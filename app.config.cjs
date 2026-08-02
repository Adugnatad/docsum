const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo?.extra,
      apiKey:
        process.env.EXPO_PUBLIC_API_KEY ||
        process.env.GEMINI_API_KEY ||
        appJson.expo?.extra?.apiKey ||
        "",
    },
  },
};
