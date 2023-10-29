const path = require('path');

module.exports = {
  coverageDirectory: '<rootDir>/@coverage',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.resolve(
      __dirname,
      'fileMock.js',
    ),
    '\\.(scss|css|less)$': path.resolve(__dirname, 'styleMock.js'),
  },
  rootDir: '../../',
  setupFiles: [path.resolve(__dirname, 'jest.setup.js')],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testRegex: '/__test__/.+\\.(test|spec)\\.tsx?$',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  verbose: true,
};
