// main.js for main.html
let currentLang = 'en';
const translations = {
  en: {
    mainTitle: '⏳ Time-Turner',
    mainDesc: 'Explore the moments, people, and ideas that shaped our world — one timeline at a time.',
    chooseCountry: 'Choose a topic to explore',
    error: country => `Could not load timeline for ${country}. Please check the data file.`,
    loading: 'Loading...',
    noResults: 'No events match your filters.',
    showFilters: 'Show Filters',
    hideFilters: 'Hide Filters',
    searchPlaceholder: 'Search titles, descriptions, tags...',
    playGame: '📅 Play Timeline',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode'
  },
  fr: {
    mainTitle: '⏳ Time-Turner',
    mainDesc: 'Parcourez les moments, les personnages et les idées qui ont façonné notre monde — une chronologie à la fois.',
    chooseCountry: 'Choisissez un sujet à explorer',
    error: country => `Impossible de charger la chronologie pour ${country}. Vérifiez le fichier de données.`,
    loading: 'Chargement...',
    noResults: 'Aucun événement ne correspond à vos filtres.',
    showFilters: 'Afficher les filtres',
    hideFilters: 'Masquer les filtres',
    searchPlaceholder: 'Rechercher titres, descriptions, tags...',
    playGame: '📅 Jouer Timeline',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair'
  }
};

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('main-title').textContent = translations[lang].mainTitle;
  document.getElementById('main-desc').textContent = translations[lang].mainDesc;
  // Update the choose-country header while preserving any SVG inside it
  const chooseEl = document.getElementById('choose-country');
  if (chooseEl) {
    const svg = chooseEl.querySelector('svg');
    chooseEl.innerHTML = (svg ? svg.outerHTML + ' ' : '') + translations[lang].chooseCountry;
  }
  // Update search placeholder
  const searchInput = document.getElementById('timeline-search');
  if (searchInput) searchInput.placeholder = translations[lang].searchPlaceholder;
  // Update tag-toggle text
  const tagBar = document.getElementById('tag-bar');
  const toggleBtn = document.getElementById('toggle-tag-bar');
  if (toggleBtn) {
    const isHidden = tagBar && tagBar.classList.contains('hidden');
    toggleBtn.textContent = isHidden ? translations[lang].showFilters : translations[lang].hideFilters;
  }
  // Update Play button text if present
  const playBtn = document.getElementById('play-game-btn');
  if (playBtn) playBtn.textContent = translations[lang].playGame;
  // Update theme toggle text spans (preserve icons)
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const lightText = themeToggle.querySelector('.light-text');
    const darkText = themeToggle.querySelector('.dark-text');
    if (lightText) lightText.textContent = translations[lang].lightMode;
    if (darkText) darkText.textContent = translations[lang].darkMode;
  }
  // Re-render loaded events to update titles/descriptions and wiki links
  if (window.__loadedEvents) applyFilters();
}

async function loadCountry(country) {
  const timelineDiv = document.getElementById('country-timeline');
  timelineDiv.innerHTML = `<div class="text-center text-gray-500">${translations[currentLang].loading}</div>`;
  try {
    const response = await fetch(`data/${country}.json`);
    const events = await response.json();
    // Store loaded events globally for filtering/search
    window.__loadedEvents = events;
    window.__activeFilters = { text: '', tags: new Set() };
    let html = '';
    events.forEach(event => {
      // Support translation for title/description if they are objects
      const title = typeof event.title === 'object' ? event.title[currentLang] : event.title;
      const description = typeof event.description === 'object' ? event.description[currentLang] : event.description;
      function normalizeImagePath(p) {
        if (!p) return p;
        if (/^[a-zA-Z]+:\/\//.test(p) || p.startsWith('data:') || p.startsWith('/')) return p;
        return './' + p.replace(/^\.?\//,'');
      }
      const imgSrc = normalizeImagePath(event.image);
      const safeSrc = imgSrc ? encodeURI(imgSrc) : '';
  const imageHtml = safeSrc ? `<div class="w-full md:w-48 h-48 mb-4 md:mb-0 md:mr-6 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"><img src="${safeSrc}" alt="${title}" loading="lazy" decoding="async" class="max-w-full max-h-full object-contain" onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/2/2b/Siege-alesia-vercingetorix-jules-cesar.jpg';"></div>` : '';
  const wikiTitle = encodeURIComponent(title.replace(/\s+\(.+\)/, '').replace(/\s+/g, '_'));
  const wikiBase = currentLang === 'fr' ? 'https://fr.wikipedia.org/wiki/' : 'https://en.wikipedia.org/wiki/';
  const wikiUrl = `${wikiBase}${wikiTitle}`;
      html += `
        <a href="${wikiUrl}" target="_blank" rel="noopener" class="timeline-card bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center mb-8 hover:ring-2 hover:ring-blue-400 transition-shadow">
          ${imageHtml}
          <div class="flex-1">
            <h2 class="text-2xl font-semibold mb-2">${event.year} — ${title}</h2>
            <p class="text-gray-700">${description}</p>
          </div>
        </a>
      `;
    });
    timelineDiv.innerHTML = html;
    // Render tag bar for this dataset
    renderTagBar(events);
    // Wire search input
    const searchInput = document.getElementById('timeline-search');
    if (searchInput) {
      searchInput.value = '';
      searchInput.oninput = () => {
        window.__activeFilters.text = searchInput.value.trim().toLowerCase();
        applyFilters();
      };
    }
  } catch (err) {
    timelineDiv.innerHTML = `<div class="text-red-600">${translations[currentLang].error(country)}</div>`;
  }
}

function renderTagBar(events) {
  const tagBar = document.getElementById('tag-bar');
  if (!tagBar) return;
  // collect tags
  const tagCounts = {};
  events.forEach(e => {
    (e.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  });
  tagBar.innerHTML = '';
  Object.keys(tagCounts).sort().forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'px-3 py-1 rounded-full bg-gray-200 text-sm hover:bg-gray-300';
    btn.textContent = `${tag} (${tagCounts[tag]})`;
    btn.onclick = () => {
      if (!window.__activeFilters) window.__activeFilters = { text: '', tags: new Set() };
      if (window.__activeFilters.tags.has(tag)) {
        window.__activeFilters.tags.delete(tag);
        btn.classList.remove('bg-blue-500','text-white');
        btn.classList.add('bg-gray-200');
      } else {
        window.__activeFilters.tags.add(tag);
        btn.classList.add('bg-blue-500','text-white');
        btn.classList.remove('bg-gray-200');
      }
      applyFilters();
    };
    tagBar.appendChild(btn);
  });
}

function applyFilters() {
  const events = window.__loadedEvents || [];
  const filters = window.__activeFilters || { text: '', tags: new Set() };
  const filtered = events.filter(e => {
    // tag filter: if any tags selected, event must have at least one
    if (filters.tags.size > 0) {
      const has = (e.tags || []).some(t => filters.tags.has(t));
      if (!has) return false;
    }
    // text filter: check title, description, tags
    if (filters.text) {
      const title = typeof e.title === 'object' ? e.title[currentLang] : e.title;
      const desc = typeof e.description === 'object' ? e.description[currentLang] : e.description;
      const hay = (title + ' ' + desc + ' ' + (e.tags || []).join(' ')).toLowerCase();
      if (!hay.includes(filters.text)) return false;
    }
    return true;
  });
  // Re-render timeline with filtered events
  const timelineDiv = document.getElementById('country-timeline');
  if (!timelineDiv) return;
  if (filtered.length === 0) {
    timelineDiv.innerHTML = `<div class="text-center text-gray-500">${translations[currentLang].noResults}</div>`;
    return;
  }
  let html = '';
  filtered.forEach(event => {
    const title = typeof event.title === 'object' ? event.title[currentLang] : event.title;
    const description = typeof event.description === 'object' ? event.description[currentLang] : event.description;
    function normalizeImagePath(p) {
      if (!p) return p;
      if (/^[a-zA-Z]+:\/\//.test(p) || p.startsWith('data:') || p.startsWith('/')) return p;
      return './' + p.replace(/^\.?\//,'');
    }
    const imgSrc = normalizeImagePath(event.image);
    const safeSrc = imgSrc ? encodeURI(imgSrc) : '';
    const imageHtml = safeSrc ? `<div class="w-full md:w-48 h-48 mb-4 md:mb-0 md:mr-6 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"><img src="${safeSrc}" alt="${title}" loading="lazy" decoding="async" class="max-w-full max-h-full object-contain" onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/2/2b/Siege-alesia-vercingetorix-jules-cesar.jpg';"></div>` : '';
    const wikiTitle = encodeURIComponent(title.replace(/\s+\(.+\)/, '').replace(/\s+/g, '_'));
    const wikiBase = currentLang === 'fr' ? 'https://fr.wikipedia.org/wiki/' : 'https://en.wikipedia.org/wiki/';
    const wikiUrl = `${wikiBase}${wikiTitle}`;
    html += `
      <a href="${wikiUrl}" target="_blank" rel="noopener" class="timeline-card bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center mb-8">
        ${imageHtml}
        <div class="flex-1">
          <h2 class="text-2xl font-semibold mb-2">${event.year} — ${title}</h2>
          <p class="text-gray-700">${description}</p>
        </div>
      </a>
    `;
  });
  timelineDiv.innerHTML = html;
}

// Set default language on load
window.onload = () => setLanguage(currentLang);
