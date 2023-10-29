const { allowModules } = require('@m-fe/eslint-config/_util');

module.exports = {
  extends: '@m-fe/eslint-config',
  settings: {
    node: {
      allowModules: allowModules.concat('tslint', 'typescript'),
    },
    polyfills: [
      'console',
      'Array.isArray',
      'JSON',
      'Object.assign',
      'Object.entries',
      'Object.keys',
      'Promise',
    ],
  },
};
