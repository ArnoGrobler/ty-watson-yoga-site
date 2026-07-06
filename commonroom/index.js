/* ------------------------------------------------------------
   Alumni index — password gate + grid of alumni pages
   ------------------------------------------------------------ */
(function () {
  "use strict";

  var PW = window.ALUMNI_PASSWORD || "wip";
  var KEY = "alumni-admin-unlocked";
  var TTL = 30 * 60 * 1000; // 30 minutes

  function unlocked() {
    try {
      var t = parseInt(localStorage.getItem(KEY), 10);
      return !!(t && (Date.now() - t) < TTL);
    } catch (e) { return false; }
  }

  function showApp() {
    document.getElementById("alumni-lock").hidden = true;
    document.getElementById("alumni-app").hidden = false;
    renderGrid();
  }
  function showLock() {
    document.getElementById("alumni-lock").hidden = false;
    document.getElementById("alumni-app").hidden = true;
  }

  function renderGrid() {
    var grid = document.getElementById("alumni-grid");
    var list = window.ALUMNI || [];
    if (!list.length) { grid.innerHTML = '<p class="al-empty">No alumni pages yet.</p>'; return; }
    grid.innerHTML = "";

    list.forEach(function (a) {
      var path = "/alumni/" + a.slug + "/";
      var url = window.location.origin + path;
      var tile = document.createElement("div");
      tile.className = "al-tile";

      var link = document.createElement("a");
      link.className = "al-tile__link";
      link.href = path;
      link.innerHTML = '<span class="al-tile__emoji">' + (a.emoji || "📄") +
        '</span><span class="al-tile__title">' + a.title + "</span>";

      var copy = document.createElement("button");
      copy.type = "button";
      copy.className = "al-tile__copy";
      copy.textContent = "Copy link";
      copy.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        function done() { copy.textContent = "Copied!"; setTimeout(function () { copy.textContent = "Copy link"; }, 1500); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done, function () { window.prompt("Copy this link:", url); });
        } else {
          window.prompt("Copy this link:", url);
        }
      });

      tile.appendChild(link);
      tile.appendChild(copy);
      grid.appendChild(tile);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (unlocked()) { showApp(); } else { showLock(); }

    function doUnlock() {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (err) {}
      showApp();
      window.scrollTo(0, 0);
    }
    function tryUnlock() {
      var v = (document.getElementById("alumni-lock-input").value || "").replace(/\s+/g, "").toLowerCase();
      if (v === PW) { doUnlock(); }
      else { document.getElementById("alumni-lock-err").hidden = false; }
    }

    var btn = document.getElementById("alumni-lock-btn");
    if (btn) btn.addEventListener("click", tryUnlock);
    var input = document.getElementById("alumni-lock-input");
    if (input) input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) { e.preventDefault(); tryUnlock(); }
    });

    /* Bulletproof fallback: just type the password anywhere on the page.
       This bypasses the input field entirely, so browser extensions,
       password managers, or autofill can't interfere. */
    var buf = "";
    document.addEventListener("keydown", function (e) {
      if (!document.getElementById("alumni-app").hidden) return; // already open
      if (e.key && e.key.length === 1) {
        buf = (buf + e.key).slice(-12).toLowerCase();
        if (buf.indexOf(PW) !== -1) { buf = ""; doUnlock(); }
      }
    });
  });
})();
