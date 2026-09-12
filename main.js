/* =========================================================
   LỘC AN SNEAKER COLLECTION
   HOMEPAGE
========================================================= */


/* =========================================================
   LANGUAGE
========================================================= */

const SUPPORTED_LANGUAGES = ["vi", "en"];


function normalizeLanguage(lang) {

  return SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : "vi";
}


const urlParams =
  new URLSearchParams(
    window.location.search
  );


let currentLang =
  normalizeLanguage(
    urlParams.get("lang") ||
    localStorage.getItem("locan_lang") ||
    "vi"
  );


localStorage.setItem(
  "locan_lang",
  currentLang
);


/* =========================================================
   SORT
========================================================= */

const VALID_SORTS = [
  "default",
  "az",
  "za",
  "date-desc",
  "date-asc",
  "size-asc",
  "size-desc"
];


let currentSort =
  localStorage.getItem("locan_sort") ||
  "default";


if (!VALID_SORTS.includes(currentSort)) {

  currentSort =
    "default";
}


/* =========================================================
   FILTERS
========================================================= */

const activeFilters = {

  edition:
    new Set(),

  condition:
    new Set(),

  size:
    new Set()

};


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

  vi: {

    mainTitle:
      "LỘC AN SNEAKER COLLECTION",

    mainSubtitle:
      "Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số",

    sortLabel:
      "SẮP XẾP",

    sortDefault:
      "Mặc định",

    sortAZ:
      "A → Z",

    sortZA:
      "Z → A",

    sortDateDesc:
      "Ngày phát hành: Mới → Cũ",

    sortDateAsc:
      "Ngày phát hành: Cũ → Mới",

    sortSizeAsc:
      "Size nhỏ → lớn",

    sortSizeDesc:
      "Size lớn → nhỏ",

    filterTitle:
      "BỘ LỌC BỘ SƯU TẬP",

    filterEdition:
      "PHÂN KHÚC",

    filterCondition:
      "TÌNH TRẠNG",

    filterSize:
      "KÍCH CỠ",

    clearFilters:
      "XÓA BỘ LỌC",

    noResults:
      "Không có đôi giày nào phù hợp với bộ lọc hiện tại.",

    total:
      count =>
        `TỔNG SỐ: ${count} ĐÔI`
  },


  en: {

    mainTitle:
      "LỘC AN SNEAKER COLLECTION",

    mainSubtitle:
      "Digital Sneaker Archive & Museum",

    sortLabel:
      "SORT",

    sortDefault:
      "Default",

    sortAZ:
      "A → Z",

    sortZA:
      "Z → A",

    sortDateDesc:
      "Release Date: Newest → Oldest",

    sortDateAsc:
      "Release Date: Oldest → Newest",

    sortSizeAsc:
      "Size: Small → Large",

    sortSizeDesc:
      "Size: Large → Small",

    filterTitle:
      "COLLECTION FILTERS",

    filterEdition:
      "EDITION",

    filterCondition:
      "CONDITION",

    filterSize:
      "SIZE",

    clearFilters:
      "CLEAR FILTERS",

    noResults:
      "No sneakers match the current filters.",

    total:
      count =>
        `TOTAL: ${count} ${count === 1 ? "PAIR" : "PAIRS"}`
  }

};


/* =========================================================
   HELPERS
========================================================= */

function getLocalizedText(value) {

  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return (
    value[currentLang] ||
    value.en ||
    value.vi ||
    ""
  );
}


function escapeHTML(value) {

  return String(value ?? "")

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}


/* =========================================================
   SIZE
========================================================= */

function getNumericSize(size) {

  if (!size) {
    return null;
  }


  const match =
    String(size).match(
      /(\d+(?:\.\d+)?)/
    );


  if (!match) {
    return null;
  }


  const value =
    Number(match[1]);


  return Number.isFinite(value)
    ? value
    : null;
}


function normalizeSizeValue(size) {

  const value =
    getNumericSize(size);


  return value === null
    ? ""
    : String(value);
}


function getAvailableSizes() {

  if (
    typeof sneakers === "undefined" ||
    !Array.isArray(sneakers)
  ) {
    return [];
  }


  const sizes =
    sneakers
      .map(
        sneaker =>
          getNumericSize(
            sneaker.size
          )
      )
      .filter(
        value =>
          value !== null
      );


  return [...new Set(sizes)]
    .sort(
      (a, b) =>
        a - b
    );
}


/* =========================================================
   DATE
========================================================= */

function getReleaseDateValue(value) {

  if (!value) {
    return null;
  }


  const date =
    String(value);


  if (
    /^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {

    const [
      year,
      month,
      day
    ] =
      date
        .split("-")
        .map(Number);


    return Date.UTC(
      year,
      month - 1,
      day
    );
  }


  if (
    /^\d{4}-\d{2}$/.test(date)
  ) {

    const [
      year,
      month
    ] =
      date
        .split("-")
        .map(Number);


    return Date.UTC(
      year,
      month - 1,
      1
    );
  }


  if (
    /^\d{4}$/.test(date)
  ) {

    return Date.UTC(
      Number(date),
      0,
      1
    );
  }


  const parsed =
    Date.parse(date);


  return Number.isNaN(parsed)
    ? null
    : parsed;
}


/* =========================================================
   EDITION CLASSIFICATION
========================================================= */

function getEditionCategories(sneaker) {

  const categories =
    new Set();


  const values = [

    sneaker.title?.vi,
    sneaker.title?.en,

    sneaker.subtitle?.vi,
    sneaker.subtitle?.en,

    sneaker.editionType?.vi,
    sneaker.editionType?.en,

    sneaker.title,
    sneaker.subtitle,
    sneaker.editionType

  ];


  const corpus =
    values
      .filter(
        value =>
          typeof value === "string"
      )
      .join(" ")
      .toUpperCase();


  if (
    /\bPE\b/.test(corpus) ||
    corpus.includes(
      "PLAYER EXCLUSIVE"
    )
  ) {

    categories.add("PE");
  }


  if (
    corpus.includes("SAMPLE")
  ) {

    categories.add("Sample");
  }


  if (
    corpus.includes("F&F") ||
    corpus.includes(
      "FRIENDS & FAMILY"
    )
  ) {

    categories.add("F&F");
  }


  if (
    categories.size === 0
  ) {

    categories.add("GR");
  }


  return categories;
}


/* =========================================================
   CONDITION
========================================================= */

function getConditionCategory(sneaker) {

  const value =
    getLocalizedText(
      sneaker.condition
    )
      .trim()
      .toLowerCase();


  if (value === "deadstock") {
    return "Deadstock";
  }


  if (value === "used") {
    return "Used";
  }


  return "";
}


/* =========================================================
   FILTER
========================================================= */

function filterSneakers(items) {

  return items.filter(
    sneaker => {


      /* EDITION */

      if (
        activeFilters.edition.size > 0
      ) {

        const categories =
          getEditionCategories(
            sneaker
          );


        const matches =
          [...activeFilters.edition]
            .some(
              value =>
                categories.has(value)
            );


        if (!matches) {
          return false;
        }
      }


      /* CONDITION */

      if (
        activeFilters.condition.size > 0
      ) {

        const condition =
          getConditionCategory(
            sneaker
          );


        if (
          !activeFilters.condition.has(
            condition
          )
        ) {

          return false;
        }
      }


      /* SIZE */

      if (
        activeFilters.size.size > 0
      ) {

        const size =
          normalizeSizeValue(
            sneaker.size
          );


        if (
          !activeFilters.size.has(
            size
          )
        ) {

          return false;
        }
      }


      return true;
    }
  );
}


/* =========================================================
   SORT
========================================================= */

function sortSneakers(items) {

  const sorted =
    [...items];


  switch (currentSort) {


    case "az":

      sorted.sort(
        (a, b) =>
          getLocalizedText(
            a.title
          ).localeCompare(
            getLocalizedText(
              b.title
            ),
            currentLang,
            {
              sensitivity: "base",
              numeric: true
            }
          )
      );

      break;


    case "za":

      sorted.sort(
        (a, b) =>
          getLocalizedText(
            b.title
          ).localeCompare(
            getLocalizedText(
              a.title
            ),
            currentLang,
            {
              sensitivity: "base",
              numeric: true
            }
          )
      );

      break;


    case "date-desc":

      sorted.sort(
        (a, b) => {

          const dateA =
            getReleaseDateValue(
              a.releaseDate
            );

          const dateB =
            getReleaseDateValue(
              b.releaseDate
            );


          if (
            dateA === null &&
            dateB === null
          ) {
            return 0;
          }

          if (dateA === null) {
            return 1;
          }

          if (dateB === null) {
            return -1;
          }


          return dateB - dateA;
        }
      );

      break;


    case "date-asc":

      sorted.sort(
        (a, b) => {

          const dateA =
            getReleaseDateValue(
              a.releaseDate
            );

          const dateB =
            getReleaseDateValue(
              b.releaseDate
            );


          if (
            dateA === null &&
            dateB === null
          ) {
            return 0;
          }

          if (dateA === null) {
            return 1;
          }

          if (dateB === null) {
            return -1;
          }


          return dateA - dateB;
        }
      );

      break;


    case "size-asc":

      sorted.sort(
        (a, b) => {

          const sizeA =
            getNumericSize(a.size);

          const sizeB =
            getNumericSize(b.size);


          if (
            sizeA === null &&
            sizeB === null
          ) {
            return 0;
          }

          if (sizeA === null) {
            return 1;
          }

          if (sizeB === null) {
            return -1;
          }


          return sizeA - sizeB;
        }
      );

      break;


    case "size-desc":

      sorted.sort(
        (a, b) => {

          const sizeA =
            getNumericSize(a.size);

          const sizeB =
            getNumericSize(b.size);


          if (
            sizeA === null &&
            sizeB === null
          ) {
            return 0;
          }

          if (sizeA === null) {
            return 1;
          }

          if (sizeB === null) {
            return -1;
          }


          return sizeB - sizeA;
        }
      );

      break;


    default:

      break;
  }


  return sorted;
}


/* =========================================================
   FILTER ACTIONS
========================================================= */

function toggleFilter(
  group,
  value
) {

  const filter =
    activeFilters[group];


  if (!filter) {
    return;
  }


  if (
    filter.has(value)
  ) {

    filter.delete(value);

  } else {

    filter.add(value);
  }


  updateFilterInterface();

  renderGrid();
}


function clearAllFilters() {

  activeFilters.edition.clear();

  activeFilters.condition.clear();

  activeFilters.size.clear();


  updateFilterInterface();

  renderGrid();
}


function hasActiveFilters() {

  return (
    activeFilters.edition.size > 0 ||
    activeFilters.condition.size > 0 ||
    activeFilters.size.size > 0
  );
}


/* =========================================================
   SIZE FILTERS
========================================================= */

function renderSizeFilterButtons() {

  const container =
    document.getElementById(
      "size-filter-chips"
    );


  if (!container) {
    return;
  }


  const sizes =
    getAvailableSizes();


  container.innerHTML =
    sizes
      .map(
        size => {

          const value =
            String(size);


          const active =
            activeFilters.size.has(
              value
            );


          return `
            <button
              type="button"
              class="filter-chip ${active ? "active" : ""}"
              data-group="size"
              data-value="${value}"
              onclick="toggleFilter('size', '${value}')"
            >
              ${value} US
            </button>
          `;
        }
      )
      .join("");
}


/* =========================================================
   FILTER UI
========================================================= */

function updateFilterInterface() {

  const t =
    translations[currentLang];


  document.getElementById(
    "filter-title"
  ).textContent =
    t.filterTitle;


  document.getElementById(
    "edition-filter-label"
  ).textContent =
    t.filterEdition;


  document.getElementById(
    "condition-filter-label"
  ).textContent =
    t.filterCondition;


  document.getElementById(
    "size-filter-label"
  ).textContent =
    t.filterSize;


  const clearButton =
    document.getElementById(
      "clear-filters"
    );


  clearButton.textContent =
    t.clearFilters;


  clearButton.classList.toggle(
    "visible",
    hasActiveFilters()
  );


  document
    .querySelectorAll(
      ".filter-chip[data-group='edition'], .filter-chip[data-group='condition']"
    )
    .forEach(
      button => {

        const group =
          button.dataset.group;

        const value =
          button.dataset.value;


        button.classList.toggle(
          "active",
          activeFilters[group].has(
            value
          )
        );
      }
    );


  renderSizeFilterButtons();
}


/* =========================================================
   SORT UI
========================================================= */

function changeSort(value) {

  currentSort =
    VALID_SORTS.includes(value)
      ? value
      : "default";


  localStorage.setItem(
    "locan_sort",
    currentSort
  );


  renderGrid();
}


function updateSortInterface() {

  const select =
    document.getElementById(
      "sort-select"
    );


  const label =
    document.getElementById(
      "sort-label"
    );


  const t =
    translations[currentLang];


  label.textContent =
    t.sortLabel;


  const names = {

    default:
      t.sortDefault,

    az:
      t.sortAZ,

    za:
      t.sortZA,

    "date-desc":
      t.sortDateDesc,

    "date-asc":
      t.sortDateAsc,

    "size-asc":
      t.sortSizeAsc,

    "size-desc":
      t.sortSizeDesc
  };


  [...select.options]
    .forEach(
      option => {

        option.textContent =
          names[option.value] ||
          option.textContent;
      }
    );


  select.value =
    currentSort;
}


/* =========================================================
   TOTAL
========================================================= */

function updateCollectionCount(count) {

  const element =
    document.getElementById(
      "collection-count"
    );


  if (!element) {
    return;
  }


  element.textContent =
    translations[currentLang]
      .total(count);
}


/* =========================================================
   LANGUAGE
========================================================= */

function setLanguage(lang) {

  currentLang =
    normalizeLanguage(lang);


  localStorage.setItem(
    "locan_lang",
    currentLang
  );


  document.documentElement.lang =
    currentLang;


  const url =
    new URL(
      window.location.href
    );


  url.searchParams.set(
    "lang",
    currentLang
  );


  window.history.replaceState(
    {},
    "",
    url.pathname +
    url.search +
    url.hash
  );


  document
    .getElementById("btn-vi")
    .classList.toggle(
      "active",
      currentLang === "vi"
    );


  document
    .getElementById("btn-en")
    .classList.toggle(
      "active",
      currentLang === "en"
    );


  const t =
    translations[currentLang];


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element => {

        const key =
          element.dataset.i18n;


        if (t[key]) {

          element.textContent =
            t[key];
        }
      }
    );


  updateSortInterface();

  updateFilterInterface();

  renderGrid();
}


/* =========================================================
   CARD
========================================================= */

function renderCard(sneaker) {

  const title =
    getLocalizedText(
      sneaker.title
    );


  const subtitle =
    getLocalizedText(
      sneaker.subtitle
    );


  const edition =
    getLocalizedText(
      sneaker.editionType
    );


  /*
     IMPORTANT:
     Use ./shoe.html so GitHub Pages stays inside
     /sneaker-room/
  */

  const detailURL =
    `./shoe.html?id=${encodeURIComponent(sneaker.id)}` +
    `&lang=${encodeURIComponent(currentLang)}`;


  const badge =
    edition
      ? `
        <span class="badge">
          ${escapeHTML(edition)}
        </span>
      `
      : `
        <span class="badge badge-placeholder">
          &nbsp;
        </span>
      `;


  return `
    <a
      href="${detailURL}"
      class="card-link"
      aria-label="${escapeHTML(title)}"
    >

      <article class="card">

        <div class="card-img-wrapper">

          <img
            src="${escapeHTML(sneaker.image || "")}"
            alt="${escapeHTML(title)}"
            loading="lazy"
            decoding="async"
          >

        </div>


        <div class="card-info">

          <h3>
            ${escapeHTML(title)}
          </h3>

          <p class="subtitle">
            ${escapeHTML(subtitle)}
          </p>

          <div class="card-meta">

            ${badge}

            <span class="size">
              ${escapeHTML(sneaker.size || "")}
            </span>

          </div>

        </div>

      </article>

    </a>
  `;
}


/* =========================================================
   RENDER
========================================================= */

function renderGrid() {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (!grid) {
    return;
  }


  if (
    typeof sneakers === "undefined" ||
    !Array.isArray(sneakers)
  ) {

    grid.innerHTML = `
      <div class="collection-message">
        Collection data unavailable.
      </div>
    `;

    updateCollectionCount(0);

    return;
  }


  const filtered =
    filterSneakers(
      sneakers
    );


  const sorted =
    sortSneakers(
      filtered
    );


  /*
     TOTAL = NUMBER CURRENTLY DISPLAYED
  */

  updateCollectionCount(
    sorted.length
  );


  if (
    sorted.length === 0
  ) {

    grid.innerHTML = `
      <div class="collection-message">
        ${escapeHTML(
          translations[currentLang]
            .noResults
        )}
      </div>
    `;

    return;
  }


  grid.innerHTML =
    sorted
      .map(renderCard)
      .join("");
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setLanguage(
      currentLang
    );
  }
);
