const { defaults } = require('jest-config');
const esModules = ['@ambition-blockchain', 'uuid', '@solana', 'jayson'].join('|');

module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/tests"],
    verbose: true,
    collectCoverage: true,
    coverageReporters: ['html'],
    transform: {
        [`(${esModules}).+\\.js$`]: 'babel-jest',
        "^.+\\.(js|jsx)$": "babel-jest",
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        ".+\\.svg?.+$": "jest-transform-stub",
    },
    // modulePaths: ["<rootDir>/src"],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '^components/(.*)$': '<rootDir>/src/components/$1',
        '^ds/(.*)$': '<rootDir>/src/ds/$1',
        '^assets/(.*)$': '<rootDir>/src/assets/$1',
        '^libs/(.*)$': '<rootDir>/src/libs/$1',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
        '^configs/(.*)$': '<rootDir>/src/configs/$1',
        '^core/(.*)$': '<rootDir>/src/core/$1',
        '^gql/(.*)$': '<rootDir>/src/gql/$1',
        '^ethereum/(.*)$': '<rootDir>/src/ethereum/$1',
        '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
        '^solana/(.*)$': '<rootDir>/src/solana/$1',
        '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-static-stubs/$1',
        "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    },
    modulePathIgnorePatterns: ['node_modules'],
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    collectCoverageFrom: [
        'tests/*.{ts,tsx,js,jsx}',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],
    setupFilesAfterEnv: ['./jest.setup.js'],
    globals: {}
};