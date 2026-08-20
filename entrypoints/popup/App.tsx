import { loadSettings } from '@/helper';
import { useState, useEffect } from 'react';

function App() {
  const [progress, setProgress] = useState(75);
  const [rememberSettings, setRememberSettings] = useState(false);
  const [color, setColor] = useState<string>('#000000');

  // prettier-ignore
  const colors: string[] = ['#000000', '#263B18', '#355820', '#477A29', '#589D2E', '#76C246',
    '#94D06B', '#B7E196', '#43484D', '#503714', '#80561F', '#B6792C', '#F3AE3D', '#F6B33E',
    '#F6C559', '#F9D88B', '#7F7F7F', '#521910', '#832317', '#BC2D21', '#EC3629', '#EF5934', 
    '#EF7D5B', '#F3A689', '#989898', '#34091D', '#500C27', '#700E35', '#90123D', '#CD1A56',
    '#D94278', '#E779A2', '#CCCCCC', '#180035', '#1D034D', '#240C6B', '#32088D', '#3B09DA',
    '#5E19F6', '#8C59F7', '#FFFFFF', '#153242', '#214865', '#29648E', '#327EC0', '#3FABF7',
    '#42BFF7', '#79D6FA'];

  const sendToContent = async (message: unknown) => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    try {
      if (tab && tab.id) {
        await browser.tabs.sendMessage(tab.id, message);
      }
    } catch (error) {
      console.error('Could not communicate with content script:', error);
    }
  };

  const handleColorChange = async (hex: string) => {
    setColor(hex);
    sendToContent({ action: 'setColor', color: hex });
  };

  const handleOpacityChange = async (progress: number) => {
    setProgress(progress);
    sendToContent({ action: 'setOpacity', opacity: progress });
  };

  const handleRememberSettingsChange = async (checked: boolean) => {
    setRememberSettings(checked);
    await sendToContent({ action: 'rememberSettings', rememberSettings: checked });
    if (checked) {
      await sendToContent({ action: 'saveSettings', color, opacity: progress });
    }
  };

  useEffect(() => {
    const loadPreset = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.url) return;
      const hostname = new URL(tab.url).hostname.replace(/^www\./, '');
      const { color: savedColor, opacity: savedOpacity, rememberedSettings: savedRememberedSettings } = await loadSettings(hostname);
      if (savedRememberedSettings) {
        setRememberSettings(savedRememberedSettings);
      }
      setColor(savedColor);
      setProgress(Math.floor(savedOpacity * 100));
    };
    loadPreset();
  }, []);

  return (
    <div className="popup">
      <div className="controls">
        <div className="opacity-container">
          {/* prettier-ignore */ }
          <div className="opacity-slider" style={{ '--progress': `${progress}%` } as React.CSSProperties}>
            <div className="slider-progress-bar" />
            <input type="range" className="opacitySliderInput" min="0" max="100" value={progress} 
            onChange={(e) => {handleOpacityChange(Number(e.target.value))}} />
          </div>
          <p>{progress}</p>
        </div>

        {/* prettier-ignore */ }
        <div className="colors-pallete-container">
          {colors.map((hex, i) => (
            <button className={hex===color ? "active-color-btn": ""}
            onClick={() => { handleColorChange(hex) }} key={i} value={hex} style={{ background: hex }} />
          ))}
        </div>

        <div className="remember-settings">
          <input
            type="checkbox"
            checked={rememberSettings}
            onChange={(e) => {
              handleRememberSettingsChange(e.target.checked);
            }}
            id="rememberSettingsCheck"
          />
          <label htmlFor="rememberSettingsCheck">
            <p>Remember my settings for this site</p>
          </label>
        </div>

        <div className="tips">
          <p>
            Toggle Shortcut: <kbd>Ctrl+Shift+L</kbd>
          </p>
        </div>

        <div className="action-buttons">
          {/* prettier-ignore */ }
          <button className='toggle-lights-btn' onClick={() => { sendToContent({ action: 'ToggleLights' }); }}>
            ON/OFF
          </button>
          {/* prettier-ignore */ }
          <button className='github-btn' onClick={() => { window.open("https://github.com/Nucletic", "_blank") }}>
             GitHub
          </button>
          {/* prettier-ignore */ }
          <button className='donate-btn' onClick={() => { window.open("https://buymeacoffee.com/pansu", "_blank") }}>
             DONATE
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
