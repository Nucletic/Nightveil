import { createRoot, type Root } from 'react-dom/client';
import Lights from '@/components/Lights';
import { loadSettings, removeSettings, saveSettings } from '@/helper';

let host: HTMLElement | null = null;
let root: Root | null = null;
let color: string | undefined;
let opacity: number | undefined;

async function showOverlay() {
  host = document.createElement('div');
  document.body.append(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const mountPoint = document.createElement('div');
  mountPoint.id = 'shadowHostBody';

  shadow.appendChild(mountPoint);

  root = createRoot(mountPoint);
  root.render(<Lights Color={color ?? '#000000'} Opacity={opacity ?? 0.75} />);
}

function hideOverlay(): void {
  root?.unmount();
  root = null;

  host?.remove();
  host = null;
}

export default defineContentScript({
  matches: ['<all_urls>'],

  main() {
    let rememberSettings = false;
    const hostname = window.location.hostname.replace(/^www\./, '');
    chrome.runtime.onMessage.addListener(async (message) => {
      try {
        if (message.action === 'ToggleLights') {
          if (!host) {
            if (!color || !opacity) {
              let { color: savedColor, opacity: savedOpacity, rememberedSettings: savedRememberedSettings } = await loadSettings(hostname);
              if (savedRememberedSettings) rememberSettings = savedRememberedSettings;
              if (!color) color = savedColor;
              if (!opacity) opacity = savedOpacity;
            }
            await showOverlay();
          } else {
            hideOverlay();
          }
          return;
        }

        if (message.action === 'saveSettings') {
          saveSettings({ color: message.color, opacity: message.opacity / 100 }, hostname);
          return;
        }

        if (message.action === 'rememberSettings') {
          if (message.rememberSettings === false) {
            removeSettings(hostname);
          }
          rememberSettings = message.rememberSettings;
          return;
        }

        if (message.action === 'setColor') {
          color = message.color;
          if (rememberSettings) {
            await saveSettings({ color: message.color }, hostname);
          }
          return;
        }

        if (message.action === 'setOpacity') {
          opacity = message.opacity / 100;
          if (rememberSettings) {
            await saveSettings({ opacity: message.opacity / 100 }, hostname);
          }
          return;
        }
      } catch (error) {
        console.error('Failed to receive message:', error);
      }
    });
  },
});
