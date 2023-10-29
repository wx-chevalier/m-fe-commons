const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    vendor: ['react'],
  },
  output: {
    filename: 'vendor.bundle.js',
    path: path.join(__dirname, 'build'),
    library: 'vendor_lib',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_lib',
      path: path.join(__dirname, 'build', 'vendor-manifest.json'),
    }),
  ],
};
