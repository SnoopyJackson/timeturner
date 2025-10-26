// Timeline-style game for Time-Turner
// Single-player: pick a topic (JSON), drag event cards into timeline slots, check order.

const topicSelect = document.getElementById('topic-select');
const startBtn = document.getElementById('start-game');
const shuffleBtn = document.getElementById('shuffle-game');
const timelineEl = document.getElementById('timeline');
const handEl = document.getElementById('hand');
const checkBtn = document.getElementById('check-answer');
const revealBtn = document.getElementById('reveal-years');
const resetBtn = document.getElementById('reset-game');
const resultEl = document.getElementById('game-result');

let deck = []; // loaded events
let hand = []; // cards in hand
let slots = []; // timeline slots state

function normalizeImagePath(p) {
  if (!p) return p;
  if (/^[a-zA-Z]+:\/\//.test(p) || p.startsWith('data:') || p.startsWith('/')) return p;
  return './' + p.replace(/^\.?\//,'');
}

async function loadTopic(topic) {
  resultEl.textContent = '';
  try {
    const res = await fetch(`data/${topic}.json`);
    deck = await res.json();
    // map to simplified objects with year number if possible
    deck = deck.map(e => {
      // try to extract a year as a number (first 4-digit)
      const yMatch = (e.year || '').toString().match(/(\d{3,4})/);
      const yearNum = yMatch ? parseInt(yMatch[0], 10) : null;
      return { ...e, yearNum };
    });
    return true;
  } catch (err) {
    resultEl.textContent = 'Could not load topic.';
    return false;
  }
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function startGame() {
  if (!deck || deck.length === 0) return;
  // choose a subset for the game (6-8 cards depending on deck size)
  const count = Math.min(8, Math.max(4, Math.floor(deck.length / 6) + 4));
  const pool = deck.slice();
  shuffleArray(pool);
  hand = pool.slice(0, count);
  // timeline initial slots: start with first card (locked) and allow placing others
  slots = new Array(count).fill(null);
  renderHand();
  renderTimeline();
}

function renderHand() {
  handEl.innerHTML = '';
  hand.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = 'bg-white p-4 rounded-lg shadow-md cursor-grab';
    el.draggable = true;
    el.dataset.index = idx;
    el.innerHTML = `<div class="font-semibold">${card.title?.en || card.title || ''}</div><div class="text-sm text-gray-500 mt-2">${card.year ? card.year : ''}</div>`;
    el.addEventListener('dragstart', onDragStart);
    handEl.appendChild(el);
  });
}

function renderTimeline() {
  timelineEl.innerHTML = '';
  for (let i = 0; i < slots.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'min-w-[180px] flex-shrink-0 bg-gray-50 border-2 border-dashed border-gray-200 rounded p-3 text-left';
    slot.dataset.slot = i;
    slot.addEventListener('dragover', onDragOver);
    slot.addEventListener('drop', onDrop);
    const content = slots[i];
    if (content) {
      const img = content.image ? `<img src="${normalizeImagePath(content.image)}" class="w-full h-28 object-cover rounded mb-2"/>` : '';
      slot.innerHTML = `<div class="font-semibold">${content.title?.en || content.title}</div>${img}<div class="text-sm text-gray-500">${content.year}</div>`;
    } else {
      slot.innerHTML = `<div class="text-sm text-gray-400">Drop here</div>`;
    }
    timelineEl.appendChild(slot);
  }
}

function onDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function onDragOver(e) { e.preventDefault(); }

function onDrop(e) {
  e.preventDefault();
  const idx = e.dataTransfer.getData('text/plain');
  const card = hand[idx];
  const slotIndex = parseInt(e.currentTarget.dataset.slot, 10);
  if (!card) return;
  // place the card into the slot and remove from hand
  slots[slotIndex] = card;
  // mark hand item as null so it doesn't render
  hand[idx] = null;
  renderHand();
  renderTimeline();
}

function checkAnswer() {
  // compute whether the timeline is in ascending chronological order by yearNum
  let correct = true;
  const placed = slots.filter(s => s);
  for (let i = 1; i < placed.length; i++) {
    const prev = placed[i-1].yearNum;
    const cur = placed[i].yearNum;
    if (prev == null || cur == null) { correct = false; break; }
    if (prev > cur) { correct = false; break; }
  }
  if (correct) {
    resultEl.textContent = 'You win! 🎉';
    resultEl.style.color = 'green';
  } else {
    resultEl.textContent = 'Wrong order. Try again.';
    resultEl.style.color = 'red';
  }
}

function revealYears() {
  // reveal years for each placed slot
  const slotsEls = timelineEl.querySelectorAll('[data-slot]');
  slotsEls.forEach((el, i) => {
    const content = slots[i];
    if (content) {
      const yearTxt = document.createElement('div');
      yearTxt.className = 'text-sm text-gray-700 font-medium mt-2';
      yearTxt.textContent = content.year;
      el.appendChild(yearTxt);
    }
  });
}

function resetGame() {
  deck = [];
  hand = [];
  slots = [];
  timelineEl.innerHTML = '';
  handEl.innerHTML = '';
  resultEl.textContent = '';
}

// Button wiring
startBtn.addEventListener('click', async () => {
  const topic = topicSelect.value;
  const ok = await loadTopic(topic);
  if (ok) startGame();
});
shuffleBtn.addEventListener('click', () => {
  shuffleArray(hand);
  renderHand();
});
checkBtn.addEventListener('click', checkAnswer);
revealBtn.addEventListener('click', revealYears);
resetBtn.addEventListener('click', resetGame);

// Allow clicking card to pick and then click slot to place (accessibility)
handEl.addEventListener('click', (e) => {
  const cardEl = e.target.closest('[draggable]');
  if (!cardEl) return;
  const idx = parseInt(cardEl.dataset.index, 10);
  // store selected index on document
  document.documentElement.dataset.selectedCard = idx;
});

timelineEl.addEventListener('click', (e) => {
  const slotEl = e.target.closest('[data-slot]');
  if (!slotEl) return;
  const selected = document.documentElement.dataset.selectedCard;
  if (selected == null) return;
  const idx = parseInt(selected, 10);
  const card = hand[idx];
  if (!card) return;
  const slotIndex = parseInt(slotEl.dataset.slot, 10);
  slots[slotIndex] = card;
  hand[idx] = null;
  delete document.documentElement.dataset.selectedCard;
  renderHand(); renderTimeline();
});

// Initialize with default topic
(async () => { await loadTopic(topicSelect.value); })();