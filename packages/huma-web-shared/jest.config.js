module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/utils/types.ts'],
}
