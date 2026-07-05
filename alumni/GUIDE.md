# Alumni pages — how they work & how to change them

This is written so **Ty can describe what he wants in plain language** and
**Claude makes the edit + deploys**. Ty does not need to touch code.

## What exists

- `/alumni` — a private index showing a grid of every alumni page.
  Protected by a **password** (`wip`). Each tile links to a page and, on hover,
  shows a **Copy link** button to send to students.
- `/alumni/<slug>/` — one page per workshop (e.g. `/alumni/summer-series-2026/`).
  Protected by an **email allowlist**: a student types the email Ty added, and
  they're in. No other verification.
- None of this is linked from the main site — only people with the link know it exists.

> Not real security: everything runs in the browser, so the email list is
> visible in the page source. It's a gentle gate, not a lock.

## The files

| File | What it's for |
|------|----------------|
| `alumni/data.js` | **The only file Ty's changes usually touch.** All pages, access lists, and content live here. |
| `alumni/index.html` | The grid page (rarely changes). |
| `alumni/<slug>/index.html` | One folder per page. Generic — it reads its slug from the folder name, so the file is identical for every page. |
| `alumni/alumni.css`, `index.js`, `page.js` | Shared code (rarely changes). |

## Common requests (what Claude does)

**"Add a new alumni page for the Autumn Series 2026."**
1. Add a new entry to the `ALUMNI` array in `alumni/data.js` (copy the
   `summer-series-2026` block, change the fields).
2. Create `alumni/autumn-series-2026/` and put a copy of
   `alumni/summer-series-2026/index.html` inside it (no edits needed).
3. Commit + push. A new tile with its own copy-able link appears on `/alumni`.

**"Give jane@example.com access to the Summer Series page."**
- Add the email to that page's `acl` list in `data.js`. Commit + push.

**"Update the Summer Series updates text / add a file / add a podcast / add a book."**
- Edit that page's entry in `data.js`. Commit + push.

**"Change the /alumni password."**
- Change `ALUMNI_PASSWORD` in `data.js`.

## Fields in a page entry (`data.js`)

```js
{
  slug: "autumn-series-2026",      // URL part; must equal the folder name (lowercase-dashes)
  title: "Autumn Series 2026",
  emoji: "🍂",
  acl: ["student@email.com"],      // who may enter (lowercase)
  updates: "Text for the 'Ty's latest updates' block.",
  files:  [ { name: "Notes", url: "https://..." } ],     // download links
  spotify:[ "episode/<id>", "playlist/<id>" ],           // part after open.spotify.com/
  books:  [ { title:"", author:"", isbn:"9780...", url:"https://..." } ]  // cover loads from ISBN
}
```

- **Files**: use Google Drive / Dropbox share links, or commit the files into the
  page's folder and link them relatively.
- **Spotify**: from a track/episode/playlist "Share → Copy link", use the bit
  after `open.spotify.com/` (e.g. `episode/1otpHd3tcgrwbPtOM5uooz`).
- **Books**: give the ISBN-13; the cover image loads automatically.
