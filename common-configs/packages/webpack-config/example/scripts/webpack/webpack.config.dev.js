const { merge } = require('webpack-merge');

module.exports = merge(require('../webpack-base/webpack.config').devConfig, {});
