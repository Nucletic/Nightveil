export default defineBackground(() => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'ToggleLights') return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) return;

    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'ToggleLights' });
    } catch (error) {
      console.error('Could not communicate with content script:', error);
    }
  });
});
