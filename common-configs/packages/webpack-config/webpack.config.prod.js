const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (
  baseConfig,
  {
    cacheId,
    title,
    htmlWebpackPluginOptions,
    usePrepack,
    useFractalNpmPackages,
    useCssHash,
    useServiceworker,
  } = {},
) => {
  const { buildEnv, moduleCSSLoader, lessLoader } = baseConfig.extra;

  delete baseConfig.extra;

  const config = merge(baseConfig, {
    devtool: false,
    mode: 'production',
    // stats这里是调试阶段，为了更好的显示错误内容，成熟之后需要删掉
    stats: {
      children: true,
    },
    output: {
      filename: '[name].[contenthash].js',
      ...baseConfig.output,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ],
        },
        {
          test: /\.less$/,
          exclude: /node_modules\/\.pnpm/,
          use: [
            MiniCssExtractPlugin.loader,
            moduleCSSLoader,
            // 'postcss-loader',
            lessLoader,
          ],
        },
        {
          test: /\.less$/,
          include: /node_modules\/\.pnpm/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            lessLoader,
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
      }),

      // 是否启用 ServiceWorker
      useServiceworker &&
        new GenerateSW({
          cacheId,
          skipWaiting: true,
          clientsClaim: true,
          exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /\.html/],
          runtimeCaching: [
            {
              urlPattern: /[./]api[./]/,
              handler: 'NetworkFirst',
            },
            {
              urlPattern: /\.html/,
              handler: 'NetworkFirst',
            },
          ],
        }),

      new MiniCssExtractPlugin({
        filename: useCssHash ? '[name].[contenthash].css' : '[name].css',
      }),

      // 使用 Prepack 优化包体大小
      // 暂时存在 Bug,等待修复
      // 使用前 21 - 425
      // 使用后 21 - 433
      usePrepack &&
        new PrepackWebpackPlugin({
          mathRandomSeed: '0',
        }),

      // 必须将 CopyWebpackPlugin 与 HtmlWebpackPlugin 添加到末尾
      new CopyWebpackPlugin({
        patterns: [
          { from: buildEnv.public, 
            to: buildEnv.build,
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: [
                "**/index.html", 
                "**/service-worker.js"
              ],
            }
          }
        ],
      }),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, './template/template.html'),
        title: title,
        favicon: path.join(buildEnv.public, 'favicon.ico'),
        manifest: path.join(buildEnv.public, 'manifest.json'),
        meta: [
          { name: 'robots', content: 'noindex,nofollow' },
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no',
          },
        ],
        appMountIds: ['root'],
        minify: true,
        mobile: true,
        inject: false,
        alwaysWriteToDisk: true,
        inlineSource: /(^|[\\/])manifest\.\w+\.js$/,
        scripts: [],
        publicPath: baseConfig.output.publicPath || './',
        ...htmlWebpackPluginOptions,
      }),
      new HtmlWebpackHarddiskPlugin(),
      // new MiniCssExtractPlugin()
      // 这里是为了调试方便，稳定之后需要删除
      new BundleAnalyzerPlugin()
    ].filter(p => !!p),

    optimization: {
      runtimeChunk: 'single',
      minimizer: [
        `...`,
        new CssMinimizerPlugin({}),
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          defaultVendors: useFractalNpmPackages
            ? {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  // get the name. E.g. node_modules/packageName/not/this/part.js
                  // or node_modules/packageName
                  const packageName = module.context.match(
                    /[\\/]node_modules\/\.pnpm[\\/](.*?)([\\/]|$)/,
                  )[1];

                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `pnpm.${packageName.replace('@', '')}`;
                },
              }
            : {
                test: /node_modules\/\.pnpm/,
                name: 'vendors',
                enforce: true,
              },
          // 将所有的样式文件打包到单个项目
          styles: {
            test: /\.(css|less)$/,
            name: 'styles',
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
  });

  return config;
};
