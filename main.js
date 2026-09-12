/* =========================================================
   SUPPORTED LANGUAGES
========================================================= */

const SUPPORTED_LANGUAGES = [
  "vi",
  "en"
];


/* =========================================================
   NORMALIZE LANGUAGE
========================================================= */

function normalizeLanguage(lang) {

  return SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : "vi";

}


/* =========================================================
   GET LANGUAGE
========================================================= */

const urlParams =
  new URLSearchParams(
    window.location.search
  );


const languageFromURL =
  urlParams.get("lang");


const languageFromStorage =
  localStorage.getItem(
    "locan_lang"
  );


let currentLang =
  normalizeLanguage(
    languageFromURL ||
    languageFromStorage ||
    "vi"
  );


/* =========================================================
   SORT SETTINGS
========================================================= */

const VALID_SORTS = [
  "default",
  "az",
  "za",
  "size-asc",
  "size-desc"
];


function normalizeSort(value) {

  return VALID_SORTS.includes(value)
    ? value
    : "default";

}


let currentSort =
  normalizeSort(
    localStorage.getItem(
      "locan_sort"
    ) || "default"
  );


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

  vi: {

    mainTitle:
      "LỘC AN SNEAKER COLLECTION",

    mainSubtitle:
      "Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số",

    loading:
      "Đang cập nhật dữ liệu bộ sưu tập...",

    sortLabel:
      "SẮP XẾP",

    sortDefault:
      "Mặc định",

    sortAZ:
      "A → Z",

    sortZA:
      "Z → A",

    sortSizeAsc:
      "Size nhỏ → lớn",

    sortSizeDesc:
      "Size lớn → nhỏ"

  },


  en: {

    mainTitle:
      "LỘC AN SNEAKER COLLECTION",

    mainSubtitle:
      "Digital Sneaker Archive & Museum",

    loading:
      "Updating collection data...",

    sortLabel:
      "SORT BY",

    sortDefault:
      "Default",

    sortAZ:
      "A → Z",

    sortZA:
      "Z → A",

    sortSizeAsc:
      "Size: Small → Large",

    sortSizeDesc:
      "Size: Large → Small"

  }

};


/* =========================================================
   GET LOCALIZED TEXT
========================================================= */

function getLocalizedText(
  object,
  lang = currentLang
) {

  if (!object) {
    return "";
  }


  if (
    typeof object === "string"
  ) {

    return object;

  }


  return (
    object[lang] ??
    object.en ??
    object.vi ??
    ""
  );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   GET NUMERIC SHOE SIZE

   Examples:

   "7 US"    -> 7
   "10 US"   -> 10
   "12 US"   -> 12
   "12.5 US" -> 12.5
   "N/A"     -> null
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


  const numericSize =
    parseFloat(
      match[1]
    );


  return Number.isFinite(
    numericSize
  )
    ? numericSize
    : null;

}


/* =========================================================
   SORT SNEAKERS
========================================================= */

function sortSneakers(items) {

  /*
    Copy array so original data.js order
    is never modified.
  */

  const sorted =
    [...items];


  /* =====================================================
     DEFAULT
     Preserve order from data.js
  ====================================================== */

  if (
    currentSort === "default"
  ) {

    return sorted;

  }


  /* =====================================================
     A -> Z
  ====================================================== */

  if (
    currentSort === "az"
  ) {

    return sorted.sort(
      (a, b) => {

        const titleA =
          getLocalizedText(
            a.title
          );


        const titleB =
          getLocalizedText(
            b.title
          );


        return titleA.localeCompare(
          titleB,
          currentLang === "vi"
            ? "vi"
            : "en",
          {
            sensitivity: "base",
            numeric: true
          }
        );

      }
    );

  }


  /* =====================================================
     Z -> A
  ====================================================== */

  if (
    currentSort === "za"
  ) {

    return sorted.sort(
      (a, b) => {

        const titleA =
          getLocalizedText(
            a.title
          );


        const titleB =
          getLocalizedText(
            b.title
          );


        return titleB.localeCompare(
          titleA,
          currentLang === "vi"
            ? "vi"
            : "en",
          {
            sensitivity: "base",
            numeric: true
          }
        );

      }
    );

  }


  /* =====================================================
     SIZE SMALL -> LARGE
  ====================================================== */

  if (
    currentSort === "size-asc"
  ) {

    return sorted.sort(
      (a, b) => {

        const sizeA =
          getNumericSize(
            a.size
          );


        const sizeB =
          getNumericSize(
            b.size
          );


        /*
          Both unknown:
          preserve original relative order.
        */

        if (
          sizeA === null &&
          sizeB === null
        ) {

          return 0;

        }


        /*
          Unknown sizes always go to bottom.
        */

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


        return sizeA - sizeB;

      }
    );

  }


  /* =====================================================
     SIZE LARGE -> SMALL
  ====================================================== */

  if (
    currentSort === "size-desc"
  ) {

    return sorted.sort(
      (a, b) => {

        const sizeA =
          getNumericSize(
            a.size
          );


        const sizeB =
          getNumericSize(
            b.size
          );


        /*
          Both unknown.
        */

        if (
          sizeA === null &&
          sizeB === null
        ) {

          return 0;

        }


        /*
          N/A still goes to bottom.
        */

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


        return sizeB - sizeA;

      }
    );

  }


  return sorted;

}


/* =========================================================
   CHANGE SORT
========================================================= */

function changeSort(value) {

  currentSort =
    normalizeSort(value);


  /*
    Remember selected sorting
    after refresh.
  */

  localStorage.setItem(
    "locan_sort",
    currentSort
  );


  renderGrid();

}


/* =========================================================
   UPDATE SORT INTERFACE LANGUAGE
========================================================= */

function updateSortInterface() {

  const text =
    translations[currentLang];


  const sortLabel =
    document.getElementById(
      "sort-label"
    );


  const sortSelect =
    document.getElementById(
      "sort-select"
    );


  if (!sortSelect) {
    return;
  }


  if (sortLabel) {

    sortLabel.textContent =
      text.sortLabel;

  }


  const options =
    sortSelect.options;


  if (
    options.length >= 5
  ) {

    options[0].textContent =
      text.sortDefault;


    options[1].textContent =
      text.sortAZ;


    options[2].textContent =
      text.sortZA;


    options[3].textContent =
      text.sortSizeAsc;


    options[4].textContent =
      text.sortSizeDesc;

  }


  sortSelect.value =
    currentSort;

}


/* =========================================================
   CHANGE LANGUAGE
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


  /* =====================================================
     UPDATE URL
  ====================================================== */

  const currentURL =
    new URL(
      window.location.href
    );


  currentURL.searchParams.set(
    "lang",
    currentLang
  );


  window.history.replaceState(
    {},
    "",
    currentURL.pathname +
    currentURL.search +
    currentURL.hash
  );


  /* =====================================================
     LANGUAGE BUTTONS
  ====================================================== */

  const viButton =
    document.getElementById(
      "btn-vi"
    );


  const enButton =
    document.getElementById(
      "btn-en"
    );


  if (viButton) {

    viButton.classList.toggle(
      "active",
      currentLang === "vi"
    );

  }


  if (enButton) {

    enButton.classList.toggle(
      "active",
      currentLang === "en"
    );

  }


  /* =====================================================
     GENERAL TRANSLATION
  ====================================================== */

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element => {

        const key =
          element.getAttribute(
            "data-i18n"
          );


        if (
          translations[currentLang][key]
        ) {

          element.textContent =
            translations[currentLang][key];

        }

      }
    );


  updateSortInterface();

  renderGrid();

}


/* =========================================================
   RENDER COLLECTION
========================================================= */

function renderGrid() {

  const grid =
    document.getElementById(
      "sneaker-grid"
    );


  if (!grid) {
    return;
  }


  /* =====================================================
     DATA NOT LOADED
  ====================================================== */

  if (
    typeof sneakers === "undefined" ||
    !Array.isArray(sneakers)
  ) {

    grid.innerHTML = `

      <p class="collection-message">

        ${escapeHTML(
          translations[currentLang]
            .loading
        )}

      </p>

    `;

    return;

  }


  /* =====================================================
     SORT DATA
  ====================================================== */

  const sortedSneakers =
    sortSneakers(
      sneakers
    );


  /* =====================================================
     GENERATE CARDS
  ====================================================== */

  grid.innerHTML =
    sortedSneakers

      .map(
        sneaker => {

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
            sneaker.size ||
            "N/A";


          const image =
            sneaker.image ||
            "";


          const detailURL =

            "shoe.html?id=" +

            encodeURIComponent(
              sneaker.id
            ) +

            "&lang=" +

            encodeURIComponent(
              currentLang
            );


          /* =================================================
             BADGE
          ================================================= */

          const badgeHTML =
            editionType

              ? `
                <span class="badge">
                  ${escapeHTML(
                    editionType
                  )}
                </span>
              `

              : `
                <span
                  class="badge badge-placeholder"
                  aria-hidden="true"
                >
                  —
                </span>
              `;


          /* =================================================
             CARD
          ================================================= */

          return `

            <a
              class="card-link"
              href="${detailURL}"
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
      )

      .join("");

}


/* =========================================================
   INITIAL PAGE LOAD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (
      document.getElementById(
        "sneaker-grid"
      )
    ) {

      setLanguage(
        currentLang
      );

    }

  }
);
