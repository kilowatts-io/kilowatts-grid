

module.exports = {
    preset: 'jest-expo',
    // testEnvironment: 'node',
    testRegex: '.*unit\.test\.tsx?$',
    setupFiles: ['./jest.setup.js', "@shopify/react-native-skia/jestSetup.js"],
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|react-native.*|@react-native.*|@?react-navigation.*|@shopify/react-native-skia)/)",
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
}