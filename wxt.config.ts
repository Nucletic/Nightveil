import { defineConfig } from 'wxt'; // See https://wxt.dev/api/config.html
// prettier-ignore
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
  name: "Nightveil",
  description: "A lightweight screen-dimming overlay for a more comfortable browsing experience in low light.",
  version: "1.0.0",
  manifest_version: 3,
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  permissions:["storage"],
    commands: {
      "ToggleLights": {
        suggested_key: {
          default: 'Ctrl+Shift+L',
        },
        description: "Toggle lights on/off",
      } 
    }
  }
});
