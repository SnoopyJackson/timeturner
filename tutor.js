let historyData = [];
let filteredData = []; // Data filtered by selected topic
let currentTopic = 'all';
let currentLang = 'en';
const availableTopics = [
    { id: 'france', name: { en: 'France', fr: 'France' }, icon: '🇫🇷' },
    { id: 'roman', name: { en: 'Rome', fr: 'Rome' }, icon: '🏛️' },
    { id: 'greece', name: { en: 'Greece', fr: 'Grèce' }, icon: '🇬🇷' },
    { id: 'egypt', name: { en: 'Egypt', fr: 'Égypte' }, icon: '🇪🇬' },
    { id: 'egypt_myth', name: { en: 'Egypt Mythology', fr: 'Mythologie Égyptienne' }, icon: '🦅' },
    { id: 'usa', name: { en: 'USA', fr: 'États-Unis' }, icon: '🇺🇸' },
    { id: 'uk', name: { en: 'UK', fr: 'Royaume-Uni' }, icon: '🇬🇧' },
    { id: 'germany', name: { en: 'Germany', fr: 'Allemagne' }, icon: '🇩🇪' },
    { id: 'russia', name: { en: 'Russia', fr: 'Russie' }, icon: '🇷🇺' },
    { id: 'china', name: { en: 'China', fr: 'Chine' }, icon: '🇨🇳' },
    { id: 'india', name: { en: 'India', fr: 'Inde' }, icon: '🇮🇳' },
    { id: 'japan', name: { en: 'Japan', fr: 'Japon' }, icon: '🇯🇵' },
    { id: 'wars', name: { en: 'Wars', fr: 'Guerres' }, icon: '⚔️' },
    { id: 'science', name: { en: 'Science', fr: 'Science' }, icon: '🔬' },
    { id: 'pandemics', name: { en: 'Pandemics', fr: 'Pandémies' }, icon: '🦠' },
    { id: 'revolutions', name: { en: 'Revolutions', fr: 'Révolutions' }, icon: '✊' },
    { id: 'bible', name: { en: 'Bible', fr: 'Bible' }, icon: '📖' },
    { id: 'islam', name: { en: 'Islam', fr: 'Islam' }, icon: '🕌' },
    { id: 'judaism', name: { en: 'Judaism', fr: 'Judaïsme' }, icon: '✡️' },
    { id: 'metal', name: { en: 'Heavy Metal', fr: 'Heavy Metal' }, icon: '🎸' },
    { id: 'bjj', name: { en: 'Brazilian Jiu Jitsu', fr: 'Jiu Jitsu Brésilien' }, icon: '🥋' }
];

// Topic data mapping
const topicDataMap = new Map();

// Load all data from JSON files
async function loadAllData() {
    historyData = [];
    for (const topic of availableTopics) {
        try {
            const response = await fetch(`data/${topic.id}.json`);
            if (response.ok) {
                const data = await response.json();
                // Store data by topic
                topicDataMap.set(topic.id, data);
                historyData = historyData.concat(data);
            }
        } catch (error) {
            console.log(`Could not load ${topic.id}.json`);
        }
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

function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Use filtered data based on selected topic
    const dataToSearch = filteredData;
    
    console.log(`Searching in ${dataToSearch.length} events for: "${msg}"`);
    
    // Extract key words from the message (remove common words)
    const stopWords = ['tell', 'me', 'about', 'what', 'when', 'who', 'why', 'how', 'the', 'a', 'an', 'is', 'was', 'were', 'are', 'parle', 'moi', 'de', 'qu', 'est', 'était', 'sur'];
    const words = msg.split(/\s+/).filter(word => 
        word.length > 2 && !stopWords.includes(word)
    );
    
    // Calculate relevance score for each event
    const scoredEvents = dataToSearch.map(event => {
        let score = 0;
        const titleLower = event.title[currentLang]?.toLowerCase() || event.title.en?.toLowerCase() || '';
        const descLower = event.description[currentLang]?.toLowerCase() || event.description.en?.toLowerCase() || '';
        const yearStr = event.year.toString().toLowerCase();
        
        // Exact title match = 100 points
        if (titleLower === msg) {
            score += 100;
        }
        // Title contains full query = 50 points
        else if (titleLower.includes(msg)) {
            score += 50;
        }
        // Query contains title (for longer queries) = 40 points
        else if (msg.includes(titleLower) && titleLower.length > 5) {
            score += 40;
        }
        
        // Year exact match = 30 points
        if (yearStr === msg || msg === yearStr) {
            score += 30;
        }
        // Year contains query or query contains year = 20 points
        else if (yearStr.includes(msg) || msg.includes(yearStr)) {
            score += 20;
        }
        
        // Each keyword in title = 15 points
        words.forEach(word => {
            if (titleLower.includes(word)) {
                score += 15;
            }
        });
        
        // Keywords in description = 8 points each
        words.forEach(word => {
            if (descLower.includes(word)) {
                score += 8;
            }
        });
        
        // Tag matches = 20 points each
        event.tags?.forEach(tag => {
            if (msg.includes(tag.toLowerCase()) || tag.toLowerCase().includes(msg)) {
                score += 20;
            }
            // Partial tag matches = 10 points
            words.forEach(word => {
                if (tag.toLowerCase().includes(word)) {
                    score += 10;
                }
            });
        });
        
        // Description contains full query = 15 points
        if (descLower.includes(msg)) {
            score += 15;
        }
        
        return { event, score };
    })
    .filter(item => item.score > 0)  // Only keep matches
    .sort((a, b) => b.score - a.score);  // Sort by score descending
    
    console.log(`Found ${scoredEvents.length} relevant events with scores`);
    if (scoredEvents.length > 0) {
        console.log('Top 3 scores:', scoredEvents.slice(0, 3).map(s => ({ title: s.event.title.en, score: s.score })));
    }
    
    const relevantEvents = scoredEvents.map(item => item.event);
    const scores = scoredEvents.map(item => item.score);

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
                const titleLower = e.title[currentLang]?.toLowerCase() || e.title.en?.toLowerCase() || '';
                const descLower = e.description[currentLang]?.toLowerCase() || e.description.en?.toLowerCase() || '';
                
                // Tag exact match = 30 points
                if (e.tags?.includes(keyword.tag)) {
                    tagScore += 30;
                }
                
                // Keywords in title = 20 points each
                keyword.search.forEach(term => {
                    if (titleLower.includes(term)) tagScore += 20;
                    if (descLower.includes(term)) tagScore += 10;
                    if (e.tags?.some(tag => tag.toLowerCase().includes(term))) tagScore += 15;
                });
                
                return { event: e, score: tagScore };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);
            
            console.log(`Keyword "${keyword.search[0]}" matched ${tagScoredEvents.length} events`);
            
            if (tagScoredEvents.length > 0) {
                const tagEvents = tagScoredEvents.map(item => item.event);
                const tagScores = tagScoredEvents.map(item => item.score);
                
                if (tagEvents.length === 1) {
                    return generateEventResponse(tagEvents[0], tagScores[0]);
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
    if (msg.includes('when') || msg.includes('quand') || msg.includes('date')) {
        if (relevantEvents.length > 0) {
            return generateDateResponse(relevantEvents[0], scores[0]);
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
        if (relevantEvents.length === 1) {
            return generateEventResponse(relevantEvents[0], scores[0]);
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
