/* ------------------------------------------------------------
   Alumni page — email allowlist gate + content rendering.
   Generic: it reads its own slug from the folder name, so every
   alumni/<slug>/index.html file is identical.
   ------------------------------------------------------------ */
(function () {
  "use strict";

  function slugFromPath() {
    var parts = window.location.pathname.replace(/\/+$/, "").split("/");
    return parts[parts.length - 1];
  }

  var page = (window.ALUMNI || []).filter(function (a) { return a.slug === slugFromPath(); })[0];
  var KEY = page ? ("alumni-" + page.slug + "-ok") : null;
  var TTL = 24 * 60 * 60 * 1000; // 24 hours

  function granted() {
    if (!KEY) return false;
    try {
      var t = parseInt(localStorage.getItem(KEY), 10);
      return !!(t && (Date.now() - t) < TTL);
    } catch (e) { return false; }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function spotifyEmbed(ref) {
    return '<iframe class="al-spotify" src="https://open.spotify.com/embed/' + esc(ref) +
      '" width="100%" height="152" allowtransparency="true" allow="encrypted-media; clipboard-write; autoplay; fullscreen; picture-in-picture" loading="lazy"></iframe>';
  }

  function render() {
    var app = document.getElementById("al-app");
    if (!page) { app.innerHTML = '<div class="al-app"><p class="al-empty">This alumni page could not be found.</p></div>'; app.hidden = false; return; }
    document.title = page.title + " — Ty Watson Yoga";

    var files = (page.files || []).map(function (f) {
      return '<li><a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.name) + "</a></li>";
    }).join("");

    var spotify = (page.spotify || []).map(spotifyEmbed).join("");

    var books = (page.books || []).map(function (b) {
      var cover = "https://covers.openlibrary.org/b/isbn/" + esc(b.isbn) + "-L.jpg";
      var inner = '<img class="al-book__cover" src="' + cover + '" alt="' + esc(b.title) +
        '" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
        '<span class="al-book__title">' + esc(b.title) + "</span>" +
        '<span class="al-book__author">' + esc(b.author) + "</span>";
      return b.url
        ? '<a class="al-book" href="' + esc(b.url) + '" target="_blank" rel="noopener">' + inner + "</a>"
        : '<div class="al-book">' + inner + "</div>";
    }).join("");

    app.innerHTML =
      '<header class="al-header"><span class="al-header__emoji">' + esc(page.emoji) +
        '</span><h1 class="al-header__title">' + esc(page.title) + "</h1></header>" +
      '<section class="al-updates"><h2 class="al-updates__label">Ty\'s latest updates</h2>' +
        '<div class="al-updates__body">' + (page.updates || "") + "</div></section>" +
      '<div class="al-widgets">' +
        '<section class="al-widget"><h3 class="al-widget__title">Materials</h3><ul class="al-files">' +
          (files || '<li class="al-empty">Nothing here yet.</li>') + "</ul></section>" +
        '<section class="al-widget"><h3 class="al-widget__title">Listen</h3>' +
          (spotify || '<p class="al-empty">Nothing here yet.</p>') + "</section>" +
        '<section class="al-widget al-widget--wide"><h3 class="al-widget__title">Reading</h3><div class="al-books">' +
          (books || '<p class="al-empty">Nothing here yet.</p>') + "</div></section>" +
      "</div>";
    app.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (page) {
      var t = document.getElementById("al-gate-title");
      if (t) t.textContent = page.title;
      var em = document.getElementById("al-gate-emoji");
      if (em && page.emoji) em.textContent = page.emoji;
    }

    if (granted()) { render(); return; }

    document.getElementById("al-gate").hidden = false;

    function tryEnter() {
      var email = (document.getElementById("al-gate-input").value || "").trim().toLowerCase();
      var allow = page && (page.acl || []).map(function (x) { return String(x).trim().toLowerCase(); });
      var master = (window.ALUMNI_PASSWORD || "wip").toLowerCase();
      if (email && (email === master || (allow && allow.indexOf(email) >= 0))) {
        try { localStorage.setItem(KEY, String(Date.now())); } catch (err) {}
        document.getElementById("al-gate").hidden = true;
        render();
        window.scrollTo(0, 0);
      } else {
        document.getElementById("al-gate-err").hidden = false;
      }
    }

    var btn = document.getElementById("al-gate-btn");
    if (btn) btn.addEventListener("click", tryEnter);
    var input = document.getElementById("al-gate-input");
    if (input) input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) { e.preventDefault(); tryEnter(); }
    });
  });
})();
