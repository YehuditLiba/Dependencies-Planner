module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: [
        '**/tests/**/*.test.(ts|tsx|js)',
        '**/?(*.)+(spec|test).(ts|tsx|js)',
    ],
    moduleDirectories: ['node_modules', 'src'],
};
