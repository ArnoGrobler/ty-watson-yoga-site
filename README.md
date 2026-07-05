# Ty Watson Yoga — site

A self-contained static site for Ty Watson Yoga. No build step, no external
dependencies — all fonts and assets are hosted locally.

## Structure

```
index.html        markup + the WIP-lock check
css/style.css     all styles (desktop + phone breakpoints)
js/main.js        tabs, series slider, help/preview follows, modals, lock
assets/           images (strap, portrait, dog)
fonts/            self-hosted fonts (Rokkitt, Notable, Inconsolata)
.nojekyll         serve files as-is on GitHub Pages
```

## Work-in-progress lock

The site can be gated behind a soft password screen while you work.

- In `index.html`, the inline script near the top has `var LOCKED = true/false`.
  Set it to `true` to gate the site, `false` to open it.
- Password: **wip** (case-insensitive). An unlock lasts **10 minutes**, after
  which the password is required again.
- This is a convenience gate, not real security (the markup is still reachable
  by anyone who views source).

## Run locally

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deploy (GitHub Pages)

Pushed to the `main` branch and served from the repo root. Pages is configured
to deploy from `main` / root.
