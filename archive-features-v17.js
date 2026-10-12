/* =========================================================
   LỘC AN — ARCHIVE FEATURES v17
   - ROOM teaser opens only after click.
   - No mutation observers / no polling.
   - Keeps Timeline total-count wording as PAIRS / ĐÔI GIÀY.
========================================================= */
(() => {
  "use strict";

  const COPY = {
    vi: {
      kicker: "ARCHIVE ROOM",
      title: "CĂN PHÒNG",
      text: "Coming soon... Một bất ngờ sẽ tới sớm thôi.",
      close: "ĐÓNG",
      pairs: "ĐÔI GIÀY"
    },
    en: {
      kicker: "ARCHIVE ROOM",
      title: "ROOM",
      text: "Coming soon... A surprise is coming very soon.",
      close: "CLOSE",
      pairs: "PAIRS"
    }
  };

  const lang = () =>
    document.documentElement.lang === "en" ? "en" : "vi";

  const overlay = () =>
    document.getElementById("room-coming-soon-overlay");

  function syncCopy() {
    const t = COPY[lang()];

    const kicker = document.getElementById("room-coming-soon-kicker");
    const title = document.getElementById("room-coming-soon-title");
    const text = document.getElementById("room-coming-soon-text");
    const close = document.getElementById("room-coming-soon-close");
    const countLabel = document.getElementById("timeline-count-label");

    if (kicker) kicker.textContent = t.kicker;
    if (title) title.textContent = t.title;
    if (text) text.textContent = t.text;
    if (close) close.textContent = t.close;
    if (countLabel) countLabel.textContent = t.pairs;
  }

  function openRoom(event) {
    event?.preventDefault();
    syncCopy();

    const node = overlay();
    if (!node) return;

    node.hidden = false;
    node.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      document.getElementById("room-coming-soon-close")?.focus();
    });
  }

  function closeRoom() {
    const node = overlay();
    if (!node) return;

    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", event => {
    const roomLink = event.target.closest("#room-feature-link");
    if (roomLink) {
      openRoom(event);
      return;
    }

    if (event.target.closest("#room-coming-soon-close")) {
      closeRoom();
      return;
    }

    const node = overlay();
    if (node && event.target === node) {
      closeRoom();
      return;
    }

    if (event.target.closest("#btn-vi, #btn-en")) {
      setTimeout(syncCopy, 0);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeRoom();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncCopy, { once: true });
  } else {
    syncCopy();
  }
})();
