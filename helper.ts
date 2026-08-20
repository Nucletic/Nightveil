import type { ExtensionSettings, LightSettings } from './types';

const removeSettings = async (hostname: string) => {
  const result = await chrome.storage.local.get('settings');
  const settings: ExtensionSettings = (result.settings as ExtensionSettings | undefined) ?? { global: { color: '#000000', opacity: 0.75 }, sites: {} };
  delete settings.sites[hostname];
  await chrome.storage.local.set({ settings });
};

const saveSettings = async (newSettings: Partial<LightSettings>, hostname: string) => {
  const result = await chrome.storage.local.get('settings');
  const settings: ExtensionSettings = (result.settings as ExtensionSettings | undefined) ?? { global: { color: '#000000', opacity: 0.75 }, sites: {} };
  const currentSiteSettings = settings.sites[hostname] ?? { color: settings.global.color, opacity: settings.global.opacity };
  settings.sites[hostname] = { ...currentSiteSettings, ...newSettings };
  await chrome.storage.local.set({ settings });
};

const loadSettings = async (hostname: string): Promise<{ color: string; opacity: number; rememberedSettings?: boolean }> => {
  let result = await browser.storage.local.get('settings');
  let extensionSettings = result.settings as ExtensionSettings | undefined;
  const siteSettings = extensionSettings?.sites?.[hostname];
  if (siteSettings) {
    return { color: siteSettings.color, opacity: siteSettings.opacity, rememberedSettings: true };
  }
  const globalSettings = extensionSettings?.global;
  if (globalSettings) {
    return { color: globalSettings.color, opacity: globalSettings.opacity };
  }
  return { color: '#000000', opacity: 0.75 };
};

export { loadSettings, removeSettings, saveSettings };
