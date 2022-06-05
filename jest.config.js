/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    // '<rootDir>/src/AITEditor/**',
  ],

  modulePathIgnorePatterns: [
    "<rootDir>/src/App.test.tsx"
  ]
};