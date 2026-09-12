const SUPPORTED_LANGUAGES = ['vi', 'en'];


/* =========================================================
   LANGUAGE
========================================================= */

function normalizeLanguage(lang) {
  return SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : 'vi';
}


const urlParams = new URLSearchParams(window.location.search);

const languageFromURL = urlParams.get('lang');

const languageFromStorage =
  localStorage.getItem('locan_lang');


let currentLang = normalizeLanguage(
  languageFromURL ||
  languageFromStorage ||
  'vi'
);


const translations = {

  vi: {
    mainTitle:
      "LỘC AN SNEAKER COLLECTION",

    mainSubtitle:
      "Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số",

    loading:
      "Đang cập nhật dữ liệu bộ sưu tập..."
  },


  en: {
    mainTitle:
      "LỘC AN SNEAKER COLLECTION",

    mainSubtitle:
      "Digital Sneaker Archive & Museum",

    loading:
      "Updating collection data..."
  }

};


/* =========================================================
   LOCALIZED TEXT
========================================================= */

function getLocalizedText(object, lang = currentLang) {

  if (!object) {
    return '';
  }

  if (typeof object === 'string') {
    return object;
  }

  return (
    object[lang] ??
    object.en ??
    object.vi ??
    ''
  );
}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(value) {

  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


/* =========================================================
   RELEASE DATE FORMAT
========================================================= */

function formatReleaseDate(dateString, lang = currentLang) {

  if (!dateString) {
    return '';
  }


  /*
    YYYY-MM-DD
  */

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

    const [year, month, day] =
      dateString.split('-').map(Number);


    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );


    return date.toLocaleDateString(
      lang === 'vi'
        ? 'vi-VN'
        : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }
    );

  }


  /*
    YYYY-MM
    Used when exact release day is unknown.
  */

  if (/^\d{4}-\d{2}$/.test(dateString)) {

    const [year, month] =
      dateString.split('-').map(Number);


    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        1
      )
    );


    return date.toLocaleDateString(
      lang === 'vi'
        ? 'vi-VN'
        : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        timeZone: 'UTC'
      }
    );

  }


  /*
    Fallback for old data format
  */

  return dateString;
}


/* =========================================================
   UPDATE LANGUAGE
========================================================= */

function setLanguage(lang) {

  currentLang =
    normalizeLanguage(lang);


  localStorage.setItem(
    'locan_lang',
    currentLang
  );


  document.documentElement.lang =
    currentLang;


  /*
    Keep language in URL
  */

  const currentURL =
    new URL(window.location.href);


  currentURL.searchParams.set(
    'lang',
    currentLang
  );


  window.history.replaceState(
    {},
    '',
    `${currentURL.pathname}${currentURL.search}${currentURL.hash}`
  );


  /*
    Language buttons
  */

  const btnVi =
    document.getElementById('btn-vi');

  const btnEn =
    document.getElementById('btn-en');


  if (btnVi) {
    btnVi.classList.toggle(
      'active',
      currentLang === 'vi'
    );
  }


  if (btnEn) {
    btnEn.classList.toggle(
      'active',
      currentLang === 'en'
    );
  }


  /*
    Translation
  */

  const dictionary =
    translations[currentLang] ||
    translations.vi;


  document
    .querySelectorAll('[data-i18n]')
    .forEach(element => {

      const key =
        element.getAttribute(
          'data-i18n'
        );


      if (dictionary[key]) {
        element.textContent =
          dictionary[key];
      }

    });


  renderGrid();
}


/* =========================================================
   HOME PAGE GRID
========================================================= */

function renderGrid() {

  const grid =
    document.getElementById(
      'sneaker-grid'
    );


  /*
    shoe.html does not contain sneaker-grid,
    so simply stop here.
  */

  if (!grid) {
    return;
  }


  /*
    Check dataset
  */

  if (
    typeof sneakers === 'undefined' ||
    !Array.isArray(sneakers) ||
    sneakers.length === 0
  ) {

    grid.innerHTML = `
      <p class="collection-message">
        ${escapeHTML(
          translations[currentLang].loading
        )}
      </p>
    `;

    return;
  }


  /*
    Sort according to current language
  */

  const locale =
    currentLang === 'vi'
      ? 'vi'
      : 'en';


  const sortedSneakers =
    [...sneakers].sort(
      (a, b) =>

        getLocalizedText(a.title)
          .localeCompare(
            getLocalizedText(b.title),
            locale,
            {
              sensitivity: 'base'
            }
          )

    );


  /*
    Create cards
  */

  grid.innerHTML =
    sortedSneakers
      .map(shoe => {

        const title =
          getLocalizedText(
            shoe.title
          );


        const subtitle =
          getLocalizedText(
            shoe.subtitle
          );


        const edition =
          getLocalizedText(
            shoe.editionType
          );


        const size =
          shoe.size || '';


        const image =
          shoe.image || '';


        const shoeURL =
          `shoe.html?id=${encodeURIComponent(shoe.id)}&lang=${encodeURIComponent(currentLang)}`;


        const badgeHTML =
          edition

            ? `
              <span class="badge">
                ${escapeHTML(edition)}
              </span>
            `

            : `
              <span
                class="badge badge-placeholder"
                aria-hidden="true"
              >
                &nbsp;
              </span>
            `;


        return `

          <a
            href="${shoeURL}"
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

                <div>

                  <h3>
                    ${escapeHTML(title)}
                  </h3>

                  <p class="subtitle">
                    ${escapeHTML(subtitle)}
                  </p>

                </div>


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

      })

      .join('');

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    document.documentElement.lang =
      currentLang;


    /*
      Only initialize homepage if
      sneaker-grid exists.
    */

    if (
      document.getElementById(
        'sneaker-grid'
      )
    ) {

      setLanguage(currentLang);

    }

  }
);
