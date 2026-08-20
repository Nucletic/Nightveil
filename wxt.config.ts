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
      16: '/icon-16.png',
      24: '/icon-24.png',
      48: '/icon-48.png',
      96: '/icon-96.png',
      128: '/icon-128.png',
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
