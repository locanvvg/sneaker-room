/* =========================================================
   LỘC AN — ITEM DETAIL UTILITIES v2
   Shared by Sneaker / LEGO / Sneaker Mask detail pages.

   Approved behavior:
   - Share button sits BELOW the full information/specification grid.
   - Native share sheet when supported; copy-link fallback otherwise.
   - Detail-page footer follows VI / EN.
   - LEGO catalogue notes are removed from detail stories.
   - Special IN COLLECTION sneakers receive a reusable catalogue note
     based on edition classification; GR and FORMERLY items do not.
========================================================= */
(() => {
  "use strict";

  const STYLE_ID = "locan-item-detail-utilities-v2";
  const BUTTON_CLASS = "locan-item-share-button";
  const NOTE_ID = "locan-special-catalogue-note";
  let observerQueued = false;

  const currentLang = () =>
    String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "vi";

  const shareText = () => {
    const lang = currentLang();

    return lang === "en"
      ? {
          share: "SHARE",
          copied: "LINK COPIED",
          aria: "Share this item",
          sentence: title => `View ${title} in the Lộc An Collection.`
        }
      : {
          share: "CHIA SẺ",
          copied: "ĐÃ SAO CHÉP LINK",
          aria: "Chia sẻ hiện vật này",
          sentence: title => `Xem ${title} trong Bộ sưu tập Lộc An.`
        };
  };

  const catalogueNotes = {
    peSample: {
      vi: `
        <strong>Ghi chú lưu trữ:</strong>
        Các hiện vật thuộc nhóm <b>Player Exclusive (PE)</b> hoặc <b>PE Sample</b>
        thường được phát triển ngoài hệ thống bán lẻ công khai, vì vậy có thể
        không có giá retail chính thức hoặc không sử dụng SKU theo cấu trúc
        thương mại thông thường. Mã sản phẩm, sample code, production code
        hoặc các ký hiệu nội bộ có thể khác đáng kể so với bản phát hành đại trà.
        Số lượng sản xuất thường rất hạn chế, thông tin công khai ít và khả năng
        xuất hiện trên thị trường thứ cấp thấp, khiến các hiện vật này có mức độ
        khan hiếm cao hơn đáng kể so với các bản General Release.
      `,
      en: `
        <strong>Exhibition Note:</strong>
        Artifacts classified as <b>Player Exclusive (PE)</b> or <b>PE Sample</b>
        are commonly developed outside public retail distribution. As a result,
        they may not have an official retail price and may use product codes,
        sample codes, production identifiers, or internal markings that differ
        from conventional commercial SKUs. Production quantities are typically
        very limited, public documentation is often sparse, and secondary-market
        availability is low, making these artifacts significantly rarer than
        standard General Release pairs.
      `
    },

    ff: {
      vi: `
        <strong>Ghi chú lưu trữ:</strong>
        Các phiên bản <b>Friends &amp; Family (F&amp;F)</b> không được phát hành
        qua hệ thống bán lẻ thông thường và thường chỉ được phân phối cho một
        nhóm nhỏ gồm người thân, bạn bè, cộng tác viên hoặc cá nhân liên quan
        trực tiếp đến dự án. Vì không phải sản phẩm retail, nhiều đôi có thể
        không có giá phát hành chính thức hoặc sử dụng SKU, product code hay
        nhãn nội bộ khác với bản thương mại. Số lượng lưu hành thường rất thấp,
        khiến F&amp;F trở thành một trong những nhóm hiện vật khan hiếm nhất
        trong sneaker archive.
      `,
      en: `
        <strong>Exhibition Note:</strong>
        <b>Friends &amp; Family (F&amp;F)</b> editions are not released through
        conventional retail channels and are typically distributed only to a
        small group of family members, friends, collaborators, or individuals
        directly connected to the project. Because they are not standard retail
        products, some examples may lack an official retail price or may carry
        SKUs, product codes, or internal labels that differ from commercial
        releases. Circulation is usually extremely limited, making F&amp;F
        editions among the rarest forms of sneaker artifacts.
      `
    },

    sample: {
      vi: `
        <strong>Ghi chú lưu trữ:</strong>
        Các hiện vật <b>Sample</b> được tạo ra trong quá trình phát triển,
        thử nghiệm hoặc tiền sản xuất nên không tuân theo hệ thống thông tin
        của một sản phẩm bán lẻ hoàn chỉnh. <b>Những hiện vật này không có giá
        retail chính thức</b>, SKU có thể xuất hiện dưới dạng sample code hoặc
        production identifier, và một số chi tiết về vật liệu, màu sắc, cấu trúc
        hoặc branding có thể khác với phiên bản cuối cùng. Do chỉ được sản xuất
        với số lượng phục vụ phát triển sản phẩm, nhiều sample tồn tại với số
        lượng rất thấp và hiếm khi xuất hiện công khai.
      `,
      en: `
        <strong>Exhibition Note:</strong>
        <b>Sample</b> artifacts are produced during development, testing, or
        pre-production and therefore do not follow the information structure
        of finalized retail products. <b>These artifacts do not have an official
        retail price</b>, the SKU may appear as a sample code or production
        identifier, and materials, colors, construction, or branding may differ
        from the final release. Because samples are produced primarily for product
        development, surviving examples are often extremely limited and rarely
        appear publicly.
      `
    },

    custom: {
      vi: `
        <strong>Ghi chú lưu trữ:</strong>
        Các hiện vật <b>Custom 1/1</b> là tác phẩm độc bản được xây dựng từ một
        đôi giày nền thông qua quá trình chỉnh sửa, tái cấu trúc hoặc chế tác riêng.
        Vì không phải sản phẩm factory-issued, hiện vật thường không có retail price
        riêng và SKU của đôi nền chỉ được dùng để xác định sản phẩm gốc. Giá trị
        lưu trữ nằm ở tính độc nhất, quá trình chế tác và thực tế rằng không tồn tại
        một bản phát hành thương mại tương đương.
      `,
      en: `
        <strong>Exhibition Note:</strong>
        <b>Custom 1/1</b> artifacts are unique works created from an existing
        base shoe through individual modification, reconstruction, or custom
        fabrication. Because they are not factory-issued products, they generally
        do not have a separate retail price, while the original base-shoe SKU is
        retained only for identification. Their archival significance lies in
        their one-of-one nature, craftsmanship, and the absence of an equivalent
        commercial release.
      `
    },

    signed: {
      vi: `
        <strong>Ghi chú lưu trữ:</strong>
        Các hiện vật <b>Signature Signed</b> giữ nguyên thông tin sản phẩm của
        bản phát hành gốc nhưng có thêm yếu tố chữ ký trực tiếp từ vận động viên,
        nhà thiết kế, nghệ sĩ hoặc cá nhân liên quan đến sản phẩm. Chữ ký không
        làm thay đổi SKU hoặc retail price của đôi giày nền, nhưng khiến hiện vật
        trở nên riêng biệt so với các đôi cùng model. Số lượng hiện vật có chữ ký
        xác thực thường nhỏ hơn nhiều so với số lượng phát hành ban đầu, làm tăng
        tính khan hiếm và giá trị lưu trữ.
      `,
      en: `
        <strong>Exhibition Note:</strong>
        <b>Signature Signed</b> artifacts retain the original product information
        of the underlying release while carrying a direct signature from an athlete,
        designer, artist, or individual associated with the product. The signature
        does not alter the original SKU or retail price, but it distinguishes the
        artifact from otherwise identical examples of the same model. Authentically
        signed examples are typically far fewer than the original production
        quantity, increasing both rarity and archival significance.
      `
    }
  };

  function installStyles() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${BUTTON_CLASS} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 38px;
        margin: 14px 0 0;
        padding: 9px 13px;
        color: #a7a7ad;
        background: rgba(255,255,255,.028);
        border: 1px solid rgba(255,255,255,.11);
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
        font-size: .66rem;
        font-weight: 900;
        letter-spacing: .9px;
        line-height: 1;
        transition:
          color .18s ease,
          border-color .18s ease,
          background .18s ease,
          transform .18s ease;
      }

      .${BUTTON_CLASS}:hover,
      .${BUTTON_CLASS}:focus-visible {
        color: #ffcc00;
        border-color: rgba(255,204,0,.40);
        background: rgba(255,204,0,.05);
        outline: none;
      }

      .${BUTTON_CLASS}:active {
        transform: scale(.98);
      }

      .${BUTTON_CLASS}.is-copied {
        color: #ffcc00;
        border-color: rgba(255,204,0,.38);
      }

      .${BUTTON_CLASS} svg {
        width: 15px;
        height: 15px;
        flex: 0 0 auto;
        stroke: currentColor;
      }

      #${NOTE_ID} {
        width: 100%;
        box-sizing: border-box;
        margin: 25px 0 0;
        padding: 16px 20px;
        background: #222226;
        border: 0;
        border-left: 4px solid #ffcc00;
        border-radius: 0 8px 8px 0;
        color: #ccc;
        font-size: .9rem;
        line-height: 1.65;
      }

      #${NOTE_ID} strong {
        display: block;
        margin-bottom: 6px;
        color: #ffcc00;
        font-weight: 850;
      }

      #${NOTE_ID} b {
        color: #f5f5f7;
        font-weight: 800;
      }

      @media (max-width: 650px) {
        .${BUTTON_CLASS} {
          min-height: 40px;
          margin-top: 12px;
          padding: 10px 13px;
        }

        #${NOTE_ID} {
          margin-top: 16px;
          padding: 14px;
          font-size: .78rem;
          line-height: 1.62;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function itemTitle(section) {
    return (
      document.getElementById("shoe-title")?.textContent?.trim() ||
      section?.querySelector("h2")?.textContent?.trim() ||
      document.title.split("|")[0].trim() ||
      "Lộc An Collection"
    );
  }

  function exactShareURL() {
    const current = new URL(window.location.href);
    current.hash = "";

    const id = current.searchParams.get("id");
    if (!id) return current.href;

    const path = current.pathname;
    let type = "";

    if (
      path.endsWith("/shoe.html") ||
      path.endsWith("shoe.html")
    ) {
      type = "sneakers";
    } else if (
      path.endsWith("/lego-detail.html") ||
      path.endsWith("lego-detail.html")
    ) {
      type = "lego";
    } else if (
      path.endsWith("/sneaker-mask-detail.html") ||
      path.endsWith("sneaker-mask-detail.html")
    ) {
      type = "masks";
    }

    if (!type) return current.href;

    const safeId = String(id)
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "-");

    return new URL(
      `./share/${currentLang()}/${type}/${safeId}.html`,
      new URL("./", current)
    ).href;
  }

  async function copyURL(url) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function setButtonText(button, value) {
    const label = button.querySelector(".locan-item-share-label");
    if (label) label.textContent = value;
  }

  async function shareItem(button, title) {
    const t = shareText();
    const url = exactShareURL();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: t.sentence(title),
          url
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await copyURL(url);
      button.classList.add("is-copied");
      setButtonText(button, t.copied);

      window.setTimeout(() => {
        button.classList.remove("is-copied");
        setButtonText(button, shareText().share);
      }, 1800);
    } catch (_) {
      window.prompt(
        currentLang() === "en"
          ? "Copy this link:"
          : "Sao chép liên kết này:",
        url
      );
    }
  }

  function createButton(section) {
    const t = shareText();
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.setAttribute("aria-label", t.aria);
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 16V4" stroke-width="1.9" stroke-linecap="round"/>
        <path d="M7.5 8.5 12 4l4.5 4.5" stroke-width="1.9"
          stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 12.5H4.8A1.8 1.8 0 0 0 3 14.3v4.9A1.8 1.8 0 0 0
          4.8 21h14.4a1.8 1.8 0 0 0 1.8-1.8v-4.9a1.8 1.8 0 0 0-1.8-1.8H18"
          stroke-width="1.9" stroke-linecap="round"/>
      </svg>
      <span class="locan-item-share-label">${t.share}</span>
    `;

    button.addEventListener("click", () => {
      shareItem(button, itemTitle(section));
    });

    return button;
  }

  function syncShareButton() {
    const section = document.querySelector(".shoe-info-section");
    if (!section) return;

    let button = section.querySelector(`.${BUTTON_CLASS}`)
      || document.querySelector(`.${BUTTON_CLASS}`);

    if (!button) {
      button = createButton(section);
    }

    /*
      Approved placement:
      title -> subtitle -> complete specs grid -> SHARE.
      This applies identically to Sneaker, LEGO and Sneaker Mask.
    */
    const specs = section.querySelector(".specs-grid");

    if (specs) {
      specs.insertAdjacentElement("afterend", button);
    } else {
      section.appendChild(button);
    }

    const t = shareText();
    button.setAttribute("aria-label", t.aria);

    if (!button.classList.contains("is-copied")) {
      setButtonText(button, t.share);
    }
  }

  function syncFooter() {
    const path = window.location.pathname;

    if (
      !path.endsWith("/shoe.html") &&
      !path.endsWith("/lego-detail.html") &&
      !path.endsWith("/sneaker-mask-detail.html") &&
      !path.endsWith("shoe.html") &&
      !path.endsWith("lego-detail.html") &&
      !path.endsWith("sneaker-mask-detail.html")
    ) {
      return;
    }

    const footerText = document.querySelector("footer p");
    if (!footerText) return;

    footerText.textContent =
      currentLang() === "vi"
        ? "© 2026 Bộ sưu tập giày Lộc An. Bảo lưu mọi quyền."
        : "© 2026 Lộc An Sneaker Collection. All Rights Reserved.";
  }

  function removeLegoCatalogueNotes() {
    const path = window.location.pathname;

    if (
      !path.endsWith("/lego-detail.html") &&
      !path.endsWith("lego-detail.html")
    ) {
      return;
    }

    document
      .querySelectorAll(
        ".story-section .exhibition-note, " +
        ".story-section .catalogue-note, " +
        ".story-section .catalog-note"
      )
      .forEach(note => note.remove());
  }

  function localizedValue(value) {
    if (value == null) return "";

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      return String(
        value[currentLang()] ??
        value.vi ??
        value.en ??
        ""
      );
    }

    return "";
  }

  function sneakerEdition(sneaker) {
    return (
      localizedValue(sneaker?.editionType) ||
      localizedValue(sneaker?.edition) ||
      localizedValue(sneaker?.classification) ||
      ""
    )
      .trim()
      .toLowerCase();
  }

  function noteKeyForEdition(edition) {
    const value = String(edition || "").toLowerCase();

    if (value.includes("pe sample")) return "peSample";
    if (
      value === "pe" ||
      value.includes("player exclusive")
    ) return "peSample";
    if (
      value.includes("f&f") ||
      value.includes("friends & family") ||
      value.includes("friends and family")
    ) return "ff";
    if (value.includes("sample")) return "sample";
    if (
      value.includes("custom 1/1") ||
      value.includes("custom")
    ) return "custom";
    if (
      value.includes("signature signed") ||
      value.includes("signed")
    ) return "signed";

    return "";
  }

  function syncSneakerCatalogueNote() {
    const path = window.location.pathname;

    if (
      !path.endsWith("/shoe.html") &&
      !path.endsWith("shoe.html")
    ) {
      document.getElementById(NOTE_ID)?.remove();
      return;
    }

    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return;
    }

    const id =
      new URLSearchParams(window.location.search)
        .get("id");

    const sneaker =
      sneakers.find(item => item?.id === id);

    if (!sneaker) {
      document.getElementById(NOTE_ID)?.remove();
      return;
    }

    const status =
      String(sneaker.collectionStatus || "own")
        .trim()
        .toLowerCase();

    const key =
      status === "own"
        ? noteKeyForEdition(
            sneakerEdition(sneaker)
          )
        : "";

    /*
      Approved exclusions:
      - GR: no note
      - FORMERLY IN COLLECTION: no special note
    */
    if (!key || !catalogueNotes[key]) {
      document.getElementById(NOTE_ID)?.remove();
      return;
    }

    const storySection =
      document.getElementById("story-section")
      || document.querySelector(".story-section");

    if (!storySection) return;

    let note =
      document.getElementById(NOTE_ID);

    if (!note) {
      note = document.createElement("div");
      note.id = NOTE_ID;
      note.className = "exhibition-note";
    }

    note.innerHTML =
      catalogueNotes[key][currentLang()];

    storySection.insertAdjacentElement(
      "afterend",
      note
    );
  }


  /* =======================================================
     FULLSCREEN IMAGE VIEWER
     Sneaker / LEGO / Sneaker Mask detail pages.
     - click main image
     - keyboard arrows / ESC
     - swipe between multi-image sneaker galleries
     - zoom buttons / wheel / image tap
  ======================================================= */
  const VIEWER_ID = "locan-fullscreen-image-viewer";
  let viewerImages = [];
  let viewerIndex = 0;
  let viewerScale = 1;
  let viewerTouchStartX = null;

  function absoluteImageURL(src) {
    try {
      return new URL(
        String(src || ""),
        window.location.href
      ).href;
    } catch (_) {
      return String(src || "");
    }
  }

  function detailMainImage() {
    return (
      document.getElementById("shoe-image") ||
      document.querySelector(
        ".shoe-detail-container .shoe-image-section > img"
      )
    );
  }

  function collectViewerImages() {
    const main = detailMainImage();

    const mainSrc = main
      ? absoluteImageURL(
          main.currentSrc ||
          main.getAttribute("src") ||
          main.src
        )
      : "";

    const thumbnails = Array
      .from(
        document.querySelectorAll(
          ".shoe-detail-thumbnail img"
        )
      )
      .map(image =>
        absoluteImageURL(
          image.currentSrc ||
          image.getAttribute("src") ||
          image.src
        )
      )
      .filter(Boolean);

    const images =
      thumbnails.length
        ? thumbnails
        : mainSrc
          ? [mainSrc]
          : [];

    if (
      mainSrc &&
      images.length > 1 &&
      !images.includes(mainSrc)
    ) {
      images.unshift(mainSrc);
    }

    return [...new Set(images)];
  }

  function installViewerStyles() {
    const STYLE =
      "locan-fullscreen-image-viewer-style";

    if (document.getElementById(STYLE)) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = STYLE;

    style.textContent = `
      .shoe-image-section > img {
        cursor: zoom-in;
      }

      #${VIEWER_ID} {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        touch-action: none;
      }

      #${VIEWER_ID}.is-open {
        display: flex;
      }

      #${VIEWER_ID} .locan-viewer-stage {
        position: relative;
        width: min(94vw, 1500px);
        height: min(88vh, 1000px);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${VIEWER_ID} .locan-viewer-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform: scale(var(--locan-viewer-scale, 1));
        transform-origin: center center;
        transition: transform .16s ease;
        user-select: none;
        -webkit-user-drag: none;
        cursor: zoom-in;
      }

      #${VIEWER_ID}.is-zoomed .locan-viewer-image {
        cursor: zoom-out;
      }

      #${VIEWER_ID} button {
        position: absolute;
        z-index: 6;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        padding: 0;
        color: #dedee2;
        background: rgba(20,20,22,.80);
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 50%;
        font: inherit;
        cursor: pointer;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      #${VIEWER_ID} button:hover,
      #${VIEWER_ID} button:focus-visible {
        color: #ffcc00;
        border-color: rgba(255,204,0,.52);
        outline: none;
      }

      #${VIEWER_ID} .locan-viewer-close {
        top: 18px;
        right: 18px;
        font-size: 24px;
      }

      #${VIEWER_ID} .locan-viewer-prev,
      #${VIEWER_ID} .locan-viewer-next {
        top: 50%;
        transform: translateY(-50%);
        font-size: 28px;
      }

      #${VIEWER_ID} .locan-viewer-prev {
        left: 18px;
      }

      #${VIEWER_ID} .locan-viewer-next {
        right: 18px;
      }

      #${VIEWER_ID} .locan-viewer-tools {
        position: absolute;
        left: 50%;
        bottom: 18px;
        z-index: 7;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px;
        background: rgba(15,15,17,.78);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 999px;
      }

      #${VIEWER_ID} .locan-viewer-tools button {
        position: static;
        width: 34px;
        height: 34px;
        font-size: 18px;
      }

      #${VIEWER_ID} .locan-viewer-counter {
        min-width: 58px;
        color: #aaaab0;
        text-align: center;
        font-size: .72rem;
        font-weight: 800;
        letter-spacing: .08em;
      }

      @media (max-width: 650px) {
        #${VIEWER_ID} .locan-viewer-stage {
          width: 100vw;
          height: 82vh;
        }

        #${VIEWER_ID} .locan-viewer-close {
          top: 12px;
          right: 12px;
        }

        #${VIEWER_ID} .locan-viewer-prev {
          left: 8px;
        }

        #${VIEWER_ID} .locan-viewer-next {
          right: 8px;
        }

        #${VIEWER_ID} .locan-viewer-tools {
          bottom: 12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function setViewerScale(value) {
    viewerScale =
      Math.max(
        1,
        Math.min(
          3,
          Number(value) || 1
        )
      );

    const viewer =
      document.getElementById(VIEWER_ID);

    const image =
      viewer?.querySelector(
        ".locan-viewer-image"
      );

    image?.style.setProperty(
      "--locan-viewer-scale",
      String(viewerScale)
    );

    viewer?.classList.toggle(
      "is-zoomed",
      viewerScale > 1.01
    );
  }

  function renderViewerImage() {
    const viewer =
      document.getElementById(VIEWER_ID);

    if (
      !viewer ||
      !viewerImages.length
    ) {
      return;
    }

    viewerIndex =
      (
        viewerIndex %
        viewerImages.length +
        viewerImages.length
      ) %
      viewerImages.length;

    const image =
      viewer.querySelector(
        ".locan-viewer-image"
      );

    const counter =
      viewer.querySelector(
        ".locan-viewer-counter"
      );

    const previous =
      viewer.querySelector(
        ".locan-viewer-prev"
      );

    const next =
      viewer.querySelector(
        ".locan-viewer-next"
      );

    if (image) {
      image.src =
        viewerImages[viewerIndex];
    }

    if (counter) {
      counter.textContent =
        `${viewerIndex + 1} / ${viewerImages.length}`;
    }

    const multiple =
      viewerImages.length > 1;

    if (previous) {
      previous.hidden = !multiple;
    }

    if (next) {
      next.hidden = !multiple;
    }

    setViewerScale(1);
  }

  function moveViewer(direction) {
    if (
      viewerImages.length <= 1
    ) {
      return;
    }

    viewerIndex += direction;
    renderViewerImage();
  }

  function closeViewer() {
    const viewer =
      document.getElementById(VIEWER_ID);

    if (!viewer) return;

    viewer.classList.remove(
      "is-open"
    );

    document.body.style.removeProperty(
      "overflow"
    );

    setViewerScale(1);
  }

  function openViewer() {
    viewerImages =
      collectViewerImages();

    if (!viewerImages.length) {
      return;
    }

    const main = detailMainImage();

    const current = main
      ? absoluteImageURL(
          main.currentSrc ||
          main.getAttribute("src") ||
          main.src
        )
      : "";

    const currentIndex =
      viewerImages.indexOf(current);

    viewerIndex =
      currentIndex >= 0
        ? currentIndex
        : 0;

    renderViewerImage();

    const viewer =
      document.getElementById(VIEWER_ID);

    if (!viewer) return;

    viewer.classList.add(
      "is-open"
    );

    document.body.style.overflow =
      "hidden";

    viewer
      .querySelector(
        ".locan-viewer-close"
      )
      ?.focus();
  }

  function installViewer() {
    installViewerStyles();

    if (
      !document.getElementById(
        VIEWER_ID
      )
    ) {
      const viewer =
        document.createElement("div");

      viewer.id = VIEWER_ID;
      viewer.setAttribute(
        "role",
        "dialog"
      );
      viewer.setAttribute(
        "aria-modal",
        "true"
      );

      viewer.innerHTML = `
        <button
          type="button"
          class="locan-viewer-close"
          aria-label="Close"
        >×</button>

        <button
          type="button"
          class="locan-viewer-prev"
          aria-label="Previous image"
        >‹</button>

        <div class="locan-viewer-stage">
          <img
            class="locan-viewer-image"
            alt=""
            decoding="async"
          >
        </div>

        <button
          type="button"
          class="locan-viewer-next"
          aria-label="Next image"
        >›</button>

        <div class="locan-viewer-tools">
          <button
            type="button"
            class="locan-viewer-zoom-out"
            aria-label="Zoom out"
          >−</button>

          <span
            class="locan-viewer-counter"
          >1 / 1</span>

          <button
            type="button"
            class="locan-viewer-zoom-in"
            aria-label="Zoom in"
          >+</button>
        </div>
      `;

      document.body.appendChild(viewer);

      viewer
        .querySelector(
          ".locan-viewer-close"
        )
        ?.addEventListener(
          "click",
          closeViewer
        );

      viewer
        .querySelector(
          ".locan-viewer-prev"
        )
        ?.addEventListener(
          "click",
          () => moveViewer(-1)
        );

      viewer
        .querySelector(
          ".locan-viewer-next"
        )
        ?.addEventListener(
          "click",
          () => moveViewer(1)
        );

      viewer
        .querySelector(
          ".locan-viewer-zoom-in"
        )
        ?.addEventListener(
          "click",
          () =>
            setViewerScale(
              viewerScale + .25
            )
        );

      viewer
        .querySelector(
          ".locan-viewer-zoom-out"
        )
        ?.addEventListener(
          "click",
          () =>
            setViewerScale(
              viewerScale - .25
            )
        );

      viewer
        .querySelector(
          ".locan-viewer-image"
        )
        ?.addEventListener(
          "click",
          () => {
            setViewerScale(
              viewerScale > 1
                ? 1
                : 2
            );
          }
        );

      viewer.addEventListener(
        "wheel",
        event => {
          event.preventDefault();

          setViewerScale(
            viewerScale +
            (
              event.deltaY < 0
                ? .2
                : -.2
            )
          );
        },
        { passive: false }
      );

      viewer.addEventListener(
        "pointerdown",
        event => {
          if (
            event.pointerType ===
            "touch"
          ) {
            viewerTouchStartX =
              event.clientX;
          }
        }
      );

      viewer.addEventListener(
        "pointerup",
        event => {
          if (
            event.pointerType !==
              "touch" ||
            viewerTouchStartX ===
              null ||
            viewerScale > 1.01
          ) {
            viewerTouchStartX =
              null;
            return;
          }

          const distance =
            event.clientX -
            viewerTouchStartX;

          viewerTouchStartX =
            null;

          if (
            Math.abs(distance) <
            45
          ) {
            return;
          }

          moveViewer(
            distance < 0
              ? 1
              : -1
          );
        }
      );

      viewer.addEventListener(
        "click",
        event => {
          if (
            event.target === viewer
          ) {
            closeViewer();
          }
        }
      );
    }

    const main = detailMainImage();

    if (
      main &&
      main.dataset.locanViewerBound !==
        "true"
    ) {
      main.dataset.locanViewerBound =
        "true";

      main.setAttribute(
        "role",
        "button"
      );

      main.tabIndex = 0;

      main.setAttribute(
        "aria-label",
        currentLang() === "vi"
          ? "Mở ảnh toàn màn hình"
          : "Open fullscreen image"
      );

      main.addEventListener(
        "click",
        openViewer
      );

      main.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openViewer();
          }
        }
      );
    }
  }

  function syncImagePerformanceHints() {
    const main = detailMainImage();

    if (main) {
      main.loading = "eager";
      main.decoding = "async";
      main.setAttribute(
        "fetchpriority",
        "high"
      );
    }

    document
      .querySelectorAll(
        ".shoe-detail-thumbnail img"
      )
      .forEach(image => {
        image.loading = "lazy";
        image.decoding = "async";
        image.setAttribute(
          "fetchpriority",
          "low"
        );
      });
  }

  function registerDetailServiceWorker() {
    if (
      !("serviceWorker" in navigator) ||
      !window.isSecureContext
    ) {
      return;
    }

    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker
          .register(
            "./sw.js?v=20261003-performance-v1"
          )
          .catch(() => {});
      },
      { once: true }
    );
  }

  document.addEventListener(
    "keydown",
    event => {
      const viewer =
        document.getElementById(
          VIEWER_ID
        );

      if (
        !viewer?.classList.contains(
          "is-open"
        )
      ) {
        return;
      }

      if (event.key === "Escape") {
        closeViewer();
      } else if (
        event.key === "ArrowLeft"
      ) {
        moveViewer(-1);
      } else if (
        event.key === "ArrowRight"
      ) {
        moveViewer(1);
      }
    }
  );

  function syncAll() {
    installStyles();
    syncShareButton();
    syncFooter();
    removeLegoCatalogueNotes();
    syncSneakerCatalogueNote();
    installViewer();
    syncImagePerformanceHints();
  }

  function scheduleSync() {
    if (observerQueued) return;
    observerQueued = true;

    requestAnimationFrame(() => {
      observerQueued = false;
      syncAll();
    });
  }

  function install() {
    registerDetailServiceWorker();
    syncAll();

    const observer =
      new MutationObserver(scheduleSync);

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: [
          "class",
          "lang",
          "hidden"
        ]
      }
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#btn-vi, #btn-en, .lang-btn"
          )
        ) {
          setTimeout(syncAll, 0);
          setTimeout(syncAll, 80);
        }
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }
})();
