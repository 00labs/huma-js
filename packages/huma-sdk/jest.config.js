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
  },
}
