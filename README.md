# Time-Turner ⏳

An interactive history timeline application featuring games, an AI tutor, and real-time historical events. Built with TailwindCSS and vanilla JavaScript.

## 🌟 Features

- 📚 **Timeline Viewer** - Browse historical events from 21+ countries and topics
- 🎮 **Timeline Game** - Test your chronological knowledge by placing events in order
- 🧠 **Quiz Game** - Multiple game modes including timeline quiz, description quiz, mixed mode, and timed challenge
- 🤖 **AI Tutor** - Interactive chatbot with smart search, scoring system, and topic filtering
- 📅 **On This Day in History** - Real-time Wikipedia integration showing events from today's date
- 🌓 **Dark Mode** - Beautiful dark theme with persistent toggle across all pages
- 🌍 **Bilingual** - Full support for English and French (EN/FR)

## 🎯 New Features

### AI History Tutor
- **Smart Search Engine** with weighted relevance scoring
- **Topic Filtering** - Filter by 21 different historical topics
- **Score Display** - See relevance scores (0-100%) on search results
- **Scrollable Event Cards** - Full content visibility for long descriptions
- **Multiple Search Methods**: 
  - Exact title matching (100 points)
  - Partial title matching (50 points)
  - Year matching (30 points)
  - Keyword matching in titles/descriptions (15/8 points)
  - Tag matching (20 points)
- **Dark Mode Support** - Beautiful chat interface in both themes
- **Quick Topics** - One-click access to popular subjects

### On This Day in History
- **Live Wikipedia API Integration** - Real historical events from today's date
- **Automatic Language Switching** - Uses EN or FR Wikipedia based on language selection
- **Rich Content** - Images, descriptions, and links to full Wikipedia articles
- **Smart Event Selection** - Prioritizes significant historical events
- **Responsive Design** - Beautiful gradient cards with hover effects

## 📂 Project Structure

### Main Pages
- `index.html` — Main landing page with topic selection, game navigation, and "On This Day" feature (uses `main.js`)
- `main.js` — Loader and renderer for `index.html` with Wikipedia API integration
- `timeturner.html` — Simple timeline viewer (uses `script.js`)
- `script.js` — Renderer used by `timeturner.html` (loads `data/france.json` by default)

### AI Tutor
- `tutor.html` — Interactive chat interface with header controls (back button, theme toggle, topic selector, language buttons)
- `tutor.js` — AI logic with smart search algorithm, scoring system, and data loading from all JSON files
- `tutor.css` — Complete styling with dark mode support (1400px width, 85vh height)

### Games
- `game2.html` + `game2.js` + `game2.css` — Timeline placement game (drag & drop cards in chronological order)
- `quizz.html` + `quizz.js` + `quizz.css` — Multi-mode quiz game (timeline, description, mixed, timed modes)

### Assets
- `style.css` — Global styling with dark mode support using CSS custom properties
- `data/` — 21 JSON datasets for countries, topics, and historical events
- `images/` — Local image assets referenced by datasets
- `start-server.ps1` — PowerShell script to easily start a local web server

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

## 🚀 Quick Start

### Prerequisites
You need a local web server because:
1. The app loads JSON files dynamically (CORS restriction)
2. The "On This Day" feature uses Wikipedia API (requires HTTP/HTTPS protocol)

**Note**: The Wikipedia API feature will NOT work when opening `index.html` directly with `file://` protocol. It WILL work once deployed to any web hosting service (GitHub Pages, Netlify, Vercel, etc.).

### Option 1: Use the provided script (Windows)
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
.\start-server.ps1
# Open http://localhost:8000 in your browser
```

### Option 2: Python (Recommended)
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
python -m http.server 8000
# or: py -3 -m http.server 8000
# Open http://localhost:8000
```

### Option 3: Node.js
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
npx serve . -p 8000
# Open http://localhost:8000
```

### Option 4: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` → "Open with Live Server"

## 🌐 Deployment

This app works perfectly when deployed! Simply upload all files to:
- **GitHub Pages** (free, automatic SSL)
- **Netlify** (free, drag & drop deployment)
- **Vercel** (free, automatic deployment from Git)
- **Any static hosting service**

The Wikipedia API will work automatically once deployed via HTTP/HTTPS! 🎉

## 📖 How to Use

### Navigation
- **Main Page** (`index.html`)
  - View "On This Day in History" from Wikipedia
  - Choose a topic to explore
  - Access Timeline Game, Quiz, or AI Tutor
  - Toggle dark/light mode
  - Switch between EN/FR languages

- **AI Tutor** (`tutor.html`)
  - Select a topic filter or use "All Topics"
  - Ask questions about historical events
  - See relevance scores on results (0-100%)
  - Click quick topic buttons for instant results
  - Scroll within cards for long descriptions

- **Timeline Game** (`game2.html`)
  - Drag cards onto the timeline in chronological order
  - Get instant visual feedback

- **Quiz** (`quizz.html`)
  - Choose your game mode and difficulty
  - Answer questions to test your knowledge

## ⚙️ Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Styling**: TailwindCSS (CDN) + Custom CSS with CSS Variables
- **Data**: JSON files for flexible content management
- **API**: Wikipedia REST API for "On This Day" feature
- **Theme**: LocalStorage-based persistence
- **Architecture**: Static site, deployable anywhere

## 🔧 Troubleshooting

### Wikipedia "On This Day" shows loading spinner
- **Cause**: CORS restriction when opening with `file://` protocol
- **Solution**: Use a local web server (see Quick Start above) OR deploy to web hosting
- **Note**: Feature works perfectly once deployed!

### Images don't show
- Check DevTools > Network for 404 errors
- Ensure paths start with `images/` and files exist
- Verify JSON references correct image paths

### JSON fails to load
- Confirm file names match `data/<name>.json`
- Validate JSON syntax (no trailing commas)
- Use a local web server, not `file://` protocol

### Dark mode not persisting
- Check browser localStorage is enabled
- Clear browser cache and try again
- Ensure JavaScript is enabled

### AI Tutor not finding results
- Try using different keywords
- Select a specific topic filter
- Check browser console for any errors
- Ensure data files are loading correctly

### Games not working
- Must use HTTP/HTTPS protocol (local server or deployed)
- Check that JSON data files are accessible
- Verify JavaScript is enabled in browser

## 🎨 Features in Detail

### AI Tutor Search Algorithm
The tutor uses a sophisticated weighted scoring system to rank search results:

| Match Type | Score | Example |
|------------|-------|---------|
| Exact title match | 100 pts | Searching "Napoleon" finds "Napoleon Bonaparte" |
| Title contains query | 50 pts | "France" matches "French Revolution" |
| Query contains title | 40 pts | "Tell me about Napoleon Bonaparte" matches "Napoleon" |
| Exact year match | 30 pts | "1789" matches events from 1789 |
| Partial year match | 20 pts | "17" matches 1700s events |
| Keyword in title | 15 pts each | "war" scores for each occurrence |
| Full query in description | 15 pts | Complete phrase found |
| Keyword in description | 8 pts each | Individual words found |
| Tag match | 20 pts each | Matches event tags |

Results are sorted by total score (highest first) and displayed with their relevance percentage.

### On This Day Feature (Wikipedia Integration)
- **Live Data**: Fetches from `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{MM}/{DD}`
- **Language Support**: Automatically switches to French Wikipedia when FR is selected
- **Smart Filtering**: Prioritizes historical events (pre-2000) over recent news
- **Rich Display**: Shows images, descriptions, and direct links to Wikipedia articles
- **Fallback Handling**: Graceful error messages if API is unavailable

### Dark Mode Implementation
- Uses CSS custom properties for consistent theming
- LocalStorage persistence across page reloads
- Smooth transitions between themes
- Covers all pages: index, tutor, games, quiz
- Accessible color contrasts (WCAG compliant)

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: TailwindCSS (CDN) + Custom CSS with CSS Variables
- **Data**: JSON files for flexible content management
- **Theme**: LocalStorage-based persistence with CSS custom properties

## 🚀 Extending the Project

### Add New Historical Dataset
1. Create `data/<name>.json` following the schema
2. Add bilingual title and description objects
3. Include relevant tags for filtering
4. Add images to `images/` folder
5. Update `availableTopics` array in `tutor.js`

### Enhance AI Tutor
- Adjust scoring weights in `generateResponse()` function
- Add new keyword categories
- Implement fuzzy string matching
- Add conversation history
- Create suggested follow-up questions

### Improve Wikipedia Integration
- Add "births" and "deaths" sections
- Show multiple events per day
- Add user preference for event types
- Cache API responses
- Add "share this event" feature

### Create New Game Modes
- Add difficulty levels
- Implement multiplayer features
- Create leaderboards
- Add time-based challenges
- Include achievement system

### UI/UX Enhancements
- Add animations and transitions
- Implement mobile swipe gestures
- Create onboarding tutorial
- Add keyboard shortcuts
- Improve accessibility (ARIA labels, screen readers)

### Future Features
- User accounts and progress tracking
- Social sharing capabilities
- Audio narration for events
- Video content integration
- AR/VR timeline experiences
- Custom timeline creation tool
- Export timelines as PDF
- Integration with more historical APIs

## 💾 Available Datasets (21 Topics)

### Countries
- 🇫🇷 **France** - From Vercingetorix to modern day
- 🇩🇪 **Germany** - Prussian era to reunification
- 🇬🇧 **UK** - British history and empire
- 🇺🇸 **USA** - American history timeline
- 🇷🇺 **Russia** - From Tsars to modern Russia
- 🇨🇳 **China** - Ancient dynasties to present
- 🇯🇵 **Japan** - Samurai to modern era
- 🇮🇳 **India** - Ancient civilizations to independence
- 🇪🇬 **Egypt** - Pharaohs and modern Egypt
- 🇬🇷 **Greece** - Ancient Greece to modern day

### Ancient Civilizations & Mythology
- 🏛️ **Roman Empire** - Rise and fall of Rome
- 🦅 **Egyptian Mythology** - Gods, myths, and legends
- 📖 **Bible/Christianity** - Biblical events and early Christianity
- 🕌 **Islam** - Islamic history and civilization
- ✡️ **Judaism** - Jewish history and traditions

### Topics
- ⚔️ **Wars** - Major conflicts throughout history
- ✊ **Revolutions** - Revolutionary movements worldwide
- 🦠 **Pandemics** - Historical disease outbreaks
- 🔬 **Science** - Scientific discoveries and inventions
- 🎸 **Heavy Metal** - Metal music history and bands
- 🥋 **Brazilian Jiu-Jitsu** - Martial arts evolution

Each dataset includes year, title (EN/FR), description (EN/FR), images, and tags for filtering.

## 📄 License
This project is open source and available for educational purposes.

## 🤝 Contributing
Contributions are welcome! Feel free to:
- Add new historical datasets
- Improve the search algorithm
- Enhance UI/UX
- Fix bugs
- Add new features
- Improve documentation

## 📞 Support
For issues, questions, or suggestions, please open an issue on the repository.

---

**Time-Turner ⏳** - Making history interactive, intelligent, and fun! 🎓✨

Built with ❤️ for history enthusiasts and learners everywhere.