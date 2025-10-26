# Time-Turner

A lightweight, static history timeline application featuring interactive games and timelines from JSON datasets. Built with TailwindCSS and vanilla JavaScript.

## Features

- 📚 **Timeline Viewer** - Browse historical events from various countries and topics
- 🎮 **Timeline Game** - Test your chronological knowledge by placing events in order
- 🧠 **Quiz Game** - Multiple game modes including timeline quiz, description quiz, mixed mode, and timed challenge
- 🌓 **Dark Mode** - Persistent theme toggle across all pages
- 🌍 **Multilingual** - Support for multiple languages (EN/FR)

## Project structure

### Main Pages
- `index.html` — main landing page with topic selection and game navigation (uses `index.js`)
- `index.js` — loader and renderer for `index.html` (function `loadCountry(country)`)
- `timeturner.html` — simple timeline viewer (uses `script.js`)
- `script.js` — renderer used by `timeturner.html` (loads `data/france.json` by default)

### Games
- `game2.html` + `game2.js` + `game2.css` — Timeline placement game (drag & drop cards in chronological order)
- `quizz.html` + `quizz.js` + `quizz.css` — Multi-mode quiz game (timeline, description, mixed, timed modes)

### Assets
- `style.css` — global styling with dark mode support
- `data/` — JSON datasets for countries, topics, and historical events
- `images/` — local image assets referenced by datasets

## JSON dataset schema
Each dataset is a JSON array of events. Minimal fields used by the renderer:

- `year`: string (e.g. "1914-1918")
- `title`: string or object `{ en: "...", fr: "..." }` for multilingual support
- `description`: string or object `{ en: "...", fr: "..." }`
- `image`: optional string URL or local path (e.g. `images/vercingetorix.png`)

Optional fields you can add later:
- `tags`: array of strings for filtering
- `region`: string for grouping (e.g., "Europe")
- `source`: string URL or citation

Example entry:

```json
{
  "year": "1914-1918",
  "title": "World War I",
  "description": "Global war centered in Europe...",
  "image": "images/ww1.jpg",
  "tags": ["war", "20th-century"],
  "region": "Global"
}
```

## How the renderer works
- `index.js` and `script.js` both fetch a `data/<name>.json` file and render each event as a "timeline card".
- Images are normalized to relative paths when necessary, URI-encoded, and placed inside a fixed thumbnail container that preserves the full image (`object-contain`).
- If an image fails to load, a fallback remote image is used.
- `index.html` exposes the function `loadCountry(country)` — add a button with `onclick="loadCountry('your-dataset')"` to load a new dataset.

## Adding a new dataset
1. Create `data/<name>.json` with the schema above.
2. Add a button to `index.html` inside the buttons group:

```html
<button onclick="loadCountry('your-dataset')">Your Label</button>
```

3. Images: place local thumbnails in `images/` and reference them with `images/your.png`.

## Run locally (Windows PowerShell)

The application requires a local web server due to CORS restrictions when loading JSON files.

### Using Python 3:
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
py -3 -m http.server 8000
# Open http://localhost:8000/index.html or just http://localhost:8000
```

### Using Node (npx serve):
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
npx serve . -p 8000
# Open http://localhost:8000/index.html or just http://localhost:8000
```

### Navigation
- **Main Page** (`index.html`) - Select a topic and choose between Timeline Game or Quiz
- **Timeline Game** (`game2.html`) - Drag cards onto the timeline in chronological order
- **Quiz** (`quizz.html`) - Answer questions in various quiz modes

## Troubleshooting
- **Images don't show**: Check DevTools > Network for 404s. Ensure local paths start with `images/` and files exist.
- **JSON fails to load**: Confirm the file name matches `data/<name>.json` and the JSON is valid (no trailing commas).
- **Multilingual content**: The renderer picks the current language from `currentLang` (default `en`).
- **Theme not persisting**: Check browser localStorage and ensure JavaScript is enabled.
- **Games not loading**: Ensure you're running a local server and accessing via `http://localhost`.

## Features in Detail

### Timeline Game (game2.html)
- Progressive difficulty - cards appear one at a time
- Visual feedback with correct/incorrect indicators
- Image and title display for each historical event
- Score tracking and game completion detection
- Dark mode support

### Quiz Game (quizz.html)
- **Timeline Mode**: Arrange events in chronological order
- **Description Mode**: Match descriptions to historical periods
- **Mixed Mode**: Combination of both question types
- **Timed Mode**: Race against the clock
- High score tracking
- Dark mode support

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: TailwindCSS (CDN) + Custom CSS with CSS Variables
- **Data**: JSON files for flexible content management
- **Theme**: LocalStorage-based persistence with CSS custom properties

## Extending the project
- Add more historical datasets to `data/` folder
- Create custom quiz questions and game modes
- Implement user accounts and progress tracking
- Add social sharing features
- Create mobile-responsive improvements
- Add audio/video content for events
- Implement multilingual expansion (more languages)

## Available Datasets
Currently includes timelines for:
- Countries: France, Germany, UK, USA, Russia, China, Japan, India, Egypt, Greece, Rome
- Topics: Wars, Revolutions, Pandemics, Science, Metal Music, BJJ (Brazilian Jiu-Jitsu)
- Religions: Bible, Judaism, Islam

## License
This project is open source and available for educational purposes.

---

**Time-Turner** - Making history interactive and fun! 🎓✨
