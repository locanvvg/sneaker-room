/* =========================================================
   LỘC AN SNEAKER COLLECTION
   HOMEPAGE CONTROLLER
========================================================= */


/* =========================================================
   LANGUAGE
========================================================= */

const SUPPORTED_LANGUAGES = [
  "vi",
  "en"
];


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

    localStorage.getItem(
      "locan_lang"
    ) ||

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
  localStorage.getItem(
    "locan_sort"
  ) || "default";


if (
  !VALID_SORTS.includes(
    currentSort
  )
) {

  currentSort =
    "default";

}



/* =========================================================
   FILTER STATE
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
      total =>
        `TỔNG SỐ: ${total} ĐÔI`,


    filteredTotal:
      (visible, total) =>
        `ĐANG HIỂN THỊ: ${visible} / TỔNG SỐ: ${total} ĐÔI`

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
      total =>
        `TOTAL: ${total} PAIRS`,


    filteredTotal:
      (visible, total) =>
        `SHOWING: ${visible} / TOTAL: ${total} PAIRS`

  }

};



/* =========================================================
   HELPERS
========================================================= */

function getLocalizedText(value) {

  if (!value) {
    return "";
  }


  if (
    typeof value === "string"
  ) {

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

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}



/* =========================================================
   SIZE HELPERS
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
    Number(
      match[1]
    );


  return Number.isFinite(value)
    ? value
    : null;

}



function normalizeSizeValue(size) {

  const numericSize =
    getNumericSize(size);


  if (
    numericSize === null
  ) {

    return "";

  }


  return String(
    numericSize
  );

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
        size =>
          size !== null
      );


  const uniqueSizes =
    [
      ...new Set(sizes)
    ];


  uniqueSizes.sort(
    (a, b) =>
      a - b
  );


  return uniqueSizes;

}



/* =========================================================
   RELEASE DATE HELPERS
========================================================= */

function getReleaseDateValue(
  releaseDate
) {

  if (!releaseDate) {
    return null;
  }


  const value =
    String(
      releaseDate
    );


  /*
     Full date:
     YYYY-MM-DD
  */

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {

    const [
      year,
      month,
      day
    ] =
      value
        .split("-")
        .map(Number);


    return Date.UTC(
      year,
      month - 1,
      day
    );

  }


  /*
     Month only:
     YYYY-MM
  */

  if (
    /^\d{4}-\d{2}$/.test(value)
  ) {

    const [
      year,
      month
    ] =
      value
        .split("-")
        .map(Number);


    return Date.UTC(
      year,
      month - 1,
      1
    );

  }


  /*
     Year only:
     YYYY
  */

  if (
    /^\d{4}$/.test(value)
  ) {

    return Date.UTC(
      Number(value),
      0,
      1
    );

  }


  const parsed =
    Date.parse(value);


  return Number.isNaN(parsed)
    ? null
    : parsed;

}



/* =========================================================
   EDITION CLASSIFICATION
========================================================= */

function getEditionCategories(
  sneaker
) {

  const categories =
    new Set();


  const corpus = [

    getLocalizedText(
      sneaker.title
    ),

    getLocalizedText(
      sneaker.subtitle
    ),

    getLocalizedText(
      sneaker.editionType
    ),

    sneaker.title?.vi,

    sneaker.title?.en,

    sneaker.subtitle?.vi,

    sneaker.subtitle?.en,

    sneaker.editionType?.vi,

    sneaker.editionType?.en

  ]

    .filter(Boolean)

    .join(" ")

    .toUpperCase();



  /*
     PLAYER EXCLUSIVE / PE
  */

  if (

    /\bPE\b/.test(corpus) ||

    corpus.includes(
      "PLAYER EXCLUSIVE"
    )

  ) {

    categories.add(
      "PE"
    );

  }



  /*
     SAMPLE
  */

  if (
    corpus.includes(
      "SAMPLE"
    )
  ) {

    categories.add(
      "Sample"
    );

  }



  /*
     FRIENDS & FAMILY
  */

  if (

    corpus.includes(
      "F&F"
    ) ||

    corpus.includes(
      "FRIENDS & FAMILY"
    )

  ) {

    categories.add(
      "F&F"
    );

  }



  /*
     GENERAL RELEASE

     If the item has none of:
     PE / SAMPLE / F&F

     it is placed in GR for homepage filtering.
  */

  if (
    categories.size === 0
  ) {

    categories.add(
      "GR"
    );

  }


  return categories;

}



/* =========================================================
   CONDITION CLASSIFICATION
========================================================= */

function getConditionCategory(
  sneaker
) {

  const condition =
    getLocalizedText(
      sneaker.condition
    )

      .trim()

      .toLowerCase();


  if (
    condition === "deadstock"
  ) {

    return "Deadstock";

  }


  if (
    condition === "used"
  ) {

    return "Used";

  }


  return "";

}



/* =========================================================
   SORTING
========================================================= */

function sortSneakers(items) {

  const sorted =
    [...items];


  switch (
    currentSort
  ) {


    /* -------------------------
       A → Z
    ------------------------- */

    case "az":

      sorted.sort(
        (a, b) =>

          getLocalizedText(
            a.title
          ).localeCompare(

            getLocalizedText(
              b.title
            ),

            currentLang === "vi"
              ? "vi"
              : "en",

            {
              sensitivity:
                "base",

              numeric:
                true
            }

          )
      );

      break;



    /* -------------------------
       Z → A
    ------------------------- */

    case "za":

      sorted.sort(
        (a, b) =>

          getLocalizedText(
            b.title
          ).localeCompare(

            getLocalizedText(
              a.title
            ),

            currentLang === "vi"
              ? "vi"
              : "en",

            {
              sensitivity:
                "base",

              numeric:
                true
            }

          )
      );

      break;



    /* -------------------------
       RELEASE DATE
       NEWEST → OLDEST
    ------------------------- */

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


          if (
            dateA === null
          ) {

            return 1;

          }


          if (
            dateB === null
          ) {

            return -1;

          }


          return (
            dateB -
            dateA
          );

        }
      );

      break;



    /* -------------------------
       RELEASE DATE
       OLDEST → NEWEST
    ------------------------- */

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


          if (
            dateA === null
          ) {

            return 1;

          }


          if (
            dateB === null
          ) {

            return -1;

          }


          return (
            dateA -
            dateB
          );

        }
      );

      break;



    /* -------------------------
       SIZE SMALL → LARGE
    ------------------------- */

    case "size-asc":

      sorted.sort(
        (a, b) => {

          const sizeA =
            getNumericSize(
              a.size
            );


          const sizeB =
            getNumericSize(
              b.size
            );


          if (
            sizeA === null &&
            sizeB === null
          ) {

            return 0;

          }


          if (
            sizeA === null
          ) {

            return 1;

          }


          if (
            sizeB === null
          ) {

            return -1;

          }


          return (
            sizeA -
            sizeB
          );

        }
      );

      break;



    /* -------------------------
       SIZE LARGE → SMALL
    ------------------------- */

    case "size-desc":

      sorted.sort(
        (a, b) => {

          const sizeA =
            getNumericSize(
              a.size
            );


          const sizeB =
            getNumericSize(
              b.size
            );


          if (
            sizeA === null &&
            sizeB === null
          ) {

            return 0;

          }


          if (
            sizeA === null
          ) {

            return 1;

          }


          if (
            sizeB === null
          ) {

            return -1;

          }


          return (
            sizeB -
            sizeA
          );

        }
      );

      break;



    /* -------------------------
       DEFAULT DATA.JS ORDER
    ------------------------- */

    default:

      break;

  }


  return sorted;

}



/* =========================================================
   FILTERING
========================================================= */

function filterSneakers(items) {

  return items.filter(
    sneaker => {


      /* =====================================================
         EDITION
      ===================================================== */

      if (
        activeFilters.edition.size > 0
      ) {

        const sneakerCategories =
          getEditionCategories(
            sneaker
          );


        const editionMatches =
          [...activeFilters.edition]
            .some(
              category =>
                sneakerCategories.has(
                  category
                )
            );


        if (
          !editionMatches
        ) {

          return false;

        }

      }



      /* =====================================================
         CONDITION
      ===================================================== */

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



      /* =====================================================
         SIZE
      ===================================================== */

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
   FILTER ACTIONS
========================================================= */

function toggleFilter(
  group,
  value
) {

  if (
    !activeFilters[group]
  ) {

    return;

  }


  if (
    activeFilters[group].has(
      value
    )
  ) {

    activeFilters[group].delete(
      value
    );

  }

  else {

    activeFilters[group].add(
      value
    );

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

    activeFilters.size > 0

  );

}



/* =========================================================
   SIZE FILTER BUTTONS
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
              data-value="${escapeHTML(value)}"
              onclick="toggleFilter('size', '${escapeHTML(value)}')"
            >
              ${escapeHTML(value)} US
            </button>
          `;

        }
      )

      .join("");

}



/* =========================================================
   FILTER INTERFACE
========================================================= */

function updateFilterInterface() {

  const t =
    translations[currentLang];


  const filterTitle =
    document.getElementById(
      "filter-title"
    );


  const editionLabel =
    document.getElementById(
      "edition-filter-label"
    );


  const conditionLabel =
    document.getElementById(
      "condition-filter-label"
    );


  const sizeLabel =
    document.getElementById(
      "size-filter-label"
    );


  const clearButton =
    document.getElementById(
      "clear-filters"
    );


  if (filterTitle) {

    filterTitle.textContent =
      t.filterTitle;

  }


  if (editionLabel) {

    editionLabel.textContent =
      t.filterEdition;

  }


  if (conditionLabel) {

    conditionLabel.textContent =
      t.filterCondition;

  }


  if (sizeLabel) {

    sizeLabel.textContent =
      t.filterSize;

  }


  if (clearButton) {

    clearButton.textContent =
      t.clearFilters;


    clearButton.classList.toggle(
      "visible",
      hasActiveFilters()
    );

  }



  /*
     Edition + Condition buttons
  */

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
   SORT ACTION
========================================================= */

function changeSort(value) {

  if (
    !VALID_SORTS.includes(value)
  ) {

    value =
      "default";

  }


  currentSort =
    value;


  localStorage.setItem(
    "locan_sort",
    currentSort
  );


  renderGrid();

}



/* =========================================================
   SORT INTERFACE
========================================================= */

function updateSortInterface() {

  const t =
    translations[currentLang];


  const label =
    document.getElementById(
      "sort-label"
    );


  const select =
    document.getElementById(
      "sort-select"
    );


  if (!select) {
    return;
  }


  if (label) {

    label.textContent =
      t.sortLabel;

  }


  const optionMap = {

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


  Array
    .from(
      select.options
    )

    .forEach(
      option => {

        if (
          optionMap[
            option.value
          ]
        ) {

          option.textContent =
            optionMap[
              option.value
            ];

        }

      }
    );


  select.value =
    currentSort;

}



/* =========================================================
   COLLECTION TOTAL
========================================================= */

function updateCollectionCount(
  visibleCount
) {

  const element =
    document.getElementById(
      "collection-count"
    );


  if (!element) {
    return;
  }


  const totalCount =

    typeof sneakers !== "undefined" &&
    Array.isArray(sneakers)

      ? sneakers.length

      : 0;


  const t =
    translations[currentLang];


  if (
    hasActiveFilters()
  ) {

    element.textContent =
      t.filteredTotal(
        visibleCount,
        totalCount
      );

  }

  else {

    element.textContent =
      t.total(
        totalCount
      );

  }

}



/* =========================================================
   CHANGE LANGUAGE
========================================================= */

function setLanguage(lang) {

  currentLang =
    normalizeLanguage(
      lang
    );


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
    ?.classList.toggle(
      "active",
      currentLang === "vi"
    );


  document
    .getElementById("btn-en")
    ?.classList.toggle(
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


        if (
          t[key]
        ) {

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
   CARD RENDERER
========================================================= */

function renderCard(
  sneaker
) {

  const title =
    getLocalizedText(
      sneaker.title
    );


  const subtitle =
    getLocalizedText(
      sneaker.subtitle
    );


  const editionType =
    getLocalizedText(
      sneaker.editionType
    );


  const size =
    sneaker.size || "";


  const image =
    sneaker.image || "";


  const detailURL =

    `shoe.html?id=${encodeURIComponent(sneaker.id)}` +

    `&lang=${encodeURIComponent(currentLang)}`;


  const badgeHTML =
    editionType

      ? `
        <span class="badge">
          ${escapeHTML(editionType)}
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
            src="${escapeHTML(image)}"
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

            ${badgeHTML}


            <span class="size">
              ${escapeHTML(size)}
            </span>

          </div>

        </div>


      </article>

    </a>

  `;

}



/* =========================================================
   GRID RENDERER
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

    grid.innerHTML =
      `
        <div class="collection-message">
          Collection data unavailable.
        </div>
      `;


    updateCollectionCount(
      0
    );


    return;

  }



  /*
     1. FILTER
  */

  const filtered =
    filterSneakers(
      sneakers
    );


  /*
     2. SORT
  */

  const sorted =
    sortSneakers(
      filtered
    );


  /*
     3. TOTAL
  */

  updateCollectionCount(
    sorted.length
  );


  /*
     4. EMPTY RESULT
  */

  if (
    sorted.length === 0
  ) {

    grid.innerHTML =
      `
        <div class="collection-message">

          ${escapeHTML(
            translations[
              currentLang
            ].noResults
          )}

        </div>
      `;


    return;

  }


  /*
     5. CARDS
  */

  grid.innerHTML =
    sorted

      .map(
        sneaker =>
          renderCard(
            sneaker
          )
      )

      .join("");

}



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  () => {

    setLanguage(
      currentLang
    );

  }

);
