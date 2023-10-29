const { merge } = require('webpack-merge');
const path = require('path');

const umdConfig = require('../../../../scripts/webpack/webpack.config')
  .umdConfig;

module.exports = merge(umdConfig, {
  entry: {
    index: path.resolve(__dirname, '../../src/index.ts'),
  },
});
