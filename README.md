# Time-Turner

A lightweight, static history timeline site that loads country- and topic-based timelines from JSON files and renders them as responsive cards using TailwindCSS and vanilla JavaScript.

## Project structure

- `index.html` — simple timeline (uses `script.js`)
- `main.html` — main landing + timeline loader (uses `main.js`)
- `main.js` — loader and renderer for `main.html` (function `loadCountry(country)`)
- `script.js` — renderer used by `index.html` (loads `data/france.json` by default)
- `style.css` — custom styling
- `data/` — JSON datasets, each is an array of event objects
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
- `main.js` and `script.js` both fetch a `data/<name>.json` file and render each event as a "timeline card".
- Images are normalized to relative paths when necessary, URI-encoded, and placed inside a fixed thumbnail container that preserves the full image (`object-contain`).
- If an image fails to load, a fallback remote image is used.
- `main.html` exposes the function `loadCountry(country)` — add a button with `onclick="loadCountry('your-dataset')"` to load a new dataset.

## Adding a new dataset
1. Create `data/<name>.json` with the schema above.
2. Add a button to `main.html` inside the buttons group:

```html
<button onclick="loadCountry('your-dataset')">Your Label</button>
```

3. Images: place local thumbnails in `images/` and reference them with `images/your.png`.

## Run locally (Windows PowerShell)
- Using Python 3:
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
py -3 -m http.server 8000
# open http://localhost:8000/main.html
```
- Using Node (npx serve):
```powershell
cd 'C:\Users\A349741\Downloads\history-fresque'
npx serve . -p 8000
# open http://localhost:8000/main.html
```

## Troubleshooting
- If images don't show, check DevTools > Network for 404s. Ensure local paths start with `images/` and that the file exists.
- If JSON fails to load, confirm the file name matches `data/<name>.json` and the JSON is valid (no trailing commas).
- For multilingual title/description objects, the renderer picks the current language from `currentLang` (default `en`).

## Extending the project
- Add tags and a client-side filter UI (search or tag buttons).
- Add a lightbox for full-resolution images.
- Convert to a small static site generator (MD/JSON -> dataset) for easier content management.

---

If you'd like, I can:
- Add a skeleton loader while datasets fetch.
- Add tag-based filtering and search.
- Move all remote images locally into `images/` and update datasets.

Which would you like next?
