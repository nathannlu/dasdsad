const { defaults } = require('jest-config');
const esModules = ['@ambition-blockchain', 'uuid'].join('|');

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
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-static-stubs/$1',
        "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    collectCoverageFrom: [
        'tests/*.{ts,tsx,js,jsx}',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],
    setupFilesAfterEnv: ['./jest.setup.js'],
    globals: {}
};