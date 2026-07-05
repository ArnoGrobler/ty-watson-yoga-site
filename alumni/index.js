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
      var url = new URL(a.slug + "/", window.location.href).href;
      var tile = document.createElement("div");
      tile.className = "al-tile";

      var link = document.createElement("a");
      link.className = "al-tile__link";
      link.href = a.slug + "/";
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

    var form = document.getElementById("alumni-lock-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (document.getElementById("alumni-lock-input").value || "").trim().toLowerCase();
      if (v === PW) {
        try { localStorage.setItem(KEY, String(Date.now())); } catch (err) {}
        showApp();
        window.scrollTo(0, 0);
      } else {
        document.getElementById("alumni-lock-err").hidden = false;
      }
    });
  });
})();
