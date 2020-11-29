const baseConfig = require('@m-fe/jest-config/jest.config');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jest-environment-jsdom-sixteen',
};
