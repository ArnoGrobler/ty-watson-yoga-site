# Alumni area — how it works & how Claude extends it

Written so **Ty describes what he wants in plain language and Claude makes the
edit + deploys**. Ty never has to touch code.

> Not real security. Everything runs in the browser, so the student email lists
> are visible in the page source. It's a gentle gate to keep pages private, not a lock.

---

## What exists today

- **`/alumni` — the dashboard.** Password `wip`. Shows a grid of tiles, one per
  workshop. Each tile has, on hover, a **Copy link** button (to send students)
  and a **Members** button (shows who has access). Clicking a tile opens that
  workshop *without* asking for a password (the dashboard is already gated).

- **`/alumni/<slug>/` — a workshop page.** A frosted glass panel over a
  background painting. A student enters the email Ty registered → the login
  fades out, the panel expands, and the widgets fade in (white text on the
  glass). Arriving from the dashboard skips the login entirely.

- **Everything is self-contained inline HTML/CSS/JS** — no build step and no
  shared data file. Each workshop page holds its own content and its own email
  allowlist. Shared look lives in `alumni/alumni.css`.

- The default background is **Botticelli — *La Primavera* (Le Printemps)** at
  `assets/back.jpg`.

**Legacy/unused:** `alumni/data.js`, `alumni/page.js`, `alumni/index.js` are
from an earlier version and are **not used** by any page. Ignore them (or delete
on request). Do not wire new work through them.

### The widgets on a workshop page
| Widget | What it is | Where it lives in the HTML |
|--------|------------|-----------------------------|
| Header | Workshop title + "Ty Watson" underneath | `.al-header` |
| Notice board | A free-text note from Ty | `.al-updates__body` |
| Next live call | The Zoom button + a live countdown to the next session | `.al-zoom` (button `.al-zoom__btn` href = Zoom link) |
| Schedule | List of sessions; auto-highlights the next one; **Add to calendar** downloads an `.ics` with the Zoom link on every event | `.al-schedule` (`<li class="al-session" data-when="...">`) |
| Materials | File download cards (click = download) | `.al-files` (`<a class="al-file" href="files/x.pdf" download="...">`) |
| Listen | Spotify embeds | `.al-listen` (`<iframe class="al-spotify">`) |
| Reading | Book covers by ISBN | `.al-books` (`<a class="al-book">`) |

The **countdown** and the **.ics** both read the Schedule's `data-when` dates,
so the schedule is the single source of truth for session times. Dates use an
explicit timezone offset, e.g. `2026-07-12T10:00:00-04:00` (US Eastern).

---

## Creating a NEW workshop page

When Ty says something like *"set up the Autumn Series"*, **have this
conversation with him first, then build.** Ask these in order and wait for
answers — don't assume.

### Step 1 — Starting point
> "Do you want to **copy a recent workshop** (which one?) or start from the
> **default template** (the Summer Series 2026 layout)?"

Whichever he picks becomes the structure you copy.

### Step 2 — Background image
> "Same background image — **Botticelli's *La Primavera*** — or do you want a
> **new one**?"

If new: ask him to drop the image in the **`assets/` folder** (tell him the full
path: `assets/`), or to send it and you'll place it there. Note the filename.

### Step 3 — Workshop basics
> "What's the **title**? And pick an **emoji** for its dashboard tile."

### Step 4 — Walk every widget, ask for this workshop's details
Go through the widgets **of the template he chose**, one at a time, and collect:

1. **Zoom link** — the single recurring link for all calls.
2. **Notice board** — the welcome/update text.
3. **Schedule** — for each session: date, start time, timezone, and a title
   (e.g. "Week 1 — Foundations"). Confirm the timezone explicitly.
4. **Materials** — the downloadable files.
5. **Listen** — Spotify episode/playlist links.
6. **Reading** — book titles + authors.

### Step 5 — Chase down anything missing
If a widget needs an asset you don't have, **help him get it and tell him where
to put it**:

- **Files (Materials):** ask him to place them in
  `alumni/<slug>/files/` (create the folder), or paste share links
  (Google Drive/Dropbox). Files committed to that folder download cleanly;
  external links may open instead of download.
- **Spotify:** he can "Share → Copy link"; you only need the part after
  `open.spotify.com/` (e.g. `episode/<id>`).
- **Book covers:** covers load automatically from the **ISBN-13** — just ask for
  the ISBN. If a cover doesn't exist on Open Library, ask him for an image file
  to drop in `alumni/<slug>/files/`.

### Step 6 — Student access (emails)
> "Do you already have the **emails of the students who signed up**, or will you
> send them later?"

Remind him: **he can add them any time — that list is exactly how students get
access**, and until an email is on the list that person can't log in. Missing
emails are fine to start; the page still works, students just can't get in yet.

### Step 7 — Build it
Once you have the details:

1. **Create the folder** `alumni/<slug>/` and copy the chosen template's
   `index.html` into it. `<slug>` is lowercase-with-dashes and becomes the URL.
2. Fill in the content: title + `.al-header__by` (keep "Ty Watson"), notice
   board text, `.al-zoom__btn` Zoom link, the `.al-session` rows (set both the
   visible date text **and** the `data-when` ISO+offset), Spotify iframes,
   book `<a class="al-book">` blocks (ISBN in the cover URL).
3. **Materials:** create `alumni/<slug>/files/`, add the files, and point each
   `.al-file` at `files/<name>` with a `download="Friendly Name.ext"` attribute.
4. **Background:** default uses `.al-body--photo` (→ `assets/back.jpg`). For a
   new image, set it inline on the body instead:
   `<body class="al-body" style="background:url('/assets/<file>') center/cover fixed no-repeat;">`.
5. **Allowlist:** put the student emails (lowercase) in the `A = [ ... ]` array
   inside `alEnter()` in that page's inline script. Master password `wip` always
   works too.
6. **Add the dashboard tile** in `alumni/index.html`, next to the existing tiles
   inside `.al-grid`. Copy an existing tile block and update:
   - `data-members='["email1","email2"]'` — **must match** the page's `A=[...]` list
   - `data-title="<Title>"`
   - the link `href="/alumni/<slug>/"` (keep the `onclick` that sets
     `sessionStorage 'al-from-dash'`)
   - the emoji and title text
   - the **Copy link** button's URL (it hardcodes `/alumni/<slug>/`)
7. **Cache-bust:** bump the `alumni.css?v=N` number on any page whose CSS you
   changed (and match it across pages so it stays consistent).
8. Verify in the preview, then **ask Ty before committing/deploying** (see below).

---

## Common one-off requests

- **"Give jane@example.com access to the Summer Series."** Add the lowercase
  email to that page's `A=[...]` array **and** the matching tile's `data-members`
  on the dashboard. (Keep the two in sync — the tile's Members count reads
  `data-members`.)
- **"Update the notice / add a file / add a podcast / add a book / change a date."**
  Edit that widget in the workshop page's `index.html`.
- **"Change the /alumni password."** It's inline in `alumni/index.html`
  (currently `wip`, checked in the Enter button + input `onkeydown`).

## Deploying
The site auto-deploys from `main` via GitHub Actions. **Do not commit or push
without Ty's explicit go-ahead.** Make the edits, verify in the preview, show
him, and wait for "deploy". If a deploy fails with "Deployment failed, try again
later", just re-run the workflow — it's an intermittent GitHub Pages hiccup.
