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
        <strong>Ghi chú catalogue:</strong>
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
        <strong>Catalogue Note:</strong>
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
        <strong>Ghi chú catalogue:</strong>
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
        <strong>Catalogue Note:</strong>
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
        <strong>Ghi chú catalogue:</strong>
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
        <strong>Catalogue Note:</strong>
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
        <strong>Ghi chú catalogue:</strong>
        Các hiện vật <b>Custom 1/1</b> là tác phẩm độc bản được xây dựng từ một
        đôi giày nền thông qua quá trình chỉnh sửa, tái cấu trúc hoặc chế tác riêng.
        Vì không phải sản phẩm factory-issued, hiện vật thường không có retail price
        riêng và SKU của đôi nền chỉ được dùng để xác định sản phẩm gốc. Giá trị
        lưu trữ nằm ở tính độc nhất, quá trình chế tác và thực tế rằng không tồn tại
        một bản phát hành thương mại tương đương.
      `,
      en: `
        <strong>Catalogue Note:</strong>
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
        <strong>Ghi chú catalogue:</strong>
        Các hiện vật <b>Signature Signed</b> giữ nguyên thông tin sản phẩm của
        bản phát hành gốc nhưng có thêm yếu tố chữ ký trực tiếp từ vận động viên,
        nhà thiết kế, nghệ sĩ hoặc cá nhân liên quan đến sản phẩm. Chữ ký không
        làm thay đổi SKU hoặc retail price của đôi giày nền, nhưng khiến hiện vật
        trở nên riêng biệt so với các đôi cùng model. Số lượng hiện vật có chữ ký
        xác thực thường nhỏ hơn nhiều so với số lượng phát hành ban đầu, làm tăng
        tính khan hiếm và giá trị lưu trữ.
      `,
      en: `
        <strong>Catalogue Note:</strong>
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
        box-sizing: border-box;
        width: 100%;
        margin: 20px 0 0;
        padding: 16px 18px;
        color: #a7a7ad;
        background: rgba(255,255,255,.024);
        border: 1px solid rgba(255,255,255,.085);
        border-radius: 10px;
        font-size: .82rem;
        line-height: 1.68;
      }

      #${NOTE_ID} strong {
        color: #d8d8dc;
        font-weight: 850;
      }

      #${NOTE_ID} b {
        color: #c8c8cd;
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
    const url = new URL(window.location.href);
    url.hash = "";

    if (url.searchParams.has("id")) {
      url.searchParams.set("lang", currentLang());
    }

    return url.href;
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
      note.className = "catalogue-note-section";
    }

    note.innerHTML =
      catalogueNotes[key][currentLang()];

    storySection.insertAdjacentElement(
      "afterend",
      note
    );
  }

  function syncAll() {
    installStyles();
    syncShareButton();
    syncFooter();
    removeLegoCatalogueNotes();
    syncSneakerCatalogueNote();
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
