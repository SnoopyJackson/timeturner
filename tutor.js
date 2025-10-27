const historyData = [
    {
        "year": "c. 3000 BC",
        "title": {"en": "Ancient Egypt", "fr": "Égypte Antique"},
        "description": {"en": "The Egyptian civilization flourished along the Nile, creating pyramids, hieroglyphics, and advanced culture.", "fr": "La civilisation égyptienne a prospéré le long du Nil, créant des pyramides, des hiéroglyphes et une culture avancée."},
        "tags": ["ancient", "egypt", "civilization"]
    },
    {
        "year": "776 BC",
        "title": {"en": "First Olympic Games", "fr": "Premiers Jeux Olympiques"},
        "description": {"en": "The ancient Greeks held the first Olympic Games in Olympia, celebrating athletic excellence.", "fr": "Les anciens Grecs ont organisé les premiers Jeux Olympiques à Olympie, célébrant l'excellence athlétique."},
        "tags": ["greece", "sports", "culture"]
    },
    {
        "year": "753 BC",
        "title": {"en": "Founding of Rome", "fr": "Fondation de Rome"},
        "description": {"en": "According to legend, Romulus founded Rome, beginning the Roman civilization.", "fr": "Selon la légende, Romulus a fondé Rome, marquant le début de la civilisation romaine."},
        "tags": ["rome", "founding", "ancient"]
    },
    {
        "year": "509 BC",
        "title": {"en": "Roman Republic", "fr": "République Romaine"},
        "description": {"en": "Rome became a republic, establishing a government by elected representatives.", "fr": "Rome est devenue une république, établissant un gouvernement par des représentants élus."},
        "tags": ["rome", "republic", "government"]
    },
    {
        "year": "27 BC",
        "title": {"en": "Roman Empire Begins", "fr": "Début de l'Empire Romain"},
        "description": {"en": "Augustus became the first Roman Emperor, transforming Rome into an empire.", "fr": "Auguste est devenu le premier empereur romain, transformant Rome en empire."},
        "tags": ["rome", "empire", "augustus"]
    },
    {
        "year": "476 AD",
        "title": {"en": "Fall of Rome", "fr": "Chute de Rome"},
        "description": {"en": "The Western Roman Empire fell to barbarian invasions, ending ancient Rome.", "fr": "L'Empire romain d'Occident est tombé face aux invasions barbares, mettant fin à la Rome antique."},
        "tags": ["rome", "fall", "medieval"]
    },
    {
        "year": "1066",
        "title": {"en": "Norman Conquest", "fr": "Conquête Normande"},
        "description": {"en": "William the Conqueror invaded England, changing British history forever.", "fr": "Guillaume le Conquérant a envahi l'Angleterre, changeant l'histoire britannique pour toujours."},
        "tags": ["england", "normandy", "conquest"]
    },
    {
        "year": "1453",
        "title": {"en": "Fall of Constantinople", "fr": "Chute de Constantinople"},
        "description": {"en": "Ottoman Turks conquered Constantinople, ending the Byzantine Empire.", "fr": "Les Turcs ottomans ont conquis Constantinople, mettant fin à l'Empire byzantin."},
        "tags": ["byzantine", "ottoman", "medieval"]
    },
    {
        "year": "1492",
        "title": {"en": "Columbus Reaches America", "fr": "Colomb Atteint l'Amérique"},
        "description": {"en": "Christopher Columbus reached the Americas, beginning European colonization.", "fr": "Christophe Colomb a atteint les Amériques, débutant la colonisation européenne."},
        "tags": ["discovery", "america", "exploration"]
    },
    {
        "year": "1789",
        "title": {"en": "French Revolution", "fr": "Révolution Française"},
        "description": {"en": "The French Revolution overthrew the monarchy, establishing principles of liberty and equality.", "fr": "La Révolution française a renversé la monarchie, établissant les principes de liberté et d'égalité."},
        "tags": ["france", "revolution", "liberty"]
    },
    {
        "year": "1914-1918",
        "title": {"en": "World War I", "fr": "Première Guerre Mondiale"},
        "description": {"en": "The Great War devastated Europe, resulting in millions of casualties.", "fr": "La Grande Guerre a dévasté l'Europe, causant des millions de victimes."},
        "tags": ["war", "europe", "20th-century"]
    },
    {
        "year": "1939-1945",
        "title": {"en": "World War II", "fr": "Seconde Guerre Mondiale"},
        "description": {"en": "The deadliest conflict in history, involving most of the world's nations.", "fr": "Le conflit le plus meurtrier de l'histoire, impliquant la plupart des nations du monde."},
        "tags": ["war", "global", "20th-century"]
    }
];

let currentLang = 'en';
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

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
    } else {
        welcomeTitle.textContent = 'Welcome to Your History Tutor!';
        welcomeText.textContent = 'I\'m here to help you learn about history.';
        welcomeInstruction.textContent = 'Ask me anything about historical events, dates, people, or choose a topic below!';
        chatInput.placeholder = 'Ask me about history...';
    }
}

// Quick topics
function updateQuickTopics() {
    const topics = currentLang === 'en' ? [
        "Tell me about Ancient Egypt",
        "What was the French Revolution?",
        "Explain World War I",
        "When did Rome fall?",
        "Who was Augustus?",
        "What were the first Olympics?"
    ] : [
        "Parle-moi de l'Égypte Antique",
        "Qu'était la Révolution Française?",
        "Explique la Première Guerre Mondiale",
        "Quand Rome est-elle tombée?",
        "Qui était Auguste?",
        "Quels étaient les premiers Jeux Olympiques?"
    ];

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
    
    // Search for relevant events
    const relevantEvents = historyData.filter(event => {
        const titleLower = event.title[currentLang].toLowerCase();
        const descLower = event.description[currentLang].toLowerCase();
        const yearStr = event.year.toLowerCase();
        
        return titleLower.includes(msg) || 
               descLower.includes(msg) || 
               yearStr.includes(msg) ||
               event.tags.some(tag => msg.includes(tag));
    });

    // Keyword-based responses
    if (msg.includes('egypt') || msg.includes('égypte') || msg.includes('pyramid')) {
        return generateEventResponse(historyData[0]);
    }
    
    if (msg.includes('olympic') || msg.includes('olymp') || msg.includes('sport')) {
        return generateEventResponse(historyData[1]);
    }
    
    if (msg.includes('rome') || msg.includes('roman') || msg.includes('romain')) {
        const romeEvents = historyData.filter(e => e.tags.includes('rome'));
        if (romeEvents.length > 0) {
            let response = currentLang === 'en' ? 
                'Rome had several important phases in history:<br><br>' :
                'Rome a eu plusieurs phases importantes dans l\'histoire:<br><br>';
            romeEvents.forEach(event => {
                response += `<div class="event-card">
                    <div class="event-card-title">${event.title[currentLang]}</div>
                    <div class="event-card-year">📅 ${event.year}</div>
                    <div class="event-card-description">${event.description[currentLang]}</div>
                </div>`;
            });
            return response;
        }
    }
    
    if (msg.includes('french revolution') || msg.includes('révolution française') || msg.includes('1789')) {
        return generateEventResponse(historyData[9]);
    }
    
    if (msg.includes('world war i') || msg.includes('première guerre mondiale') || msg.includes('wwi') || msg.includes('great war')) {
        return generateEventResponse(historyData[10]);
    }
    
    if (msg.includes('world war ii') || msg.includes('seconde guerre mondiale') || msg.includes('wwii') || msg.includes('ww2')) {
        return generateEventResponse(historyData[11]);
    }
    
    if (msg.includes('columbus') || msg.includes('colomb') || msg.includes('america') || msg.includes('1492')) {
        return generateEventResponse(historyData[8]);
    }
    
    if (msg.includes('constantinople') || msg.includes('byzantine') || msg.includes('ottoman')) {
        return generateEventResponse(historyData[7]);
    }
    
    if (msg.includes('norman') || msg.includes('normand') || msg.includes('william') || msg.includes('guillaume')) {
        return generateEventResponse(historyData[6]);
    }
    
    if (msg.includes('augustus') || msg.includes('auguste') || msg.includes('emperor') || msg.includes('empereur')) {
        return generateEventResponse(historyData[4]);
    }

    // Date queries
    if (msg.includes('when') || msg.includes('quand') || msg.includes('date')) {
        if (relevantEvents.length > 0) {
            return generateDateResponse(relevantEvents[0]);
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
        return generateEventResponse(relevantEvents[0]);
    }

    // Default responses
    const defaultResponses = currentLang === 'en' ? [
        "That's an interesting question! Let me tell you about some key events in history. Try asking about Ancient Egypt, the Roman Empire, the French Revolution, or the World Wars.",
        "I'd love to help you learn about that! Could you be more specific? For example, you could ask about the Olympics, Columbus, or specific historical periods.",
        "Great question! History is fascinating. I can tell you about ancient civilizations, medieval conquests, revolutions, or world wars. What interests you most?",
        "I'm here to help! Try asking about specific events, people, or time periods. For example: 'What happened in 1789?' or 'Tell me about Ancient Rome'."
    ] : [
        "C'est une question intéressante! Laisse-moi te parler de certains événements clés de l'histoire. Essaie de demander sur l'Égypte Antique, l'Empire Romain, la Révolution Française ou les Guerres Mondiales.",
        "Je serais ravi de t'aider! Pourrais-tu être plus spécifique? Tu pourrais demander sur les Jeux Olympiques, Colomb, ou des périodes historiques spécifiques.",
        "Excellente question! L'histoire est fascinante. Je peux te parler des civilisations anciennes, des conquêtes médiévales, des révolutions ou des guerres mondiales. Qu'est-ce qui t'intéresse le plus?",
        "Je suis là pour t'aider! Essaie de demander sur des événements, des personnes ou des périodes spécifiques. Par exemple: 'Que s'est-il passé en 1789?' ou 'Parle-moi de la Rome Antique'."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function generateEventResponse(event) {
    const intro = currentLang === 'en' ? 
        `Great question! Let me tell you about <strong>${event.title[currentLang]}</strong>:` :
        `Excellente question! Laisse-moi te parler de <strong>${event.title[currentLang]}</strong>:`;
    
    return `${intro}
        <div class="event-card">
            <div class="event-card-title">${event.title[currentLang]}</div>
            <div class="event-card-year">📅 ${event.year}</div>
            <div class="event-card-description">${event.description[currentLang]}</div>
        </div>
        ${currentLang === 'en' ? 
            'Would you like to know more about this period or another event?' : 
            'Voudrais-tu en savoir plus sur cette période ou un autre événement?'}`;
}

function generateDateResponse(event) {
    return currentLang === 'en' ? 
        `<strong>${event.title[currentLang]}</strong> occurred in <strong>${event.year}</strong>. ${event.description[currentLang]}` :
        `<strong>${event.title[currentLang]}</strong> s'est produit en <strong>${event.year}</strong>. ${event.description[currentLang]}`;
}

function generateOverviewResponse() {
    let response = currentLang === 'en' ? 
        'Here\'s an overview of major events in history:<br><br>' :
        'Voici un aperçu des événements majeurs de l\'histoire:<br><br>';
    
    historyData.forEach(event => {
        response += `<div class="event-card">
            <div class="event-card-title">${event.title[currentLang]}</div>
            <div class="event-card-year">📅 ${event.year}</div>
        </div>`;
    });
    
    return response;
}

function generateComparisonResponse() {
    return currentLang === 'en' ? 
        `History spans thousands of years! From Ancient Egypt (3000 BC) to modern times, humanity has witnessed the rise and fall of empires, revolutions, world wars, and remarkable discoveries. Each era brought unique challenges and achievements that shaped our world today. What specific periods would you like to compare?` :
        `L'histoire s'étend sur des milliers d'années! De l'Égypte Antique (3000 av. J.-C.) à l'époque moderne, l'humanité a été témoin de la montée et de la chute d'empires, de révolutions, de guerres mondiales et de découvertes remarquables. Chaque ère a apporté des défis et des réalisations uniques qui ont façonné notre monde aujourd'hui. Quelles périodes spécifiques voudrais-tu comparer?`;
}

function generateTimelineResponse() {
    let response = currentLang === 'en' ? 
        'Here\'s a chronological timeline of historical events:<br><br>' :
        'Voici une chronologie des événements historiques:<br><br>';
    
    response += '<div style="border-left: 3px solid #667eea; padding-left: 15px;">';
    historyData.forEach(event => {
        response += `
            <div style="margin-bottom: 15px;">
                <strong style="color: #667eea;">${event.year}</strong><br>
                <strong>${event.title[currentLang]}</strong>
            </div>`;
    });
    response += '</div>';
    
    return response;
}

// Initialize
updateQuickTopics();
updateWelcomeMessage();
