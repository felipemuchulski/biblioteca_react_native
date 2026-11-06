const fs = require("fs");
const path = require("path");

// This workspace keeps its local .env one level above the Expo app.
const appDirectory = path.dirname(require.resolve("./app.json"));
const workspaceEnvPath = path.resolve(appDirectory, "..", ".env");
if (fs.existsSync(workspaceEnvPath)) {
  for (const line of fs.readFileSync(workspaceEnvPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    process.env[match[1]] = value;
  }
}

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY,
      },
    ],
  ],
});
