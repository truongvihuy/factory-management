import type { Config } from 'jest';

const config: Config = {
  displayName: 'auth-service',

  rootDir: '.',

  testEnvironment: 'node',

  testMatch: ['<rootDir>/src/**/*.spec.ts'],

  moduleFileExtensions: ['js', 'json', 'ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },

  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/*.module.ts'],

  coverageDirectory: '<rootDir>/coverage',

  clearMocks: true,

  restoreMocks: true,
};

export default config;
