/* =========================================================
   LỘC AN SNEAKER COLLECTION
   HOMEPAGE LOGIC

   - LANGUAGE
   - SORT
   - FILTER
   - SNEAKER GRID
   - RESPONSIVE GRID VIEW CONTROLLER
========================================================= */


/* =========================================================
   LANGUAGE
========================================================= */

const SUPPORTED_LANGUAGES = [
  "vi",
  "en"
];


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

    clearFilters:
      "XÓA BỘ LỌC",

    editionLabel:
      "PHÂN KHÚC",

    conditionLabel:
      "TÌNH TRẠNG",

    sizeLabel:
      "KÍCH CỠ",

    total:
      count =>
        `TỔNG SỐ: ${count} ĐÔI`,

    viewMore:
      "XEM THÊM →",

    noResults:
      "Không có hiện vật phù hợp với bộ lọc hiện tại."

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
      "Release date: Newest → Oldest",

    sortDateAsc:
      "Release date: Oldest → Newest",

    sortSizeAsc:
      "Size: Small → Large",

    sortSizeDesc:
      "Size: Large → Small",

    filterTitle:
      "COLLECTION FILTERS",

    clearFilters:
      "CLEAR FILTERS",

    editionLabel:
      "EDITION",

    conditionLabel:
      "CONDITION",

    sizeLabel:
      "SIZE",

    total:
      count =>
        `TOTAL: ${count} PAIRS`,

    viewMore:
      "VIEW MORE →",

    noResults:
      "No artifacts match the current filters."

  }

};


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

    urlParams.get("lang")
    ||
    localStorage.getItem(
      "locan_lang"
    )
    ||
    "vi"

  );


let currentSort =
  "default";


const activeFilters = {

  edition:
    new Set(),

  condition:
    new Set(),

  size:
    new Set()

};


/* =========================================================
   LOCALIZED TEXT
========================================================= */

function getLocalizedText(value) {

  if (
    value === null
    ||
    value === undefined
  ) {
    return "";
  }


  if (
    typeof value === "string"
    ||
    typeof value === "number"
  ) {

    return String(value);

  }


  if (
    typeof value === "object"
  ) {

    return String(

      value[currentLang]
      ??
      value.vi
      ??
      value.en
      ??
      ""

    );

  }


  return "";

}


/* =========================================================
   HTML ESCAPE
========================================================= */

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
   SIZE
========================================================= */

function getNumericSize(size) {

  const match =
    String(
      size ?? ""
    )
      .match(
        /(\d+(?:\.\d+)?)/
      );


  if (!match) {
    return null;
  }


  const value =
    Number(
      match[1]
    );


  return Number.isFinite(
    value
  )
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
    typeof sneakers === "undefined"
    ||
    !Array.isArray(sneakers)
  ) {

    return [];

  }


  return [

    ...new Set(

      sneakers

        .map(
          item =>
            getNumericSize(
              item.size
            )
        )

        .filter(
          value =>
            value !== null
        )

    )

  ]
    .sort(
      (a, b) =>
        a - b
    );

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

    sneaker.title?.vi,

    sneaker.title?.en,

    sneaker.subtitle?.vi,

    sneaker.subtitle?.en,

    sneaker.editionType?.vi,

    sneaker.editionType?.en,

    sneaker.title,

    sneaker.subtitle,

    sneaker.editionType

  ]

    .filter(
      value =>
        typeof value ===
        "string"
    )

    .join(" ")

    .toUpperCase();


  /* PE */

  if (

    corpus.includes(
      "PLAYER EXCLUSIVE"
    )

    ||

    /\bPE\b/.test(
      corpus
    )

  ) {

    categories.add(
      "PE"
    );

  }


  /* SAMPLE */

  if (
    corpus.includes(
      "SAMPLE"
    )
  ) {

    categories.add(
      "Sample"
    );

  }


  /* FRIENDS & FAMILY */

  if (

    corpus.includes(
      "FRIENDS & FAMILY"
    )

    ||

    corpus.includes(
      "FRIENDS AND FAMILY"
    )

    ||

    corpus.includes(
      "F&F"
    )

  ) {

    categories.add(
      "F&F"
    );

  }


  /* SIGNATURE SIGNED */

  if (

    corpus.includes(
      "SIGNATURE SIGNED"
    )

    ||

    (
      corpus.includes(
        "SIGNATURE"
      )

      &&

      corpus.includes(
        "SIGNED"
      )
    )

  ) {

    categories.add(
      "Signature Signed"
    );

  }


  /* GENERAL RELEASE */

  if (

    corpus.includes(
      "GENERAL RELEASE"
    )

    ||

    /\bGR\b/.test(
      corpus
    )

  ) {

    categories.add(
      "GR"
    );

  }


  /*
     If an item does not explicitly
     declare another edition,
     treat it as GR.
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
   CONDITION
========================================================= */

function getConditionCategory(
  sneaker
) {

  const value =
    getLocalizedText(
      sneaker.condition
    )

      .trim()

      .toLowerCase();


  if (
    value === "deadstock"
  ) {

    return "Deadstock";

  }


  if (
    value === "used"
  ) {

    return "Used";

  }


  return "";

}


/* =========================================================
   FILTER
========================================================= */

function filterSneakers(
  items
) {

  return items.filter(
    sneaker => {


      /* EDITION */

      if (
        activeFilters
          .edition
          .size > 0
      ) {

        const categories =
          getEditionCategories(
            sneaker
          );


        const match = [

          ...activeFilters
            .edition

        ]

          .some(
            value =>
              categories.has(
                value
              )
          );


        if (!match) {
          return false;
        }

      }


      /* CONDITION */

      if (
        activeFilters
          .condition
          .size > 0
      ) {

        if (

          !activeFilters
            .condition
            .has(
              getConditionCategory(
                sneaker
              )
            )

        ) {

          return false;

        }

      }


      /* SIZE */

      if (
        activeFilters
          .size
          .size > 0
      ) {

        const size =
          normalizeSizeValue(
            sneaker.size
          );


        if (

          !activeFilters
            .size
            .has(
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
   RELEASE DATE
========================================================= */

function getReleaseTimestamp(
  value
) {

  if (!value) {
    return 0;
  }


  const text =
    String(value)
      .trim();


  const normalized =
    /^\d{4}-\d{2}$/.test(
      text
    )

      ? `${text}-01`

      : text;


  const timestamp =
    Date.parse(
      `${normalized}T12:00:00`
    );


  return Number.isFinite(
    timestamp
  )

    ? timestamp

    : 0;

}


/* =========================================================
   SORT
========================================================= */

function sortSneakers(
  items
) {

  const sorted =
    [...items];


  switch (
    currentSort
  ) {


    case "az":

      sorted.sort(
        (a, b) =>

          getLocalizedText(
            a.title
          )

            .localeCompare(

              getLocalizedText(
                b.title
              ),

              currentLang === "vi"
                ? "vi"
                : "en"

            )

      );

      break;


    case "za":

      sorted.sort(
        (a, b) =>

          getLocalizedText(
            b.title
          )

            .localeCompare(

              getLocalizedText(
                a.title
              ),

              currentLang === "vi"
                ? "vi"
                : "en"

            )

      );

      break;


    case "date-desc":

      sorted.sort(
        (a, b) =>

          getReleaseTimestamp(
            b.releaseDate
          )

          -

          getReleaseTimestamp(
            a.releaseDate
          )

      );

      break;


    case "date-asc":

      sorted.sort(
        (a, b) =>

          getReleaseTimestamp(
            a.releaseDate
          )

          -

          getReleaseTimestamp(
            b.releaseDate
          )

      );

      break;


    case "size-asc":

      sorted.sort(
        (a, b) => {

          const aSize =
            getNumericSize(
              a.size
            );


          const bSize =
            getNumericSize(
              b.size
            );


          if (
            aSize === null
            &&
            bSize === null
          ) {

            return 0;

          }


          if (
            aSize === null
          ) {

            return 1;

          }


          if (
            bSize === null
          ) {

            return -1;

          }


          return (
            aSize - bSize
          );

        }
      );

      break;


    case "size-desc":

      sorted.sort(
        (a, b) => {

          const aSize =
            getNumericSize(
              a.size
            );


          const bSize =
            getNumericSize(
              b.size
            );


          if (
            aSize === null
            &&
            bSize === null
          ) {

            return 0;

          }


          if (
            aSize === null
          ) {

            return 1;

          }


          if (
            bSize === null
          ) {

            return -1;

          }


          return (
            bSize - aSize
          );

        }
      );

      break;


    default:

      break;

  }


  return sorted;

}


/* =========================================================
   FILTER EVENTS
========================================================= */

function toggleFilter(
  group,
  value
) {

  const set =
    activeFilters[group];


  if (!set) {
    return;
  }


  if (
    set.has(value)
  ) {

    set.delete(
      value
    );

  } else {

    set.add(
      value
    );

  }


  updateFilterInterface();

  renderGrid();

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearAllFilters() {

  Object
    .values(
      activeFilters
    )

    .forEach(
      set =>
        set.clear()
    );


  updateFilterInterface();

  renderGrid();

}


/* =========================================================
   CHANGE SORT
========================================================= */

function changeSort(
  value
) {

  const allowed = [

    "default",

    "az",

    "za",

    "date-desc",

    "date-asc",

    "size-asc",

    "size-desc"

  ];


  currentSort =
    allowed.includes(
      value
    )

      ? value

      : "default";


  renderGrid();

}


/* =========================================================
   SIZE FILTER BUTTONS
========================================================= */

function renderSizeFilters() {

  const container =
    document.getElementById(
      "size-filter-chips"
    );


  if (!container) {
    return;
  }


  container.innerHTML =

    getAvailableSizes()

      .map(
        size => {


          const value =
            String(size);


          return `

            <button

              type="button"

              class="filter-chip"

              data-group="size"

              data-value="${escapeHTML(
                value
              )}"

              onclick="toggleFilter(
                'size',
                '${escapeHTML(
                  value
                )}'
              )"

            >

              ${escapeHTML(
                value
              )} US

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

  document

    .querySelectorAll(
      ".filter-chip[data-group]"
    )

    .forEach(
      button => {


        const group =
          button.dataset.group;


        const value =
          button.dataset.value;


        const set =
          activeFilters[group];


        button.classList.toggle(

          "active",

          Boolean(
            set
            &&
            set.has(
              value
            )
          )

        );

      }
    );


  const clearButton =
    document.getElementById(
      "clear-filters"
    );


  if (
    clearButton
  ) {

    const hasActiveFilters =

      activeFilters
        .edition
        .size > 0

      ||

      activeFilters
        .condition
        .size > 0

      ||

      activeFilters
        .size
        .size > 0;


    clearButton
      .classList
      .toggle(

        "visible",

        hasActiveFilters

      );

  }

}


/* =========================================================
   GRID VIEW SYSTEM
========================================================= */


/*
   Desktop:
   1 - 5 columns
   Default = 3

   Tablet:
   1 - 3 columns
   Default = 2

   Mobile:
   1 - 2 columns
   Default = 1

   Each device category has
   its own remembered preference.
*/

const GRID_VIEW_CONFIG = {

  desktop: {

    min:
      1,

    max:
      5,

    defaultColumns:
      3,

    storageKey:
      "locan_grid_columns_desktop"

  },


  tablet: {

    min:
      1,

    max:
      3,

    defaultColumns:
      2,

    storageKey:
      "locan_grid_columns_tablet"

  },


  mobile: {

    min:
      1,

    max:
      2,

    defaultColumns:
      1,

    storageKey:
      "locan_grid_columns_mobile"

  }

};


let currentGridMode =
  null;


let currentGridColumns =
  3;


let gridResizeTimer =
  null;


/* =========================================================
   GRID MODE
========================================================= */

function getGridViewMode() {

  const width =
    window.innerWidth;


  if (
    width <= 700
  ) {

    return "mobile";

  }


  if (
    width <= 999
  ) {

    return "tablet";

  }


  return "desktop";

}


/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

function getStoredGridColumns(
  mode
) {

  const config =
    GRID_VIEW_CONFIG[mode];


  if (!config) {
    return 3;
  }


  try {

    const stored =
      Number.parseInt(

        localStorage.getItem(
          config.storageKey
        ),

        10

      );


    if (
      Number.isFinite(
        stored
      )
    ) {

      return Math.min(

        config.max,

        Math.max(
          config.min,
          stored
        )

      );

    }

  } catch (
    error
  ) {

    /*
       Storage unavailable.
       Fall back to default.
    */

  }


  return config
    .defaultColumns;

}


function storeGridColumns(
  mode,
  columns
) {

  const config =
    GRID_VIEW_CONFIG[mode];


  if (!config) {
    return;
  }


  try {

    localStorage.setItem(

      config.storageKey,

      String(columns)

    );

  } catch (
    error
  ) {

    /*
       Ignore storage errors.
       Grid still works normally.
    */

  }

}


/* =========================================================
   GRID CONTROL CSS
========================================================= */

function installGridViewStyles() {

  if (
    document.getElementById(
      "locan-grid-view-styles"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "locan-grid-view-styles";


  style.textContent = `

    /* =====================================================
       DYNAMIC SNEAKER GRID
    ===================================================== */

    #sneaker-grid {

      --locan-grid-columns: 3;

      display: grid !important;

      grid-template-columns:
        repeat(
          var(--locan-grid-columns),
          minmax(0, 1fr)
        ) !important;

      align-items: stretch !important;

    }


    /*
       When the viewer deliberately selects
       1-column mode on desktop/tablet,
       prevent an excessively wide museum card.
    */

    #sneaker-grid.grid-cols-1 {

      width: 100%;

      max-width: 760px;

      margin-left: auto;

      margin-right: auto;

    }


    #sneaker-grid.grid-cols-2 {

      gap: 28px;

    }


    #sneaker-grid.grid-cols-3 {

      gap: 28px;

    }


    #sneaker-grid.grid-cols-4 {

      gap: 20px;

    }


    #sneaker-grid.grid-cols-5 {

      gap: 16px;

    }


    /* =====================================================
       FOUR-COLUMN DENSITY
    ===================================================== */

    #sneaker-grid.grid-cols-4
    .card-info {

      min-height: 178px;

      padding: 17px;

    }


    #sneaker-grid.grid-cols-4
    .card-info h3 {

      font-size: 0.98rem;

      line-height: 1.38;

    }


    #sneaker-grid.grid-cols-4
    .card-info .subtitle {

      font-size: 0.78rem;

    }


    #sneaker-grid.grid-cols-4
    .badge,

    #sneaker-grid.grid-cols-4
    .size {

      font-size: 0.74rem;

    }


    /* =====================================================
       FIVE-COLUMN DENSITY
    ===================================================== */

    #sneaker-grid.grid-cols-5
    .card {

      border-radius: 15px;

    }


    #sneaker-grid.grid-cols-5
    .card-info {

      min-height: 166px;

      padding: 14px;

    }


    #sneaker-grid.grid-cols-5
    .card-info h3 {

      margin-bottom: 6px;

      font-size: 0.86rem;

      line-height: 1.34;

    }


    #sneaker-grid.grid-cols-5
    .card-info .subtitle {

      margin-bottom: 12px;

      font-size: 0.71rem;

      line-height: 1.42;

    }


    #sneaker-grid.grid-cols-5
    .badge {

      padding:
        4px
        7px;

      font-size: 0.66rem;

    }


    #sneaker-grid.grid-cols-5
    .size {

      font-size: 0.67rem;

    }


    #sneaker-grid.grid-cols-5
    .card-cta {

      margin-top: 12px;

      padding-top: 10px;

      font-size: 0.61rem;

      letter-spacing: 0.9px;

    }


    /* =====================================================
       GRID VIEW CONTROL
       DESKTOP FLOATING LIQUID GLASS RAIL
    ===================================================== */

    .grid-view-control {

      position: fixed;

      top: 50%;

      right: 18px;

      z-index: 120;

      display: flex;

      flex-direction: column;

      align-items: stretch;

      width: 46px;

      overflow: hidden;

      background:
        linear-gradient(
          145deg,
          rgba(48, 48, 53, 0.72),
          rgba(18, 18, 21, 0.58)
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.13
        );

      border-radius: 15px;

      box-shadow:
        0 14px 36px
        rgba(
          0,
          0,
          0,
          0.34
        ),
        inset
        0
        1px
        0
        rgba(
          255,
          255,
          255,
          0.09
        );

      backdrop-filter:
        blur(24px)
        saturate(145%);

      -webkit-backdrop-filter:
        blur(24px)
        saturate(145%);

      transform:
        translateY(-50%);

      user-select: none;

      -webkit-user-select: none;

    }


    .grid-view-button {

      display: grid;

      place-items: center;

      width: 44px;

      height: 44px;

      padding: 0;

      appearance: none;

      -webkit-appearance: none;

      color: #a2a2a8;

      background:
        transparent;

      border: 0;

      outline: none;

      cursor: pointer;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      font-size: 1.3rem;

      font-weight: 400;

      line-height: 1;

      transition:
        color 0.18s ease,
        background 0.18s ease,
        opacity 0.18s ease;

    }


    .grid-view-button:hover {

      color: #ffcc00;

      background:
        rgba(
          255,
          204,
          0,
          0.065
        );

    }


    .grid-view-button:focus-visible {

      color: #ffcc00;

      box-shadow:
        inset
        0
        0
        0
        2px
        rgba(
          255,
          204,
          0,
          0.38
        );

    }


    .grid-view-button:disabled {

      color: #505056;

      opacity: 0.45;

      cursor: default;

      background:
        transparent;

    }


    .grid-view-number {

      display: grid;

      place-items: center;

      width: 44px;

      height: 35px;

      color: #ffcc00;

      border-top:
        1px solid
        rgba(
          255,
          255,
          255,
          0.075
        );

      border-bottom:
        1px solid
        rgba(
          255,
          255,
          255,
          0.075
        );

      font-size: 0.75rem;

      font-weight: 850;

      letter-spacing: 0.5px;

    }


    /* =====================================================
       MOBILE GRID TOGGLE
       HIDDEN ON DESKTOP / TABLET
    ===================================================== */

    .grid-mobile-toggle {

      display: none;

      align-items: center;

      justify-content: center;

      min-height: 39px;

      padding:
        9px
        13px;

      color: #96969c;

      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,0.045),
          rgba(255,255,255,0.018)
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.10
        );

      border-radius: 9px;

      cursor: pointer;

      font-size: 0.68rem;

      font-weight: 800;

      letter-spacing: 1px;

      backdrop-filter:
        blur(18px);

      -webkit-backdrop-filter:
        blur(18px);

      transition:
        color 0.18s ease,
        border-color 0.18s ease,
        background 0.18s ease;

    }


    .grid-mobile-toggle:hover,

    .grid-mobile-toggle:focus-visible {

      color: #ffcc00;

      border-color:
        rgba(
          255,
          204,
          0,
          0.26
        );

      background:
        rgba(
          255,
          204,
          0,
          0.04
        );

    }


    /* =====================================================
       TABLET
       Control moves beside SORT.
    ===================================================== */

    @media screen and
    (min-width: 701px) and
    (max-width: 999px) {


      .collection-toolbar {

        gap: 12px;

        flex-wrap: wrap;

      }


      .grid-view-control {

        position: static;

        top: auto;

        right: auto;

        z-index: auto;

        flex-direction: row;

        width: auto;

        height: 41px;

        border-radius: 10px;

        transform: none;

      }


      .grid-view-button {

        width: 39px;

        height: 39px;

        font-size: 1.15rem;

      }


      .grid-view-number {

        width: 36px;

        height: 39px;

        border-top: 0;

        border-bottom: 0;

        border-left:
          1px solid
          rgba(
            255,
            255,
            255,
            0.075
          );

        border-right:
          1px solid
          rgba(
            255,
            255,
            255,
            0.075
          );

      }


      #sneaker-grid.grid-cols-1 {

        max-width: 680px;

      }


    }


    /* =====================================================
       MOBILE
       No floating rail.
       Only compact 1 ↔ 2 toggle.
    ===================================================== */

    @media screen and
    (max-width: 700px) {


      .collection-toolbar {

        flex-wrap: wrap;

        gap: 10px;

      }


      .grid-view-control {

        display: none !important;

      }


      .grid-mobile-toggle {

        display: inline-flex;

        margin-left: auto;

      }


      #sneaker-grid {

        max-width: none !important;

        margin-left: 0 !important;

        margin-right: 0 !important;

      }


      #sneaker-grid.grid-cols-1 {

        gap: 22px;

      }


      #sneaker-grid.grid-cols-2 {

        gap: 12px;

      }


      /* MOBILE 2-COLUMN CARD */

      #sneaker-grid.grid-cols-2
      .card {

        border-radius: 13px;

      }


      #sneaker-grid.grid-cols-2
      .card-info {

        min-height: 148px;

        padding: 11px;

      }


      #sneaker-grid.grid-cols-2
      .card-info h3 {

        margin-bottom: 5px;

        font-size: 0.77rem;

        line-height: 1.32;

      }


      #sneaker-grid.grid-cols-2
      .card-info .subtitle {

        margin-bottom: 9px;

        font-size: 0.66rem;

        line-height: 1.38;

      }


      #sneaker-grid.grid-cols-2
      .card-meta {

        gap: 6px;

      }


      #sneaker-grid.grid-cols-2
      .badge {

        padding:
          3px
          5px;

        border-radius: 5px;

        font-size: 0.58rem;

      }


      #sneaker-grid.grid-cols-2
      .size {

        font-size: 0.59rem;

      }


      #sneaker-grid.grid-cols-2
      .card-cta {

        margin-top: 9px;

        padding-top: 8px;

        font-size: 0.54rem;

        letter-spacing: 0.65px;

      }


    }


    /* =====================================================
       SMALL MOBILE
    ===================================================== */

    @media screen and
    (max-width: 430px) {


      .grid-mobile-toggle {

        min-height: 37px;

        padding:
          8px
          11px;

        font-size: 0.64rem;

      }


      #sneaker-grid.grid-cols-2 {

        gap: 9px;

      }


      #sneaker-grid.grid-cols-2
      .card-info {

        min-height: 140px;

        padding: 9px;

      }


      #sneaker-grid.grid-cols-2
      .card-info h3 {

        font-size: 0.72rem;

      }


      #sneaker-grid.grid-cols-2
      .card-info .subtitle {

        font-size: 0.62rem;

      }


      #sneaker-grid.grid-cols-2
      .badge,

      #sneaker-grid.grid-cols-2
      .size {

        font-size: 0.54rem;

      }


    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   CREATE GRID CONTROLS
========================================================= */

function createGridViewControls() {

  const toolbar =
    document.querySelector(
      ".collection-toolbar"
    );


  if (!toolbar) {
    return;
  }


  installGridViewStyles();


  /* DESKTOP / TABLET CONTROL */

  if (

    !document.getElementById(
      "grid-view-control"
    )

  ) {

    const control =
      document.createElement(
        "div"
      );


    control.id =
      "grid-view-control";


    control.className =
      "grid-view-control";


    control.setAttribute(
      "role",
      "group"
    );


    control.innerHTML = `

      <button

        type="button"

        id="grid-view-increase"

        class="grid-view-button"

      >

        +

      </button>


      <span

        id="grid-view-number"

        class="grid-view-number"

        aria-live="polite"

      >

        3

      </span>


      <button

        type="button"

        id="grid-view-decrease"

        class="grid-view-button"

      >

        −

      </button>

    `;


    toolbar.appendChild(
      control
    );


    document

      .getElementById(
        "grid-view-increase"
      )

      ?.addEventListener(
        "click",
        () => {

          changeGridColumns(
            1
          );

        }
      );


    document

      .getElementById(
        "grid-view-decrease"
      )

      ?.addEventListener(
        "click",
        () => {

          changeGridColumns(
            -1
          );

        }
      );

  }


  /* MOBILE CONTROL */

  if (

    !document.getElementById(
      "grid-mobile-toggle"
    )

  ) {

    const mobileToggle =
      document.createElement(
        "button"
      );


    mobileToggle.type =
      "button";


    mobileToggle.id =
      "grid-mobile-toggle";


    mobileToggle.className =
      "grid-mobile-toggle";


    mobileToggle.addEventListener(

      "click",

      () => {


        const next =
          currentGridColumns === 1
            ? 2
            : 1;


        setGridColumns(
          next,
          true
        );

      }

    );


    toolbar.appendChild(
      mobileToggle
    );

  }

}


/* =========================================================
   APPLY GRID COLUMNS
========================================================= */

function setGridColumns(
  columns,
  persist = true
) {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (!grid) {
    return;
  }


  const mode =
    getGridViewMode();


  const config =
    GRID_VIEW_CONFIG[mode];


  let value =
    Number.parseInt(
      columns,
      10
    );


  if (
    !Number.isFinite(
      value
    )
  ) {

    value =
      config.defaultColumns;

  }


  value =
    Math.min(

      config.max,

      Math.max(
        config.min,
        value
      )

    );


  currentGridMode =
    mode;


  currentGridColumns =
    value;


  grid.style.setProperty(

    "--locan-grid-columns",

    String(value)

  );


  grid.dataset.gridColumns =
    String(value);


  for (
    let i = 1;
    i <= 5;
    i += 1
  ) {

    grid.classList.remove(
      `grid-cols-${i}`
    );

  }


  grid.classList.add(
    `grid-cols-${value}`
  );


  if (
    persist
  ) {

    storeGridColumns(
      mode,
      value
    );

  }


  updateGridViewControl();

}


/* =========================================================
   CHANGE GRID COLUMNS
========================================================= */

function changeGridColumns(
  direction
) {

  const mode =
    getGridViewMode();


  const config =
    GRID_VIEW_CONFIG[mode];


  const next =

    Math.min(

      config.max,

      Math.max(

        config.min,

        currentGridColumns
        +
        direction

      )

    );


  setGridColumns(
    next,
    true
  );

}


/* =========================================================
   LOAD SAVED GRID
========================================================= */

function applySavedGridView() {

  const mode =
    getGridViewMode();


  const columns =
    getStoredGridColumns(
      mode
    );


  setGridColumns(
    columns,
    false
  );

}


/* =========================================================
   GRID CONTROL STATE / LANGUAGE
========================================================= */

function updateGridViewControl() {

  const mode =
    getGridViewMode();


  const config =
    GRID_VIEW_CONFIG[mode];


  const increase =
    document.getElementById(
      "grid-view-increase"
    );


  const decrease =
    document.getElementById(
      "grid-view-decrease"
    );


  const number =
    document.getElementById(
      "grid-view-number"
    );


  const mobileToggle =
    document.getElementById(
      "grid-mobile-toggle"
    );


  const isVietnamese =
    currentLang === "vi";


  if (
    number
  ) {

    number.textContent =
      String(
        currentGridColumns
      );


    number.setAttribute(

      "aria-label",

      isVietnamese

        ? `${currentGridColumns} cột`

        : `${currentGridColumns} columns`

    );

  }


  if (
    increase
  ) {

    increase.disabled =
      currentGridColumns
      >=
      config.max;


    increase.setAttribute(

      "aria-label",

      isVietnamese

        ? "Tăng số cột"

        : "Increase grid columns"

    );


    increase.title =

      isVietnamese

        ? "Tăng số cột"

        : "Increase columns";

  }


  if (
    decrease
  ) {

    decrease.disabled =
      currentGridColumns
      <=
      config.min;


    decrease.setAttribute(

      "aria-label",

      isVietnamese

        ? "Giảm số cột"

        : "Decrease grid columns"

    );


    decrease.title =

      isVietnamese

        ? "Giảm số cột"

        : "Decrease columns";

  }


  const control =
    document.getElementById(
      "grid-view-control"
    );


  if (
    control
  ) {

    control.setAttribute(

      "aria-label",

      isVietnamese

        ? "Điều chỉnh bố cục lưới"

        : "Adjust grid layout"

    );

  }


  if (
    mobileToggle
  ) {

    mobileToggle.textContent =

      isVietnamese

        ? `▦  LƯỚI · ${currentGridColumns}`

        : `▦  GRID · ${currentGridColumns}`;


    mobileToggle.setAttribute(

      "aria-label",

      isVietnamese

        ? (
            currentGridColumns === 1

              ? "Chuyển sang lưới 2 cột"

              : "Chuyển sang lưới 1 cột"
          )

        : (
            currentGridColumns === 1

              ? "Switch to 2-column grid"

              : "Switch to 1-column grid"
          )

    );

  }

}


/* =========================================================
   RESPONSIVE GRID MODE
========================================================= */

function handleGridViewResize() {

  clearTimeout(
    gridResizeTimer
  );


  gridResizeTimer =
    setTimeout(
      () => {


        const mode =
          getGridViewMode();


        /*
           If the viewport moved into
           a different device category,
           load that category's own setting.
        */

        if (
          mode !==
          currentGridMode
        ) {

          applySavedGridView();

          return;

        }


        /*
           Otherwise simply ensure
           the value still remains valid.
        */

        setGridColumns(
          currentGridColumns,
          false
        );


      },
      120
    );

}


window.addEventListener(

  "resize",

  handleGridViewResize

);


/* =========================================================
   STATIC TEXT
========================================================= */

function updateStaticText() {

  const t =
    translations[
      currentLang
    ];


  document.documentElement.lang =
    currentLang;


  const title =
    document.querySelector(
      '[data-i18n="mainTitle"]'
    );


  const subtitle =
    document.querySelector(
      '[data-i18n="mainSubtitle"]'
    );


  if (
    title
  ) {

    title.textContent =
      t.mainTitle;

  }


  if (
    subtitle
  ) {

    subtitle.textContent =
      t.mainSubtitle;

  }


  const sortLabel =
    document.getElementById(
      "sort-label"
    );


  const filterTitle =
    document.getElementById(
      "filter-title"
    );


  const clearButton =
    document.getElementById(
      "clear-filters"
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


  if (
    sortLabel
  ) {

    sortLabel.textContent =
      t.sortLabel;

  }


  if (
    filterTitle
  ) {

    filterTitle.textContent =
      t.filterTitle;

  }


  if (
    clearButton
  ) {

    clearButton.textContent =
      t.clearFilters;

  }


  if (
    editionLabel
  ) {

    editionLabel.textContent =
      t.editionLabel;

  }


  if (
    conditionLabel
  ) {

    conditionLabel.textContent =
      t.conditionLabel;

  }


  if (
    sizeLabel
  ) {

    sizeLabel.textContent =
      t.sizeLabel;

  }


  const select =
    document.getElementById(
      "sort-select"
    );


  if (
    select
  ) {

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


    [
      ...select.options
    ]

      .forEach(
        option => {

          option.textContent =
            names[
              option.value
            ]
            ||
            option.textContent;

        }
      );


    select.value =
      currentSort;

  }


  document

    .getElementById(
      "btn-vi"
    )

    ?.classList

    .toggle(

      "active",

      currentLang === "vi"

    );


  document

    .getElementById(
      "btn-en"
    )

    ?.classList

    .toggle(

      "active",

      currentLang === "en"

    );


  updateGridViewControl();

}


/* =========================================================
   COLLECTION COUNT
========================================================= */

function updateCollectionCount(
  count
) {

  const element =
    document.getElementById(
      "collection-count"
    );


  if (!element) {
    return;
  }


  element.textContent =

    translations[
      currentLang
    ]

      .total(
        count
      );

}


/* =========================================================
   CARD
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


  const edition =
    getLocalizedText(
      sneaker.editionType
    );


  const detailURL =

    `./shoe.html?id=${encodeURIComponent(
      sneaker.id
    )}`

    +

    `&lang=${encodeURIComponent(
      currentLang
    )}`;


  const badge =
    edition

      ? `

        <span class="badge">

          ${escapeHTML(
            edition
          )}

        </span>

      `

      : `

        <span
          class="badge badge-placeholder"
        >
          &nbsp;
        </span>

      `;


  return `

    <a

      href="${detailURL}"

      class="card-link"

      aria-label="${escapeHTML(
        title
      )}"

    >

      <article class="card">


        <div class="card-img-wrapper">

          <img

            src="${escapeHTML(
              sneaker.image || ""
            )}"

            alt="${escapeHTML(
              title
            )}"

            loading="lazy"

            decoding="async"

          >

        </div>


        <div class="card-info">


          <h3>

            ${escapeHTML(
              title
            )}

          </h3>


          <p class="subtitle">

            ${escapeHTML(
              subtitle
            )}

          </p>


          <div class="card-meta">

            ${badge}


            <span class="size">

              ${escapeHTML(
                sneaker.size || ""
              )}

            </span>

          </div>


          <span class="card-cta">

            ${translations[
              currentLang
            ].viewMore}

          </span>


        </div>


      </article>

    </a>

  `;

}


/* =========================================================
   GRID RENDER
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

    typeof sneakers ===
      "undefined"

    ||

    !Array.isArray(
      sneakers
    )

  ) {

    grid.innerHTML = `

      <div class="not-found">

        Collection data could not be loaded.

      </div>

    `;


    updateCollectionCount(
      0
    );


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


  updateCollectionCount(
    sorted.length
  );


  if (
    sorted.length === 0
  ) {

    grid.innerHTML = `

      <div class="not-found">

        ${escapeHTML(
          translations[
            currentLang
          ].noResults
        )}

      </div>

    `;


    return;

  }


  grid.innerHTML =

    sorted

      .map(
        renderCard
      )

      .join("");

}


/* =========================================================
   SET LANGUAGE
========================================================= */

function setLanguage(
  lang
) {

  currentLang =
    normalizeLanguage(
      lang
    );


  localStorage.setItem(

    "locan_lang",

    currentLang

  );


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

    url.pathname
    +
    url.search
    +
    url.hash

  );


  updateStaticText();

  renderSizeFilters();

  updateFilterInterface();

  renderGrid();

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  () => {


    /*
       Grid controls first,
       so language update can also
       update their labels.
    */

    createGridViewControls();


    /*
       Load remembered layout
       for the current device class.
    */

    applySavedGridView();


    updateStaticText();

    renderSizeFilters();

    updateFilterInterface();

    renderGrid();

  }

);
