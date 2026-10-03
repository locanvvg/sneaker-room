/* =========================================================
   LỘC AN — ITEM SHARE BUTTON v1
   Shared by Sneaker / LEGO / Sneaker Mask detail pages.
   - Native share sheet when supported.
   - Clipboard fallback on desktop/unsupported browsers.
   - Shares the exact item URL + current language.
========================================================= */
(() => {
  "use strict";

  const STYLE_ID = "locan-item-share-style-v1";
  const BUTTON_CLASS = "locan-item-share-button";
  let observerQueued = false;

  const text = () => {
    const lang = String(document.documentElement.lang || "").toLowerCase().startsWith("en")
      ? "en"
      : "vi";

    return lang === "en"
      ? {
          share: "SHARE",
          copied: "LINK COPIED",
          aria: "Share this item",
          sentence: title => `View ${title} in the Lộc An Collection.`
        }
      : {
          share: "CHIA SẺ",
          copied: "ĐÃ SAO CHÉP LINK",
          aria: "Chia sẻ hiện vật này",
          sentence: title => `Xem ${title} trong Bộ sưu tập Lộc An.`
        };
  };

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${BUTTON_CLASS} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 38px;
        margin: 2px 0 18px;
        padding: 9px 13px;
        color: #a7a7ad;
        background: rgba(255,255,255,.028);
        border: 1px solid rgba(255,255,255,.11);
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
        font-size: .66rem;
        font-weight: 900;
        letter-spacing: .9px;
        line-height: 1;
        transition:
          color .18s ease,
          border-color .18s ease,
          background .18s ease,
          transform .18s ease;
      }

      .${BUTTON_CLASS}:hover,
      .${BUTTON_CLASS}:focus-visible {
        color: #ffcc00;
        border-color: rgba(255,204,0,.40);
        background: rgba(255,204,0,.05);
        outline: none;
      }

      .${BUTTON_CLASS}:active {
        transform: scale(.98);
      }

      .${BUTTON_CLASS}.is-copied {
        color: #ffcc00;
        border-color: rgba(255,204,0,.38);
      }

      .${BUTTON_CLASS} svg {
        width: 15px;
        height: 15px;
        flex: 0 0 auto;
        stroke: currentColor;
      }

      @media (max-width: 650px) {
        .${BUTTON_CLASS} {
          min-height: 40px;
          margin-bottom: 16px;
          padding: 10px 13px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function itemTitle(section) {
    return (
      document.getElementById("shoe-title")?.textContent?.trim() ||
      section?.querySelector("h2")?.textContent?.trim() ||
      document.title.split("|")[0].trim() ||
      "Lộc An Collection"
    );
  }

  function exactShareURL() {
    const url = new URL(window.location.href);
    url.hash = "";

    const lang = String(document.documentElement.lang || "").toLowerCase().startsWith("en")
      ? "en"
      : "vi";

    if (url.searchParams.has("id")) {
      url.searchParams.set("lang", lang);
    }

    return url.href;
  }

  async function copyURL(url) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function setButtonText(button, value) {
    const label = button.querySelector(".locan-item-share-label");
    if (label) label.textContent = value;
  }

  async function shareItem(button, title) {
    const t = text();
    const url = exactShareURL();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: t.sentence(title),
          url
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await copyURL(url);
      button.classList.add("is-copied");
      setButtonText(button, t.copied);

      window.setTimeout(() => {
        button.classList.remove("is-copied");
        setButtonText(button, text().share);
      }, 1800);
    } catch (_) {
      window.prompt(
        document.documentElement.lang === "en"
          ? "Copy this link:"
          : "Sao chép liên kết này:",
        url
      );
    }
  }

  function createButton(section) {
    const t = text();
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.setAttribute("aria-label", t.aria);
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 16V4" stroke-width="1.9" stroke-linecap="round"/>
        <path d="M7.5 8.5 12 4l4.5 4.5" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 12.5H4.8A1.8 1.8 0 0 0 3 14.3v4.9A1.8 1.8 0 0 0 4.8 21h14.4a1.8 1.8 0 0 0 1.8-1.8v-4.9a1.8 1.8 0 0 0-1.8-1.8H18" stroke-width="1.9" stroke-linecap="round"/>
      </svg>
      <span class="locan-item-share-label">${t.share}</span>
    `;

    button.addEventListener("click", () => {
      shareItem(button, itemTitle(section));
    });

    return button;
  }

  function syncButton() {
    installStyles();

    const section = document.querySelector(".shoe-info-section");
    if (!section) return;

    let button = section.querySelector(`.${BUTTON_CLASS}`);

    if (!button) {
      button = createButton(section);
      const subtitle = section.querySelector(".detail-subtitle, .subtitle");

      if (subtitle) {
        subtitle.insertAdjacentElement("afterend", button);
      } else {
        const heading = section.querySelector("h2");
        if (heading) heading.insertAdjacentElement("afterend", button);
        else section.prepend(button);
      }
    }

    const t = text();
    button.setAttribute("aria-label", t.aria);

    if (!button.classList.contains("is-copied")) {
      setButtonText(button, t.share);
    }
  }

  function scheduleSync() {
    if (observerQueued) return;
    observerQueued = true;

    requestAnimationFrame(() => {
      observerQueued = false;
      syncButton();
    });
  }

  function install() {
    syncButton();

    const observer = new MutationObserver(scheduleSync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "lang"]
    });

    document.addEventListener("click", event => {
      if (event.target.closest("#btn-vi, #btn-en, .lang-btn")) {
        setTimeout(syncButton, 0);
        setTimeout(syncButton, 80);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
