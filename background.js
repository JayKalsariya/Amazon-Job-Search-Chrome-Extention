chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get(['cities', 'keywords', 'monitorEnabled']);

  if (!Array.isArray(existing.cities)) {
    await chrome.storage.sync.set({
      cities: ['Toronto'],
      keywords: [],
      monitorEnabled: true
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== 'MATCH_FOUND') {
    return;
  }

  const title = message.payload?.title ?? 'New shift match found';
  const city = message.payload?.city ?? 'Configured city';

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Amazon Shift Helper',
    message: `${title} • ${city}`
  });

  if (sender.tab?.id) {
    chrome.tabs.update(sender.tab.id, {
      active: true
    });
  }
});
