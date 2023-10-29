const path = require('path');
const process = require('process');

const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const NODE_MODULES_REG = /[\\/]node_modules[\\/]/;
const NODE_ENV = process.env.NODE_ENV || 'development';
const __DEV__ = NODE_ENV === 'development' || NODE_ENV === 'dev';

module.exports = ({ rootPath = process.cwd() } = {}) => {
  const buildEnv = {
    rootPath,

    src: path.resolve(rootPath, './src'),
    build: path.resolve(rootPath, './build'),
  };

  return {
    context: rootPath,
    mode: __DEV__ ? 'development' : 'production',
    devtool: __DEV__ ? 'source-map' : 'hidden-source-map',
    entry: {
      index: path.resolve(buildEnv.rootPath, './src/index.ts'),
    },
    target: 'node',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TSConfigPathsPlugin()],
      alias: Object.assign({
        '@': path.resolve(rootPath, './src/'),
      }),
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
          test: /\.[jt]sx?$/,
          use: [
            'cache-loader',
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
          exclude: NODE_MODULES_REG,
        },
        {
          test: /\.wasm$/,
          loader: 'wasm-loader',
          exclude: NODE_MODULES_REG,
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        eslint: { files: './src/**/*.{ts,tsx,js,jsx}' },
      }),
      new webpack.IgnorePlugin(/\.js\.map$/),
    ],
    optimization: __DEV__
      ? {
          minimize: false,
        }
      : {
          runtimeChunk: false,
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
        },
  };
};
