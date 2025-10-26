// Quiz Game Logic
let currentLang = 'en';
let currentMode = '';
let currentTopic = 'germany';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timer = null;
let timeLeft = 15;
let historyData = [];

// Load data from JSON file
async function loadTopicData(topic) {
    try {
        const response = await fetch(`data/${topic}.json`);
        historyData = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading topic data:', error);
        return false;
    }
}

// Language selection
function initLanguageSelector() {
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
        });
    });
}

// Topic selection
function initTopicSelector() {
    const topicSelect = document.getElementById('topic-select');
    if (topicSelect) {
        topicSelect.addEventListener('change', async (e) => {
            currentTopic = e.target.value;
            await loadTopicData(currentTopic);
        });
    }
}

// Mode selection
function initModeSelector() {
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            currentMode = card.dataset.mode;
            startQuiz();
        });
    });
}

async function startQuiz() {
    // Load data if not already loaded
    if (historyData.length === 0) {
        await loadTopicData(currentTopic);
    }
    
    questions = generateQuestions(currentMode);
    currentQuestionIndex = 0;
    score = 0;
    
    document.querySelector('.start-screen').classList.remove('active');
    document.querySelector('.quiz-screen').classList.add('active');
    
    updateProgress();
    showQuestion();
}

function generateQuestions(mode) {
    const allQuestions = [];
    
    historyData.forEach(event => {
        // Extract title and description based on language
        const title = typeof event.title === 'object' ? 
            (event.title[currentLang] || event.title.en || Object.values(event.title)[0]) : 
            event.title;
        
        const description = typeof event.description === 'object' ? 
            (event.description[currentLang] || event.description.en || Object.values(event.description)[0]) : 
            event.description;
        
        const year = event.year || event.date;
        
        if (!year) return; // Skip events without dates
        
        if (mode === 'timeline' || mode === 'mixed') {
            allQuestions.push({
                type: 'timeline',
                question: currentLang === 'en' ? 
                    `When did "${title}" occur?` :
                    `Wann fand "${title}" statt?`,
                correct: year,
                options: generateYearOptions(year),
                event: event
            });
        }
        
        if (mode === 'description' || mode === 'mixed') {
            if (description) {
                allQuestions.push({
                    type: 'description',
                    question: description,
                    correct: title,
                    options: generateTitleOptions(title),
                    event: event
                });
            }
        }
        
        if (mode === 'timed') {
            allQuestions.push({
                type: 'timed',
                question: currentLang === 'en' ? 
                    `Which year: ${title}?` :
                    `Welches Jahr: ${title}?`,
                correct: year,
                options: generateYearOptions(year),
                event: event
            });
        }
    });
    
    return shuffleArray(allQuestions).slice(0, Math.min(8, allQuestions.length));
}

function generateYearOptions(correctYear) {
    const options = [correctYear];
    const allYears = historyData
        .map(e => e.year || e.date)
        .filter(y => y && y !== correctYear);
    
    while (options.length < 4 && allYears.length > 0) {
        const randomIndex = Math.floor(Math.random() * allYears.length);
        const year = allYears.splice(randomIndex, 1)[0];
        if (!options.includes(year)) {
            options.push(year);
        }
    }
    
    // Fill with random years if not enough options
    while (options.length < 4) {
        const randomYear = Math.floor(Math.random() * 2000) + 1;
        if (!options.includes(randomYear.toString())) {
            options.push(randomYear.toString());
        }
    }
    
    return shuffleArray(options);
}

function generateTitleOptions(correctTitle) {
    const options = [correctTitle];
    const allTitles = historyData
        .map(e => typeof e.title === 'object' ? 
            (e.title[currentLang] || e.title.en || Object.values(e.title)[0]) : 
            e.title)
        .filter(t => t && t !== correctTitle);
    
    while (options.length < 4 && allTitles.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTitles.length);
        const title = allTitles.splice(randomIndex, 1)[0];
        if (!options.includes(title)) {
            options.push(title);
        }
    }
    
    return shuffleArray(options);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    
    document.querySelector('.question-text').textContent = question.question;
    
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(option, question.correct, btn));
        optionsContainer.appendChild(btn);
    });
    
    document.querySelector('.next-btn').disabled = true;
    
    if (currentMode === 'timed') {
        startTimer();
    } else {
        document.querySelector('.timer').style.display = 'none';
    }
}

function startTimer() {
    const timerEl = document.querySelector('.timer');
    timerEl.style.display = 'block';
    timeLeft = 15;
    timerEl.textContent = `⏱️ ${timeLeft}s`;
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱️ ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === questions[currentQuestionIndex].correct) {
                    btn.classList.add('correct');
                }
            });
            document.querySelector('.next-btn').disabled = false;
        }
    }, 1000);
}

function selectAnswer(selected, correct, btn) {
    clearInterval(timer);
    
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    
    if (selected === correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.textContent === correct) {
                b.classList.add('correct');
            }
        });
    }
    
    document.querySelector('.next-btn').disabled = false;
    updateScore();
}

function updateProgress() {
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = questions.length;
}

function showResults() {
    clearInterval(timer);
    document.querySelector('.quiz-screen').classList.remove('active');
    document.querySelector('.result-screen').classList.add('active');
    
    const percentage = Math.round((score / questions.length) * 100);
    document.querySelector('.result-score').textContent = `${score} / ${questions.length}`;
    
    let message = '';
    if (percentage === 100) {
        message = currentLang === 'en' ? 'Perfect! You\'re a history master! 🏆' : 'Perfekt! Du bist ein Geschichtsmeister! 🏆';
    } else if (percentage >= 75) {
        message = currentLang === 'en' ? 'Excellent work! Great knowledge! 🌟' : 'Hervorragende Arbeit! Tolles Wissen! 🌟';
    } else if (percentage >= 50) {
        message = currentLang === 'en' ? 'Good job! Keep learning! 📚' : 'Gute Arbeit! Weiter lernen! 📚';
    } else {
        message = currentLang === 'en' ? 'Keep studying! You\'ll improve! 💪' : 'Weiter lernen! Du wirst besser! 💪';
    }
    
    document.querySelector('.result-message').textContent = message;
}

// Initialize
function initQuiz() {
    initLanguageSelector();
    initTopicSelector();
    initModeSelector();
    
    // Next button handler
    document.querySelector('.next-btn').addEventListener('click', () => {
        currentQuestionIndex++;
        updateProgress();
        showQuestion();
    });
    
    // Restart button handler
    document.querySelector('.restart-btn').addEventListener('click', () => {
        document.querySelector('.result-screen').classList.remove('active');
        document.querySelector('.start-screen').classList.add('active');
    });
    
    // Load default topic
    loadTopicData(currentTopic);
    
    // Initialize score display
    updateScore();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
