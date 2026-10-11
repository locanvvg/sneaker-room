/* =========================================================
   LỘC AN — COLLECTION TIMELINE v1
   Read-only view of the current sneaker catalog.
========================================================= */
(() => {
  "use strict";

  const BUILD =
    "20261011-timeline-v1";

  const BASE_START_YEAR =
    1999;

  const BASE_END_YEAR =
    2026;

  const NORMALIZED_ROOT =
    "pictures/normalized/v4b/";

  const LANGUAGES =
    ["vi", "en"];

  const copy = {
    vi: {
      brandSubtitle:
        "Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số",
      title:
        "DÒNG THỜI GIAN BỘ SƯU TẬP",
      description:
        "Khám phá các hiện vật theo năm phát hành và theo dõi cách bộ sưu tập phát triển qua từng thời kỳ.",
      countLabel:
        "HIỆN VẬT",
      all:
        "TẤT CẢ",
      inCollection:
        "IN COLLECTION",
      formerly:
        "FORMERLY IN COLLECTION",
      guide:
        "KÉO NGANG HOẶC VUỐT ĐỂ KHÁM PHÁ",
      prev:
        "Mốc thời gian trước",
      next:
        "Mốc thời gian tiếp theo",
      timelineAria:
        "Dòng thời gian bộ sưu tập sneaker",
      artifacts:
        count =>
          `${count} HIỆN VẬT`,
      noArtifacts:
        "KHÔNG CÓ HIỆN VẬT",
      undated:
        "KHÔNG XÁC ĐỊNH",
      statusOwn:
        "IN COLLECTION",
      statusSold:
        "FORMERLY IN COLLECTION"
    },

    en: {
      brandSubtitle:
        "Digital Sneaker Archive & Museum",
      title:
        "COLLECTION TIMELINE",
      description:
        "Explore the collection by release year and follow its development across different periods of sneaker history.",
      countLabel:
        "ARTIFACTS",
      all:
        "ALL",
      inCollection:
        "IN COLLECTION",
      formerly:
        "FORMERLY IN COLLECTION",
      guide:
        "DRAG OR SWIPE TO EXPLORE",
      prev:
        "Previous timeline period",
      next:
        "Next timeline period",
      timelineAria:
        "Sneaker collection timeline",
      artifacts:
        count =>
          `${count} ${count === 1 ? "ARTIFACT" : "ARTIFACTS"}`,
      noArtifacts:
        "NO ARTIFACTS",
      undated:
        "UNDATED",
      statusOwn:
        "IN COLLECTION",
      statusSold:
        "FORMERLY IN COLLECTION"
    }
  };

  const state = {
    lang: "vi",
    filter: "all",
    suppressNextArtifactClick: false
  };


  function normalizeLanguage(value) {
    return LANGUAGES.includes(value)
      ? value
      : "vi";
  }


  function initialLanguage() {
    const urlLang =
      new URLSearchParams(
        window.location.search
      ).get("lang");

    if (LANGUAGES.includes(urlLang)) {
      return urlLang;
    }

    try {
      const stored =
        localStorage.getItem(
          "locan_lang"
        );

      if (LANGUAGES.includes(stored)) {
        return stored;
      }
    } catch (_) {}

    return "vi";
  }


  function setStoredLanguage(lang) {
    try {
      localStorage.setItem(
        "locan_lang",
        lang
      );
    } catch (_) {}
  }


  function localized(value) {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }

    if (typeof value === "object") {
      return String(
        value[state.lang] ??
        value.vi ??
        value.en ??
        ""
      );
    }

    return "";
  }


  function setLanguage(
    lang,
    { updateURL = true } = {}
  ) {
    state.lang =
      normalizeLanguage(lang);

    setStoredLanguage(
      state.lang
    );

    document.documentElement.lang =
      state.lang;

    document
      .getElementById("btn-vi")
      ?.classList
      .toggle(
        "active",
        state.lang === "vi"
      );

    document
      .getElementById("btn-en")
      ?.classList
      .toggle(
        "active",
        state.lang === "en"
      );

    if (updateURL) {
      const url =
        new URL(
          window.location.href
        );

      url.searchParams.set(
        "lang",
        state.lang
      );

      window.history.replaceState(
        {},
        "",
        url.pathname +
        url.search +
        url.hash
      );
    }

    updateStaticCopy();
    updateNavigationLinks();
    renderTimeline();
  }


  window.setTimelineLanguage =
    lang => {
      setLanguage(lang);
    };


  function updateNavigationLinks() {
    const suffix =
      `?lang=${encodeURIComponent(
        state.lang
      )}`;

    const links = {
      "timeline-about-link":
        `./about.html${suffix}`,
      "timeline-nav-sneakers":
        `./index.html${suffix}`,
      "timeline-nav-timeline":
        `./timeline.html${suffix}`,
      "timeline-nav-lego":
        `./lego.html${suffix}`,
      "timeline-nav-mask":
        `./sneaker-mask.html${suffix}`
    };

    Object.entries(links)
      .forEach(
        ([id, href]) => {
          const element =
            document.getElementById(id);

          if (element) {
            element.href = href;
          }
        }
      );
  }


  function updateStaticCopy() {
    const t =
      copy[state.lang];

    const brand =
      document.getElementById(
        "timeline-brand-subtitle"
      );

    const title =
      document.getElementById(
        "timeline-title"
      );

    const description =
      document.getElementById(
        "timeline-description"
      );

    const countLabel =
      document.getElementById(
        "timeline-count-label"
      );

    const guide =
      document.getElementById(
        "timeline-guide-text"
      );

    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    const prev =
      document.getElementById(
        "timeline-prev"
      );

    const next =
      document.getElementById(
        "timeline-next"
      );

    if (brand) {
      brand.textContent =
        t.brandSubtitle;
    }

    if (title) {
      title.textContent =
        t.title;
    }

    if (description) {
      description.textContent =
        t.description;
    }

    if (countLabel) {
      countLabel.textContent =
        t.countLabel;
    }

    if (guide) {
      guide.textContent =
        t.guide;
    }

    if (scroll) {
      scroll.setAttribute(
        "aria-label",
        t.timelineAria
      );
    }

    if (prev) {
      prev.setAttribute(
        "aria-label",
        t.prev
      );
    }

    if (next) {
      next.setAttribute(
        "aria-label",
        t.next
      );
    }

    const allButton =
      document.querySelector(
        '[data-timeline-filter="all"]'
      );

    const ownButton =
      document.querySelector(
        '[data-timeline-filter="own"]'
      );

    const soldButton =
      document.querySelector(
        '[data-timeline-filter="sold"]'
      );

    if (allButton) {
      allButton.textContent =
        t.all;
    }

    if (ownButton) {
      ownButton.textContent =
        t.inCollection;
    }

    if (soldButton) {
      soldButton.textContent =
        t.formerly;
    }

    document.title =
      state.lang === "vi"
        ? "Dòng thời gian | Lộc An Sneaker Collection"
        : "Collection Timeline | Lộc An Sneaker Collection";
  }


  function statusOf(item) {
    return String(
      item?.collectionStatus || "own"
    )
      .trim()
      .toLowerCase() === "sold"
        ? "sold"
        : "own";
  }


  function yearOf(item) {
    const value =
      String(
        item?.releaseDate || ""
      );

    const match =
      value.match(
        /\b(19|20)\d{2}\b/
      );

    if (!match) {
      return null;
    }

    const year =
      Number(match[0]);

    return Number.isFinite(year)
      ? year
      : null;
  }


  function dateTimestamp(item) {
    const value =
      String(
        item?.releaseDate || ""
      );

    const timestamp =
      Date.parse(
        value.length === 4
          ? `${value}-01-01T12:00:00`
          : value
      );

    return Number.isFinite(timestamp)
      ? timestamp
      : 0;
  }


  function editionOf(item) {
    return (
      localized(
        item?.editionType
      ) ||
      localized(
        item?.edition
      ) ||
      "—"
    );
  }


  function collectionItems() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return [];
    }

    return sneakers
      .filter(Boolean)
      .filter(item => {
        if (state.filter === "all") {
          return true;
        }

        return (
          statusOf(item) ===
          state.filter
        );
      })
      .sort((a, b) => {
        const yearA =
          yearOf(a) ?? 9999;

        const yearB =
          yearOf(b) ?? 9999;

        if (yearA !== yearB) {
          return yearA - yearB;
        }

        const dateDifference =
          dateTimestamp(a) -
          dateTimestamp(b);

        if (dateDifference) {
          return dateDifference;
        }

        return localized(a.title)
          .localeCompare(
            localized(b.title),
            state.lang === "vi"
              ? "vi"
              : "en"
          );
      });
  }


  function timelineRange(items) {
    const years =
      items
        .map(yearOf)
        .filter(
          year =>
            Number.isInteger(year)
        );

    const start =
      years.length
        ? Math.min(
            BASE_START_YEAR,
            ...years
          )
        : BASE_START_YEAR;

    const end =
      years.length
        ? Math.max(
            BASE_END_YEAR,
            ...years
          )
        : BASE_END_YEAR;

    return { start, end };
  }


  function cleanImagePath(value) {
    return String(value || "")
      .trim()
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "");
  }


  function normalizedImagePath(value) {
    let path =
      cleanImagePath(value);

    if (
      !path ||
      !path.startsWith(
        "pictures/"
      )
    ) {
      return path;
    }

    if (
      path.startsWith(
        NORMALIZED_ROOT
      )
    ) {
      return path;
    }

    let relative =
      path.slice(
        "pictures/".length
      );

    if (
      relative.startsWith(
        "source/"
      )
    ) {
      relative =
        relative.slice(
          "source/".length
        );
    }

    relative =
      relative.replace(
        /\.(png|jpe?g|webp)$/i,
        ".png"
      );

    return (
      NORMALIZED_ROOT +
      relative
    );
  }


  function escapeHTML(value) {
    return String(
      value ?? ""
    )
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function detailURL(item) {
    return (
      `./shoe.html?id=${encodeURIComponent(
        item?.id || ""
      )}` +
      `&lang=${encodeURIComponent(
        state.lang
      )}`
    );
  }


  function artifactCard(item) {
    const status =
      statusOf(item);

    const title =
      localized(item?.title);

    const subtitle =
      localized(item?.subtitle);

    const original =
      cleanImagePath(
        item?.image || ""
      );

    const normalized =
      normalizedImagePath(
        original
      );

    const statusLabel =
      status === "sold"
        ? copy[state.lang]
            .statusSold
        : copy[state.lang]
            .statusOwn;

    const edition =
      editionOf(item);

    const release =
      String(
        item?.releaseDate || ""
      );

    return `
      <a
        class="timeline-artifact ${
          status === "sold"
            ? "is-sold"
            : "is-own"
        }"
        href="${escapeHTML(
          detailURL(item)
        )}"
        data-artifact-id="${escapeHTML(
          item?.id || ""
        )}"
      >
        <div class="timeline-artifact-image">
          <img
            src="${escapeHTML(
              normalized
            )}"
            data-original-src="${escapeHTML(
              original
            )}"
            alt="${escapeHTML(
              title
            )}"
            loading="lazy"
            decoding="async"
            draggable="false"
          >
        </div>

        <div class="timeline-artifact-body">

          <div class="timeline-artifact-status">
            ${escapeHTML(
              statusLabel
            )}
          </div>

          <h3 class="timeline-artifact-title">
            ${escapeHTML(
              title
            )}
          </h3>

          ${
            subtitle
              ? `
                <p class="timeline-artifact-subtitle">
                  ${escapeHTML(
                    subtitle
                  )}
                </p>
              `
              : ""
          }

          <div class="timeline-artifact-meta">

            <span class="timeline-artifact-edition">
              ${escapeHTML(
                edition
              )}
            </span>

            <span>
              ${escapeHTML(
                release &&
                release !== "N/A"
                  ? release
                  : ""
              )}
            </span>

          </div>

        </div>
      </a>
    `;
  }


  function renderTimeline() {
    const track =
      document.getElementById(
        "timeline-track"
      );

    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!track || !scroll) {
      return;
    }

    const items =
      collectionItems();

    const { start, end } =
      timelineRange(items);

    const rangeLabel =
      document.getElementById(
        "timeline-range-label"
      );

    if (rangeLabel) {
      rangeLabel.textContent =
        `${start} — ${end}`;
    }

    const visibleCount =
      document.getElementById(
        "timeline-visible-count"
      );

    if (visibleCount) {
      visibleCount.textContent =
        String(items.length);
    }

    const byYear =
      new Map();

    const undated =
      [];

    items.forEach(item => {
      const year =
        yearOf(item);

      if (!Number.isInteger(year)) {
        undated.push(item);
        return;
      }

      if (!byYear.has(year)) {
        byYear.set(year, []);
      }

      byYear
        .get(year)
        .push(item);
    });

    const t =
      copy[state.lang];

    const years =
      [];

    for (
      let year = start;
      year <= end;
      year += 1
    ) {
      const yearItems =
        byYear.get(year) || [];

      years.push(`
        <section
          class="timeline-year ${
            yearItems.length
              ? "has-artifacts"
              : "is-empty"
          }"
          data-year="${year}"
          aria-label="${year}"
        >

          <div class="timeline-year-header">

            <div class="timeline-year-label">
              ${year}
            </div>

            <span class="timeline-year-count">
              ${
                yearItems.length
                  ? escapeHTML(
                      t.artifacts(
                        yearItems.length
                      )
                    )
                  : escapeHTML(
                      t.noArtifacts
                    )
              }
            </span>

            <span
              class="timeline-year-dot"
              aria-hidden="true"
            ></span>

          </div>

          <div class="timeline-year-items">

            ${
              yearItems.length
                ? yearItems
                    .map(
                      artifactCard
                    )
                    .join("")
                : `
                    <span class="timeline-year-empty">
                      —
                    </span>
                  `
            }

          </div>

        </section>
      `);
    }

    if (undated.length) {
      years.push(`
        <section
          class="timeline-year has-artifacts"
          data-year="undated"
        >

          <div class="timeline-year-header">

            <div class="timeline-year-label">
              ${escapeHTML(
                t.undated
              )}
            </div>

            <span class="timeline-year-count">
              ${escapeHTML(
                t.artifacts(
                  undated.length
                )
              )}
            </span>

            <span
              class="timeline-year-dot"
              aria-hidden="true"
            ></span>

          </div>

          <div class="timeline-year-items">

            ${undated
              .map(
                artifactCard
              )
              .join("")}

          </div>

        </section>
      `);
    }

    track.innerHTML =
      years.join("");

    track
      .querySelectorAll(
        ".timeline-artifact-image img"
      )
      .forEach(img => {
        img.addEventListener(
          "error",
          () => {
            const original =
              cleanImagePath(
                img.dataset
                  .originalSrc
              );

            if (
              original &&
              cleanImagePath(
                img.getAttribute(
                  "src"
                )
              ) !== original
            ) {
              img.src =
                original;
            }
          },
          { once: true }
        );
      });

    updateProgress();

    document
      .querySelectorAll(
        ".timeline-filter"
      )
      .forEach(button => {
        const active =
          button.dataset
            .timelineFilter ===
          state.filter;

        button.classList.toggle(
          "active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          String(active)
        );
      });
  }


  function installFilters() {
    document
      .querySelectorAll(
        "[data-timeline-filter]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            const value =
              button.dataset
                .timelineFilter;

            if (
              ![
                "all",
                "own",
                "sold"
              ].includes(value)
            ) {
              return;
            }

            state.filter =
              value;

            renderTimeline();

            const scroll =
              document.getElementById(
                "timeline-scroll"
              );

            if (scroll) {
              scroll.scrollTo({
                left: 0,
                behavior:
                  window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                  ).matches
                    ? "auto"
                    : "smooth"
              });
            }
          }
        );
      });
  }


  function scrollStep() {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!scroll) {
      return 260;
    }

    return Math.max(
      220,
      Math.min(
        620,
        scroll.clientWidth * .78
      )
    );
  }


  function scrollByDirection(
    direction
  ) {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!scroll) {
      return;
    }

    scroll.scrollBy({
      left:
        direction *
        scrollStep(),
      behavior:
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
    });
  }


  function updateProgress() {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    const bar =
      document.getElementById(
        "timeline-progress-bar"
      );

    if (!scroll || !bar) {
      return;
    }

    const max =
      Math.max(
        0,
        scroll.scrollWidth -
        scroll.clientWidth
      );

    const fraction =
      max > 0
        ? scroll.scrollLeft / max
        : 0;

    bar.style.width =
      `${Math.max(
        0,
        Math.min(
          1,
          fraction
        )
      ) * 100}%`;
  }


  function installNavigation() {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!scroll) {
      return;
    }

    document
      .getElementById(
        "timeline-prev"
      )
      ?.addEventListener(
        "click",
        () =>
          scrollByDirection(-1)
      );

    document
      .getElementById(
        "timeline-next"
      )
      ?.addEventListener(
        "click",
        () =>
          scrollByDirection(1)
      );

    scroll.addEventListener(
      "scroll",
      updateProgress,
      { passive: true }
    );

    scroll.addEventListener(
      "keydown",
      event => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollByDirection(-1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollByDirection(1);
        }

        if (event.key === "Home") {
          event.preventDefault();
          scroll.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        }

        if (event.key === "End") {
          event.preventDefault();
          scroll.scrollTo({
            left:
              scroll.scrollWidth,
            behavior: "smooth"
          });
        }
      }
    );
  }


  function installDesktopDrag() {
    const scroll =
      document.getElementById(
        "timeline-scroll"
      );

    if (!scroll) {
      return;
    }

    let dragging =
      false;

    let startX =
      0;

    let startLeft =
      0;

    let moved =
      false;

    scroll.addEventListener(
      "pointerdown",
      event => {
        if (
          event.pointerType !==
          "mouse"
        ) {
          return;
        }

        dragging =
          true;

        moved =
          false;

        startX =
          event.clientX;

        startLeft =
          scroll.scrollLeft;

        scroll.classList.add(
          "is-dragging"
        );

        scroll.setPointerCapture(
          event.pointerId
        );
      }
    );

    scroll.addEventListener(
      "pointermove",
      event => {
        if (!dragging) {
          return;
        }

        const delta =
          event.clientX -
          startX;

        if (Math.abs(delta) > 6) {
          moved = true;
        }

        scroll.scrollLeft =
          startLeft -
          delta;
      }
    );

    const finish =
      event => {
        if (!dragging) {
          return;
        }

        dragging = false;

        scroll.classList.remove(
          "is-dragging"
        );

        try {
          scroll.releasePointerCapture(
            event.pointerId
          );
        } catch (_) {}

        if (moved) {
          state
            .suppressNextArtifactClick =
              true;

          setTimeout(
            () => {
              state
                .suppressNextArtifactClick =
                  false;
            },
            0
          );
        }
      };

    scroll.addEventListener(
      "pointerup",
      finish
    );

    scroll.addEventListener(
      "pointercancel",
      finish
    );

    scroll.addEventListener(
      "click",
      event => {
        if (
          !state
            .suppressNextArtifactClick
        ) {
          return;
        }

        if (
          event.target.closest(
            ".timeline-artifact"
          )
        ) {
          event.preventDefault();
          event.stopPropagation();

          state
            .suppressNextArtifactClick =
              false;
        }
      },
      true
    );
  }


  function init() {
    state.lang =
      initialLanguage();

    updateStaticCopy();
    updateNavigationLinks();

    installFilters();
    installNavigation();
    installDesktopDrag();

    renderTimeline();

    requestAnimationFrame(
      () => {
        renderTimeline();
        updateProgress();
      }
    );

    window.addEventListener(
      "resize",
      updateProgress,
      { passive: true }
    );

    document.body.dataset
      .timelineBuild =
        BUILD;
  }


  state.lang =
    initialLanguage();

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
