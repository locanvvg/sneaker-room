/* LỘC AN — ARCHIVE SEARCH — 2026-09-17 */
(() => {
  "use strict";

  let archiveSearchQuery = "";
  let archiveSearchTimer = null;

  const normalizeArchiveSearchText = value =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const flattenArchiveSearchValue = value => {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(flattenArchiveSearchValue).join(" ");
    if (typeof value === "object") return Object.values(value).map(flattenArchiveSearchValue).join(" ");
    return "";
  };

  const getSneakerArchiveSearchText = sneaker => {
    const fields = [
      sneaker.title,
      sneaker.subtitle,
      sneaker.brand,
      sneaker.collaboration,
      sneaker.sku,
      sneaker.styleCode,
      sneaker.colorway,
      sneaker.editionType,
      sneaker.condition,
      sneaker.size,
      sneaker.releaseDate,
      sneaker.retail,
      sneaker.retailPrice
    ];

    return normalizeArchiveSearchText(
      fields.map(flattenArchiveSearchValue).join(" ")
    );
  };

  if (typeof filterSneakers === "function") {
    const originalFilterSneakers = filterSneakers;

    filterSneakers = function(items) {
      const filtered = originalFilterSneakers(items);
      const query = normalizeArchiveSearchText(archiveSearchQuery);

      if (!query) return filtered;

      const terms = query.split(/\s+/).filter(Boolean);

      return filtered.filter(sneaker => {
        const searchableText = getSneakerArchiveSearchText(sneaker);
        return terms.every(term => searchableText.includes(term));
      });
    };
  }

  function updateArchiveSearchUI() {
    const clearButton = document.getElementById("archive-search-clear");
    if (clearButton) {
      clearButton.classList.toggle("visible", archiveSearchQuery.trim().length > 0);
    }

    const label = document.getElementById("archive-search-label");
    const input = document.getElementById("archive-search-input");
    const vi = typeof currentLang === "undefined" || currentLang === "vi";

    if (label) label.textContent = vi ? "TÌM KIẾM" : "SEARCH";

    if (input) {
      input.placeholder = vi ? "Tìm kiếm..." : "Search...";
      input.setAttribute("aria-label", vi ? "Tìm kiếm bộ sưu tập" : "Search collection");
    }

    if (clearButton) {
      clearButton.setAttribute("aria-label", vi ? "Xóa tìm kiếm" : "Clear search");
    }
  }

  window.handleArchiveSearch = function(value) {
    archiveSearchQuery = value;
    updateArchiveSearchUI();

    clearTimeout(archiveSearchTimer);
    archiveSearchTimer = setTimeout(() => {
      if (typeof renderGrid === "function") renderGrid();
    }, 70);
  };

  window.clearArchiveSearch = function() {
    archiveSearchQuery = "";
    clearTimeout(archiveSearchTimer);

    const input = document.getElementById("archive-search-input");
    if (input) {
      input.value = "";
      input.focus();
    }

    updateArchiveSearchUI();
    if (typeof renderGrid === "function") renderGrid();
  };

  window.handleArchiveSearchKeydown = function(event) {
    if (event.key === "Escape") window.clearArchiveSearch();
  };

  if (typeof updateStaticText === "function") {
    const originalUpdateStaticText = updateStaticText;

    updateStaticText = function() {
      originalUpdateStaticText();
      updateArchiveSearchUI();
    };
  }

  if (typeof updateCollectionCount === "function") {
    const originalUpdateCollectionCount = updateCollectionCount;

    updateCollectionCount = function(count) {
      const element = document.getElementById("collection-count");

      if (
        !element ||
        typeof sneakers === "undefined" ||
        !Array.isArray(sneakers)
      ) {
        originalUpdateCollectionCount(count);
        return;
      }

      const total = sneakers.length;
      const searchIsActive = archiveSearchQuery.trim().length > 0;
      const filtersAreActive =
        typeof activeFilters !== "undefined" &&
        (
          activeFilters.edition?.size > 0 ||
          activeFilters.condition?.size > 0 ||
          activeFilters.size?.size > 0
        );

      if (searchIsActive || filtersAreActive) {
        const vi = typeof currentLang === "undefined" || currentLang === "vi";
        element.textContent = vi
          ? `HIỂN THỊ: ${count} / ${total} ĐÔI`
          : `SHOWING: ${count} / ${total} PAIRS`;
        return;
      }

      originalUpdateCollectionCount(count);
    };
  }

  document.addEventListener("DOMContentLoaded", updateArchiveSearchUI);
})();
