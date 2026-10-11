/* =========================================================
   LỘC AN — TIMELINE CARD NAVIGATION v15

   Root fix for desktop pointer capture:
   - timeline.js captures the mouse pointer on the horizontal scroller.
   - That can move the eventual click target away from the <a> card.
   - We remember the card from pointerdown BEFORE capture changes target.
   - If pointerup happens without a real horizontal drag, navigate to
     that remembered card's href directly.
   - If the user dragged, do nothing.
========================================================= */
(() => {
  "use strict";

  const MOVE_THRESHOLD =
    7;

  function install() {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!scroll) {
      return;
    }

    let activePointerId =
      null;

    let pendingCard =
      null;

    let startX =
      0;

    let startY =
      0;

    let moved =
      false;

    let plainLeftMouse =
      false;


    /*
      Capture phase is intentional:
      event.target is still the actual card/child before
      timeline.js applies pointer capture to the scroller.
    */
    scroll.addEventListener(
      "pointerdown",
      event => {
        if (
          event.pointerType !==
          "mouse"
        ) {
          return;
        }

        activePointerId =
          event.pointerId;

        pendingCard =
          event.target.closest(
            ".timeline-artifact"
          );

        startX =
          event.clientX;

        startY =
          event.clientY;

        moved =
          false;

        plainLeftMouse =
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey;
      },
      true
    );


    scroll.addEventListener(
      "pointermove",
      event => {
        if (
          event.pointerType !== "mouse" ||
          event.pointerId !== activePointerId
        ) {
          return;
        }

        const dx =
          event.clientX -
          startX;

        const dy =
          event.clientY -
          startY;

        if (
          Math.hypot(dx, dy) >
          MOVE_THRESHOLD
        ) {
          moved = true;
        }
      },
      true
    );


    /*
      Bubble phase is intentional:
      timeline.js's own pointerup handler was registered earlier,
      so it gets to finish/release its drag state first.
    */
    scroll.addEventListener(
      "pointerup",
      event => {
        if (
          event.pointerType !== "mouse" ||
          event.pointerId !== activePointerId
        ) {
          return;
        }

        const card =
          pendingCard;

        const shouldOpen =
          Boolean(card) &&
          !moved &&
          plainLeftMouse;

        activePointerId =
          null;

        pendingCard =
          null;

        plainLeftMouse =
          false;

        if (!shouldOpen) {
          return;
        }

        const href =
          card.getAttribute(
            "href"
          );

        if (!href) {
          return;
        }

        /*
          Direct navigation avoids the lost-click problem caused
          by pointer capture. The card's existing URL already includes
          the correct shoe id and current VI/EN language.
        */
        window.location.assign(
          href
        );
      },
      false
    );


    scroll.addEventListener(
      "pointercancel",
      event => {
        if (
          event.pointerId !==
          activePointerId
        ) {
          return;
        }

        activePointerId =
          null;

        pendingCard =
          null;

        moved =
          false;

        plainLeftMouse =
          false;
      },
      true
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }
})();
