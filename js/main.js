/* ------------------------------------------------------------
   Ty Watson — single-page interactions
   · tab navigation (swap middle panel, no page change)
   · cursor-following help text on [data-help] elements
   · legal modal
   ------------------------------------------------------------ */
(function () {
  "use strict";

  var DEFAULT_TAB = "teaching";

  /* ---------------- Tabs ---------------- */
  function panels() {
    return Array.prototype.slice.call(document.querySelectorAll(".c-panel"));
  }

  function activate(name) {
    var found = false;
    panels().forEach(function (panel) {
      var match = panel.id === "panel-" + name;
      panel.hidden = !match;
      if (match) found = true;
    });

    if (!found) {
      name = DEFAULT_TAB;
      panels().forEach(function (panel) {
        panel.hidden = panel.id !== "panel-" + name;
      });
    }

    var activeLabel = "";
    document.querySelectorAll("button[data-tab]").forEach(function (btn) {
      var active = btn.getAttribute("data-tab") === name;
      btn.classList.toggle("is-active", active);
      if (active) activeLabel = btn.textContent;
    });

    // sync the mobile collapsed bar label and close the dropdown
    var current = document.querySelector(".c-tabs__current");
    if (current && activeLabel) current.textContent = activeLabel;
    closeTabs();

    // Summer series always opens on the detail view; size the slider now
    // that the panel is visible.
    if (name === "summer-series") {
      var vp = document.getElementById("series-viewport");
      if (vp) {
        vp.classList.remove("is-archive");
        requestAnimationFrame(seriesSetHeight);
      }
    }

    if (history.replaceState) history.replaceState(null, "", "#" + name);
  }

  /* ---------------- Series detail ⇄ archive slider ---------------- */
  function seriesSetHeight() {
    var vp = document.getElementById("series-viewport");
    if (!vp || vp.offsetParent === null) return; // skip when panel hidden
    var archive = vp.classList.contains("is-archive");
    var view = vp.querySelector(archive ? ".c-series-view--archive" : ".c-series-view--detail");
    if (view) vp.style.height = view.offsetHeight + "px";
  }

  function seriesShow(archive) {
    var vp = document.getElementById("series-viewport");
    if (!vp) return;
    vp.classList.toggle("is-archive", archive);
    seriesSetHeight();
  }

  function initSeries() {
    var vp = document.getElementById("series-viewport");
    if (!vp) return;
    vp.querySelectorAll("[data-series-open]").forEach(function (b) {
      b.addEventListener("click", function () { seriesShow(true); });
    });
    vp.querySelectorAll("[data-series-close]").forEach(function (b) {
      b.addEventListener("click", function () { seriesShow(false); });
    });
    window.addEventListener("resize", seriesSetHeight);
  }

  /* ---------------- Mobile collapsed tab bar ---------------- */
  function closeTabs() {
    var nav = document.querySelector(".c-tabs");
    if (!nav) return;
    nav.classList.remove("is-open");
    var toggle = nav.querySelector(".c-tabs__toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function initTabBar() {
    var nav = document.querySelector(".c-tabs");
    if (!nav) return;
    nav.querySelectorAll("[data-toggle-tabs]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var open = nav.classList.toggle("is-open");
        var toggle = nav.querySelector(".c-tabs__toggle");
        if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    // Selecting any item in the dropdown collapses it (covers the mailto link,
    // which has no data-tab so wouldn't close via activate()).
    nav.querySelectorAll(".c-tabs__list .tab").forEach(function (t) {
      t.addEventListener("click", function () { closeTabs(); });
    });
  }

  /* Touch capability — on touch devices we reveal help/previews on tap. */
  var IS_TOUCH = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);

  /* Position a fixed follower box near a point, kept on-screen.
     `above` places it above the point (used for taps so a finger
     doesn't cover it). */
  function positionFollower(box, clientX, clientY, above) {
    var w = box.offsetWidth;
    var h = box.offsetHeight;
    var x = clientX + 16;
    var y = above ? (clientY - h - 16) : (clientY + 18);
    if (x + w > window.innerWidth - 8) x = clientX - 16 - w;
    if (x < 8) x = 8;
    if (y < 8) y = clientY + 18;
    if (y + h > window.innerHeight - 8) y = clientY - h - 16;
    if (y < 8) y = 8;
    box.style.transform = "translate3d(" + x + "px," + y + "px,0)";
  }

  // whichever follower is currently open by tap (so a 2nd tap can close it)
  var tapOpenEl = null;

  /* Wire a follower box to a set of trigger elements.
     onShow(el) prepares the box (e.g. sets text/image) and returns nothing.
     Works with mouse hover AND touch tap (two-tap: 1st reveals, 2nd follows
     the link / closes). */
  function wireFollower(box, selector, onShow) {
    if (!box) return;

    function show(el, x, y, above) {
      onShow(el);
      box.classList.add("is-visible");
      positionFollower(box, x, y, above);
    }
    function hide() {
      box.classList.remove("is-visible");
    }

    document.querySelectorAll(selector).forEach(function (el) {
      // Desktop: hover
      el.addEventListener("mouseenter", function (e) {
        if (IS_TOUCH) return;
        show(el, e.clientX, e.clientY, false);
      });
      el.addEventListener("mousemove", function (e) {
        if (IS_TOUCH) return;
        positionFollower(box, e.clientX, e.clientY, false);
      });
      el.addEventListener("mouseleave", function () {
        if (IS_TOUCH) return;
        hide();
      });

      // Touch: tap to reveal; tap again to follow the link / dismiss
      el.addEventListener("click", function (e) {
        if (!IS_TOUCH) return;
        // Real links (e.g. mailto) navigate on a single tap — no reveal.
        var href = el.getAttribute("href");
        if (el.tagName === "A" && href && href.charAt(0) !== "#") {
          hideAllFollowers();
          return;
        }
        var alreadyOpen = box.classList.contains("is-visible") && tapOpenEl === el;
        if (alreadyOpen) {
          // second tap: dismiss and let the link behave normally
          hide();
          tapOpenEl = null;
          return;
        }
        // first tap: reveal, block navigation for now
        e.preventDefault();
        e.stopPropagation();
        // close any other open follower
        hideAllFollowers();
        tapOpenEl = el;
        show(el, e.clientX, e.clientY, true);
      });
    });

    // register for global dismissal
    followerBoxes.push(box);
  }

  var followerBoxes = [];
  function hideAllFollowers() {
    followerBoxes.forEach(function (b) { b.classList.remove("is-visible"); });
    tapOpenEl = null;
  }

  /* ---------------- Cursor-following help text ---------------- */
  function initCursorHelp() {
    var tip = document.getElementById("cursor-help");
    wireFollower(tip, "[data-help]", function (el) {
      tip.textContent = el.getAttribute("data-help");
    });
  }

  /* ---------------- Cursor-following image preview ---------------- */
  function initImagePreview() {
    var box = document.getElementById("img-preview");
    if (!box) return;
    var img = box.querySelector("img");
    wireFollower(box, "[data-preview]", function (el) {
      var src = el.getAttribute("data-preview");
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    });
    // if the image can't load, don't show an empty/broken box
    img.addEventListener("error", function () {
      box.classList.add("is-broken");
    });
  }

  /* ---------------- Modals (generic) ---------------- */
  function closeAllModals() {
    document.querySelectorAll(".c-modal").forEach(function (m) { m.hidden = true; });
    document.body.style.overflow = "";
  }

  function initModals() {
    // openers
    document.querySelectorAll("[data-open-modal]").forEach(function (opener) {
      opener.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(opener.getAttribute("data-open-modal"));
        if (!target) return;
        target.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });

    // close buttons / overlays
    document.querySelectorAll(".c-modal [data-close]").forEach(function (el) {
      el.addEventListener("click", closeAllModals);
    });

    // Escape closes whatever is open
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllModals();
    });
  }

  /* ---------------- Work-in-progress lock ---------------- */
  function initLock() {
    var form = document.getElementById("lock-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (document.getElementById("lock-input").value || "").trim().toLowerCase();
      if (v === "wip") {
        try { localStorage.setItem("tw-unlocked", String(Date.now())); } catch (err) {}
        document.documentElement.classList.remove("is-locked");
      } else {
        var err = document.getElementById("lock-err");
        if (err) err.hidden = false;
      }
    });
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-tab]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        activate(el.getAttribute("data-tab"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    var initial = (location.hash || "").replace("#", "");
    activate(initial || DEFAULT_TAB);

    initLock();
    initTabBar();
    initSeries();
    initCursorHelp();
    initImagePreview();
    initModals();

    // On touch, dismiss an open help/preview when tapping elsewhere
    // (including on the tip itself, which is click-through) or on scroll.
    if (IS_TOUCH) {
      document.addEventListener("click", function () { hideAllFollowers(); });
      window.addEventListener("scroll", hideAllFollowers, { passive: true });
      window.addEventListener("touchmove", hideAllFollowers, { passive: true });
    }
  });
})();
