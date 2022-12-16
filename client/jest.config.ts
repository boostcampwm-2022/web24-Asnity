import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/setupTest.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleDirectories: ['node_modules', 'shared'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',

    '@pages/(.*)$': '<rootDir>/src/pages/$1',
    '@layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '@components/(.*)$': '<rootDir>/src/components/$1',
    '@mocks/(.*)$': '<rootDir>/src/mocks/$1',
    '@stores/(.*)$': '<rootDir>/src/stores/$1',
    '@icons/(.*)$': '<rootDir>/src/assets/icons/$1',
    '@constants/(.*)$': '<rootDir>/src/constants/$1',
    '@apis/(.*)$': '<rootDir>/src/apis/$1',
    '@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '@errors/(.*)$': '<rootDir>/src/errors/$1',
    '@utils/(.*)$': '<rootDir>/src/utils/$1',
    '@routes/(.*)$': '<rootDir>/src/routes/$1',
    '@sockets/(.*)$': '<rootDir>/src/sockets/$1',
    '@@types/(.*)$': '<rootDir>/src/types/$1',
    '@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = config;
