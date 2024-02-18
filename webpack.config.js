const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  console.log(config);

  config.resolve.fallback = {};
  config.resolve.fallback.path = require.resolve("path-browserify");
  config.resolve.fallback.fs = require.resolve("react-native-level-fs");
  config.resolve.fallback.stream = require.resolve("stream-browserify");
  return config;
};
