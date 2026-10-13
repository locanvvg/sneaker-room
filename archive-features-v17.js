/* =========================================================
   LỘC AN — ARCHIVE FEATURES v19
   Shared Timeline / World Map / Museum Mode / Room behavior.

   - ROOM opens only after click.
   - Adds MUSEUM MODE to existing archive feature rows.
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
      pairs: "ĐÔI GIÀY",
      museum: "TRÌNH CHIẾU"
    },
    en: {
      kicker: "ARCHIVE ROOM",
      title: "ROOM",
      text: "Coming soon... A surprise is coming very soon.",
      close: "CLOSE",
      pairs: "PAIRS",
      museum: "MUSEUM MODE"
    }
  };

  const lang = () =>
    document.documentElement.lang === "en" ? "en" : "vi";

  const overlay = () =>
    document.getElementById("room-coming-soon-overlay");

  function ensureMuseumLink() {
    const nav = document.querySelector(".archive-feature-nav");
    if (!nav) return null;

    let link = document.getElementById("museum-mode-feature-link");
    if (link) return link;

    link = document.createElement("a");
    link.id = "museum-mode-feature-link";
    link.className = "archive-feature-link";
    link.href = "./museum.html";

    const vi = document.createElement("span");
    vi.className = "archive-copy-vi";
    vi.textContent = "TRÌNH CHIẾU";

    const en = document.createElement("span");
    en.className = "archive-copy-en";
    en.textContent = "MUSEUM MODE";

    link.append(vi, en);

    const roomLink = document.getElementById("room-feature-link");
    nav.insertBefore(link, roomLink || null);

    return link;
  }

  function syncMuseumLink() {
    const link = ensureMuseumLink();
    if (!link) return;

    const t = COPY[lang()];
    const vi = link.querySelector(".archive-copy-vi");
    const en = link.querySelector(".archive-copy-en");

    if (vi) vi.textContent = "TRÌNH CHIẾU";
    if (en) en.textContent = "MUSEUM MODE";

    link.href = `./museum.html?lang=${encodeURIComponent(lang())}`;
    link.setAttribute(
      "aria-label",
      lang() === "vi" ? "Mở chế độ trình chiếu bảo tàng" : "Open Museum Mode"
    );

    void t;
  }

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

    syncMuseumLink();
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
