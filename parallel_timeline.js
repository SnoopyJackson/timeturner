const periods = {
    renaissance: {
        start: 1400,
        end: 1600,
        regions: {
            europe: [
                { year: 1453, title: "Fall of Constantinople", desc: "Ottoman conquest ends Byzantine Empire" },
                { year: 1492, title: "Columbus Sails", desc: "Christopher Columbus reaches the Americas" },
                { year: 1517, title: "Protestant Reformation", desc: "Martin Luther posts 95 Theses" },
                { year: 1588, title: "Spanish Armada", desc: "England defeats Spanish naval invasion" }
            ],
            asia: [
                { year: 1405, title: "Zheng He Voyages", desc: "Chinese treasure fleets explore Indian Ocean" },
                { year: 1526, title: "Mughal Empire Founded", desc: "Babur establishes Mughal rule in India" },
                { year: 1543, title: "Europeans in Japan", desc: "Portuguese traders arrive in Japan" },
                { year: 1592, title: "Japanese Invasions", desc: "Hideyoshi invades Korea" }
            ],
            americas: [
                { year: 1438, title: "Inca Empire Peak", desc: "Pachacuti expands the Inca Empire" },
                { year: 1492, title: "Taino Contact", desc: "Indigenous peoples encounter Europeans" },
                { year: 1521, title: "Aztec Fall", desc: "Tenochtitlan falls to Spanish conquistadors" },
                { year: 1533, title: "Inca Conquest", desc: "Spanish conquest of the Inca Empire" }
            ],
            africa: [
                { year: 1415, title: "Songhai Rise", desc: "Songhai Empire begins expansion" },
                { year: 1464, title: "Sunni Ali", desc: "Sunni Ali becomes ruler of Songhai" },
                { year: 1505, title: "Swahili Coast", desc: "Portuguese establish presence on East African coast" },
                { year: 1591, title: "Songhai Falls", desc: "Moroccan invasion ends Songhai Empire" }
            ]
        }
    },
    industrial: {
        start: 1750,
        end: 1850,
        regions: {
            europe: [
                { year: 1769, title: "Steam Engine", desc: "James Watt improves the steam engine" },
                { year: 1789, title: "French Revolution", desc: "Storming of the Bastille begins revolution" },
                { year: 1815, title: "Waterloo", desc: "Napoleon defeated at Battle of Waterloo" },
                { year: 1848, title: "Revolutions", desc: "Wave of revolutions across Europe" }
            ],
            asia: [
                { year: 1757, title: "Battle of Plassey", desc: "British East India Company dominates Bengal" },
                { year: 1796, title: "Qing Peak", desc: "Qianlong Emperor abdicates at empire's height" },
                { year: 1839, title: "Opium War", desc: "First Opium War begins between Britain and China" },
                { year: 1853, title: "Perry Expedition", desc: "Commodore Perry arrives in Japan" }
            ],
            americas: [
                { year: 1776, title: "US Independence", desc: "Declaration of Independence signed" },
                { year: 1791, title: "Haitian Revolution", desc: "Slave revolt begins in Haiti" },
                { year: 1810, title: "Mexican Independence", desc: "Mexican War of Independence begins" },
                { year: 1822, title: "Brazil Independent", desc: "Brazil declares independence from Portugal" }
            ],
            africa: [
                { year: 1787, title: "Sierra Leone", desc: "Freetown founded for freed slaves" },
                { year: 1806, title: "Cape Colony", desc: "British seize Cape Colony" },
                { year: 1818, title: "Zulu Kingdom", desc: "Shaka forms powerful Zulu Kingdom" },
                { year: 1847, title: "Liberia Founded", desc: "Liberia becomes independent republic" }
            ]
        }
    },
    modern: {
        start: 1900,
        end: 1950,
        regions: {
            europe: [
                { year: 1914, title: "WWI Begins", desc: "Archduke Franz Ferdinand assassinated" },
                { year: 1917, title: "Russian Revolution", desc: "Bolsheviks seize power in Russia" },
                { year: 1939, title: "WWII Begins", desc: "Germany invades Poland" },
                { year: 1945, title: "WWII Ends", desc: "Victory in Europe and Japan" }
            ],
            asia: [
                { year: 1911, title: "Qing Dynasty Falls", desc: "Chinese Revolution ends imperial rule" },
                { year: 1920, title: "Gandhi's Movement", desc: "Non-cooperation movement begins in India" },
                { year: 1937, title: "Sino-Japanese War", desc: "Japan invades China" },
                { year: 1947, title: "India Independence", desc: "British India partitioned into India and Pakistan" }
            ],
            americas: [
                { year: 1910, title: "Mexican Revolution", desc: "Revolution against Díaz dictatorship begins" },
                { year: 1929, title: "Great Depression", desc: "Stock market crash triggers global depression" },
                { year: 1941, title: "Pearl Harbor", desc: "US enters World War II" },
                { year: 1946, title: "Perón Era", desc: "Juan Perón elected president of Argentina" }
            ],
            africa: [
                { year: 1902, title: "Boer War Ends", desc: "British victory in South Africa" },
                { year: 1935, title: "Ethiopia Invasion", desc: "Italy invades Ethiopia" },
                { year: 1941, title: "Ethiopia Liberated", desc: "Emperor Haile Selassie returns" },
                { year: 1948, title: "Apartheid Begins", desc: "National Party implements apartheid in South Africa" }
            ]
        }
    }
};

let currentPeriod = 'renaissance';
let currentMode = 'default'; // 'default' or 'topics'
let selectedTopics = [];
let topicData = {};
let filteredYearRange = null; // {min: number, max: number} or null for all
let zoomLevel = 1;
let originalYearRange = null;
const topicColors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea'];
const topicLabels = {
    'france': '🇫🇷 France',
    'usa': '🇺🇸 USA',
    'roman': '🏛️ Roman Empire',
    'wars': '⚔️ Wars',
    'revolutions': '✊ Revolutions',
    'inventions': '💡 Inventions',
    'pandemics': '🦠 Pandemics',
    'ideas/uk': '🇬🇧 UK',
    'ideas/japan': '🇯🇵 Japan',
    'ideas/china': '🇨🇳 China',
    'ideas/india': '🇮🇳 India',
    'ideas/russia': '🇷🇺 Russia',
    'ideas/germany': '🇩🇪 Germany',
    'greek_myth': '⚡ Greek Mythology',
    'hindu_myth': '🕉️ Hindu Mythology',
    'egypt_myth': '𓂀 Egyptian Mythology'
};

function setMode(mode) {
    currentMode = mode;
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const timeRangeControls = document.getElementById('timeRangeControls');
    
    if (mode === 'default') {
        document.getElementById('defaultModeBtn').classList.add('active');
        document.getElementById('defaultControls').style.display = 'flex';
        document.getElementById('topicControls').style.display = 'none';
        timeRangeControls.style.display = 'none';
        filteredYearRange = null;
        zoomLevel = 1;
        renderTimeline();
    } else {
        document.getElementById('topicsModeBtn').classList.add('active');
        document.getElementById('defaultControls').style.display = 'none';
        document.getElementById('topicControls').style.display = 'block';
        
        // Show time range controls only when topics are loaded
        if (selectedTopics.length > 0 && Object.keys(topicData).length > 0) {
            timeRangeControls.style.display = 'block';
        } else {
            timeRangeControls.style.display = 'none';
        }
        
        // Clear timeline if no topics selected
        if (selectedTopics.length === 0) {
            document.getElementById('timelineContainer').innerHTML = '';
            document.getElementById('yearMarkers').innerHTML = '';
            updateLegend([]);
        }
    }
}

function updateTopicSelection() {
    const checkboxes = document.querySelectorAll('.topic-checkbox input[type="checkbox"]:checked');
    selectedTopics = Array.from(checkboxes).map(cb => cb.value);
    
    const loadBtn = document.getElementById('loadTopicsBtn');
    loadBtn.disabled = selectedTopics.length < 2 || selectedTopics.length > 4;
}

async function loadSelectedTopics() {
    if (selectedTopics.length < 2 || selectedTopics.length > 4) {
        alert('Please select between 2 and 4 topics to compare.');
        return;
    }
    
    const loadBtn = document.getElementById('loadTopicsBtn');
    loadBtn.textContent = 'Loading...';
    loadBtn.disabled = true;
    
    try {
        topicData = {};
        
        // Load each selected topic
        for (const topic of selectedTopics) {
            try {
                console.log(`Attempting to load: data/${topic}.json`);
                const response = await fetch(`data/${topic}.json`);
                
                if (!response.ok) {
                    console.error(`Failed to load ${topic}: HTTP ${response.status} ${response.statusText}`);
                    throw new Error(`Failed to load ${topic}: HTTP ${response.status}`);
                }
                
                const rawData = await response.json();
                console.log(`Raw data loaded for ${topic}:`, rawData.length, 'entries');
                
                // Filter out entries with invalid years
                const validData = rawData.filter(event => {
                    const year = parseYear(event.year);
                    if (year === null) {
                        console.log(`Filtered out event with invalid year: "${event.year}"`, event.title || event);
                        return false;
                    }
                    return true;
                });
                
                topicData[topic] = validData;
                console.log(`✓ Loaded ${topic}: ${validData.length} valid events out of ${rawData.length} total`);
                
            } catch (err) {
                console.error(`✗ Error loading ${topic}:`, err);
                console.error('Error details:', {
                    message: err.message,
                    stack: err.stack,
                    topic: topic,
                    path: `data/${topic}.json`
                });
                throw new Error(`Failed to load ${topic}: ${err.message}`);
            }
        }
        
        // Reset filters
        filteredYearRange = null;
        zoomLevel = 1;
        
        // Show time range controls
        document.getElementById('timeRangeControls').style.display = 'block';
        
        renderTopicTimeline();
        loadBtn.textContent = 'Load Timeline';
        updateTopicSelection(); // Re-enable button based on current selection
    } catch (error) {
        console.error('Error loading topics:', error);
        alert(`Error loading topic data: ${error.message}\nPlease check the console for details.`);
        loadBtn.textContent = 'Load Timeline';
        updateTopicSelection(); // Re-enable button based on current selection
    }
}

function renderTopicTimeline() {
    const container = document.getElementById('timelineContainer');
    const yearMarkers = document.getElementById('yearMarkers');
    
    container.innerHTML = '';
    yearMarkers.innerHTML = '';
    
    if (selectedTopics.length === 0) {
        updateLegend([]);
        return;
    }
    
    // Find the overall time range across all topics
    let minYear = Infinity;
    let maxYear = -Infinity;
    let totalValidEvents = 0;
    
    selectedTopics.forEach(topic => {
        const data = topicData[topic];
        if (!data || data.length === 0) {
            console.warn(`No data available for topic: ${topic}`);
            return;
        }
        
        data.forEach(event => {
            const year = parseYear(event.year);
            if (year !== null && isFinite(year)) {
                minYear = Math.min(minYear, year);
                maxYear = Math.max(maxYear, year);
                totalValidEvents++;
            }
        });
    });
    
    // Check if we have any valid data to display
    if (!isFinite(minYear) || !isFinite(maxYear) || totalValidEvents === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">No valid timeline data found for selected topics.</div>';
        updateLegend([]);
        return;
    }
    
    // Store original range for zoom reset
    if (!originalYearRange) {
        originalYearRange = { min: minYear, max: maxYear };
    }
    
    // Apply filtered year range if set
    if (filteredYearRange) {
        minYear = filteredYearRange.min;
        maxYear = filteredYearRange.max;
    } else {
        // Add some padding to the range
        const range = maxYear - minYear;
        const padding = Math.max(10, Math.floor(range * 0.05));
        minYear -= padding;
        maxYear += padding;
    }
    
    // Render each topic as a row
    selectedTopics.forEach((topic, index) => {
        const row = document.createElement('div');
        row.className = 'timeline-row';
        
        const label = document.createElement('div');
        label.className = 'timeline-label';
        label.textContent = topicLabels[topic] || topic;
        
        const track = document.createElement('div');
        track.className = 'timeline-track';
        
        const axis = document.createElement('div');
        axis.className = 'timeline-axis';
        track.appendChild(axis);
        
        const data = topicData[topic];
        
        if (!data || data.length === 0) {
            console.warn(`No data for topic: ${topic}`);
            return;
        }
        
        // Sample events if there are too many (keep max 20 per topic)
        let eventsToShow = data;
        if (data.length > 20) {
            const step = Math.floor(data.length / 20);
            eventsToShow = data.filter((_, i) => i % step === 0);
        }
        
        eventsToShow.forEach(event => {
            const year = parseYear(event.year);
            if (year !== null && isFinite(year) && year >= minYear && year <= maxYear) {
                const eventEl = document.createElement('div');
                eventEl.className = `event topic-${index}`;
                
                const position = ((year - minYear) / (maxYear - minYear)) * 100;
                eventEl.style.left = `${position}%`;
                
                const title = typeof event.title === 'object' ? (event.title.en || event.title.fr) : event.title;
                const desc = typeof event.description === 'object' ? (event.description.en || event.description.fr) : event.description;
                
                eventEl.innerHTML = `
                    <div class="event-title">${title}</div>
                    <div class="event-year">${event.year}</div>
                `;
                
                eventEl.addEventListener('mouseenter', (e) => showTooltip(e, {
                    title: title,
                    year: event.year,
                    desc: desc ? desc.replace(/\n/g, '<br>').replace(/[🔥⚔️🏛️💰👑⚡🌍🎨📜✝️🕌🛡️⛪🗡️📖🎭🏰🌟💀🏆🎪👥🚢⛵🌊🏴‍☠️⚓💎🎖️🔔🕊️🌸🎌🐉🗾⛩️🇯🇵🇮🇳🕉️🙏🐘👳📿🪔🌺🎆🇨🇳🀄🥟🏮🐼🧧🎋🇫🇷⚜️🥖🗼🍷🎨🧀👨‍🎨🇺🇸🦅🗽⭐🏈🍔🎸🚀🇬🇧☕👑🎩🚂🏴󠁧󠁢󠁥󠁮󠁧󠁿🇷🇺❄️🐻⚒️🪆🇩🇪🍺🏰🎼🥨💡🦠🤒😷💉🏥⚕️☠️🌡️💊✊🚩⛓️🗳️🔨📢🎺💡⚙️🔬🚂💻📱✈️🚀]/g, '') : ''
                }));
                eventEl.addEventListener('mouseleave', hideTooltip);
                
                track.appendChild(eventEl);
            }
        });
        
        row.appendChild(label);
        row.appendChild(track);
        container.appendChild(row);
    });
    
    // Create year markers
    const numMarkers = 5;
    for (let i = 0; i < numMarkers; i++) {
        const year = Math.floor(minYear + (maxYear - minYear) * (i / (numMarkers - 1)));
        const marker = document.createElement('div');
        marker.textContent = year;
        yearMarkers.appendChild(marker);
    }
    
    updateLegend(selectedTopics);
}

function parseYear(yearStr) {
    // Handle undefined, null, or empty values
    if (yearStr === undefined || yearStr === null || yearStr === '') {
        return null;
    }
    
    // Handle number type
    if (typeof yearStr === 'number') {
        return isNaN(yearStr) ? null : yearStr;
    }
    
    // Convert to string if not already
    if (typeof yearStr !== 'string') {
        yearStr = String(yearStr);
    }
    
    // Trim whitespace
    yearStr = yearStr.trim();
    if (yearStr === '') return null;
    
    // Handle ranges like "1492–1607" or "1492-1607" - take the start year
    const rangeMatch = yearStr.match(/^(-?\d+)[\s–\-—~]+(-?\d+)/);
    if (rangeMatch) {
        const year = parseInt(rangeMatch[1]);
        return isNaN(year) ? null : year;
    }
    
    // Handle BC/BCE dates (e.g., "3300 BC", "660 BCE", "2070 av. J.-C.")
    const bcMatch = yearStr.match(/^(\d+)\s*(BC|BCE|av\.\s*J[\.\-]\s*C\.?)/i);
    if (bcMatch) {
        const year = -parseInt(bcMatch[1]);
        return isNaN(year) ? null : year;
    }
    
    // Handle AD/CE dates explicitly (e.g., "43 AD", "1066 CE")
    const adMatch = yearStr.match(/^(\d+)\s*(AD|CE|ap\.\s*J[\.\-]\s*C\.?)/i);
    if (adMatch) {
        const year = parseInt(adMatch[1]);
        return isNaN(year) ? null : year;
    }
    
    // Handle c. or circa dates (e.g., "c. 1500", "circa 1600")
    const circaMatch = yearStr.match(/^(?:c\.?|circa)\s*(-?\d+)/i);
    if (circaMatch) {
        const year = parseInt(circaMatch[1]);
        return isNaN(year) ? null : year;
    }
    
    // Handle regular years (positive or negative)
    const yearMatch = yearStr.match(/^(-?\d+)/);
    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        return isNaN(year) ? null : year;
    }
    
    // If nothing matches, return null
    console.warn(`Could not parse year: "${yearStr}"`);
    return null;
}

function updateLegend(topics) {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    
    if (currentMode === 'default') {
        // Default legend for regions
        const regions = [
            { class: 'europe', label: '🇪🇺 Europe' },
            { class: 'asia', label: '🌏 Asia' },
            { class: 'americas', label: '🌎 Americas' },
            { class: 'africa', label: '🌍 Africa' }
        ];
        
        regions.forEach(region => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-color ${region.class}"></div>
                <span>${region.label}</span>
            `;
            legend.appendChild(item);
        });
    } else {
        // Dynamic legend for selected topics
        topics.forEach((topic, index) => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-color topic-${index}"></div>
                <span>${topicLabels[topic] || topic}</span>
            `;
            legend.appendChild(item);
        });
    }
}

function loadPeriod(periodName) {
    currentPeriod = periodName;
    document.querySelectorAll('.controls button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTimeline();
}

function renderTimeline() {
    const period = periods[currentPeriod];
    const container = document.getElementById('timelineContainer');
    const yearMarkers = document.getElementById('yearMarkers');
    
    container.innerHTML = '';
    yearMarkers.innerHTML = '';

    const regions = ['europe', 'asia', 'americas', 'africa'];
    const labels = {
        europe: '🇪🇺 Europe',
        asia: '🌏 Asia',
        americas: '🌎 Americas',
        africa: '🌍 Africa'
    };

    regions.forEach(region => {
        const row = document.createElement('div');
        row.className = 'timeline-row';
        
        const label = document.createElement('div');
        label.className = 'timeline-label';
        label.textContent = labels[region];
        
        const track = document.createElement('div');
        track.className = 'timeline-track';
        
        const axis = document.createElement('div');
        axis.className = 'timeline-axis';
        track.appendChild(axis);

        period.regions[region].forEach(evt => {
            const eventEl = document.createElement('div');
            eventEl.className = `event ${region}`;
            
            const position = ((evt.year - period.start) / (period.end - period.start)) * 100;
            eventEl.style.left = `${position}%`;
            
            eventEl.innerHTML = `
                <div class="event-title">${evt.title}</div>
                <div class="event-year">${evt.year}</div>
            `;
            
            eventEl.addEventListener('mouseenter', (e) => showTooltip(e, evt));
            eventEl.addEventListener('mouseleave', hideTooltip);
            
            track.appendChild(eventEl);
        });

        row.appendChild(label);
        row.appendChild(track);
        container.appendChild(row);
    });

    const markerYears = [period.start, Math.floor((period.start + period.end) / 2), period.end];
    markerYears.forEach(year => {
        const marker = document.createElement('div');
        marker.textContent = year;
        yearMarkers.appendChild(marker);
    });
    
    updateLegend([]);
}

function showTooltip(e, evt) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `<strong>${evt.title} (${evt.year})</strong><br>${evt.desc}`;
    tooltip.style.display = 'block';
    updateTooltipPosition(e);
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
}

function hideTooltip() {
    document.getElementById('tooltip').style.display = 'none';
}

document.addEventListener('mousemove', (e) => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip.style.display === 'block') {
        updateTooltipPosition(e);
    }
});

// Period filtering functions
function filterByPeriod(period) {
    // Update active button
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`period-${period}`).classList.add('active');
    
    // Reset original range if not set
    if (!originalYearRange && Object.keys(topicData).length > 0) {
        let minYear = Infinity;
        let maxYear = -Infinity;
        selectedTopics.forEach(topic => {
            const data = topicData[topic];
            if (data) {
                data.forEach(event => {
                    const year = parseYear(event.year);
                    if (year !== null && isFinite(year)) {
                        minYear = Math.min(minYear, year);
                        maxYear = Math.max(maxYear, year);
                    }
                });
            }
        });
        originalYearRange = { min: minYear, max: maxYear };
    }
    
    // Set year range based on period
    switch(period) {
        case 'all':
            filteredYearRange = null;
            break;
        case 'ancient':
            filteredYearRange = { min: -3000, max: 500 };
            break;
        case 'medieval':
            filteredYearRange = { min: 500, max: 1500 };
            break;
        case 'early-modern':
            filteredYearRange = { min: 1500, max: 1800 };
            break;
        case 'modern':
            filteredYearRange = { min: 1800, max: 1950 };
            break;
        case 'contemporary':
            filteredYearRange = { min: 1950, max: new Date().getFullYear() };
            break;
    }
    
    zoomLevel = 1;
    renderTopicTimeline();
}

function applyCustomRange() {
    const startYear = parseInt(document.getElementById('rangeStart').value);
    const endYear = parseInt(document.getElementById('rangeEnd').value);
    
    if (isNaN(startYear) || isNaN(endYear)) {
        alert('Please enter valid years for both start and end.');
        return;
    }
    
    if (startYear >= endYear) {
        alert('Start year must be before end year.');
        return;
    }
    
    // Deactivate preset period buttons
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    
    filteredYearRange = { min: startYear, max: endYear };
    zoomLevel = 1;
    renderTopicTimeline();
}

function zoomTimeline(factor) {
    if (!filteredYearRange && !originalYearRange) return;
    
    const currentRange = filteredYearRange || originalYearRange;
    if (!currentRange) return;
    
    const center = (currentRange.min + currentRange.max) / 2;
    const currentSpan = currentRange.max - currentRange.min;
    const newSpan = currentSpan / factor;
    
    // Prevent zooming too far in or out
    if (newSpan < 10) {
        alert('Cannot zoom in further. Minimum range is 10 years.');
        return;
    }
    
    if (originalYearRange) {
        const originalSpan = originalYearRange.max - originalYearRange.min;
        if (newSpan > originalSpan * 2) {
            alert('Cannot zoom out further.');
            return;
        }
    }
    
    filteredYearRange = {
        min: Math.floor(center - newSpan / 2),
        max: Math.ceil(center + newSpan / 2)
    };
    
    zoomLevel *= factor;
    
    // Update custom range inputs
    document.getElementById('rangeStart').value = filteredYearRange.min;
    document.getElementById('rangeEnd').value = filteredYearRange.max;
    
    renderTopicTimeline();
}

function resetZoom() {
    filteredYearRange = null;
    zoomLevel = 1;
    
    // Clear custom range inputs
    document.getElementById('rangeStart').value = '';
    document.getElementById('rangeEnd').value = '';
    
    // Activate "All Time" button
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('period-all').classList.add('active');
    
    renderTopicTimeline();
}

// Theme toggle functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Add theme toggle event listener
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Initialize
renderTimeline();
updateLegend([]);
