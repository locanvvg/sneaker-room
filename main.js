/* =========================================================
   LỘC AN SNEAKER COLLECTION
   HOMEPAGE LOGIC

   - LANGUAGE
   - SORT
   - FILTER
   - SEARCH-COMPATIBLE RENDERING
   - ADJUSTABLE GRID 1–5 COLUMNS
   - HORIZONTAL GRID DENSITY SLIDER
   - 3D COVER-FLOW VIEW
========================================================= */

const SUPPORTED_LANGUAGES = ["vi", "en"];

const translations = {
  vi: {
    mainTitle: "LỘC AN SNEAKER COLLECTION",
    mainSubtitle: "Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số",

    sortLabel: "SẮP XẾP",
    sortDefault: "Mặc định",
    sortAZ: "A → Z",
    sortZA: "Z → A",
    sortDateDesc: "Ngày phát hành: Mới → Cũ",
    sortDateAsc: "Ngày phát hành: Cũ → Mới",
    sortSizeAsc: "Size nhỏ → lớn",
    sortSizeDesc: "Size lớn → nhỏ",

    filterTitle: "BỘ LỌC BỘ SƯU TẬP",
    clearFilters: "XÓA BỘ LỌC",

    editionLabel: "PHÂN KHÚC",
    conditionLabel: "TÌNH TRẠNG",
    sizeLabel: "KÍCH CỠ",

    total: count => `TỔNG SỐ: ${count} ĐÔI`,

    viewMore: "XEM THÊM →",

    noResults:
      "Không có hiện vật phù hợp với bộ lọc hiện tại.",

    gridLabel:
      columns => `LƯỚI · ${columns} CỘT`,

    decreaseGrid:
      "Giảm số cột",

    increaseGrid:
      "Tăng số cột",

    gridRange:
      "Điều chỉnh số cột trong lưới",

    view3D:
      "3D VIEW",

    backToGrid:
      "GRID VIEW",

    previous:
      "Đôi trước",

    next:
      "Đôi tiếp theo",

    galleryHint:
      "KÉO / VUỐT ĐỂ XEM · NHẤN ĐÔI Ở GIỮA ĐỂ MỞ"
  },


  en: {
    mainTitle: "LỘC AN SNEAKER COLLECTION",
    mainSubtitle: "Digital Sneaker Archive & Museum",

    sortLabel: "SORT",
    sortDefault: "Default",
    sortAZ: "A → Z",
    sortZA: "Z → A",
    sortDateDesc: "Release date: Newest → Oldest",
    sortDateAsc: "Release date: Oldest → Newest",
    sortSizeAsc: "Size: Small → Large",
    sortSizeDesc: "Size: Large → Small",

    filterTitle: "COLLECTION FILTERS",
    clearFilters: "CLEAR FILTERS",

    editionLabel: "EDITION",
    conditionLabel: "CONDITION",
    sizeLabel: "SIZE",

    total:
      count => `TOTAL: ${count} PAIRS`,

    viewMore:
      "VIEW MORE →",

    noResults:
      "No artifacts match the current filters.",

    gridLabel:
      columns => `GRID · ${columns} COLUMNS`,

    decreaseGrid:
      "Decrease grid columns",

    increaseGrid:
      "Increase grid columns",

    gridRange:
      "Adjust the number of grid columns",

    view3D:
      "3D VIEW",

    backToGrid:
      "GRID VIEW",

    previous:
      "Previous sneaker",

    next:
      "Next sneaker",

    galleryHint:
      "DRAG / SWIPE TO BROWSE · TAP THE CENTER PAIR TO OPEN"
  }
};


/* =========================================================
   LANGUAGE
========================================================= */

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
    localStorage.getItem("locan_lang")
    ||
    "vi"
  );


let currentSort =
  "default";


const activeFilters = {
  edition: new Set(),
  condition: new Set(),
  size: new Set()
};


/* =========================================================
   HELPERS
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


function safeStorageGet(key) {

  try {

    return localStorage.getItem(
      key
    );

  } catch (_) {

    return null;

  }

}


function safeStorageSet(
  key,
  value
) {

  try {

    localStorage.setItem(
      key,
      String(value)
    );

  } catch (_) {

    /*
      Storage is optional.
      Website still works without it.
    */

  }

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
        typeof value === "string"
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

     /* CUSTOM 1/1 */

  if (

    corpus.includes(
      "CUSTOM 1/1"
    )

    ||

    corpus.includes(
      "CUSTOM 1 OF 1"
    )

    ||

    corpus.includes(
      "CUSTOM 1-OF-1"
    )

    ||

    corpus.includes(
      "PERSONAL CUSTOM 1/1"
    )

  ) {

    categories.add(
      "Custom 1/1"
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
    If the sneaker has no special category,
    use GR.
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
        activeFilters.edition.size > 0
      ) {

        const categories =
          getEditionCategories(
            sneaker
          );


        const match = [

          ...activeFilters.edition

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
        activeFilters.condition.size > 0
      ) {

        if (

          !activeFilters.condition.has(

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
    /^\d{4}-\d{2}$/.test(text)

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
   FILTER ACTIONS
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

  reset3DPosition();

  renderGrid();

}


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

  reset3DPosition();

  renderGrid();

}


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
    allowed.includes(value)

      ? value

      : "default";


  reset3DPosition();

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
            set.has(value)
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

      activeFilters.edition.size > 0

      ||

      activeFilters.condition.size > 0

      ||

      activeFilters.size.size > 0;


    clearButton
      .classList
      .toggle(

        "visible",

        hasActiveFilters

      );

  }

}


/* =========================================================
   COLLECTION VIEW STATE
========================================================= */

const GRID_MIN =
  1;


const GRID_MAX =
  5;


let collectionViewMode =

  safeStorageGet(
    "locan_collection_view"
  ) === "3d"

    ? "3d"

    : "grid";


let gridColumns =
  3;


let gridDevice =
  null;


let resizeTimer =
  null;


let slideItems =
  [];


let slideIndex =
  0;


let slideActiveId =
  null;


let pointerStartX =
  null;


let pointerStartY =
  null;


let pointerMoved =
  false;


/* =========================================================
   RESPONSIVE DEVICE
========================================================= */

function getGridDevice() {

  if (
    window.innerWidth <= 650
  ) {

    return "mobile";

  }


  if (
    window.innerWidth <= 950
  ) {

    return "tablet";

  }


  return "desktop";

}


/* =========================================================
   DEFAULT GRID
========================================================= */

function getDefaultGridColumns(
  device
) {

  if (
    device === "mobile"
  ) {

    return 1;

  }


  if (
    device === "tablet"
  ) {

    return 2;

  }


  return 3;

}


/* =========================================================
   GRID STORAGE
========================================================= */

function getGridStorageKey(
  device
) {

  return `locan_grid_columns_${device}`;

}


function readGridColumns(
  device
) {

  const stored =
    Number.parseInt(

      safeStorageGet(
        getGridStorageKey(
          device
        )
      ),

      10

    );


  if (
    Number.isFinite(
      stored
    )
  ) {

    return Math.min(

      GRID_MAX,

      Math.max(
        GRID_MIN,
        stored
      )

    );

  }


  return getDefaultGridColumns(
    device
  );

}


/* =========================================================
   SET GRID COLUMNS
========================================================= */

function setGridColumns(
  value,
  persist = true
) {

  const next =
    Math.min(

      GRID_MAX,

      Math.max(

        GRID_MIN,

        Number.parseInt(
          value,
          10
        ) || 1

      )

    );


  gridDevice =
    getGridDevice();


  gridColumns =
    next;


  if (
    persist
  ) {

    safeStorageSet(

      getGridStorageKey(
        gridDevice
      ),

      gridColumns

    );

  }


  applyGridLayout();

  updateCollectionViewControls();

}


/* =========================================================
   STEP GRID
========================================================= */

function stepGridColumns(
  delta
) {

  if (
    collectionViewMode !== "grid"
  ) {

    return;

  }


  setGridColumns(

    gridColumns + delta,

    true

  );

}


/* =========================================================
   APPLY GRID LAYOUT
========================================================= */

function applyGridLayout() {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (!grid) {
    return;
  }


  grid.classList.remove(

    "locan-grid-view",

    "locan-3d-view",

    "grid-cols-1",

    "grid-cols-2",

    "grid-cols-3",

    "grid-cols-4",

    "grid-cols-5"

  );


  if (
    collectionViewMode === "3d"
  ) {

    grid.classList.add(
      "locan-3d-view"
    );


    grid.style.removeProperty(
      "--locan-grid-columns"
    );


    return;

  }


  grid.classList.add(

    "locan-grid-view",

    `grid-cols-${gridColumns}`

  );


  grid.style.setProperty(

    "--locan-grid-columns",

    String(
      gridColumns
    )

  );

}


/* =========================================================
   SET COLLECTION VIEW
========================================================= */

function setCollectionViewMode(
  mode
) {

  collectionViewMode =
    mode === "3d"
      ? "3d"
      : "grid";


  safeStorageSet(

    "locan_collection_view",

    collectionViewMode

  );


  if (
    collectionViewMode === "3d"
  ) {

    reset3DPosition();

  }


  applyGridLayout();

  updateCollectionViewControls();

  renderGrid();

}


function toggleCollectionViewMode() {

  setCollectionViewMode(

    collectionViewMode === "3d"

      ? "grid"

      : "3d"

  );

}


/* =========================================================
   VIEW UI
========================================================= */

function createCollectionViewUI() {

  if (
    document.getElementById(
      "collection-display-row"
    )
  ) {

    return;

  }


  const filterPanel =
    document.querySelector(
      ".filter-panel"
    );


  const count =
    document.getElementById(
      "collection-count"
    );


  const toolbar =
    document.querySelector(
      ".collection-toolbar"
    );


  if (
    !filterPanel
    ||
    !count
  ) {

    return;

  }


  /* =====================================================
     DISPLAY ROW
  ===================================================== */

  const displayRow =
    document.createElement(
      "div"
    );


  displayRow.id =
    "collection-display-row";


  displayRow.className =
    "collection-display-row";


  /* =====================================================
     LEFT SPACER

     Desktop:
     [ empty ] [ GRID SLIDER ] [ TOTAL ]

     This keeps slider visually centered.
  ===================================================== */

  const spacer =
    document.createElement(
      "div"
    );


  spacer.className =
    "collection-display-spacer";


  spacer.setAttribute(
    "aria-hidden",
    "true"
  );


  /* =====================================================
     GRID SLIDER
  ===================================================== */

  const density =
    document.createElement(
      "div"
    );


  density.id =
    "grid-density-control";


  density.className =
    "grid-density-control";


  density.innerHTML = `

    <div
      id="grid-density-label"
      class="grid-density-label"
    >
      LƯỚI · 3 CỘT
    </div>


    <div class="grid-density-slider-row">


      <button

        type="button"

        id="grid-density-minus"

        class="grid-density-step"

        aria-label="Giảm số cột"

      >

        −

      </button>


      <div class="grid-density-range-wrap">


        <input

          type="range"

          id="grid-density-range"

          class="grid-density-range"

          min="1"

          max="5"

          step="1"

          value="3"

          aria-label="Điều chỉnh số cột trong lưới"

        >


        <div
          class="grid-density-ticks"
          aria-hidden="true"
        >

          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>

        </div>


      </div>


      <button

        type="button"

        id="grid-density-plus"

        class="grid-density-step"

        aria-label="Tăng số cột"

      >

        +

      </button>


    </div>

  `;


  /*
     Insert row immediately under
     the filter panel.
  */

  filterPanel
    .insertAdjacentElement(
      "afterend",
      displayRow
    );


  /*
     Move existing collection count
     into this row.
  */

  displayRow.appendChild(
    spacer
  );


  displayRow.appendChild(
    density
  );


  displayRow.appendChild(
    count
  );


  /* =====================================================
     SLIDER EVENTS
  ===================================================== */

  document

    .getElementById(
      "grid-density-minus"
    )

    ?.addEventListener(

      "click",

      () =>

        stepGridColumns(
          -1
        )

    );


  document

    .getElementById(
      "grid-density-plus"
    )

    ?.addEventListener(

      "click",

      () =>

        stepGridColumns(
          1
        )

    );


  document

    .getElementById(
      "grid-density-range"
    )

    ?.addEventListener(

      "input",

      event => {

        if (
          collectionViewMode === "3d"
        ) {

          return;

        }


        setGridColumns(

          event.target.value,

          true

        );

      }

    );


  /* =====================================================
     SEPARATE 3D BUTTON
  ===================================================== */

  if (

    toolbar

    &&

    !document.getElementById(
      "collection-3d-toggle"
    )

  ) {

    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.id =
      "collection-3d-toggle";


    button.className =
      "collection-3d-toggle";


    button.addEventListener(

      "click",

      toggleCollectionViewMode

    );


    toolbar.appendChild(
      button
    );

  }

}


/* =========================================================
   RANGE PROGRESS
========================================================= */

function updateRangeProgress(
  range
) {

  if (!range) {
    return;
  }


  const min =
    Number(
      range.min
    ) || GRID_MIN;


  const max =
    Number(
      range.max
    ) || GRID_MAX;


  const value =
    Number(
      range.value
    ) || gridColumns;


  const progress =

    (
      (
        value - min
      )

      /

      (
        max - min
      )
    )

    * 100;


  range.style.setProperty(

    "--range-progress",

    `${progress}%`

  );

}


/* =========================================================
   UPDATE VIEW CONTROLS
========================================================= */

function updateCollectionViewControls() {

  const t =
    translations[
      currentLang
    ];


  const range =
    document.getElementById(
      "grid-density-range"
    );


  const minus =
    document.getElementById(
      "grid-density-minus"
    );


  const plus =
    document.getElementById(
      "grid-density-plus"
    );


  const label =
    document.getElementById(
      "grid-density-label"
    );


  const toggle3D =
    document.getElementById(
      "collection-3d-toggle"
    );


  /* RANGE */

  if (
    range
  ) {

    range.value =
      String(
        gridColumns
      );


    range.disabled =
      collectionViewMode === "3d";


    range.setAttribute(

      "aria-label",

      t.gridRange

    );


    updateRangeProgress(
      range
    );

  }


  /* MINUS */

  if (
    minus
  ) {

    minus.disabled =

      collectionViewMode === "3d"

      ||

      gridColumns <= GRID_MIN;


    minus.setAttribute(

      "aria-label",

      t.decreaseGrid

    );


    minus.title =
      t.decreaseGrid;

  }


  /* PLUS */

  if (
    plus
  ) {

    plus.disabled =

      collectionViewMode === "3d"

      ||

      gridColumns >= GRID_MAX;


    plus.setAttribute(

      "aria-label",

      t.increaseGrid

    );


    plus.title =
      t.increaseGrid;

  }


  /* LABEL */

  if (
    label
  ) {

    label.textContent =
      t.gridLabel(
        gridColumns
      );

  }


  /* DISABLE SLIDER VISUALLY IN 3D */

  const density =
    document.getElementById(
      "grid-density-control"
    );


  if (
    density
  ) {

    density.classList.toggle(

      "disabled",

      collectionViewMode === "3d"

    );

  }


  /* 3D BUTTON */

  if (
    toggle3D
  ) {

    const active =
      collectionViewMode === "3d";


    toggle3D.textContent =

      active

        ? t.backToGrid

        : t.view3D;


    toggle3D.classList.toggle(

      "active",

      active

    );


    toggle3D.setAttribute(

      "aria-label",

      active
        ? t.backToGrid
        : t.view3D

    );

  }

}


/* =========================================================
   COLLECTION VIEW STYLES
========================================================= */

function installCollectionViewStyles() {

  if (
    document.getElementById(
      "locan-collection-view-styles"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "locan-collection-view-styles";


  style.textContent = `

    /* =====================================================
       HORIZONTAL GRID CONTROL + TOTAL
    ===================================================== */

    .collection-display-row {

      display: grid;

      grid-template-columns:
        1fr
        minmax(360px, 520px)
        1fr;

      align-items: center;

      gap: 24px;

      width: 100%;

      margin:
        0
        0
        24px;

    }


    .collection-display-spacer {

      min-width: 0;

    }


    .collection-display-row
    .collection-count {

      justify-self: end;

      margin: 0 !important;

    }


    /* =====================================================
       GRID SLIDER CONTAINER
    ===================================================== */

    .grid-density-control {

      width: 100%;

      min-width: 0;

      padding:
        10px
        16px
        8px;

      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,0.043),
          rgba(255,255,255,0.018)
        );

      border:
        1px solid
        rgba(255,255,255,0.09);

      border-radius: 14px;

      box-shadow:

        inset
        0
        1px
        0
        rgba(255,255,255,0.055),

        0
        10px
        28px
        rgba(0,0,0,0.12);

      backdrop-filter:
        blur(18px)
        saturate(130%);

      -webkit-backdrop-filter:
        blur(18px)
        saturate(130%);

      transition:
        opacity 0.2s ease,
        border-color 0.2s ease;

    }


    .grid-density-control.disabled {

      opacity: 0.38;

    }


    /* =====================================================
       GRID LABEL
    ===================================================== */

    .grid-density-label {

      margin-bottom: 5px;

      color: #777b83;

      font-size: 0.62rem;

      font-weight: 850;

      letter-spacing: 1.25px;

      text-align: center;

    }


    /* =====================================================
       SLIDER ROW
    ===================================================== */

    .grid-density-slider-row {

      display: grid;

      grid-template-columns:
        34px
        minmax(0, 1fr)
        34px;

      align-items: center;

      gap: 13px;

    }


    /* =====================================================
       − / + BUTTONS
    ===================================================== */

    .grid-density-step {

      display: grid;

      place-items: center;

      width: 34px;

      height: 34px;

      padding: 0;

      color: #92959d;

      background:
        rgba(
          255,
          255,
          255,
          0.025
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.075
        );

      border-radius: 50%;

      cursor: pointer;

      font-size: 1.12rem;

      line-height: 1;

      transition:
        color 0.18s ease,
        border-color 0.18s ease,
        background 0.18s ease,
        transform 0.18s ease;

    }


    .grid-density-step:hover:not(:disabled) {

      color: #ffcc00;

      border-color:
        rgba(
          255,
          204,
          0,
          0.30
        );

      background:
        rgba(
          255,
          204,
          0,
          0.045
        );

      transform:
        scale(1.04);

    }


    .grid-density-step:disabled {

      opacity: 0.28;

      cursor: default;

    }


    /* =====================================================
       RANGE
    ===================================================== */

    .grid-density-range-wrap {

      min-width: 0;

    }


    .grid-density-range {

      --range-progress: 50%;

      display: block;

      width: 100%;

      height: 24px;

      margin: 0;

      padding: 0;

      appearance: none;

      -webkit-appearance: none;

      background: transparent;

      cursor: pointer;

    }


    .grid-density-range:disabled {

      cursor: default;

    }


    /* CHROME / EDGE / SAFARI TRACK */

    .grid-density-range::-webkit-slider-runnable-track {

      height: 4px;

      border-radius: 999px;

      background:

        linear-gradient(

          to right,

          #ffcc00 0%,

          #ffcc00
          var(--range-progress),

          #3c3c41
          var(--range-progress),

          #3c3c41 100%

        );

      box-shadow:

        inset
        0
        0
        0
        1px
        rgba(
          255,
          255,
          255,
          0.035
        );

    }


    /* CHROME / EDGE / SAFARI THUMB */

    .grid-density-range::-webkit-slider-thumb {

      width: 19px;

      height: 19px;

      margin-top: -7.5px;

      appearance: none;

      -webkit-appearance: none;

      background: #111114;

      border:
        3px solid
        #ffcc00;

      border-radius: 50%;

      box-shadow:

        0
        0
        0
        3px
        rgba(
          255,
          204,
          0,
          0.08
        ),

        0
        3px
        10px
        rgba(
          0,
          0,
          0,
          0.45
        );

      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    }


    .grid-density-range:hover::-webkit-slider-thumb {

      transform:
        scale(1.08);

      box-shadow:

        0
        0
        0
        5px
        rgba(
          255,
          204,
          0,
          0.10
        ),

        0
        3px
        11px
        rgba(
          0,
          0,
          0,
          0.48
        );

    }


    /* FIREFOX */

    .grid-density-range::-moz-range-track {

      height: 4px;

      border-radius: 999px;

      background: #3c3c41;

    }


    .grid-density-range::-moz-range-progress {

      height: 4px;

      border-radius: 999px;

      background: #ffcc00;

    }


    .grid-density-range::-moz-range-thumb {

      width: 15px;

      height: 15px;

      background: #111114;

      border:
        3px solid
        #ffcc00;

      border-radius: 50%;

      box-shadow:

        0
        0
        0
        3px
        rgba(
          255,
          204,
          0,
          0.08
        ),

        0
        3px
        10px
        rgba(
          0,
          0,
          0,
          0.45
        );

    }


    /* =====================================================
       TICKS 1–5
    ===================================================== */

    .grid-density-ticks {

      display: flex;

      justify-content: space-between;

      padding:
        0
        2px;

      margin-top: -2px;

      color: #505158;

      font-size: 0.50rem;

      font-weight: 800;

      line-height: 1;

    }


    /* =====================================================
       SEPARATE 3D BUTTON
    ===================================================== */

    .collection-3d-toggle {

      min-height: 39px;

      margin-left: 12px;

      padding:
        9px
        13px;

      color: #8e929a;

      background:
        rgba(
          255,
          255,
          255,
          0.025
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.09
        );

      border-radius: 9px;

      cursor: pointer;

      font-size: 0.66rem;

      font-weight: 900;

      letter-spacing: 1px;

      transition:
        color 0.18s ease,
        border-color 0.18s ease,
        background 0.18s ease;

    }


    .collection-3d-toggle:hover,
    .collection-3d-toggle.active {

      color: #ffcc00;

      border-color:
        rgba(
          255,
          204,
          0,
          0.24
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
       DYNAMIC GRID
    ===================================================== */

    #sneaker-grid.locan-grid-view {

      --locan-grid-columns: 3;

      display: grid !important;

      grid-template-columns:

        repeat(

          var(
            --locan-grid-columns
          ),

          minmax(
            0,
            1fr
          )

        ) !important;

      align-items:
        stretch !important;

    }


    /* =====================================================
       1 COLUMN
    ===================================================== */

    #sneaker-grid.locan-grid-view.grid-cols-1 {

      max-width: 760px;

      margin-left: auto;

      margin-right: auto;

    }


    /* =====================================================
       GAPS
    ===================================================== */

    #sneaker-grid.locan-grid-view.grid-cols-2,
    #sneaker-grid.locan-grid-view.grid-cols-3 {

      gap: 28px;

    }


    #sneaker-grid.locan-grid-view.grid-cols-4 {

      gap: 20px;

    }


    #sneaker-grid.locan-grid-view.grid-cols-5 {

      gap: 16px;

    }


    /* =====================================================
       FOUR COLUMN DENSITY
    ===================================================== */

    #sneaker-grid.grid-cols-4
    .card-info {

      min-height: 178px;

      padding: 17px;

    }


    #sneaker-grid.grid-cols-4
    .card-info h3 {

      font-size: 0.98rem;

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
       FIVE COLUMN DENSITY
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

    }


    /* =====================================================
       3D COVER FLOW
    ===================================================== */

    #sneaker-grid.locan-3d-view {

      display: block !important;

      width: 100% !important;

      max-width: none !important;

      margin: 0 !important;

      overflow: visible !important;

    }


    .sneaker-3d-gallery {

      position: relative;

      width: 100%;

      min-height: 620px;

      overflow: hidden;

      border-radius: 24px;

      outline: none;

      perspective: 1450px;

      perspective-origin:
        50% 45%;

      touch-action:
        pan-y;

      user-select:
        none;

    }


    .sneaker-3d-gallery::before {

      content: "";

      position: absolute;

      inset:
        8%
        8%
        12%;

      pointer-events: none;

      background:

        radial-gradient(

          circle at center,

          rgba(
            255,
            255,
            255,
            0.048
          ),

          rgba(
            255,
            255,
            255,
            0.018
          ) 34%,

          transparent 70%

        );

      filter:
        blur(18px);

    }


    .sneaker-3d-stage {

      position: relative;

      width: 100%;

      height: 550px;

      transform-style:
        preserve-3d;

    }


    .sneaker-3d-card {

      position: absolute;

      top: 48%;

      left: 50%;

      width:
        min(
          360px,
          30vw
        );

      min-width: 270px;

      height: 480px;

      overflow: hidden;

      background:

        linear-gradient(

          145deg,

          rgba(
            255,
            255,
            255,
            0.075
          ),

          rgba(
            255,
            255,
            255,
            0.024
          ) 48%,

          rgba(
            255,
            255,
            255,
            0.016
          )

        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.13
        );

      border-radius: 22px;

      box-shadow:

        0
        30px
        55px
        rgba(
          0,
          0,
          0,
          0.44
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

      transform-style:
        preserve-3d;

      cursor: pointer;

      opacity: 0;

      transition:

        transform
        0.48s
        cubic-bezier(
          0.22,
          0.76,
          0.22,
          1
        ),

        opacity
        0.34s
        ease,

        filter
        0.34s
        ease,

        border-color
        0.24s
        ease;

    }


    /* ACTIVE */

    .sneaker-3d-card[data-offset="0"] {

      z-index: 5;

      opacity: 1;

      transform:

        translate(
          -50%,
          -50%
        )

        translateZ(
          110px
        )

        scale(1);

      border-color:
        rgba(
          255,
          204,
          0,
          0.20
        );

    }


    /* LEFT */

    .sneaker-3d-card[data-offset="-1"] {

      z-index: 4;

      opacity: 0.74;

      filter:
        brightness(0.72)
        saturate(0.82);

      transform:

        translate(
          -50%,
          -50%
        )

        translateX(
          -77%
        )

        translateZ(
          -80px
        )

        rotateY(
          27deg
        )

        scale(
          0.82
        );

    }


    /* RIGHT */

    .sneaker-3d-card[data-offset="1"] {

      z-index: 4;

      opacity: 0.74;

      filter:
        brightness(0.72)
        saturate(0.82);

      transform:

        translate(
          -50%,
          -50%
        )

        translateX(
          77%
        )

        translateZ(
          -80px
        )

        rotateY(
          -27deg
        )

        scale(
          0.82
        );

    }


    /* FAR LEFT */

    .sneaker-3d-card[data-offset="-2"] {

      z-index: 3;

      opacity: 0.32;

      filter:
        brightness(0.52)
        saturate(0.65);

      transform:

        translate(
          -50%,
          -50%
        )

        translateX(
          -128%
        )

        translateZ(
          -250px
        )

        rotateY(
          40deg
        )

        scale(
          0.64
        );

    }


    /* FAR RIGHT */

    .sneaker-3d-card[data-offset="2"] {

      z-index: 3;

      opacity: 0.32;

      filter:
        brightness(0.52)
        saturate(0.65);

      transform:

        translate(
          -50%,
          -50%
        )

        translateX(
          128%
        )

        translateZ(
          -250px
        )

        rotateY(
          -40deg
        )

        scale(
          0.64
        );

    }


    /* =====================================================
       3D IMAGE
    ===================================================== */

    .sneaker-3d-image {

      display: flex;

      align-items: center;

      justify-content: center;

      width: 100%;

      height: 285px;

    }


    .sneaker-3d-image img {

      display: block;

      width: 88%;

      height: 88%;

      object-fit: contain;

      object-position: center;

      background: transparent;

      filter:

        drop-shadow(

          0
          16px
          18px
          rgba(
            0,
            0,
            0,
            0.24
          )

        );

      pointer-events: none;

    }


    /* BAPE */

    .sneaker-3d-image
    img[src*="bapesta_stussy.png"] {

      width: 54%;

      height: 54%;

    }


    /* WAFFLE */

    .sneaker-3d-image
    img[src*="nike_waffle_racer_ow.png"] {

      width: 52%;

      height: 52%;

    }


    /* =====================================================
       3D INFO
    ===================================================== */

    .sneaker-3d-info {

      display: flex;

      flex-direction: column;

      min-height: 194px;

      padding:
        18px
        20px
        20px;

      border-top:
        1px solid
        rgba(
          255,
          255,
          255,
          0.055
        );

    }


    .sneaker-3d-info h3 {

      margin:
        0
        0
        8px;

      color: #f6f6f8;

      font-size: 1rem;

      line-height: 1.38;

    }


    .sneaker-3d-info p {

      margin:
        0
        0
        14px;

      color: #9699a2;

      font-size: 0.78rem;

      line-height: 1.45;

    }


    .sneaker-3d-meta {

      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 10px;

      margin-top: auto;

    }


    .sneaker-3d-meta span {

      padding:
        5px
        8px;

      color: #ffcc00;

      background:
        rgba(
          255,
          255,
          255,
          0.085
        );

      border-radius: 6px;

      font-size: 0.70rem;

    }


    .sneaker-3d-meta small {

      color: #b5bac3;

      font-size: 0.72rem;

    }


    /* =====================================================
       3D NAVIGATION
    ===================================================== */

    .sneaker-3d-nav {

      position: absolute;

      top: 46%;

      z-index: 20;

      display: grid;

      place-items: center;

      width: 46px;

      height: 46px;

      padding: 0;

      color: #a5a5aa;

      background:
        rgba(
          18,
          18,
          21,
          0.58
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.11
        );

      border-radius: 50%;

      backdrop-filter:
        blur(18px);

      -webkit-backdrop-filter:
        blur(18px);

      cursor: pointer;

      font-size: 1.6rem;

      transform:
        translateY(-50%);

    }


    .sneaker-3d-nav:hover {

      color: #ffcc00;

      border-color:
        rgba(
          255,
          204,
          0,
          0.26
        );

    }


    .sneaker-3d-prev {

      left: 18px;

    }


    .sneaker-3d-next {

      right: 18px;

    }


    /* =====================================================
       3D FOOTER
    ===================================================== */

    .sneaker-3d-footer {

      position: absolute;

      left: 50%;

      bottom: 17px;

      z-index: 15;

      display: flex;

      flex-direction: column;

      align-items: center;

      gap: 7px;

      transform:
        translateX(-50%);

      pointer-events: none;

    }


    .sneaker-3d-footer strong {

      color: #ffcc00;

      font-size: 0.72rem;

      letter-spacing: 1.4px;

    }


    .sneaker-3d-footer span {

      color: #626269;

      font-size: 0.58rem;

      font-weight: 800;

      letter-spacing: 1px;

      white-space: nowrap;

    }


    /* =====================================================
       TABLET
    ===================================================== */

    @media screen and (max-width: 950px) {


      .collection-display-row {

        grid-template-columns:
          minmax(0, 1fr)
          auto;

      }


      .collection-display-spacer {

        display: none;

      }


      .grid-density-control {

        width:
          min(
            100%,
            500px
          );

        justify-self: center;

      }


      .collection-display-row
      .collection-count {

        justify-self: end;

      }

    }


    /* =====================================================
       MOBILE

       TOTAL first.
       Slider directly under TOTAL.

       Still supports 1–5.
    ===================================================== */

    @media screen and (max-width: 650px) {


      .collection-toolbar {

        flex-wrap: wrap;

        gap: 10px;

      }


      /* 3D button full width */

      .collection-3d-toggle {

        width: 100%;

        margin-left: 0;

      }


      /* row becomes vertical */

      .collection-display-row {

        display: flex;

        flex-direction: column;

        gap: 11px;

        margin-bottom: 22px;

      }


      /* TOTAL FIRST */

      .collection-display-row
      .collection-count {

        order: 1;

        width: 100%;

        margin: 0 !important;

        text-align: center;

      }


      /* SLIDER SECOND */

      .grid-density-control {

        order: 2;

        width: 100%;

        padding:
          10px
          12px
          8px;

      }


      .grid-density-slider-row {

        grid-template-columns:
          32px
          minmax(0, 1fr)
          32px;

        gap: 10px;

      }


      .grid-density-step {

        width: 32px;

        height: 32px;

      }


      /* ===================================================
         MOBILE GRID
      =================================================== */

      #sneaker-grid.locan-grid-view {

        max-width: none !important;

        margin-left: 0 !important;

        margin-right: 0 !important;

      }


      /* ONE COLUMN */

      #sneaker-grid.locan-grid-view.grid-cols-1 {

        gap: 22px;

      }


      /* TWO COLUMNS */

      #sneaker-grid.locan-grid-view.grid-cols-2 {

        gap: 12px;

      }


      /* THREE */

      #sneaker-grid.locan-grid-view.grid-cols-3 {

        gap: 9px;

      }


      /* FOUR / FIVE */

      #sneaker-grid.locan-grid-view.grid-cols-4,

      #sneaker-grid.locan-grid-view.grid-cols-5 {

        gap: 7px;

      }


      /* ===================================================
         MOBILE 2 COLUMNS
      =================================================== */

      #sneaker-grid.grid-cols-2
      .card-info {

        min-height: 146px;

        padding: 11px;

      }


      #sneaker-grid.grid-cols-2
      .card-info h3 {

        font-size: 0.77rem;

        line-height: 1.31;

      }


      #sneaker-grid.grid-cols-2
      .card-info .subtitle {

        font-size: 0.65rem;

      }


      /* ===================================================
         MOBILE 3 COLUMNS
         Compact catalogue preview
      =================================================== */

      #sneaker-grid.grid-cols-3
      .card {

        border-radius: 11px;

      }


      #sneaker-grid.grid-cols-3
      .card-info {

        min-height: 94px;

        padding: 8px;

      }


      #sneaker-grid.grid-cols-3
      .card-info h3 {

        margin: 0;

        font-size: 0.62rem;

        line-height: 1.25;

      }


      #sneaker-grid.grid-cols-3
      .card-info .subtitle,

      #sneaker-grid.grid-cols-3
      .card-meta,

      #sneaker-grid.grid-cols-3
      .card-cta {

        display: none;

      }


      /* ===================================================
         MOBILE 4–5 COLUMNS
         VISUAL OVERVIEW
      =================================================== */

      #sneaker-grid.grid-cols-4
      .card,

      #sneaker-grid.grid-cols-5
      .card {

        border-radius: 9px;

      }


      #sneaker-grid.grid-cols-4
      .card-info,

      #sneaker-grid.grid-cols-5
      .card-info {

        display: none;

      }


      #sneaker-grid.grid-cols-4
      .card-img-wrapper,

      #sneaker-grid.grid-cols-5
      .card-img-wrapper {

        aspect-ratio:
          1 / 1;

      }


      /* ===================================================
         3D MOBILE
      =================================================== */

      .sneaker-3d-gallery {

        min-height: 540px;

        border-radius: 18px;

        perspective: 1100px;

      }


      .sneaker-3d-stage {

        height: 485px;

      }


      .sneaker-3d-card {

        top: 47%;

        width:
          min(
            78vw,
            330px
          );

        min-width: 0;

        height: 420px;

      }


      .sneaker-3d-card[data-offset="0"] {

        transform:

          translate(
            -50%,
            -50%
          )

          translateZ(
            80px
          )

          scale(1);

      }


      .sneaker-3d-card[data-offset="-1"] {

        opacity: 0.46;

        transform:

          translate(
            -50%,
            -50%
          )

          translateX(
            -82%
          )

          translateZ(
            -100px
          )

          rotateY(
            30deg
          )

          scale(
            0.72
          );

      }


      .sneaker-3d-card[data-offset="1"] {

        opacity: 0.46;

        transform:

          translate(
            -50%,
            -50%
          )

          translateX(
            82%
          )

          translateZ(
            -100px
          )

          rotateY(
            -30deg
          )

          scale(
            0.72
          );

      }


      .sneaker-3d-card[data-offset="-2"],

      .sneaker-3d-card[data-offset="2"] {

        opacity: 0;

        pointer-events: none;

      }


      .sneaker-3d-image {

        height: 245px;

      }


      .sneaker-3d-info {

        min-height: 174px;

        padding:
          15px
          16px
          17px;

      }


      .sneaker-3d-info h3 {

        font-size: 0.9rem;

      }


      .sneaker-3d-info p {

        font-size: 0.72rem;

      }


      .sneaker-3d-nav {

        display: none;

      }


      .sneaker-3d-footer {

        bottom: 10px;

      }


      .sneaker-3d-footer span {

        max-width: 88vw;

        overflow: hidden;

        text-overflow: ellipsis;

        font-size: 0.52rem;

      }

    }


    /* =====================================================
       SMALL MOBILE
    ===================================================== */

    @media screen and (max-width: 430px) {


      .grid-density-label {

        font-size: 0.58rem;

      }


      .grid-density-ticks {

        font-size: 0.47rem;

      }

    }


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    @media
    (prefers-reduced-motion: reduce) {


      .sneaker-3d-card,

      .grid-density-step,

      .collection-3d-toggle {

        transition:
          none !important;

      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   3D GALLERY
========================================================= */

function reset3DPosition() {

  slideIndex =
    0;


  slideActiveId =
    null;

}


function wrapIndex(
  index,
  length
) {

  return length > 0

    ? (
        (
          index % length
        )
        +
        length
      )
      %
      length

    : 0;

}


function offsetsFor(
  length
) {

  if (
    length <= 1
  ) {

    return [0];

  }


  if (
    length === 2
  ) {

    return [
      0,
      1
    ];

  }


  if (
    length === 3
  ) {

    return [
      -1,
      0,
      1
    ];

  }


  if (
    length === 4
  ) {

    return [
      -1,
      0,
      1,
      2
    ];

  }


  return [
    -2,
    -1,
    0,
    1,
    2
  ];

}


/* =========================================================
   DETAIL URL
========================================================= */

function getDetailURL(
  sneaker
) {

  return (

    `./shoe.html?id=${encodeURIComponent(
      sneaker.id
    )}`

    +

    `&lang=${encodeURIComponent(
      currentLang
    )}`

  );

}


/* =========================================================
   3D CARD
========================================================= */

function render3DCard(
  sneaker,
  index,
  offset
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


  return `

    <article

      class="sneaker-3d-card"

      data-index="${index}"

      data-offset="${offset}"

      tabindex="0"

      role="button"

      aria-label="${escapeHTML(
        title
      )}"

    >


      <div class="sneaker-3d-image">


        <img

          src="${escapeHTML(
            sneaker.image || ""
          )}"

          alt="${escapeHTML(
            title
          )}"

          loading="${
            offset === 0
              ? "eager"
              : "lazy"
          }"

          decoding="async"

          draggable="false"

        >


      </div>


      <div class="sneaker-3d-info">


        <h3>

          ${escapeHTML(
            title
          )}

        </h3>


        <p>

          ${escapeHTML(
            subtitle
          )}

        </p>


        <div class="sneaker-3d-meta">


          <span>

            ${escapeHTML(
              edition || "—"
            )}

          </span>


          <small>

            ${escapeHTML(
              sneaker.size || ""
            )}

          </small>


        </div>


      </div>


    </article>

  `;

}


/* =========================================================
   SLIDE POSITION
========================================================= */

function setSlideIndex(
  index
) {

  if (
    !slideItems.length
  ) {

    return;

  }


  slideIndex =
    wrapIndex(

      index,

      slideItems.length

    );


  slideActiveId =
    slideItems[
      slideIndex
    ]?.id
    ||
    null;


  render3DGallery(
    slideItems
  );

}


function moveSlide(
  direction
) {

  if (
    slideItems.length <= 1
  ) {

    return;

  }


  setSlideIndex(

    slideIndex
    +
    direction

  );

}


/* =========================================================
   OPEN ACTIVE SLIDE
========================================================= */

function openActiveSlide() {

  const sneaker =
    slideItems[
      slideIndex
    ];


  if (!sneaker) {
    return;
  }


  window.location.href =
    getDetailURL(
      sneaker
    );

}


/* =========================================================
   3D EVENTS
========================================================= */

function bind3DGalleryEvents() {

  const gallery =
    document.getElementById(
      "sneaker-3d-gallery"
    );


  if (!gallery) {
    return;
  }


  /* PREVIOUS */

  document

    .getElementById(
      "sneaker-3d-prev"
    )

    ?.addEventListener(

      "click",

      event => {

        event.stopPropagation();

        moveSlide(
          -1
        );

      }

    );


  /* NEXT */

  document

    .getElementById(
      "sneaker-3d-next"
    )

    ?.addEventListener(

      "click",

      event => {

        event.stopPropagation();

        moveSlide(
          1
        );

      }

    );


  /* CARDS */

  gallery

    .querySelectorAll(
      ".sneaker-3d-card"
    )

    .forEach(
      card => {


        const activate =
          () => {


            if (
              pointerMoved
            ) {

              return;

            }


            const index =
              Number.parseInt(

                card.dataset.index,

                10

              );


            if (
              !Number.isFinite(
                index
              )
            ) {

              return;

            }


            /*
              Active card:
              open sneaker detail.

              Side card:
              move into center.
            */

            if (
              index === slideIndex
            ) {

              openActiveSlide();

            } else {

              setSlideIndex(
                index
              );

            }

          };


        card.addEventListener(

          "click",

          activate

        );


        card.addEventListener(

          "keydown",

          event => {


            if (

              event.key === "Enter"

              ||

              event.key === " "

            ) {

              event.preventDefault();

              activate();

            }

          }

        );

      }

    );


  /* KEYBOARD */

  gallery.addEventListener(

    "keydown",

    event => {


      if (
        event.key === "ArrowLeft"
      ) {

        event.preventDefault();

        moveSlide(
          -1
        );

      }


      if (
        event.key === "ArrowRight"
      ) {

        event.preventDefault();

        moveSlide(
          1
        );

      }

    }

  );


  /* POINTER DOWN */

  gallery.addEventListener(

    "pointerdown",

    event => {


      pointerStartX =
        event.clientX;


      pointerStartY =
        event.clientY;


      pointerMoved =
        false;


      try {

        gallery.setPointerCapture(
          event.pointerId
        );

      } catch (_) {

        /*
          Optional.
        */

      }

    }

  );


  /* POINTER MOVE */

  gallery.addEventListener(

    "pointermove",

    event => {


      if (

        pointerStartX === null

        ||

        pointerStartY === null

      ) {

        return;

      }


      const dx =
        event.clientX
        -
        pointerStartX;


      const dy =
        event.clientY
        -
        pointerStartY;


      if (

        Math.abs(dx) > 8

        ||

        Math.abs(dy) > 8

      ) {

        pointerMoved =
          true;

      }

    }

  );


  /* POINTER UP */

  gallery.addEventListener(

    "pointerup",

    event => {


      if (

        pointerStartX === null

        ||

        pointerStartY === null

      ) {

        return;

      }


      const dx =
        event.clientX
        -
        pointerStartX;


      const dy =
        event.clientY
        -
        pointerStartY;


      /*
        Horizontal swipe only.
      */

      if (

        Math.abs(dx) > 48

        &&

        Math.abs(dx)
        >
        Math.abs(dy)

      ) {

        moveSlide(

          dx < 0
            ? 1
            : -1

        );

      }


      pointerStartX =
        null;


      pointerStartY =
        null;


      window.setTimeout(
        () => {

          pointerMoved =
            false;

        },
        0
      );

    }

  );


  /* POINTER CANCEL */

  gallery.addEventListener(

    "pointercancel",

    () => {

      pointerStartX =
        null;


      pointerStartY =
        null;


      pointerMoved =
        false;

    }

  );

}


/* =========================================================
   RENDER 3D GALLERY
========================================================= */

function render3DGallery(
  items
) {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (
    !grid
    ||
    !items.length
  ) {

    return;

  }


  slideItems =
    items;


  /*
    Preserve active sneaker
    if filter/sort changes.
  */

  if (
    slideActiveId
  ) {

    const preserved =
      slideItems.findIndex(

        item =>
          item.id === slideActiveId

      );


    slideIndex =
      preserved >= 0
        ? preserved
        : 0;

  }


  slideIndex =
    wrapIndex(

      slideIndex,

      slideItems.length

    );


  slideActiveId =
    slideItems[
      slideIndex
    ]?.id
    ||
    null;


  const seen =
    new Set();


  const cards =
    [];


  offsetsFor(
    slideItems.length
  )

    .forEach(
      offset => {


        const index =
          wrapIndex(

            slideIndex
            +
            offset,

            slideItems.length

          );


        if (
          seen.has(
            index
          )
        ) {

          return;

        }


        seen.add(
          index
        );


        cards.push(

          render3DCard(

            slideItems[
              index
            ],

            index,

            offset

          )

        );

      }

    );


  const t =
    translations[
      currentLang
    ];


  grid.innerHTML = `

    <section

      id="sneaker-3d-gallery"

      class="sneaker-3d-gallery"

      tabindex="0"

    >


      <button

        type="button"

        id="sneaker-3d-prev"

        class="
          sneaker-3d-nav
          sneaker-3d-prev
        "

        aria-label="${escapeHTML(
          t.previous
        )}"

      >

        ‹

      </button>


      <div class="sneaker-3d-stage">

        ${cards.join("")}

      </div>


      <button

        type="button"

        id="sneaker-3d-next"

        class="
          sneaker-3d-nav
          sneaker-3d-next
        "

        aria-label="${escapeHTML(
          t.next
        )}"

      >

        ›

      </button>


      <div class="sneaker-3d-footer">


        <strong>

          ${slideIndex + 1}
          /
          ${slideItems.length}

        </strong>


        <span>

          ${escapeHTML(
            t.galleryHint
          )}

        </span>


      </div>


    </section>

  `;


  bind3DGalleryEvents();

}


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


  updateCollectionViewControls();

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
          class="
            badge
            badge-placeholder
          "
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
   GRID / 3D RENDER
========================================================= */

function renderGrid() {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (!grid) {
    return;
  }


  applyGridLayout();


  if (

    typeof sneakers === "undefined"

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


  /* 3D */

  if (
    collectionViewMode === "3d"
  ) {

    render3DGallery(
      sorted
    );


    return;

  }


  /* GRID */

  grid.innerHTML =

    sorted

      .map(
        renderCard
      )

      .join("");

}


/* =========================================================
   LANGUAGE
========================================================= */

function setLanguage(
  lang
) {

  currentLang =
    normalizeLanguage(
      lang
    );


  safeStorageSet(

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
   RESPONSIVE GRID PREFERENCE
========================================================= */

function handleCollectionResize() {

  clearTimeout(
    resizeTimer
  );


  resizeTimer =
    window.setTimeout(

      () => {


        const device =
          getGridDevice();


        if (
          device !== gridDevice
        ) {

          gridDevice =
            device;


          gridColumns =
            readGridColumns(
              device
            );


          applyGridLayout();

          updateCollectionViewControls();

          renderGrid();

        }


      },

      120

    );

}


window.addEventListener(

  "resize",

  handleCollectionResize

);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  () => {


    /*
      Install injected CSS.
    */

    installCollectionViewStyles();


    /*
      Create slider + 3D button.
    */

    createCollectionViewUI();


    /*
      Load grid preference
      for current device.
    */

    gridDevice =
      getGridDevice();


    gridColumns =
      readGridColumns(
        gridDevice
      );


    /*
      Apply UI.
    */

    applyGridLayout();

    updateStaticText();

    renderSizeFilters();

    updateFilterInterface();

    updateCollectionViewControls();

    renderGrid();

  }

);
