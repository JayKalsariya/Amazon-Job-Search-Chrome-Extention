const DEFAULT_PREFS = {
  cities: [],
  keywords: [],
  monitorEnabled: true
};

let prefs = { ...DEFAULT_PREFS };
const seenMatchIds = new Set();
let observer;

main().catch((error) => {
  console.error('[Amazon Shift Helper] Initialization failed', error);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'PREFERENCES_UPDATED') {
    refreshPreferences().then(runScan);
  }
});

async function main() {
  await refreshPreferences();
  startObserver();
  runScan();
  window.setInterval(runScan, 5000);
}

async function refreshPreferences() {
  prefs = {
    ...DEFAULT_PREFS,
    ...(await chrome.storage.sync.get(DEFAULT_PREFS))
  };
}

function startObserver() {
  observer = new MutationObserver(() => {
    runScan();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function runScan() {
  if (!prefs.monitorEnabled || prefs.cities.length === 0) {
    return;
  }

  const cards = collectPotentialCards();
  cards.forEach((card) => {
    const data = extractCardData(card);
    if (!data) {
      return;
    }

    const cityMatch = findCityMatch(data.fullText, prefs.cities);
    if (!cityMatch) {
      return;
    }

    if (!keywordMatch(data.fullText, prefs.keywords)) {
      return;
    }

    const matchId = `${data.title}|${cityMatch}|${data.link}`;
    if (seenMatchIds.has(matchId)) {
      return;
    }

    seenMatchIds.add(matchId);
    notifyMatch({
      title: data.title,
      city: cityMatch,
      link: data.link
    });
    flashCard(card);
  });
}

function collectPotentialCards() {
  const selectors = [
    '[data-test-component="StencilReactCard"]',
    '.job-card',
    '[class*="job"] article',
    'article'
  ];

  const items = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  return Array.from(new Set(items)).slice(0, 250);
}

function extractCardData(card) {
  const text = card.textContent?.replace(/\s+/g, ' ').trim();
  if (!text || text.length < 20) {
    return null;
  }

  const title = card.querySelector('h1, h2, h3, [role="heading"]')?.textContent?.trim() || 'Shift match';
  const linkElement = card.querySelector('a[href]');
  const link = linkElement ? new URL(linkElement.getAttribute('href'), location.href).toString() : location.href;

  return {
    title,
    fullText: text,
    link
  };
}

function findCityMatch(text, cities) {
  const lower = text.toLowerCase();
  for (const city of cities) {
    if (lower.includes(city.toLowerCase())) {
      return city;
    }
  }
  return null;
}

function keywordMatch(text, keywords) {
  if (!keywords || keywords.length === 0) {
    return true;
  }

  const lower = text.toLowerCase();
  return keywords.every((keyword) => lower.includes(keyword.toLowerCase()));
}

function notifyMatch(payload) {
  chrome.runtime.sendMessage({
    type: 'MATCH_FOUND',
    payload
  });
}

function flashCard(card) {
  card.style.outline = '2px solid #22c55e';
  card.style.outlineOffset = '2px';

  setTimeout(() => {
    card.style.outline = '';
    card.style.outlineOffset = '';
  }, 2500);
}
