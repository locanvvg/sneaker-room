/* =========================================================
   LỘC AN SNEAKER COLLECTION
   HOMEPAGE LOGIC
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
    noResults: "Không có hiện vật phù hợp với bộ lọc hiện tại."
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
    total: count => `TOTAL: ${count} PAIRS`,
    viewMore: "VIEW MORE →",
    noResults: "No artifacts match the current filters."
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
    urlParams.get("lang") ||
    localStorage.getItem("locan_lang") ||
    "vi"
  );


let currentSort =
  "default";


const activeFilters = {
  edition: new Set(),
  condition: new Set(),
  size: new Set()
};


function getLocalizedText(value) {

  if (value == null) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (
    typeof value === "object"
  ) {

    return String(
      value[currentLang] ??
      value.vi ??
      value.en ??
      ""
    );

  }

  return "";
}


function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getNumericSize(size) {

  const match =
    String(size ?? "")
      .match(
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

  ].sort(
    (a, b) =>
      a - b
  );
}


function getEditionCategories(sneaker) {

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


  if (
    corpus.includes(
      "PLAYER EXCLUSIVE"
    )
    ||
    /\bPE\b/.test(corpus)
  ) {
    categories.add("PE");
  }


  if (
    corpus.includes(
      "SAMPLE"
    )
  ) {
    categories.add(
      "Sample"
    );
  }


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
    categories.add("F&F");
  }


  if (
    corpus.includes(
      "SIGNATURE SIGNED"
    )
    ||
    (
      corpus.includes("SIGNATURE")
      &&
      corpus.includes("SIGNED")
    )
  ) {
    categories.add(
      "Signature Signed"
    );
  }


  if (
    corpus.includes(
      "GENERAL RELEASE"
    )
    ||
    /\bGR\b/.test(corpus)
  ) {
    categories.add("GR");
  }


  if (
    categories.size === 0
  ) {
    categories.add("GR");
  }


  return categories;
}


function getConditionCategory(sneaker) {

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


function filterSneakers(items) {

  return items.filter(
    sneaker => {


      if (
        activeFilters.edition.size > 0
      ) {

        const categories =
          getEditionCategories(
            sneaker
          );


        const match =
          [...activeFilters.edition]

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


function getReleaseTimestamp(value) {

  if (!value) {
    return 0;
  }


  const text =
    String(value).trim();


  const normalized =
    /^\d{4}-\d{2}$/.test(text)

      ? `${text}-01`

      : text;


  const timestamp =
    Date.parse(
      `${normalized}T12:00:00`
    );


  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}


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
          ).localeCompare(

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
            aSize === null &&
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


          return aSize - bSize;

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
            aSize === null &&
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


          return bSize - aSize;

        }
      );

      break;


    default:

      break;

  }


  return sorted;
}


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

    set.delete(value);

  } else {

    set.add(value);

  }


  updateFilterInterface();

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

  renderGrid();
}


function changeSort(value) {

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


  renderGrid();
}


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
            set &&
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


    clearButton.classList.toggle(
      "visible",
      hasActiveFilters
    );

  }
}


function updateStaticText() {

  const t =
    translations[currentLang];


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


  if (title) {
    title.textContent =
      t.mainTitle;
  }


  if (subtitle) {
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


  if (sortLabel) {
    sortLabel.textContent =
      t.sortLabel;
  }


  if (filterTitle) {
    filterTitle.textContent =
      t.filterTitle;
  }


  if (clearButton) {
    clearButton.textContent =
      t.clearFilters;
  }


  if (editionLabel) {
    editionLabel.textContent =
      t.editionLabel;
  }


  if (conditionLabel) {
    conditionLabel.textContent =
      t.conditionLabel;
  }


  if (sizeLabel) {
    sizeLabel.textContent =
      t.sizeLabel;
  }


  const select =
    document.getElementById(
      "sort-select"
    );


  if (select) {

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
            names[option.value]
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
    ?.classList.toggle(
      "active",
      currentLang === "vi"
    );


  document
    .getElementById(
      "btn-en"
    )
    ?.classList.toggle(
      "active",
      currentLang === "en"
    );
}


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
    translations[currentLang]
      .total(count);
}


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
            src="${escapeHTML(
              sneaker.image || ""
            )}"
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
              ${escapeHTML(
                sneaker.size || ""
              )}
            </span>

          </div>


          <span class="card-cta">
            ${translations[currentLang].viewMore}
          </span>


        </div>


      </article>

    </a>

  `;
}


function renderGrid() {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (!grid) {
    return;
  }


  if (
    typeof sneakers === "undefined"
    ||
    !Array.isArray(sneakers)
  ) {

    grid.innerHTML = `

      <div class="not-found">
        Collection data could not be loaded.
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


  updateCollectionCount(
    sorted.length
  );


  if (
    sorted.length === 0
  ) {

    grid.innerHTML = `

      <div class="not-found">
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
      .map(
        renderCard
      )
      .join("");
}


function setLanguage(lang) {

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


document.addEventListener(

  "DOMContentLoaded",

  () => {

    updateStaticText();

    renderSizeFilters();

    updateFilterInterface();

    renderGrid();

  }

);
