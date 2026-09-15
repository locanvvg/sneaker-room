/* =========================================================
   LỘC AN — LANGUAGE NAVIGATION SYNC v16

   Purpose:
   - VI/EN must survive navigation between:
     Sneakers / LEGO / Sneaker Mask / About
   - Explicit ?lang= in URL always wins over stale localStorage.
   - Clicking VI/EN immediately updates localStorage.
   - Internal navigation links always carry the current language.

   This file does NOT translate page content by itself.
   It only keeps language state synchronized across pages.
   ========================================================= */

(() => {
  "use strict";

  const LANG_KEY = "locan_lang";
  const VALID = new Set(["vi", "en"]);

  function queryLanguage() {
    const value =
      new URLSearchParams(
        window.location.search
      ).get("lang");

    return VALID.has(value)
      ? value
      : null;
  }

  function storedLanguage() {
    const value =
      localStorage.getItem(
        LANG_KEY
      );

    return VALID.has(value)
      ? value
      : null;
  }

  function currentLanguage() {
    /*
      Explicit URL language has highest priority.
      This fixes the old situation where stored EN could override ?lang=vi.
    */
    return (
      queryLanguage()
      ||
      storedLanguage()
      ||
      (
        document.documentElement.lang === "en"
          ? "en"
          : "vi"
      )
    );
  }

  function saveLanguage(lang) {
    if (!VALID.has(lang)) {
      return;
    }

    localStorage.setItem(
      LANG_KEY,
      lang
    );
  }

  function isCollectionPageURL(url) {
    if (
      url.origin !==
      window.location.origin
    ) {
      return false;
    }

    const path =
      url.pathname;

    return (
      path.endsWith("/sneaker-room/")
      ||
      path.endsWith("/sneaker-room/index.html")
      ||
      path.endsWith("/sneaker-room/lego.html")
      ||
      path.endsWith("/sneaker-room/sneaker-mask.html")
      ||
      path.endsWith("/sneaker-room/about.html")
    );
  }

  function syncInternalLinks(lang) {
    if (!VALID.has(lang)) {
      return;
    }

    document
      .querySelectorAll("a[href]")
      .forEach(link => {
        let url;

        try {
          url = new URL(
            link.getAttribute("href"),
            window.location.href
          );
        } catch (_) {
          return;
        }

        if (!isCollectionPageURL(url)) {
          return;
        }

        url.searchParams.set(
          "lang",
          lang
        );

        /*
          Keep links relative for GitHub Pages.
        */
        const file =
          url.pathname.endsWith("/sneaker-room/")
            ? "./index.html"
            : "./" + url.pathname.split("/").pop();

        link.setAttribute(
          "href",
          file
          +
          url.search
          +
          url.hash
        );
      });
  }

  function synchronize(lang) {
    if (!VALID.has(lang)) {
      return;
    }

    saveLanguage(lang);
    syncInternalLinks(lang);
  }

  /*
    Run immediately, BEFORE later localization scripts whenever possible.
    If URL has ?lang=vi, localStorage is corrected to vi immediately.
  */
  synchronize(
    currentLanguage()
  );

  /*
    Language buttons:
    capture phase means storage changes immediately even if the page's
    own onclick/setLanguage handler runs later in the same click.
  */
  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "#btn-vi, #btn-en"
        );

      if (button) {
        const lang =
          button.id === "btn-en"
            ? "en"
            : "vi";

        synchronize(lang);

        /*
          The page's own language function updates text afterward.
          Re-sync links on the next frame using the newly saved language.
        */
        requestAnimationFrame(
          () => {
            syncInternalLinks(lang);
          }
        );

        return;
      }

      /*
        Just before navigating through an internal collection link,
        force the latest stored language into that destination URL.
      */
      const link =
        event.target.closest(
          "a[href]"
        );

      if (!link) {
        return;
      }

      let url;

      try {
        url = new URL(
          link.href,
          window.location.href
        );
      } catch (_) {
        return;
      }

      if (!isCollectionPageURL(url)) {
        return;
      }

      const lang =
        currentLanguage();

      saveLanguage(lang);

      url.searchParams.set(
        "lang",
        lang
      );

      link.href =
        url.href;
    },
    true
  );

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      synchronize(
        currentLanguage()
      );
    }
  );

  /*
    If another page script updates localStorage after load,
    keep the visible navigation URLs synchronized.
  */
  window.addEventListener(
    "storage",
    event => {
      if (
        event.key === LANG_KEY
        &&
        VALID.has(event.newValue)
      ) {
        syncInternalLinks(
          event.newValue
        );
      }
    }
  );

  window.LocAnLanguageSync = {
    get:
      currentLanguage,

    set:
      synchronize,

    refreshLinks() {
      syncInternalLinks(
        currentLanguage()
      );
    }
  };
})();
