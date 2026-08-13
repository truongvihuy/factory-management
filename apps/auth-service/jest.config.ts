import type { Config } from 'jest';

const config: Config = {
  displayName: 'fms-auth-service',

  rootDir: '.',

  testEnvironment: 'node',

  moduleFileExtensions: ['js', 'json', 'ts'],

  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/test/**/*.spec.ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/coverage'],

  coveragePathIgnorePatterns: ['<rootDir>/src/infrastructure/database/', '<rootDir>/src/common/'],

  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main.ts', '!<rootDir>/src/**/*.module.ts'],

  coverageDirectory: '<rootDir>/coverage',

  clearMocks: true,

  restoreMocks: true,
};

export default config;
