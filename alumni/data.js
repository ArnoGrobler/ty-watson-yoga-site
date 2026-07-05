/* ============================================================
   ALUMNI CONFIG  —  single source of truth
   ------------------------------------------------------------
   Ty maintains everything here by describing changes to Claude.
   See alumni/GUIDE.md for plain-language, step-by-step help.
   ============================================================ */

/* Password for the /alumni index (Ty's private grid of all pages). */
window.ALUMNI_PASSWORD = "wip";

/* One object per alumni page. To add a page: add an entry here AND
   create a folder alumni/<slug>/ containing a copy of an existing
   page's index.html (nothing inside it needs editing). */
window.ALUMNI = [
  {
    slug: "summer-series-2026",          /* URL part — must match the folder name */
    title: "Summer Series 2026",
    emoji: "☀️",

    /* Who can open this page. Alumni type their email to enter.
       Add student emails here in lowercase. (Soft gate, not security.) */
    acl: [
      "tyrone13watson@gmail.com"
    ],

    /* "Ty's latest updates" block. Plain text (or simple HTML). */
    updates: "Welcome to the Summer Series 2026 alumni space. I'll post new practices, reflections, and reading here through the season — check back for updates.",

    /* Downloadable materials. Replace url with real links
       (Google Drive / Dropbox share links, or files committed to the repo). */
    files: [
      { name: "Summer Series — Practice Notes", url: "#" },
      { name: "Breathwork Guide", url: "#" }
    ],

    /* Spotify episodes or playlists. Use the part of the share URL after
       open.spotify.com/  — e.g. "episode/<id>" or "playlist/<id>". */
    spotify: [
      "episode/1otpHd3tcgrwbPtOM5uooz",
      "episode/0dJlS89KlskcdytX079iOM"
    ],

    /* Reading list. Covers load automatically from the ISBN.
       (These are examples — replace with Ty's picks.) */
    books: [
      { title: "Light on Yoga", author: "B.K.S. Iyengar", isbn: "9780805210316", url: "https://openlibrary.org/isbn/9780805210316" },
      { title: "Tao Te Ching", author: "Lao Tzu", isbn: "9780679724346", url: "https://openlibrary.org/isbn/9780679724346" }
    ]
  }
];
