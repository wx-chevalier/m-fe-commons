const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

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
    output: {
      filename: '[name].[contenthash].js',
      ...baseConfig.output,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            moduleCSSLoader,
            'postcss-loader',
            lessLoader,
          ],
        },
        {
          test: /\.less$/,
          include: /node_modules/,
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
        filename: useCssHash ? '[name].[hash].css' : '[name].css',
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
        patterns: [{ from: buildEnv.public, to: buildEnv.build }],
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
    ].filter(p => !!p),

    optimization: {
      runtimeChunk: 'single',
      minimizer: [
        new TerserPlugin({
          exclude: /.*ts-worker.*/,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: 'initial',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendors: useFractalNpmPackages
            ? {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  // get the name. E.g. node_modules/packageName/not/this/part.js
                  // or node_modules/packageName
                  const packageName = module.context.match(
                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                  )[1];

                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `npm.${packageName.replace('@', '')}`;
                },
              }
            : {
                test: /node_modules/,
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
