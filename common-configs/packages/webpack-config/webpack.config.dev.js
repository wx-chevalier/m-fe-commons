const webpack = require('webpack');
const { merge } = require('webpack-merge');

const NODE_MODULES_REG = /[\\/]node_modules[\\/]/;

module.exports = baseConfig => {
  const { buildEnv, moduleCSSLoader, lessLoader } = baseConfig.extra;

  delete baseConfig.extra;

  return merge(baseConfig, {
    mode: 'development',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'cache-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'cache-loader', moduleCSSLoader, lessLoader],
          exclude: NODE_MODULES_REG,
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'cache-loader', 'css-loader', lessLoader],
          include: NODE_MODULES_REG,
        },
      ],
    },
    plugins: [
      // 定义控制变量
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
      }),
    ],
    optimization: {
      emitOnErrors: true,
    },
    experiments: {
      lazyCompilation: true,
    },
    devServer: {
      clientLogLevel: 'warning',
      // 设置生成的 Bundle 的前缀路径
      publicPath: '/',
      // assets 中资源文件默认应该还使用 assets
      contentBase: buildEnv.public,
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
      open: true,
      overlay: {
        warnings: true,
        errors: true,
      },
      host: '0.0.0.0',
      port: 8080,
      hot: true,
      https: false,
      disableHostCheck: true,
      quiet: false,
    },
    stats: {
      children: false,
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
  });
};
