const {pathsToModuleNameMapper} = require('ts-jest')

const {compilerOptions} = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['<rootDir>/.jest/setup.ts'],
};
