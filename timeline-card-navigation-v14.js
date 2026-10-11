/* =========================================================
   LỘC AN — TIMELINE CARD NAVIGATION v14

   Exact scope:
   - A real click/tap on a Timeline artifact opens that shoe's
     existing detail page.
   - Horizontal drag/swipe remains drag/swipe and does not open a card.
   - Modifier clicks keep normal browser behavior.
========================================================= */
(() => {
  "use strict";

  function installTimelineCardNavigation() {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!scroll) {
      return;
    }

    /*
      Existing timeline.js already suppresses the click generated after
      a desktop drag in the capture phase. This listener runs in bubble
      phase, so it only receives a genuine click/tap.
    */
    scroll.addEventListener(
      "click",
      event => {
        const card =
          event.target.closest(
            ".timeline-artifact"
          );

        if (!card) {
          return;
        }

        /*
          Preserve standard browser behavior for:
          Cmd/Ctrl-click, Shift-click, Alt-click, middle-click.
        */
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }

        const href =
          card.getAttribute(
            "href"
          );

        if (!href) {
          return;
        }

        event.preventDefault();

        window.location.assign(
          href
        );
      },
      false
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      installTimelineCardNavigation,
      { once: true }
    );
  } else {
    installTimelineCardNavigation();
  }
})();
