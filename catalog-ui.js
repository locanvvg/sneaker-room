/* =========================================================
   LỘC AN — AUTO FILTER UI v1

   - Edition filters generated from sneaker data.
   - Condition filters generated from sneaker data.
   - Size filters generated from sneaker data.
   - New categories can appear without editing index.html.
   ========================================================= */

(() => {
  "use strict";

  if (!window.CatalogEngine) {
    console.warn(
      "[Catalog UI] CatalogEngine is not loaded."
    );

    return;
  }

  function escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function editionCategories(item) {
    return new Set(
      CatalogEngine.getCategories(item)
    );
  }

  function conditionCategory(item) {
    return CatalogEngine.getCondition(item);
  }

  /*
    Replace the original hard-coded helpers in main.js.
  */
  if (
    typeof getEditionCategories ===
    "function"
  ) {
    getEditionCategories =
      editionCategories;
  }

  if (
    typeof getConditionCategory ===
    "function"
  ) {
    getConditionCategory =
      conditionCategory;
  }

  /*
    Replace filtering so size filters also support
    12W/10.5M, 9.5W/8M, etc.
  */
  if (
    typeof filterSneakers ===
    "function"
  ) {
    filterSneakers =
      function catalogFilterSneakers(items) {
        return items.filter(sneaker => {
          if (
            activeFilters.edition.size > 0
          ) {
            const categories =
              editionCategories(sneaker);

            const matches =
              [...activeFilters.edition]
                .some(value =>
                  categories.has(value)
                );

            if (!matches) {
              return false;
            }
          }

          if (
            activeFilters.condition.size > 0
          ) {
            const condition =
              conditionCategory(sneaker);

            if (
              !activeFilters.condition.has(
                condition
              )
            ) {
              return false;
            }
          }

          if (
            activeFilters.size.size > 0
          ) {
            const tokens =
              new Set(
                CatalogEngine
                  .getSizeTokens(sneaker)
              );

            const matches =
              [...activeFilters.size]
                .some(value =>
                  tokens.has(value)
                );

            if (!matches) {
              return false;
            }
          }

          return true;
        });
      };
  }

  function sortSizeToken(value) {
    const text =
      String(value);

    const number =
      Number.parseFloat(text);

    const suffix =
      text.replace(
        /^[\d.]+/,
        ""
      );

    const suffixRank =
      suffix === "M"
        ? 0
        : suffix === "W"
          ? 1
          : 2;

    return {
      number:
        Number.isFinite(number)
          ? number
          : 999,
      suffixRank,
      text
    };
  }

  function allSizeTokens() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return [];
    }

    const set =
      new Set();

    sneakers.forEach(item => {
      CatalogEngine
        .getSizeTokens(item)
        .forEach(value =>
          set.add(value)
        );
    });

    return [...set]
      .sort((a, b) => {
        const A =
          sortSizeToken(a);

        const B =
          sortSizeToken(b);

        return (
          A.number - B.number ||
          A.suffixRank - B.suffixRank ||
          A.text.localeCompare(B.text)
        );
      });
  }

  function sizeLabel(value) {
    if (/[WM]$/i.test(value)) {
      return value.toUpperCase();
    }

    return `${value} US`;
  }

  if (
    typeof renderSizeFilters ===
    "function"
  ) {
    renderSizeFilters =
      function renderCatalogSizeFilters() {
        const container =
          document.getElementById(
            "size-filter-chips"
          );

        if (!container) return;

        container.innerHTML =
          allSizeTokens()
            .map(value => `
              <button
                type="button"
                class="filter-chip"
                data-group="size"
                data-value="${escape(value)}"
                onclick="toggleFilter('size', '${escape(value)}')"
              >
                ${escape(sizeLabel(value))}
              </button>
            `)
            .join("");
      };
  }

  function renderEditionFilters() {
    const label =
      document.getElementById(
        "edition-filter-label"
      );

    const group =
      label?.closest(
        ".filter-group"
      );

    const container =
      group?.querySelector(
        ".filter-chips"
      );

    if (!container) return;

    const categories =
      CatalogEngine
        .getAllCategories();

    container.innerHTML =
      categories
        .map(value => `
          <button
            type="button"
            class="filter-chip"
            data-group="edition"
            data-value="${escape(value)}"
            onclick="toggleFilter('edition', '${escape(value)}')"
          >
            ${escape(value.toUpperCase())}
          </button>
        `)
        .join("");
  }

  function renderConditionFilters() {
    const label =
      document.getElementById(
        "condition-filter-label"
      );

    const group =
      label?.closest(
        ".filter-group"
      );

    const container =
      group?.querySelector(
        ".filter-chips"
      );

    if (!container) return;

    const available =
      new Set();

    if (
      typeof sneakers !== "undefined" &&
      Array.isArray(sneakers)
    ) {
      sneakers.forEach(item => {
        const condition =
          CatalogEngine
            .getCondition(item);

        if (condition) {
          available.add(condition);
        }
      });
    }

    const order =
      ["Deadstock", "Used"];

    const values =
      [
        ...order.filter(value =>
          available.has(value)
        ),
        ...[...available]
          .filter(value =>
            !order.includes(value)
          )
      ];

    container.innerHTML =
      values
        .map(value => `
          <button
            type="button"
            class="filter-chip"
            data-group="condition"
            data-value="${escape(value)}"
            onclick="toggleFilter('condition', '${escape(value)}')"
          >
            ${escape(value.toUpperCase())}
          </button>
        `)
        .join("");
  }

  function renderAllCatalogFilters() {
    renderEditionFilters();
    renderConditionFilters();

    if (
      typeof renderSizeFilters ===
      "function"
    ) {
      renderSizeFilters();
    }

    if (
      typeof updateFilterInterface ===
      "function"
    ) {
      updateFilterInterface();
    }
  }

  window.renderAllCatalogFilters =
    renderAllCatalogFilters;

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      renderAllCatalogFilters,
      {
        once: true
      }
    );
  } else {
    renderAllCatalogFilters();
  }

  console.info(
    "Lộc An auto filter UI v1 loaded"
  );
})();
