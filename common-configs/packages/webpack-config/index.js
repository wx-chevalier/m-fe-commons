const { merge } = require('webpack-merge');

module.exports = ({
  rootPath = process.cwd(),
  target = 'web', // target 可以为 web, mobile, server, rn, taro 等
  cacheId = 'cacheId',
  themeVars = {},
  title = 'Awesome App',
  useCssModule = true,
  usePrepack = false,
  useFractalNpmPackages = false,
  useCssHash = false,
  useScriptCache = true,
  extendedBaseConfig = {},
  // 需要编译的 Node 模块
  compiledNodeModules = [],
  htmlWebpackPluginOptions = {},
  useServiceworker = true,
} = {}) => {
  console.log(`\nCurrent build path: ${rootPath}\n`);

  const baseConfig = merge(
    require('./webpack.config.base')({
      rootPath,
      cacheId,
      themeVars,
      title,
      target,
      useCssModule,
      useScriptCache,
      compiledNodeModules,
    }),
    extendedBaseConfig,
  );

  const devConfig = require('./webpack.config.dev')(
    { ...baseConfig },
    {
      rootPath,
      cacheId,
      themeVars,
      title,
      target,
      useScriptCache,
    },
  );

  const prodConfig = require('./webpack.config.prod')(
    { ...baseConfig },
    {
      rootPath,
      cacheId,
      themeVars,
      title,
      target,
      htmlWebpackPluginOptions,
      usePrepack,
      useFractalNpmPackages,
      useCssHash,
      useServiceworker,
    },
  );

  const umdConfig = require('./webpack.config.umd')(
    { ...prodConfig },
    {
      rootPath,
      cacheId,
      themeVars,
      title,
      target,
    },
  );

  return {
    baseConfig,
    devConfig,
    prodConfig,
    umdConfig,
  };
};
