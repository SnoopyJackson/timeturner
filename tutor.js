let historyData = [];
let filteredData = []; // Data filtered by selected topic
let currentTopic = 'all';
let currentLang = 'en';
const availableTopics = [
    // Main data folder
    { id: 'arthur', name: { en: 'King Arthur', fr: 'Roi Arthur' }, icon: '⚔️' },
    { id: 'bjj', name: { en: 'Brazilian Jiu Jitsu', fr: 'Jiu Jitsu Brésilien' }, icon: '🥋' },
    { id: 'egypt_myth', name: { en: 'Egypt Mythology', fr: 'Mythologie Égyptienne' }, icon: '🦅' },
    { id: 'france', name: { en: 'France', fr: 'France' }, icon: '�🇷' },
    { id: 'greek_myth', name: { en: 'Greek Mythology', fr: 'Mythologie Grecque' }, icon: '🇷' },
    { id: 'hindu_myth', name: { en: 'Hindu Mythology', fr: 'Mythologie Hindoue' }, icon: '🕉️' },
    { id: 'inventions', name: { en: 'Inventions', fr: 'Inventions' }, icon: '💡' },
    { id: 'metal', name: { en: 'Heavy Metal', fr: 'Heavy Metal' }, icon: '�' },
    { id: 'pandemics', name: { en: 'Pandemics', fr: 'Pandémies' }, icon: '🦠' },
    { id: 'revolutions', name: { en: 'Revolutions', fr: 'Révolutions' }, icon: '✊' },
    { id: 'roman', name: { en: 'Rome', fr: 'Rome' }, icon: '�️' },
    { id: 'universe', name: { en: 'Universe', fr: 'Univers' }, icon: '�' },
    { id: 'usa', name: { en: 'USA', fr: 'États-Unis' }, icon: '��' },
    { id: 'wars', name: { en: 'Wars', fr: 'Guerres' }, icon: '⚔️' },
    // Ideas subfolder
    { id: 'ideas/bible', name: { en: 'Bible', fr: 'Bible' }, icon: '📖' },
    { id: 'ideas/china', name: { en: 'China', fr: 'Chine' }, icon: '🇨🇳' },
    { id: 'ideas/germany', name: { en: 'Germany', fr: 'Allemagne' }, icon: '🇩🇪' },
    { id: 'ideas/india', name: { en: 'India', fr: 'Inde' }, icon: '🇮🇳' },
    { id: 'ideas/japan', name: { en: 'Japan', fr: 'Japon' }, icon: '🇯🇵' },
    { id: 'ideas/russia', name: { en: 'Russia', fr: 'Russie' }, icon: '🇷�' },
    { id: 'ideas/uk', name: { en: 'UK', fr: 'Royaume-Uni' }, icon: '🇬🇧' }
];

// Topic data mapping
const topicDataMap = new Map();

// --- Text helpers for better matching ---
function normalizeText(s) {
    if (!s) return '';
    // lower-case, remove punctuation, and strip diacritics
    return s.toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenize(s) {
    if (!s) return [];
    return normalizeText(s).split(/\s+/).filter(Boolean);
}

function jaccardScore(aTokens, bTokens) {
    if (!aTokens.length || !bTokens.length) return 0;
    const a = new Set(aTokens);
    const b = new Set(bTokens);
    const intersection = [...a].filter(x => b.has(x)).length;
    const union = new Set([...a, ...b]).size;
    return union === 0 ? 0 : intersection / union;
}

// Dynamic n-gram index (built at load time) to map common multi-word phrases to events/tags
const ngramIndex = new Map(); // ngram -> Set of event ids
const ngramTagMap = new Map(); // ngram -> most frequent topic/tag (derived)

function extractNgramsFromTokens(tokens, minN=2, maxN=3) {
    const out = [];
    for (let n = minN; n <= Math.min(maxN, tokens.length); n++) {
        for (let i = 0; i <= tokens.length - n; i++) {
            out.push(tokens.slice(i, i+n).join(' '));
        }
    }
    return out;
}

// Load all data from JSON files
async function loadAllData() {
    historyData = [];
    for (const topic of availableTopics) {
        try {
            const response = await fetch(`data/${topic.id}.json`);
            if (response.ok) {
                const data = await response.json();
                // Stamp every event with its source topic before storing
                data.forEach(ev => { ev.__sourceTopic = topic.id; });
                // Store data by topic
                topicDataMap.set(topic.id, data);
                historyData = historyData.concat(data);
            }
        } catch (error) {
            console.log(`Could not load ${topic.id}.json`);
        }
    }
    // Build dynamic n-gram index for loaded events
    ngramIndex.clear();
    ngramTagMap.clear();
    historyData.forEach((event, idx) => {
        // stamp index onto event for lookup
        event.__index = idx;
        // create a stable id for the event (use idx)
        const eventId = idx;
        const title = event.title[currentLang] || event.title.en || '';
        const desc = event.description[currentLang] || event.description.en || '';
        const tokens = tokenize(title).concat(tokenize(desc));
        const ngrams = extractNgramsFromTokens(tokens, 2, 3);
        ngrams.forEach(ng => {
            if (!ngramIndex.has(ng)) ngramIndex.set(ng, new Set());
            ngramIndex.get(ng).add(eventId);
            // track tag counts for this ngram
            const existing = ngramTagMap.get(ng) || {};
            (event.tags || []).forEach(t => {
                existing[t] = (existing[t] || 0) + 1;
            });
            ngramTagMap.set(ng, existing);
        });
    });
    // reduce ngramTagMap to most frequent tag per ngram
    for (const [ng, counts] of ngramTagMap.entries()) {
        let top = null, topCount = 0;
        for (const t in counts) {
            if (counts[t] > topCount) { top = t; topCount = counts[t]; }
        }
        if (top) ngramTagMap.set(ng, top);
        else ngramTagMap.delete(ng);
    }
    // Sort by year
    historyData.sort((a, b) => {
        const yearA = parseInt(a.year.toString().replace(/[^0-9-]/g, '')) || 0;
        const yearB = parseInt(b.year.toString().replace(/[^0-9-]/g, '')) || 0;
        return yearA - yearB;
    });
    filteredData = historyData; // Initially show all
    populateTopicSelector();
}

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const topicSelect = document.getElementById('topic-select');

// Populate topic selector
function populateTopicSelector() {
    const allText = currentLang === 'en' ? 'All Topics' : 'Tous les Sujets';
    topicSelect.innerHTML = `<option value="all">${allText}</option>`;
    
    availableTopics.forEach(topic => {
        if (topicDataMap.has(topic.id)) {
            const option = document.createElement('option');
            option.value = topic.id;
            option.textContent = `${topic.icon} ${topic.name[currentLang] || topic.name.en}`;
            topicSelect.appendChild(option);
        }
    });
}

// Topic change handler
topicSelect.addEventListener('change', (e) => {
    currentTopic = e.target.value;
    
    if (currentTopic === 'all') {
        filteredData = historyData;
        document.querySelector('.status-all').style.display = 'inline';
        document.querySelector('.status-topic').style.display = 'none';
    } else {
        filteredData = topicDataMap.get(currentTopic) || [];
        const topic = availableTopics.find(t => t.id === currentTopic);
        if (topic) {
            document.getElementById('current-topic-name').textContent = topic.name[currentLang] || topic.name.en;
            document.querySelector('.status-all').style.display = 'none';
            document.querySelector('.status-topic').style.display = 'inline';
        }
    }
    
    updateQuickTopics();
    
    // Add a system message about topic change
    const topicName = currentTopic === 'all' 
        ? (currentLang === 'en' ? 'all topics' : 'tous les sujets')
        : (availableTopics.find(t => t.id === currentTopic)?.name[currentLang] || currentTopic);
    
    const message = currentLang === 'en' 
        ? `📚 Now focusing on <strong>${topicName}</strong>. I have ${filteredData.length} events to tell you about!`
        : `📚 Concentration sur <strong>${topicName}</strong>. J'ai ${filteredData.length} événements à te raconter!`;
    
    addMessage(message, 'tutor');
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Language selection
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLang = btn.dataset.lang;
        updateQuickTopics();
        updateWelcomeMessage();
    });
});

function updateWelcomeMessage() {
    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeText = document.querySelector('.welcome-text');
    const welcomeInstruction = document.querySelector('.welcome-instruction');
    
    if (currentLang === 'fr') {
        welcomeTitle.textContent = 'Bienvenue à votre tuteur d\'histoire!';
        welcomeText.textContent = 'Je suis là pour vous aider à apprendre l\'histoire.';
        welcomeInstruction.textContent = 'Posez-moi des questions sur les événements historiques, les dates, les personnages, ou choisissez un sujet ci-dessous!';
        chatInput.placeholder = 'Posez-moi une question sur l\'histoire...';
        document.querySelector('.topic-label-text').textContent = 'Sujet:';
    } else {
        welcomeTitle.textContent = 'Welcome to Your History Tutor!';
        welcomeText.textContent = 'I\'m here to help you learn about history.';
        welcomeInstruction.textContent = 'Ask me anything about historical events, dates, people, or choose a topic below!';
        chatInput.placeholder = 'Ask me about history...';
        document.querySelector('.topic-label-text').textContent = 'Topic:';
    }
    
    // Update topic selector options
    populateTopicSelector();
    topicSelect.value = currentTopic; // Maintain current selection
}

// Quick topics
function updateQuickTopics() {
    let topics = [];
    
    if (currentTopic === 'all') {
        topics = currentLang === 'en' ? [
            "Tell me about France",
            "What was the French Revolution?",
            "Explain World War I",
            "Tell me about Heavy Metal",
            "What about Ancient Rome?",
            "Show me Egyptian history"
        ] : [
            "Parle-moi de la France",
            "Qu'était la Révolution Française?",
            "Explique la Première Guerre Mondiale",
            "Parle-moi du Heavy Metal",
            "Qu'en est-il de la Rome Antique?",
            "Montre-moi l'histoire égyptienne"
        ];
    } else {
        // Get sample events from the current topic
        const topicData = topicDataMap.get(currentTopic) || [];
        if (topicData.length > 0) {
            topics = topicData.slice(0, 6).map(event => {
                const title = event.title[currentLang] || event.title.en;
                return currentLang === 'en' ? 
                    `Tell me about ${title}` : 
                    `Parle-moi de ${title}`;
            });
            
            // Add some generic questions
            if (currentLang === 'en') {
                topics.push("Show me a timeline");
                topics.push("Give me an overview");
            } else {
                topics.push("Montre-moi une chronologie");
                topics.push("Donne-moi un aperçu");
            }
        }
    }

    const topicChips = document.getElementById('topicChips');
    topicChips.innerHTML = '';
    
    topics.forEach(topic => {
        const chip = document.createElement('div');
        chip.className = 'topic-chip';
        chip.textContent = topic;
        chip.addEventListener('click', () => {
            chatInput.value = topic;
            sendMessage();
        });
        topicChips.appendChild(chip);
    });
}

// Send message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';

    showTypingIndicator();
    
    setTimeout(() => {
        const response = generateResponse(message);
        hideTypingIndicator();
        addMessage(response, 'tutor');
    }, 1000 + Math.random() * 1000);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? '👤' : '🎓'}</div>
        <div class="message-content">
            ${content}
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

/**
 * IMPROVED SEARCH ALGORITHM
 * 
 * This function uses a multi-factor scoring system to find the most relevant historical events:
 * 
 * 1. EXACT MATCHES (300+ points): Perfect title/description matches get highest priority
 * 2. JACCARD SIMILARITY (0-120 points): Token overlap between query and event
 * 3. N-GRAM MATCHES (20-50 points): Multi-word phrases like "french revolution"
 * 4. YEAR MATCHING (20-50 points): Chronological queries
 * 5. TAG MATCHES (10-40 points): Category and topic tags
 * 6. PHRASE BOOST (50-60 points): Pre-indexed common phrases
 * 7. QUESTION TYPE BOOST (40-150 points): "Tell me about", "Who is", "What is", "When"
 * 8. TOKEN MATCHES (6-12 points): Individual word matches
 * 9. AGGREGATE COVERAGE (20-60 points): Multiple token matches
 * 10. WORD ORDER PRESERVATION (0-30 points): Maintains query word sequence
 * 11. ERA MATCHING (8 points): Historical period context
 * 
 * Confidence calculation considers both absolute score quality and gap to second-best result.
 * Lower thresholds (30 points) ensure more results while maintaining quality.
 */
function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Use filtered data based on selected topic
    const dataToSearch = filteredData;
    
    console.log(`Searching in ${dataToSearch.length} events for: "${msg}"`);
    
    // Normalize user message and extract tokens
    const normalizedMsg = normalizeText(userMessage);
    const msgTokens = tokenize(userMessage);
    
    // Detect explicit "tell me about" / "what is" / "who is" style queries and extract intent
    const isTellMeQuery = /^(tell me about|parle moi de|parle-moi de|what (is|was|were)|qui (est|etait)|qu'est ce que|quelle est)/i.test(normalizedMsg);
    const isWhoQuery = /^(who (is|was|were)|qui (est|etait))/i.test(normalizedMsg);
    const isWhatQuery = /^(what (is|was|were)|qu'est ce que|quelle est)/i.test(normalizedMsg);
    const isWhenQuery = /^(when (did|was|were)|quand)/i.test(normalizedMsg);
    
    // Enhanced stop words list
    const stopWords = new Set(['tell','me','about','parle','moi','de','tellme','please','what','is','was','were','who','when','did','qui','est','etait','quand','quest','quelle','the','le','la','les','un','une','des']);
    const intentTokens = msgTokens.filter(t => !stopWords.has(t) && t.length > 2);

    // phrase boost: compute n-grams from the query and consult dynamic ngramTagMap
    let phraseBoostTag = null;
    const queryNgrams = extractNgramsFromTokens(msgTokens, 2, 3);
    const matchedNgramEvents = new Set();
    queryNgrams.forEach(ng => {
        if (ngramTagMap.has(ng)) {
            phraseBoostTag = ngramTagMap.get(ng);
        }
        const evSet = ngramIndex.get(ng);
        if (evSet) evSet.forEach(id => matchedNgramEvents.add(id));
    });

    // Calculate relevance score for each event using normalized comparisons
    const scoredEvents = dataToSearch.map(event => {
        let score = 0;
        const title = event.title[currentLang] || event.title.en || '';
        const desc = event.description[currentLang] || event.description.en || '';
        const titleNorm = normalizeText(title);
        const descNorm = normalizeText(desc);
        const titleTokens = tokenize(title);
        const descTokens = tokenize(desc);
        const yearStr = event.year ? String(event.year) : '';
        const era = event.era ? normalizeText(event.era) : '';

        // 1. EXACT MATCHES (highest priority)
        // Exact normalized title match => strongest boost
        if (titleNorm === normalizedMsg) score += 300;
        // Exact phrase in title (substring match)
        if (titleNorm.includes(normalizedMsg) && normalizedMsg.length > 3) score += 150;
        // Exact phrase in description
        if (descNorm.includes(normalizedMsg) && normalizedMsg.length > 5) score += 80;

        // 2. JACCARD SIMILARITY (token overlap)
        const jaccardTitle = jaccardScore(msgTokens, titleTokens);
        const jaccardDesc = jaccardScore(msgTokens, descTokens);
        score += Math.round(jaccardTitle * 120); // increased weight for title
        score += Math.round(jaccardDesc * 60);   // moderate weight for description

        // 3. N-GRAM MATCHES (multi-word phrases like "french revolution")
        const ngrams = [];
        const t = msgTokens;
        for (let n = 2; n <= Math.min(4, t.length); n++) { // extended to 4-grams
            for (let i = 0; i <= t.length - n; i++) {
                ngrams.push(t.slice(i, i+n).join(' '));
            }
        }
        // Prioritize longer n-grams (more specific)
        ngrams.forEach(g => {
            const ngramLength = g.split(' ').length;
            const lengthBonus = ngramLength * 5; // bonus for longer phrases
            if (titleNorm.includes(g)) score += 20 + lengthBonus;
            if (descNorm.includes(g)) score += 10 + lengthBonus;
            if (era.includes(g)) score += 12;
        });

        // 4. YEAR MATCHING
        if (yearStr && yearStr.length >= 3) {
            if (yearStr === normalizedMsg) score += 50;
            else if (normalizedMsg.includes(yearStr)) score += 25;
            else if (yearStr.includes(normalizedMsg.replace(/[^\d]/g, ''))) score += 20;
        }

        // 5. TAG MATCHES
        (event.tags || []).forEach(tag => {
            const tagNorm = normalizeText(tag);
            // Exact tag match
            if (tagNorm === normalizedMsg) score += 40;
            // Tag contains query or vice versa
            if (normalizedMsg.includes(tagNorm)) score += 30;
            if (tagNorm.includes(normalizedMsg)) score += 25;
            // Partial token matches in tags
            msgTokens.forEach(w => { 
                if (tagNorm.includes(w) && w.length > 2) score += 10; 
            });
        });

        // 6. PHRASE BOOST (from n-gram index)
        if (matchedNgramEvents.has(event.__index)) {
            score += 60;
        }
        if (phraseBoostTag && (event.tags || []).includes(phraseBoostTag)) {
            score += 50;
        }

        // 7. QUESTION TYPE SPECIFIC BOOSTS
        if ((isTellMeQuery || isWhatQuery || isWhoQuery || isWhenQuery) && intentTokens.length > 0) {
            const titleTokSet = new Set(titleTokens);
            const descTokSet = new Set(descTokens);
            const intentMatchesInTitle = intentTokens.filter(t => titleTokSet.has(t)).length;
            const intentMatchesInDesc = intentTokens.filter(t => descTokSet.has(t)).length;
            
            // Strong boost when intent matches title
            if (intentMatchesInTitle >= 1) {
                score += 100 + (intentMatchesInTitle - 1) * 30; // bonus for multiple matches
            }
            // Moderate boost for description matches
            if (intentMatchesInDesc >= 2) {
                score += 40;
            }
            
            // Extra boost for "who is" queries matching person-related tags
            if (isWhoQuery) {
                const personTags = ['leader', 'emperor', 'king', 'queen', 'president', 'prime-minister', 'philosopher', 'scientist'];
                if ((event.tags || []).some(tag => personTags.includes(tag))) {
                    score += 50;
                }
            }
        }

        // 8. INDIVIDUAL TOKEN MATCHES
        msgTokens.forEach(w => {
            if (w.length <= 2) return; // skip very short tokens
            if (titleTokens.includes(w)) score += 12;
            if (descTokens.includes(w)) score += 6;
        });

        // 9. AGGREGATE TOKEN COVERAGE
        // Reward events that match multiple query tokens
        const titleTokenMatches = msgTokens.filter(w => w.length > 2 && titleTokens.includes(w)).length;
        const descTokenMatches = msgTokens.filter(w => w.length > 2 && descTokens.includes(w)).length;
        
        if (titleTokenMatches > 1) {
            score += titleTokenMatches * 20; // e.g., 3 matching tokens => +60
        }
        if (descTokenMatches > 2) {
            score += descTokenMatches * 8;
        }

        // 10. WORD ORDER PRESERVATION BONUS
        // Check if query tokens appear in same order in title
        if (msgTokens.length >= 2) {
            let orderScore = 0;
            for (let i = 0; i < msgTokens.length - 1; i++) {
                const idx1 = titleTokens.indexOf(msgTokens[i]);
                const idx2 = titleTokens.indexOf(msgTokens[i + 1]);
                if (idx1 !== -1 && idx2 !== -1 && idx2 > idx1) {
                    orderScore += 15; // bonus for maintaining word order
                }
            }
            score += orderScore;
        }

        // 11. ERA MATCHING
        if (era) {
            msgTokens.forEach(w => {
                if (era.includes(w) && w.length > 3) score += 8;
            });
        }

        return { event, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
    
    console.log(`Found ${scoredEvents.length} relevant events with scores`);
    if (scoredEvents.length > 0) {
        console.log('Top 3 scores:', scoredEvents.slice(0, 3).map(s => ({ title: s.event.title.en, score: s.score })));
    }
    
    const relevantEvents = scoredEvents.map(item => item.event);
    const scores = scoredEvents.map(item => item.score);

    // Helper: compute confidence percentage based on score quality and gap to second best
    function computeConfidencePercent(top, second) {
        if (!top || top <= 0) return 0;
        
        // Factor 1: Absolute score quality (higher scores = better match)
        let baseConfidence = 0;
        if (top >= 200) baseConfidence = 90;
        else if (top >= 150) baseConfidence = 80;
        else if (top >= 100) baseConfidence = 70;
        else if (top >= 70) baseConfidence = 60;
        else if (top >= 50) baseConfidence = 50;
        else if (top >= 30) baseConfidence = 40;
        else baseConfidence = 25;
        
        // Factor 2: Gap between top and second result (wider gap = more confident)
        const gap = Math.max(0, top - (second || 0));
        const gapRatio = second > 0 ? gap / top : 1.0;
        
        // Adjust confidence based on gap
        let gapAdjustment = 0;
        if (gapRatio >= 0.5) gapAdjustment = 10;      // large gap
        else if (gapRatio >= 0.3) gapAdjustment = 5;  // moderate gap
        else if (gapRatio >= 0.15) gapAdjustment = 0; // small gap
        else gapAdjustment = -10;                     // very small gap
        
        const finalConfidence = baseConfidence + gapAdjustment;
        return Math.max(5, Math.min(99, finalConfidence));
    }

    // Helper: wrap an existing HTML response with source/confidence metadata
    function wrapWithMeta(html, event, topScore, secondScore) {
        const topicId = event.__sourceTopic || event.__topic || currentTopic || 'unknown';
        const topicObj = availableTopics.find(t => t.id === topicId);
        const topicLabel = topicObj ? `${topicObj.icon} ${topicObj.name[currentLang] || topicObj.name.en}` : topicId;
        const confidence = computeConfidencePercent(topScore, secondScore);
        const metaHtml = `<div class="event-meta" style="margin-top:8px;color:#6b7280;font-size:0.9em">` +
            (currentLang === 'en' ? `Source: ${topicLabel}` : `Source : ${topicLabel}`) +
            ` • ` + (currentLang === 'en' ? `Confidence` : `Confiance`) + `: <strong>${confidence}%</strong></div>`;
        return html + metaHtml;
    }


    // Special keyword searches - also with scoring
    const keywords = [
        { search: ['egypt', 'égypte', 'pyramid', 'pharaoh', 'egypte', 'egyptian'], tag: 'egypt' },
        { search: ['rome', 'roman', 'romain', 'caesar', 'augustus', 'empire'], tag: 'rome' },
        { search: ['france', 'french', 'français', 'francais', 'paris'], tag: 'france' },
        { search: ['metal', 'métal', 'rock', 'metallica', 'maiden', 'band'], tag: 'metal' },
        { search: ['war', 'guerre', 'battle', 'bataille', 'wwi', 'ww2', 'world'], tag: 'war' },
        { search: ['greece', 'greek', 'grec', 'grèce', 'athens', 'sparta', 'olympic'], tag: 'greece' },
        { search: ['revolution', 'révolution', 'uprising', 'revolt'], tag: 'revolution' },
        { search: ['science', 'scientist', 'discovery', 'invention', 'physics', 'chemistry'], tag: 'science' },
        { search: ['king', 'queen', 'roi', 'reine', 'monarch', 'emperor'], tag: 'monarchy' },
        { search: ['death', 'died', 'mort', 'deceased', 'killed'], tag: 'death' }
    ];

    for (const keyword of keywords) {
        if (keyword.search.some(term => msg.includes(term))) {
            const tagScoredEvents = dataToSearch.map(e => {
                let tagScore = 0;
                const title = e.title[currentLang] || e.title.en || '';
                const desc = e.description[currentLang] || e.description.en || '';
                const titleNorm = normalizeText(title);
                const descNorm = normalizeText(desc);
                const titleTokens = tokenize(title);
                
                // Tag exact match = higher priority
                if (e.tags?.includes(keyword.tag)) {
                    tagScore += 50;
                }
                
                // Keywords matching
                keyword.search.forEach(term => {
                    const termNorm = normalizeText(term);
                    
                    // Exact keyword in title = highest score
                    if (titleNorm === termNorm) tagScore += 100;
                    // Keyword as whole word in title
                    if (titleTokens.includes(termNorm)) tagScore += 40;
                    // Keyword substring in title
                    else if (titleNorm.includes(termNorm)) tagScore += 30;
                    
                    // Keyword in description
                    if (descNorm.includes(termNorm)) tagScore += 15;
                    
                    // Keyword in tags
                    if (e.tags?.some(tag => normalizeText(tag).includes(termNorm))) tagScore += 25;
                });
                
                // Boost if multiple search terms match
                const matchingTerms = keyword.search.filter(term => 
                    titleNorm.includes(normalizeText(term)) || 
                    descNorm.includes(normalizeText(term))
                ).length;
                if (matchingTerms > 1) {
                    tagScore += matchingTerms * 20;
                }
                
                return { event: e, score: tagScore };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);
            
            console.log(`Keyword "${keyword.search[0]}" matched ${tagScoredEvents.length} events`);
            
            if (tagScoredEvents.length > 0) {
                const tagEvents = tagScoredEvents.map(item => item.event);
                const tagScores = tagScoredEvents.map(item => item.score);
                
                if (tagEvents.length === 1) {
                    // Check confidence before returning a single-event answer
                    const top = tagScores[0];
                    const second = tagScores[1] || 0;
                    if (top < 30) {
                        return currentLang === 'en' ?
                            `I found a possible match but I'm not confident. Could you be more specific or try a different phrasing?` :
                            `J'ai trouvé une correspondance possible mais je ne suis pas sûr. Peux-tu être plus précis ou reformuler ?`;
                    }
                    return wrapWithMeta(generateEventResponse(tagEvents[0], tagScores[0]), tagEvents[0], top, second);
                } else if (tagEvents.length <= 3) {
                    // Show all if just a few
                    let response = currentLang === 'en' ? 
                        `I found ${tagEvents.length} events:<br><br>` :
                        `J'ai trouvé ${tagEvents.length} événements:<br><br>`;
                    tagEvents.forEach((event, idx) => {
                        response += generateEventCard(event, tagScores[idx]);
                    });
                    return response;
                } else {
                    // Show first 5
                    const topicInfo = currentTopic !== 'all' 
                        ? (currentLang === 'en' ? ` in ${availableTopics.find(t => t.id === currentTopic)?.name.en}` : ` en ${availableTopics.find(t => t.id === currentTopic)?.name.fr}`)
                        : '';
                    let response = currentLang === 'en' ? 
                        `I found ${tagEvents.length} events${topicInfo}. Here are the most relevant:<br><br>` :
                        `J'ai trouvé ${tagEvents.length} événements${topicInfo}. Voici les plus pertinents:<br><br>`;
                    tagEvents.slice(0, 5).forEach((event, idx) => {
                        response += generateEventCard(event, tagScores[idx]);
                    });
                    if (tagEvents.length > 5) {
                        response += currentLang === 'en' ? 
                            `<br><em>...and ${tagEvents.length - 5} more events. Try being more specific!</em>` :
                            `<br><em>...et ${tagEvents.length - 5} événements de plus. Essaie d'être plus spécifique!</em>`;
                    }
                    return response;
                }
            }
        }
    }

    // Date queries
    if (isWhenQuery || msg.includes('when') || msg.includes('quand') || msg.includes('date')) {
        if (relevantEvents.length > 0) {
            // require reasonable confidence
            const top = scores[0];
            const second = scores[1] || 0;
            if (top < 30) {
                return currentLang === 'en' ?
                    `I found some possible matches but I'm not confident about the exact date. Could you try rephrasing or ask about a specific person or event?` :
                    `J'ai trouvé quelques correspondances possibles mais je ne suis pas sûr de la date exacte. Peux-tu reformuler ou demander sur un événement ou une personne spécifique ?`;
            }
            return wrapWithMeta(generateDateResponse(relevantEvents[0], scores[0]), relevantEvents[0], top, second);
        }
    }

    // List all events
    if (msg.includes('all events') || msg.includes('tous les événements') || msg.includes('overview') || msg.includes('aperçu')) {
        return generateOverviewResponse();
    }

    // Compare events
    if (msg.includes('compare') || msg.includes('comparer') || msg.includes('difference')) {
        return generateComparisonResponse();
    }

    // Timeline query
    if (msg.includes('timeline') || msg.includes('chronology') || msg.includes('chronologie')) {
        return generateTimelineResponse();
    }

    // If relevant events found
    if (relevantEvents.length > 0) {
        const top = scores[0];
        const second = scores[1] || 0;
        
        if (relevantEvents.length === 1) {
            // Only return direct event answer if confidence is reasonably high
            if (top < 30) {
                return currentLang === 'en' ?
                    `I found a possible match but I'm not confident enough to give a full answer. Try being more specific or ask for an overview.` :
                    `J'ai trouvé une correspondance possible mais je ne suis pas assez confiant pour donner une réponse complète. Essaie d'être plus précis ou demande un aperçu.`;
            }
            return wrapWithMeta(generateEventResponse(relevantEvents[0], scores[0]), relevantEvents[0], top, second);
        } else if (relevantEvents.length <= 3) {
            // Show all matching events if just a few
            let response = currentLang === 'en' ? 
                'I found these matching events:<br><br>' :
                'J\'ai trouvé ces événements correspondants:<br><br>';
            relevantEvents.forEach((event, idx) => {
                response += generateEventCard(event, scores[idx]);
            });
            return response;
        } else {
            // Show first few matching events
            let response = currentLang === 'en' ? 
                `I found ${relevantEvents.length} matching events. Here are the most relevant:<br><br>` :
                `J'ai trouvé ${relevantEvents.length} événements correspondants. Voici les plus pertinents:<br><br>`;
            relevantEvents.slice(0, 4).forEach((event, idx) => {
                response += generateEventCard(event, scores[idx], true); // truncated
            });
            response += currentLang === 'en' ? 
                `<br><em>...and ${relevantEvents.length - 4} more. Try being more specific!</em>` :
                `<br><em>...et ${relevantEvents.length - 4} de plus. Essaie d'être plus spécifique!</em>`;
            return response;
        }
    }

    // Default responses with more guidance
    const topicContext = currentTopic !== 'all' 
        ? (currentLang === 'en' 
            ? ` about ${availableTopics.find(t => t.id === currentTopic)?.name.en}` 
            : ` sur ${availableTopics.find(t => t.id === currentTopic)?.name.fr}`)
        : '';
    
    const sampleEvents = dataToSearch.slice(0, 3);
    const suggestions = sampleEvents.map(e => e.title[currentLang] || e.title.en).join(', ');
    
    const defaultResponses = currentLang === 'en' ? [
        `I couldn't find a specific match for "${userMessage}"${topicContext}. I have ${dataToSearch.length} events available. Try asking about: <strong>${suggestions}</strong>`,
        `Hmm, I'm not sure about that${topicContext}. Could you try rephrasing? For example: "Tell me about ${sampleEvents[0]?.title.en}" or "What happened in ${sampleEvents[0]?.year}?"`,
        `I don't have information matching that query${topicContext}. Here are some topics I can help with: <strong>${suggestions}</strong>. You can also try: "show me a timeline" or "give me an overview"`,
        `I'm having trouble finding that${topicContext}. Try asking more specifically, like: "What about ${sampleEvents[0]?.title.en}?" or clicking one of the quick topics above!`
    ] : [
        `Je n'ai pas trouvé de correspondance spécifique pour "${userMessage}"${topicContext}. J'ai ${dataToSearch.length} événements disponibles. Essaie de demander: <strong>${suggestions}</strong>`,
        `Hmm, je ne suis pas sûr${topicContext}. Pourrais-tu reformuler? Par exemple: "Parle-moi de ${sampleEvents[0]?.title.fr || sampleEvents[0]?.title.en}" ou "Que s'est-il passé en ${sampleEvents[0]?.year}?"`,
        `Je n'ai pas d'informations correspondant à cette requête${topicContext}. Voici quelques sujets avec lesquels je peux t'aider: <strong>${suggestions}</strong>. Tu peux aussi essayer: "montre-moi une chronologie" ou "donne-moi un aperçu"`,
        `J'ai du mal à trouver ça${topicContext}. Essaie de demander plus spécifiquement, comme: "Qu'en est-il de ${sampleEvents[0]?.title.fr || sampleEvents[0]?.title.en}?" ou clique sur l'un des sujets rapides ci-dessus!`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Helper function to generate event card HTML with score
function generateEventCard(event, score, truncated = false) {
    const title = event.title[currentLang] || event.title.en || 'Unknown Event';
    const description = event.description[currentLang] || event.description.en || 'No description available';
    // Always show full description - CSS will handle the collapsing
    const scorePercent = Math.min(100, Math.round(score));
    const cardId = 'card-' + Math.random().toString(36).substr(2, 9);
    
    const expandHint = currentLang === 'en' ? 'Click to expand' : 'Cliquer pour agrandir';
    
    return `<div class="event-card" id="${cardId}" onclick="toggleCardExpansion('${cardId}')">
        <div class="event-card-header">
            <div class="event-card-title">${title}</div>
            <div class="event-card-score" title="${currentLang === 'en' ? 'Relevance score' : 'Score de pertinence'}">${scorePercent}%</div>
        </div>
        <div class="event-card-year">📅 ${event.year}</div>
        <div class="event-card-description">${description}</div>
        <div class="event-card-expand-hint">👆 ${expandHint}</div>
    </div>`;
}

function generateEventResponse(event, score = 50) {
    const title = event.title[currentLang] || event.title.en || 'Unknown Event';
    
    const intro = currentLang === 'en' ? 
        `Great question! Let me tell you about <strong>${title}</strong>:` :
        `Excellente question! Laisse-moi te parler de <strong>${title}</strong>:`;
    
    return `${intro}<br><br>${generateEventCard(event, score)}
        <br>${currentLang === 'en' ? 
            'Would you like to know more about this period or another event?' : 
            'Voudrais-tu en savoir plus sur cette période ou un autre événement?'}`;
}

function generateDateResponse(event, score = 50) {
    const title = event.title[currentLang] || event.title.en || 'Unknown Event';
    const description = event.description[currentLang] || event.description.en || '';
    
    return currentLang === 'en' ? 
        `<strong>${title}</strong> occurred in <strong>${event.year}</strong>. ${description}<br><br>${generateEventCard(event, score)}` :
        `<strong>${title}</strong> s'est produit en <strong>${event.year}</strong>. ${description}<br><br>${generateEventCard(event, score)}`;
}

function generateOverviewResponse() {
    const dataToShow = filteredData;
    const topicName = currentTopic === 'all' 
        ? (currentLang === 'en' ? 'all topics' : 'tous les sujets')
        : (availableTopics.find(t => t.id === currentTopic)?.name[currentLang] || currentTopic);
    
    let response = currentLang === 'en' ? 
        `Here's an overview of major events in <strong>${topicName}</strong> (showing ${Math.min(dataToShow.length, 20)} of ${dataToShow.length} total events):<br><br>` :
        `Voici un aperçu des événements majeurs en <strong>${topicName}</strong> (montrant ${Math.min(dataToShow.length, 20)} des ${dataToShow.length} événements totaux):<br><br>`;
    
    dataToShow.slice(0, 20).forEach(event => {
        response += `<div class="event-card">
            <div class="event-card-title">${event.title[currentLang] || event.title.en}</div>
            <div class="event-card-year">📅 ${event.year}</div>
        </div>`;
    });
    
    if (dataToShow.length > 20) {
        response += currentLang === 'en' ? 
            `<br>...and many more events! Try asking about specific topics or time periods.` :
            `<br>...et bien d'autres événements! Essaie de demander sur des sujets ou périodes spécifiques.`;
    }
    
    return response;
}

function generateComparisonResponse() {
    const topicName = currentTopic === 'all' 
        ? (currentLang === 'en' ? 'many topics' : 'plusieurs sujets')
        : (availableTopics.find(t => t.id === currentTopic)?.name[currentLang] || currentTopic);
    
    return currentLang === 'en' ? 
        `History spans thousands of years! I'm currently focused on <strong>${topicName}</strong> with ${filteredData.length} events. Each era brought unique challenges and achievements that shaped our world today. What specific periods or events would you like to compare?` :
        `L'histoire s'étend sur des milliers d'années! Je me concentre actuellement sur <strong>${topicName}</strong> avec ${filteredData.length} événements. Chaque ère a apporté des défis et des réalisations uniques qui ont façonné notre monde aujourd'hui. Quelles périodes ou événements spécifiques voudrais-tu comparer?`;
}

function generateTimelineResponse() {
    const dataToShow = filteredData;
    const topicName = currentTopic === 'all' 
        ? (currentLang === 'en' ? 'all topics' : 'tous les sujets')
        : (availableTopics.find(t => t.id === currentTopic)?.name[currentLang] || currentTopic);
    
    let response = currentLang === 'en' ? 
        `Here's a chronological timeline for <strong>${topicName}</strong> (showing first ${Math.min(dataToShow.length, 15)} events):<br><br>` :
        `Voici une chronologie pour <strong>${topicName}</strong> (montrant les ${Math.min(dataToShow.length, 15)} premiers événements):<br><br>`;
    
    response += '<div style="border-left: 3px solid #667eea; padding-left: 15px;">';
    dataToShow.slice(0, 15).forEach(event => {
        response += `
            <div style="margin-bottom: 15px;">
                <strong style="color: #667eea;">${event.year}</strong><br>
                <strong>${event.title[currentLang] || event.title.en}</strong>
            </div>`;
    });
    response += '</div>';
    
    if (dataToShow.length > 15) {
        response += currentLang === 'en' ? 
            `<br>...and ${dataToShow.length - 15} more events!` :
            `<br>...et ${dataToShow.length - 15} événements de plus!`;
    }
    
    return response;
}

// Toggle card expansion
function toggleCardExpansion(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        card.classList.toggle('expanded');
        
        // Scroll the card into view if it's expanding and partially off-screen
        if (card.classList.contains('expanded')) {
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// Initialize - Load data and setup
loadAllData().then(() => {
    updateQuickTopics();
    updateWelcomeMessage();
    console.log(`Loaded ${historyData.length} historical events from all topics!`);
});
