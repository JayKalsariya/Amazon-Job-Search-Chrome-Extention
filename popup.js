const DEFAULT_PREFS = {
  cities: [],
  keywords: [],
  monitorEnabled: true
};

const citiesField = document.getElementById('cities');
const keywordsField = document.getElementById('keywords');
const monitorToggle = document.getElementById('monitorEnabled');
const saveBtn = document.getElementById('saveBtn');
const statusLabel = document.getElementById('status');

init().catch((error) => {
  setStatus(`Could not load settings: ${error.message}`, true);
});

saveBtn.addEventListener('click', async () => {
  const cities = splitAndClean(citiesField.value);
  const keywords = splitAndClean(keywordsField.value);
  const monitorEnabled = monitorToggle.checked;

  await chrome.storage.sync.set({
    cities,
    keywords,
    monitorEnabled
  });

  setStatus('Preferences saved.');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'PREFERENCES_UPDATED'
    });
  }
});

async function init() {
  const saved = await chrome.storage.sync.get(DEFAULT_PREFS);
  const prefs = {
    ...DEFAULT_PREFS,
    ...saved
  };

  citiesField.value = prefs.cities.join(', ');
  keywordsField.value = prefs.keywords.join(', ');
  monitorToggle.checked = Boolean(prefs.monitorEnabled);
}

function splitAndClean(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function setStatus(message, isError = false) {
  statusLabel.textContent = message;
  statusLabel.style.color = isError ? '#b91c1c' : '#065f46';
}
