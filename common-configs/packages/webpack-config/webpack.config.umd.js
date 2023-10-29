const path = require('path');

module.exports = (prodConfig, { rootPath } = {}) => {
  const plugins = [...prodConfig.plugins];

  // 移除 CopyWebpackPlugin 与 HtmlWebpackPlugin
  plugins.pop();
  plugins.pop();
  plugins.pop();

  const umdConfig = {
    ...prodConfig,
    output: {
      ...prodConfig.output,
      filename: '[name].js',
      path: path.resolve(rootPath, './dist'),
      // 默认不允许挂载在全局变量下
      // library: library,
      libraryTarget: 'umd',
    },
    externals: {
      antd: 'antd',
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
      'styled-components': {
        commonjs: 'styled-components',
        commonjs2: 'styled-components',
      },
    },
    plugins,
  };

  delete umdConfig.optimization;

  return umdConfig;
};
