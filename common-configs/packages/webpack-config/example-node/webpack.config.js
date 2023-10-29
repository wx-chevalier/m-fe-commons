const path = require('path');

const merge = require('webpack-merge');

module.exports = merge(
  require('../webpack.config.node')({
    rootPath: path.resolve(__dirname, './'),
  }),
  {
    entry: {
      index: path.resolve(__dirname, './index.ts'),
    },
  },
);
