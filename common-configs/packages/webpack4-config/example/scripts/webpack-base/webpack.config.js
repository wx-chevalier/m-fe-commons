const path = require('path');

const configMap = require('../../..')({
  rootPath: path.resolve(__dirname, '../../'),
  themeVars: { 'primary-color': '#1DA57A', 'brand-primary': '#1DA57A' },
  extendedBaseConfig: {
    entry: {
      index: path.resolve(__dirname, '../../src/index'),
    },
    output: {
      publicPath: './',
    },
    resolve: {
      alias: {
        dayjs: 'dayjs/esm',
        moment$: 'dayjs/esm',
        systemjs$: 'systemjs/dist/system.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          oneOf: [
            {
              issuer: /\.[jt]sx?$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  // loader: 'svg-inline-loader',
                },
              ],
            },
            {
              loader: 'url-loader',
              options: {
                limit: 10,
                name: 'images/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
  },
  usePrepack: true,
  useFractalNpmPackages: true,
  useCssHash: true,
  htmlWebpackPluginOptions: {
    scripts: ['a.js'],
  },
});

module.exports = configMap;
