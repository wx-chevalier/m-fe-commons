const config = require('@m-fe/stylelint-config');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'plugin/no-unsupported-browser-features': null,
  },
};
