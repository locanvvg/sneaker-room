/* =========================================================
   LỘC AN — SHOE DETAIL PAGE v2
   Supports:
   - legacy data.js entries
   - schemaVersion:2 additions
   - multiple images
   - bilingual detail content
   ========================================================= */

(() => {
  "use strict";

  const SUPPORTED_LANGUAGES =
    ["vi", "en"];

  function normalizeLanguage(lang) {
    return SUPPORTED_LANGUAGES
      .includes(lang)
        ? lang
        : "vi";
  }

  const params =
    new URLSearchParams(
      window.location.search
    );

  const shoeId =
    params.get("id");

  let currentLang =
    normalizeLanguage(
      params.get("lang") ||
      localStorage.getItem(
        "locan_lang"
      ) ||
      "vi"
    );

  const labels = {
    vi: {
      back:
        "← Quay lại Bộ sưu tập",
      sku:
        "MÃ SẢN PHẨM",
      colorway:
        "PHỐI MÀU",
      retail:
        "GIÁ PHÁT HÀNH",
      date:
        "NGÀY RA MẮT",
      condition:
        "TÌNH TRẠNG",
      size:
        "KÍCH CỠ",
      story:
        "Câu chuyện & Bối cảnh thiết kế",
      notFound:
        "Không tìm thấy thông tin tác phẩm này."
    },

    en: {
      back:
        "← Back to Collection",
      sku:
        "SKU",
      colorway:
        "COLORWAY",
      retail:
        "RETAIL PRICE",
      date:
        "RELEASE DATE",
      condition:
        "CONDITION",
      size:
        "SIZE",
      story:
        "Story & Design Background",
      notFound:
        "Piece information not found."
    }
  };

  function localized(value) {
    if (!value) {
      return "";
    }

    if (
      typeof value ===
      "string"
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

  function formatDate(value) {
    if (!value) {
      return "N/A";
    }

    if (
      /^\d{4}-\d{2}-\d{2}$/
        .test(value)
    ) {
      const [
        year,
        month,
        day
      ] =
        value
          .split("-")
          .map(Number);

      const date =
        new Date(
          Date.UTC(
            year,
            month - 1,
            day
          )
        );

      return date.toLocaleDateString(
        currentLang === "vi"
          ? "vi-VN"
          : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC"
        }
      );
    }

    if (
      /^\d{4}-\d{2}$/
        .test(value)
    ) {
      const [
        year,
        month
      ] =
        value
          .split("-")
          .map(Number);

      const date =
        new Date(
          Date.UTC(
            year,
            month - 1,
            1
          )
        );

      return date.toLocaleDateString(
        currentLang === "vi"
          ? "vi-VN"
          : "en-US",
        {
          year: "numeric",
          month: "long",
          timeZone: "UTC"
        }
      );
    }

    return value;
  }

  function installGalleryStyles() {
    if (
      document.getElementById(
        "locan-detail-gallery-v2"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "locan-detail-gallery-v2";

    style.textContent = `
      .shoe-image-section {
        position: relative;
      }

      .shoe-detail-thumbnails {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: 12px;
        line-height: normal;
      }

      .shoe-detail-thumbnail {
        width: 72px;
        aspect-ratio: 4 / 3;
        padding: 0;
        overflow: hidden;
        border: 1px solid #2b2b2e;
        border-radius: 8px;
        background: rgba(255,255,255,.025);
        cursor: pointer;
      }

      .shoe-detail-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .shoe-detail-thumbnail.active {
        border-color: rgba(255,204,0,.65);
      }

      #shoe-condition.condition-deadstock {
        color: #61d58a;
      }

      #shoe-condition.condition-used {
        color: #66a8ff;
      }
    `;

    document.head
      .appendChild(style);
  }

  function setGallery(
    sneaker,
    title
  ) {
    const main =
      document.getElementById(
        "shoe-image"
      );

    if (!main) return;

    const images =
      (
        Array.isArray(
          sneaker.images
        ) &&
        sneaker.images.length
      )
        ? sneaker.images
        : sneaker.image
          ? [sneaker.image]
          : [];

    const section =
      main.closest(
        ".shoe-image-section"
      );

    section
      ?.querySelector(
        ".shoe-detail-thumbnails"
      )
      ?.remove();

    if (!images.length) {
      main.removeAttribute(
        "src"
      );

      return;
    }

    main.src =
      images[0];

    main.alt =
      title;

    if (
      images.length <= 1 ||
      !section
    ) {
      return;
    }

    const tray =
      document.createElement(
        "div"
      );

    tray.className =
      "shoe-detail-thumbnails";

    images.forEach(
      (src, index) => {
        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "shoe-detail-thumbnail" +
          (
            index === 0
              ? " active"
              : ""
          );

        button.setAttribute(
          "aria-label",
          `${title} — image ${index + 1}`
        );

        const thumb =
          document.createElement(
            "img"
          );

        thumb.src =
          src;

        thumb.alt =
          "";

        thumb.loading =
          "lazy";

        button.appendChild(
          thumb
        );

        button.addEventListener(
          "click",
          () => {
            main.src =
              src;

            tray
              .querySelectorAll(
                ".shoe-detail-thumbnail"
              )
              .forEach(
                node =>
                  node.classList
                    .remove(
                      "active"
                    )
              );

            button.classList
              .add(
                "active"
              );
          }
        );

        tray.appendChild(
          button
        );
      }
    );

    section.appendChild(
      tray
    );
  }

  function updateLanguageInterface() {
    document.documentElement.lang =
      currentLang;

    localStorage.setItem(
      "locan_lang",
      currentLang
    );

    const language =
      labels[currentLang];

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

    const backLink =
      document.getElementById(
        "back-link"
      );

    if (backLink) {
      backLink.textContent =
        language.back;

      backLink.href =
        "index.html?lang=" +
        encodeURIComponent(
          currentLang
        );
    }

    const map = {
      "label-sku":
        language.sku,
      "label-colorway":
        language.colorway,
      "label-retail":
        language.retail,
      "label-date":
        language.date,
      "label-condition":
        language.condition,
      "label-size":
        language.size,
      "story-title":
        language.story
    };

    Object.entries(map)
      .forEach(
        ([id, value]) => {
          const element =
            document.getElementById(
              id
            );

          if (element) {
            element.textContent =
              value;
          }
        }
      );
  }

  function findSneaker() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return null;
    }

    return (
      sneakers.find(
        item =>
          item.id === shoeId
      ) ||
      null
    );
  }

  function showNotFound() {
    document.title =
      labels[currentLang]
        .notFound;

    const detail =
      document.getElementById(
        "shoe-detail"
      );

    if (detail) {
      detail.innerHTML = `
        <div class="not-found">
          <p>
            ${labels[currentLang].notFound}
          </p>
        </div>
      `;
    }

    const story =
      document.getElementById(
        "story-section"
      );

    if (story) {
      story.style.display =
        "none";
    }
  }

  function render() {
    updateLanguageInterface();

    const sneaker =
      findSneaker();

    if (!sneaker) {
      showNotFound();
      return;
    }

    const storySection =
      document.getElementById(
        "story-section"
      );

    if (storySection) {
      storySection.style.display =
        "block";
    }

    const title =
      localized(
        sneaker.title
      );

    document.title =
      title +
      " | Lộc An Sneaker Collection";

    const values = {
      "shoe-title":
        title,

      "shoe-subtitle":
        localized(
          sneaker.subtitle
        ),

      "shoe-sku":
        sneaker.sku ||
        "N/A",

      "shoe-colorway":
        sneaker.colorway ||
        "N/A",

      "shoe-retail":
        sneaker.retailPrice ||
        "N/A",

      "shoe-date":
        formatDate(
          sneaker.releaseDate
        ),

      "shoe-condition":
        localized(
          sneaker.condition
        ) ||
        "N/A",

      "shoe-size":
        sneaker.size ||
        "N/A"
    };

    Object.entries(values)
      .forEach(
        ([id, value]) => {
          const element =
            document.getElementById(
              id
            );

          if (element) {
            element.textContent =
              value;
          }
        }
      );

    const condition =
      document.getElementById(
        "shoe-condition"
      );

    if (condition) {
      const value =
        condition
          .textContent
          .trim()
          .toLowerCase();

      condition.classList.toggle(
        "condition-deadstock",
        value === "deadstock"
      );

      condition.classList.toggle(
        "condition-used",
        value === "used"
      );
    }

    setGallery(
      sneaker,
      title
    );

    const story =
      document.getElementById(
        "shoe-story"
      );

    if (story) {
      story.innerHTML =
        localized(
          sneaker.story
        );
    }
  }

  function changeLang(lang) {
    currentLang =
      normalizeLanguage(lang);

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

    render();
  }

  window.changeLang =
    changeLang;

  installGalleryStyles();

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      render,
      {
        once: true
      }
    );
  } else {
    render();
  }
})();
