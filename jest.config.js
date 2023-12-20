/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['e2e.test'],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@react-native|react-native|react-native-elements|@rneui|@expo|expo-font|expo-modules-core|expo-asset|expo/*)"
  ],
  setupFiles: [
    "<rootDir>/jest/setup.js"
  ],
};