import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "drevr-app",
  slug: "drevr-app",
  scheme: "drevr",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",

  // ✅ ثبّت الوضع الفاتح
  userInterfaceStyle: "light",

  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "sa.drevr.client", // 🔥 هذا أهم سطر
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },

  plugins: [
    "expo-router",
    "@react-native-community/datetimepicker",
    "expo-font",
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/splash.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },
});