/** @type {import('jest').Config} */
const config = {
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    ['^.+\\.(t|j)s$']: 'ts-jest',
  },
  cacheDirectory: './.jest-cache/',
  testEnvironment: 'node',
};

module.exports = config;
