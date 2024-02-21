const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  console.log(config);
  env.mode = "production";

  config.plugins = config.plugins.map((plugin) => {
    if (plugin.constructor.name === "HtmlWebpackPlugin") {
      return new HtmlWebpackPlugin({
        ...plugin.options,
        meta: {
          title: "Kilowatts grid",
          description:
            "Second by second visualisation of the GB grid with live generation from hundreds of wind, gas, interconnector, solar, nuclear and hydro sources.",
          "og:title": { property: "og:title", content: "Kilowatts grid" },
          visualViewport: {
            name: "visualViewport",
            content:
              "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          },
          "og:description": {
            property: "og:description",
            content:
              "Second by second visualisation of the GB grid with live generation from hundreds of wind, gas, interconnector, solar, nuclear and hydro sources."
          },
          "og:image": {
            property: "og:image",
            content: "https://kilowatts.io/grid-screenshot.png"
          },
          "twitter:card": "app",
          "twitter:site": "@KilowattsIo",
          "twitter:title": "Kilowatts grid",
          "twitter:description":
            "Second by second visualisation of the GB grid with live generation from hundreds of wind, gas, interconnector, solar, nuclear and hydro sources.",
          "twitter:image": "https://kilowatts.io/grid-screenshot.png",
          "apple-itunes-app": "app-id=6474467753"
        }
      });
    }
    return plugin;
  });

  config.resolve.fallback = {};
  config.resolve.fallback.path = require.resolve("path-browserify");
  config.resolve.fallback.fs = require.resolve("react-native-level-fs");
  config.resolve.fallback.stream = require.resolve("stream-browserify");
  return config;
};

// Inside your Webpack config
