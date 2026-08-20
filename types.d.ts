type LightSettings = { color: string; opacity: number };

type ExtensionSettings = {
  global: LightSettings;

  sites: Record<string, LightSettings>;
};

export { ExtensionSettings, LightSettings };
