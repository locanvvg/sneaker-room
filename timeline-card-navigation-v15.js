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

/* =========================================================
   LỘC AN — TIMELINE VISUAL FIT PATCH (2026-11)
   Retain existing card navigation and timeline rendering.
   Each visible transparent sneaker image is cropped to its
   actual alpha bounds, then fit to the same centered viewport.
   No changes to the catalog, status, or sneaker images on disk.
========================================================= */
(() => {
  "use strict";

  function install() {
    const track = document.getElementById("timeline-track") ||
      document.getElementById("timeline-scroll");
    if (!track) return;

    const style = document.createElement("style");
    style.id = "locan-timeline-visual-fit-202611";
    style.textContent = `
      .timeline-artifact-image {
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        overflow:hidden !important;
      }
      .timeline-artifact-image img {
        display:block !important;
        width:100% !important;
        height:100% !important;
        max-width:100% !important;
        max-height:100% !important;
        object-fit:contain !important;
        object-position:center center !important;
        transform:none !important;
        margin:0 auto !important;
        pointer-events:none !important;
      }
    `;
    document.head.appendChild(style);

    function normalizeImage(img) {
      if (!img.isConnected || img.dataset.locanFitDone === "1") return;
      if (!img.complete || !img.naturalWidth || !img.naturalHeight) return;
      img.dataset.locanFitDone = "1";
      try {
        const maxSide = 600;
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const source = document.createElement("canvas");
        source.width = w;
        source.height = h;
        const ctx = source.getContext("2d", { willReadFrequently:true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const pixels = ctx.getImageData(0, 0, w, h).data;
        let minX = w, minY = h, maxX = -1, maxY = -1, visible = 0;
        for (let y = 0; y < h; y += 2) {
          for (let x = 0; x < w; x += 2) {
            const alpha = pixels[(y * w + x) * 4 + 3];
            if (alpha <= 18) continue;
            visible++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
        const coverage = visible / (Math.ceil(w / 2) * Math.ceil(h / 2));
        // Keep opaque images untouched. Trim only true transparent padding.
        if (maxX < 0 || coverage > .96) return;
        let boxW = maxX - minX + 2, boxH = maxY - minY + 2;
        if (boxW < 8 || boxH < 8) return;
        const pad = Math.ceil(Math.max(boxW,boxH) * .035);
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(w, maxX + 2 + pad);
        maxY = Math.min(h, maxY + 2 + pad);
        boxW = maxX - minX;
        boxH = maxY - minY;
        const cropped = document.createElement("canvas");
        cropped.width = boxW;
        cropped.height = boxH;
        const dst = cropped.getContext("2d");
        if (!dst) return;
        dst.drawImage(source, minX, minY, boxW, boxH, 0, 0, boxW, boxH);
        // A small data URL is acceptable because only visible cards are processed.
        img.src = cropped.toDataURL("image/png");
      } catch (err) {
        // A nontransparent or cross-origin image retains the existing fallback.
        console.debug("[Loc An] Timeline original image retained", err);
      }
    }

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              observeLoad(entry.target);
            }
          }
        }, { root:document.getElementById("timeline-scroll"), rootMargin:"70px 320px" })
      : null;

    function observeLoad(img) {
      if (img.dataset.locanFitObserved === "1") return;
      img.dataset.locanFitObserved = "1";
      if (img.complete && img.naturalWidth) normalizeImage(img);
      else img.addEventListener("load", () => normalizeImage(img), { once:true });
    }

    function scan() {
      track.querySelectorAll(".timeline-artifact-image img").forEach(img => {
        if (img.dataset.locanFitObserved === "1") return;
        if (observer) observer.observe(img);
        else observeLoad(img);
      });
    }

    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(track, { childList:true, subtree:true });
    scan();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once:true });
  } else {
    install();
  }
})();
