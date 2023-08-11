module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
}
