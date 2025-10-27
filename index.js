// main.js for index.html
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
    lightMode: 'Light Mode',
    onThisDay: 'On This Day in History',
    fromTimeline: source => `From the ${source} timeline`,
    noExactMatch: '(No exact match for today, but here\'s an interesting historical event!)'
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
    lightMode: 'Mode clair',
    onThisDay: 'Ce Jour dans l\'Histoire',
    fromTimeline: source => `De la chronologie ${source}`,
    noExactMatch: '(Aucune correspondance exacte pour aujourd\'hui, mais voici un événement historique intéressant !)'
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
window.onload = () => {
  setLanguage(currentLang);
  loadOnThisDay();
};

// On This Day in History Feature - Using Wikipedia API
async function loadOnThisDay() {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate(); // 1-31
  
  const contentDiv = document.getElementById('on-this-day-content');
  const titleEl = document.getElementById('on-this-day-title');
  
  if (!contentDiv || !titleEl) {
    console.log('On this day elements not found in DOM');
    return;
  }
  
  // Update title with current date
  const monthNames = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  };
  
  const formattedDate = currentLang === 'en' 
    ? `${monthNames.en[month - 1]} ${day}`
    : `${day} ${monthNames.fr[month - 1]}`;
  
  titleEl.textContent = currentLang === 'en' 
    ? `📅 On This Day in History - ${formattedDate}`
    : `📅 Ce Jour dans l'Histoire - ${formattedDate}`;
  
  try {
    // Use Wikipedia's "On this day" API
    const langCode = currentLang === 'en' ? 'en' : 'fr';
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    
    const apiUrl = `https://${langCode}.wikipedia.org/api/rest_v1/feed/onthisday/events/${monthStr}/${dayStr}`;
    
    console.log('Fetching from Wikipedia API:', apiUrl);
    
    // Add timeout to fetch and use CORS mode. Note: browsers disallow setting the Origin header manually.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors',
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
    
    if (!response.ok) {
      console.error('Wikipedia API response not OK:', response.status, response.statusText);
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Wikipedia API data received:', data);
    
    if (data.events && data.events.length > 0) {
      // Get a random event from the list (prefer historical events)
      const importantEvents = data.events.filter(e => e.year && e.year < 2000);
      const eventsToChooseFrom = importantEvents.length > 0 ? importantEvents : data.events;
      const randomEvent = eventsToChooseFrom[Math.floor(Math.random() * Math.min(eventsToChooseFrom.length, 20))];
      
      console.log('Selected event:', randomEvent);
        // Create or reference a small loading hint element that appears after a short delay
        let loadingHint = document.getElementById('on-this-day-loading-hint');
        if (!loadingHint) {
          loadingHint = document.createElement('div');
          loadingHint.id = 'on-this-day-loading-hint';
          loadingHint.className = 'text-sm text-gray-500 italic mt-2';
          loadingHint.style.display = 'none';
          if (contentDiv && contentDiv.parentNode) contentDiv.parentNode.insertBefore(loadingHint, contentDiv.nextSibling);
        }
      displayWikipediaEvent(randomEvent);
    } else {
      throw new Error('No events found in API response');
    }
    
  } catch (error) {
  console.error('Error loading on this day:', error);
    
    // Check if it was a timeout
    const isTimeout = error.name === 'AbortError';
    
    // Show error message
    contentDiv.innerHTML = `
      <div class="text-center py-4">
        <p class="text-red-600 mb-2">
          ${isTimeout 
            ? (currentLang === 'en' ? '⏱️ Request timed out' : '⏱️ Délai d\'attente dépassé')
            : (currentLang === 'en' ? '⚠️ Could not load event from Wikipedia' : '⚠️ Impossible de charger l\'événement depuis Wikipédia')}
        </p>
        <p class="text-gray-500 text-sm mb-2">
          ${error.name || ''} ${error.message || (currentLang === 'en' ? 'Unknown error' : 'Erreur inconnue')}
        </p>
        <pre class="text-xs text-gray-400 mb-2" style="white-space:pre-wrap">${(error.stack || '').substring(0, 500)}</pre>
        <p class="text-gray-500 text-sm">
          ${currentLang === 'en' 
            ? 'Check your internet connection or try again later.' 
            : 'Vérifiez votre connexion internet ou réessayez plus tard.'}
        </p>
        <button onclick="loadOnThisDay()" class="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          ${currentLang === 'en' ? '🔄 Retry' : '🔄 Réessayer'}
        </button>
      </div>
    `;
  }
}

function displayWikipediaEvent(event) {
  console.log('displayWikipediaEvent called with:', event);
  
  const contentDiv = document.getElementById('on-this-day-content');
  
  if (!contentDiv) {
    console.error('on-this-day-content element not found!');
    return;
  }
  
  console.log('contentDiv found:', contentDiv);
  
  // Get event details
  const year = event.year || 'Unknown';
  const text = event.text || (currentLang === 'en' ? 'No description available' : 'Aucune description disponible');
  
  console.log('Event year:', year);
  console.log('Event text:', text);
  
  // Get related pages/links
  const pages = event.pages || [];
  let linksHtml = '';
  
  console.log('Event pages:', pages);
  
  if (pages.length > 0) {
    const mainPage = pages[0];
    const wikiUrl = (mainPage && mainPage.content_urls && mainPage.content_urls.desktop && mainPage.content_urls.desktop.page) ? mainPage.content_urls.desktop.page : '#';
    const thumbnail = (mainPage && mainPage.thumbnail && mainPage.thumbnail.source) ? mainPage.thumbnail.source : ((mainPage && mainPage.originalimage && mainPage.originalimage.source) ? mainPage.originalimage.source : '');
    
  console.log('Wiki URL:', wikiUrl);
  console.log('Thumbnail:', thumbnail);
    
    // Create image HTML if available
    const imageHtml = thumbnail ? `
      <div class="mb-4 rounded-lg overflow-hidden">
        <img src="${thumbnail}" alt="${mainPage.normalizedtitle || ''}" class="w-full h-48 object-cover">
      </div>
    ` : '';
    
    // Create link to full Wikipedia article
    linksHtml = `
      ${imageHtml}
      <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mt-3">
        ${currentLang === 'en' ? 'Read more on Wikipedia' : 'Lire plus sur Wikipédia'} →
      </a>
    `;
  }
  
  const htmlContent = `
    <div class="flex items-start gap-3 mb-3">
      <span class="text-3xl">📜</span>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-purple-800 mb-2">${year}</h3>
        <p class="text-gray-700 leading-relaxed mb-3">${text}</p>
        ${linksHtml}
      </div>
    </div>
    <div class="mt-4 text-sm text-gray-500 italic flex items-center gap-2">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"/>
      </svg>
      ${currentLang === 'en' ? 'Source: Wikipedia' : 'Source : Wikipédia'}
    </div>
  `;
  
  console.log('Setting innerHTML with content length:', htmlContent.length);
  contentDiv.innerHTML = htmlContent;
  console.log('innerHTML set successfully');
}

