const path = require('path');
const process = require('process');

const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const NODE_MODULES_REG = /[\\/]node_modules[\\/]/;
const NODE_ENV = process.env.NODE_ENV || 'development';
const __DEV__ = NODE_ENV === 'development' || NODE_ENV === 'dev';

module.exports = ({
  rootPath,
  themeVars,
  useCssModule,
  useScriptCache,
  compiledNodeModules = [],
} = {}) => {
  const buildEnv = {
    rootPath,

    src: path.resolve(rootPath, './src'),
    public: path.resolve(rootPath, './public'),
    build: path.resolve(rootPath, './build'),
  };

  const moduleCSSLoader = {
    loader: 'css-loader',
    options: {
      modules: useCssModule
        ? {
            localIdentName: __DEV__
              ? '[path][name]__[local]---[hash:base64:5]'
              : '[hash:base64:10]',
            exportLocalsConvention: 'camelCaseOnly',
          }
        : false,
      sourceMap: __DEV__,
      importLoaders: 2,
    },
  };

  const lessLoader = {
    loader: 'less-loader',
    options: {
      modifyVars: {
        ...themeVars,
      },
      javascriptEnabled: true,
      sourceMap: __DEV__,
    },
  };

  const fontsOptions = {
    limit: 8192,
    mimetype: 'application/font-woff',
    name: 'fonts/[name].[ext]',
  };

  return {
    context: rootPath,
    entry: {
      index: path.resolve(buildEnv.rootPath, './src/index.tsx'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css', '.less'],
      plugins: [new TSConfigPathsPlugin()],
      alias: Object.assign(
        {
          '@': path.resolve(rootPath, './src/'),
        },
        __DEV__ && {
          'react-dom': '@hot-loader/react-dom',
        },
      ),
    },
    output: {
      path: buildEnv.build,
      // 设置所有资源的默认公共路径，Webpack 会自动将 import 的资源改写为该路径
      publicPath: '/',
      filename: `[name].js`,
      globalObject: 'this', // 避免全局使用 window
    },
    module: {
      rules: [
        {
          test: /.*ts-worker.*/,
          use: ['workerize-loader', 'ts-loader'],
        },
        {
          test: /\.[jt]sx?$/,
          use: [
            useScriptCache && 'cache-loader',
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: useScriptCache,
              },
            },
          ].filter(c => !!c),
          exclude:
            Array.isArray(compiledNodeModules) && compiledNodeModules.length > 0
              ? new RegExp(
                  `node_modules/(?!(${compiledNodeModules.join('|')})/).*`,
                )
              : NODE_MODULES_REG,
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: 'images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: fontsOptions,
            },
          ],
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'file-loader',
              options: fontsOptions,
            },
          ],
        },
        {
          test: /\.wasm$/,
          loader: 'wasm-loader',
          exclude: NODE_MODULES_REG,
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new webpack.WatchIgnorePlugin([/less\.d\.ts$/]),
      new webpack.IgnorePlugin(/\.js\.map$/),
    ],

    // 定义非直接引用依赖，使用方式即为 var $ = require("jquery")
    externals: {
      window: 'window',
      jquery: '$',
    },
    stats: __DEV__ ? 'normal' : 'errors-warnings',
    extra: {
      moduleCSSLoader,
      lessLoader,
      buildEnv,
    },
  };
};
