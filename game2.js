let allCards = [];
let playerHand = [];
let timeline = [];
let selectedCard = null;
let score = 0;

// List of known data files in the `data/` folder.
// Kept as a static list to avoid relying on directory listing from a static host.
const AVAILABLE_TOPICS = [
    'arthur', 'bjj', 'egypt_myth', 'france', 'greek_myth', 'hindu_myth', 'inventions', 'metal', 'pandemics', 'revolutions', 'roman', 'universe', 'usa', 'wars',
    'ideas/bible', 'ideas/china', 'ideas/germany', 'ideas/india', 'ideas/japan', 'ideas/russia', 'ideas/uk'
];

// Populate topic dropdown on load
document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('topicSelect');
    if (!sel) return;
    // Friendly labels: use filename -> capitalized words
    AVAILABLE_TOPICS.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        sel.appendChild(opt);
    });
});

async function startTopic() {
    const sel = document.getElementById('topicSelect');
    if (!sel) return alert('Aucun sujet sélectionné');
    const topic = sel.value;
    await loadTopic(topic);
}

async function loadTopic(topic) {
    try {
        const res = await fetch(`data/${topic}.json`);
        const data = await res.json();
        // Map dataset entries to simple cards {title, year, image}, filter by valid years
        allCards = data.map(e => {
            const title = (typeof e.title === 'object') ? (e.title.fr || e.title.en || Object.values(e.title)[0]) : (e.title || e.name || 'Untitled');
            const year = extractYear(e.year || e.date || title);
            const image = normalizeImagePath(e.image);
            return { title, year, image };
        }).filter(c => c.year !== null); // Keep only entries with valid years

        if (!Array.isArray(allCards) || allCards.length < 6) {
            alert('Le fichier sélectionné contient moins de 6 événements exploitables avec des dates valides.');
            return;
        }

        // Shuffle and start
        allCards = allCards.sort(() => Math.random() - 0.5);
        document.getElementById('dataLoader').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';
        initGame();
    } catch (err) {
        alert('Erreur lors du chargement du sujet: ' + err.message);
    }
}

// Helper: normalize image path
function normalizeImagePath(p) {
    if (!p) return '';
    if (/^[a-zA-Z]+:\/\//.test(p) || p.startsWith('data:') || p.startsWith('/')) return p;
    return './' + p.replace(/^\.?\//, '');
}

// Helper: try to extract a numeric year from various formats
function extractYear(raw) {
    if (typeof raw === 'number') return raw;
    if (!raw) return null;
    // If it's a string like "1914" or "1914-1918" or "1960s" or "2010s–2020s"
    const s = String(raw);
    // Match a 4-digit year
    const m = s.match(/(\d{4})/);
    if (m) return parseInt(m[1], 10);
    // Match 3-digit or 2-digit fallback
    const m2 = s.match(/(\d{3,4})/);
    if (m2) return parseInt(m2[1], 10);
    return null;
}

function loadSampleData() {
    const sampleData = [
        {"title": "Premier pas sur la Lune", "year": 1969},
        {"title": "Chute du mur de Berlin", "year": 1989},
        {"title": "Invention de l'imprimerie", "year": 1450},
        {"title": "Découverte de l'Amérique", "year": 1492},
        {"title": "Première Guerre mondiale", "year": 1914},
        {"title": "Révolution française", "year": 1789},
        {"title": "Invention du téléphone", "year": 1876},
        {"title": "Première télévision", "year": 1926},
        {"title": "Invention d'Internet", "year": 1983},
        {"title": "Premier iPhone", "year": 2007}
    ];
    // Use the sample dataset directly and start the game
    allCards = sampleData.map(c => ({ title: c.title, year: c.year, description: c.description || '' }));
    // Shuffle
    allCards = allCards.sort(() => Math.random() - 0.5);
    if (allCards.length < 6) {
        alert('Le jeu requiert au moins 6 cartes.');
        return;
    }
    document.getElementById('dataLoader').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    initGame();
}

function loadData() {
    try {
        const inputEl = document.getElementById('jsonInput');
        if (!inputEl) {
            alert('Aucun champ d\'import JSON présent. Utilisez le sélecteur de sujets.');
            return;
        }
        const jsonText = inputEl.value;
        allCards = JSON.parse(jsonText);
        
        if (!Array.isArray(allCards) || allCards.length < 6) {
            alert('Il faut au moins 6 cartes pour jouer !');
            return;
        }

        // Mélanger les cartes
        allCards = allCards.sort(() => Math.random() - 0.5);

        // Initialiser le jeu
        document.getElementById('dataLoader').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';

        initGame();
    } catch (e) {
        alert('Erreur dans le format JSON: ' + e.message);
    }
}

function initGame() {
    // Première carte sur la timeline
    timeline = [allCards.pop()];
    
    // Start with 5 cards in hand (or all remaining cards if less than 5)
    const initialHandSize = Math.min(5, allCards.length);
    playerHand = allCards.splice(0, initialHandSize);
    
    score = 0;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('remaining').textContent = playerHand.length;

    // Afficher la timeline
    const timelineEl = document.getElementById('timeline');
    timelineEl.innerHTML = '<div class="timeline-line"></div>';

    // Zone d'insertion avant la première carte
    const firstZone = createInsertionZone(0);
    timelineEl.appendChild(firstZone);

    timeline.forEach((card, index) => {
        const cardEl = createTimelineCard(card);
        timelineEl.appendChild(cardEl);

        // Zone d'insertion après chaque carte
        const zone = createInsertionZone(index + 1);
        timelineEl.appendChild(zone);
    });

    // Afficher la main du joueur
    const handEl = document.getElementById('handCards');
    handEl.innerHTML = '';
    playerHand.forEach((card, index) => {
        const cardEl = createHandCard(card, index);
        handEl.appendChild(cardEl);
    });
}

function createTimelineCard(card) {
    const div = document.createElement('div');
    div.className = 'card revealed';
    
    const imgSrc = card.image ? encodeURI(card.image) : '';
    const imageHtml = imgSrc 
        ? `<img src="${imgSrc}" alt="${card.title}" class="card-image" onerror="this.style.display='none';">` 
        : '';
    
    div.innerHTML = `
        ${imageHtml}
        <div class="title">${card.title}</div>
        <div class="year">${card.year}</div>
    `;
    return div;
}

function createHandCard(card, index) {
    const div = document.createElement('div');
    div.className = 'hand-card';
    if (selectedCard === index) {
        div.classList.add('selected');
    }
    
    const imgSrc = card.image ? encodeURI(card.image) : '';
    const imageHtml = imgSrc 
        ? `<img src="${imgSrc}" alt="${card.title}" class="card-image" onerror="this.style.display='none';">` 
        : '';
    
    div.innerHTML = `
        ${imageHtml}
        <div class="title">${card.title}</div>
    `;
    div.onclick = () => selectCard(index);
    return div;
}

function createInsertionZone(position) {
    const div = document.createElement('div');
    div.className = 'insertion-zone';
    if (selectedCard !== null) {
        div.classList.add('active');
    }
    div.innerHTML = '<div>+</div>';
    div.onclick = () => placeCard(position);
    return div;
}

function selectCard(index) {
    selectedCard = index;
    updateDisplay();
    showMessage('Choisissez maintenant où placer la carte sur la timeline', 'success');
}

function placeCard(position) {
    if (selectedCard === null) {
        showMessage('Sélectionnez d\'abord une carte de votre main !', 'error');
        return;
    }

    const card = playerHand[selectedCard];
    
    // Vérifier si le placement est correct
    let correct = true;
    
    // Vérifier la carte avant
    if (position > 0 && timeline[position - 1].year > card.year) {
        correct = false;
    }
    
    // Vérifier la carte après
    if (position < timeline.length && timeline[position].year < card.year) {
        correct = false;
    }

    if (correct) {
        // Placement correct
        timeline.splice(position, 0, card);
        playerHand.splice(selectedCard, 1);
        score += 10;
        
        // Draw a new card if available
        if (allCards.length > 0) {
            playerHand.push(allCards.pop());
        }
        
        selectedCard = null;
        
        showMessage(`✓ Correct ! ${card.title} (${card.year})`, 'success');

        // Vérifier si le joueur a gagné (all cards placed)
        if (playerHand.length === 0 && allCards.length === 0) {
            setTimeout(endGame, 1500);
        } else {
            updateDisplay();
        }
    } else {
        // Placement incorrect
        showMessage(`✗ Incorrect ! ${card.title} date de ${card.year}`, 'error');
        
        // Retirer la carte de la main et en piocher une nouvelle
        playerHand.splice(selectedCard, 1);
        if (allCards.length > 0) {
            playerHand.push(allCards.pop());
        }
        selectedCard = null;
        
        setTimeout(() => {
            updateDisplay();
        }, 2000);
    }
}

function showMessage(text, type) {
    const msgEl = document.getElementById('message');
    msgEl.textContent = text;
    msgEl.className = 'message ' + type;
    msgEl.style.display = 'block';

    setTimeout(() => {
        msgEl.style.display = 'none';
    }, 3000);
}

function endGame() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
}
