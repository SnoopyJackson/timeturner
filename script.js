window.__loadedEvents = [];
window.__activeFilters = { text: '', tags: new Set() };

function normalizeImagePath(p) {
  if (!p) return p;
  if (/^[a-zA-Z]+:\/\//.test(p) || p.startsWith('data:') || p.startsWith('/')) return p;
  return './' + p.replace(/^\.?\//, '');
}

function renderTimeline(events) {
  const container = document.getElementById('timeline');
  container.innerHTML = '';
  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'timeline-card bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center';

    const imgSrc = normalizeImagePath(event.image);
    const safeSrc = imgSrc ? encodeURI(imgSrc) : '';
    const imageHtml = safeSrc ? `<div class="w-full md:w-48 h-48 mb-4 md:mb-0 md:mr-6 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"><img src="${safeSrc}" alt="${(event.title && (event.title.en || event.title)) || ''}" loading="lazy" decoding="async" class="max-w-full max-h-full object-contain" onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/2/2b/Siege-alesia-vercingetorix-jules-cesar.jpg';"></div>` : '';

    card.innerHTML = `
      ${imageHtml}
      <div class="flex-1">
        <h2 class="text-2xl font-semibold mb-2">${event.year} — ${(event.title && (event.title.en || event.title)) || ''}</h2>
        <p class="text-gray-700">${(event.description && (event.description.en || event.description)) || ''}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderTagBar(events) {
  const tagCounts = {};
  events.forEach(ev => {
    if (!ev.tags) return;
    ev.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  });

  const tagBar = document.getElementById('tag-bar');
  if (!tagBar) return;
  tagBar.innerHTML = '';

  Object.keys(tagCounts).sort().forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200';
    btn.textContent = `${tag} (${tagCounts[tag]})`;
    btn.dataset.tag = tag;
    btn.addEventListener('click', () => {
      if (window.__activeFilters.tags.has(tag)) {
        window.__activeFilters.tags.delete(tag);
        btn.classList.remove('bg-indigo-600','text-white');
      } else {
        window.__activeFilters.tags.add(tag);
        btn.classList.add('bg-indigo-600','text-white');
      }
      applyFilters();
    });
    tagBar.appendChild(btn);
  });
}

function applyFilters() {
  const text = (window.__activeFilters.text || '').toLowerCase().trim();
  const activeTags = window.__activeFilters.tags;
  const filtered = window.__loadedEvents.filter(ev => {
    // text match across title, description, year, and tags
    const title = (ev.title && (ev.title.en || ev.title)) || '';
    const desc = (ev.description && (ev.description.en || ev.description)) || '';
    const hay = `${ev.year} ${title} ${desc} ${(ev.tags || []).join(' ')}`.toLowerCase();
    if (text && !hay.includes(text)) return false;
    if (activeTags.size > 0) {
      // OR logic: keep event if it has any selected tag
      const evTags = new Set(ev.tags || []);
      let has = false;
      for (const t of activeTags) if (evTags.has(t)) { has = true; break; }
      if (!has) return false;
    }
    return true;
  });
  renderTimeline(filtered);
}

async function loadTimeline() {
  const response = await fetch('data/france.json');
  const events = await response.json();
  window.__loadedEvents = events;
  renderTagBar(events);
  renderTimeline(events);

  const search = document.getElementById('timeline-search');
  if (search) {
    search.addEventListener('input', (e) => {
      window.__activeFilters.text = e.target.value;
      applyFilters();
    });
  }
}

loadTimeline();
