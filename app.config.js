module.exports = {
  expo: {
    name: "Kilowatts grid",
    slug: "kilowattsgrid",
    version: "6.0.1",
    orientation: "portrait",
    scheme: "kilowattsgrid",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.benjaminwatts.kilowatts",
      config: {
        usesNonExemptEncryption: false,
      },
      buildNumber: "6.0.1",
      infoPlist: {
        "CFBundleDisplayName": "Grid"
      },
      entitlements: {
        "aps-environment": null 
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.benjaminwatts.kilowatts",
      versionCode: 6,
      appName: "Grid"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      description: "Live electricity data and map for Great Britain for hundreds of generators and interconnectors.",
      name: "Kilowatts grid - Live electricity data and map for Great Britain for hundreds of generators and interconnectors.",
      shortName: "Kilowatts grid",
      lang: "en-GB",
      orientation: "portrait-primary",
      startUrl: "/",
      backgroundColor: "lightblue",
      themeColor: "lightblue"
    },
    plugins: ["expo-router"],
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "717a98a5-3e9e-4dc5-830e-4d3fc30335ab"
      },
      extra: {
        EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL
      }
    }
  }
};
