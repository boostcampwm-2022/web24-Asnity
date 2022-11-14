import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  testEnvironment: 'jsdom',
  // moduleNameMapper: {
  //   '\\.(css|less|svg)$': 'identity-obj-proxy',
  // },
  setupFilesAfterEnv: ['<rootDir>/src/setupTest.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

module.exports = config;
