import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

const historyKnowledge = [
    {
        topic: "Roman Empire",
        period: "27 BC - 476 AD",
        facts: [
            "The Roman Empire was established by Augustus in 27 BC",
            "At its peak, it controlled territory from Britain to Egypt",
            "The Western Roman Empire fell in 476 AD",
            "Latin was the official language of the empire"
        ]
    },
    {
        topic: "World War II",
        period: "1939 - 1945",
        facts: [
            "WWII began on September 1, 1939 with Germany's invasion of Poland",
            "The war ended in 1945 with Allied victory",
            "D-Day landings occurred on June 6, 1944",
            "The atomic bombs were dropped on Hiroshima and Nagasaki in August 1945"
        ]
    },
    {
        topic: "French Revolution",
        period: "1789 - 1799",
        facts: [
            "The revolution began in 1789 with the storming of the Bastille",
            "King Louis XVI was executed in 1793",
            "The revolution introduced ideals of liberty, equality, and fraternity",
            "Napoleon Bonaparte rose to power during this period"
        ]
    }
];

let engine = null;
let isLoading = false;

async function initializeEngine() {
    if (engine || isLoading) return;

    isLoading = true;
    const statusEl = document.getElementById('status');
    const chatSection = document.getElementById('chatSection');

    try {
        statusEl.textContent = 'Loading AI model... This may take a few minutes on first load.';
        statusEl.className = 'status loading';

        engine = await CreateMLCEngine("Llama-3.2-1B-Instruct-q4f32_1-MLC", {
            initProgressCallback: (progress) => {
                statusEl.textContent = `Loading model: ${progress.text}`;
            }
        });

        statusEl.textContent = 'AI Ready! Ask me anything about history.';
        statusEl.className = 'status ready';
        chatSection.style.display = 'block';
        isLoading = false;
    } catch (error) {
        statusEl.textContent = `Error loading model: ${error.message}`;
        statusEl.className = 'status error';
        isLoading = false;
    }
}

function searchKnowledge(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const entry of historyKnowledge) {
        if (lowerQuery.includes(entry.topic.toLowerCase()) || 
            entry.facts.some(fact => lowerQuery.includes(fact.toLowerCase()))) {
            results.push(entry);
        }
    }

    return results;
}

function buildContext(knowledgeResults) {
    if (knowledgeResults.length === 0) return '';

    let context = '\n\nRelevant historical information:\n';
    knowledgeResults.forEach(entry => {
        context += `\n${entry.topic} (${entry.period}):\n`;
        entry.facts.forEach(fact => {
            context += `- ${fact}\n`;
        });
    });

    return context;
}

async function sendMessage() {
    if (!engine) {
        alert('Please wait for the AI to load first.');
        return;
    }

    const input = document.getElementById('userInput');
    const messagesEl = document.getElementById('messages');
    const sendBtn = document.getElementById('sendBtn');

    const userMessage = input.value.trim();
    if (!userMessage) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    userDiv.textContent = userMessage;
    messagesEl.appendChild(userDiv);

    input.value = '';
    sendBtn.disabled = true;

    const knowledgeResults = searchKnowledge(userMessage);
    const context = buildContext(knowledgeResults);

    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message assistant thinking';
    thinkingDiv.textContent = 'Thinking...';
    messagesEl.appendChild(thinkingDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
        const systemPrompt = `You are an expert history teacher. Answer questions about history in a clear, educational, and engaging way. Use the provided context when available, but also draw on your general knowledge.${context}`;

        const response = await engine.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        messagesEl.removeChild(thinkingDiv);

        const assistantDiv = document.createElement('div');
        assistantDiv.className = 'message assistant';
        assistantDiv.textContent = response.choices[0].message.content;
        messagesEl.appendChild(assistantDiv);

    } catch (error) {
        messagesEl.removeChild(thinkingDiv);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'message assistant error';
        errorDiv.textContent = `Error: ${error.message}`;
        messagesEl.appendChild(errorDiv);
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
    sendBtn.disabled = false;
}

window.addEventListener('DOMContentLoaded', () => {
    initializeEngine();

    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const theme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
});