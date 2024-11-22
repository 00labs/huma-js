module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@huma-finance/shared$': '<rootDir>/../huma-shared/src',
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
  },
}
