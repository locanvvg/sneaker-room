/* =========================================================
   LỘC AN — CATALOG ENGINE v1

   Purpose:
   - Existing data.js remains compatible.
   - New schemaVersion: 2 entries are normalized automatically.
   - Auto ID generation when id is omitted.
   - Retail formatting.
   - Image-array support.
   - Category inference.
   - Condition validation.
   - Size-token support.
   ========================================================= */

(() => {
  "use strict";

  const KNOWN_CONDITIONS =
    new Set(["Deadstock", "Used"]);

  const CATEGORY_ORDER = [
    "PE",
    "Sample",
    "F&F",
    "Signature Signed",
    "Custom 1/1",
    "GR"
  ];

  function text(value, lang = "en") {
    if (value == null) return "";

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }

    if (typeof value === "object") {
      return String(
        value[lang] ??
        value.en ??
        value.vi ??
        ""
      );
    }

    return "";
  }

  function bilingual(value, fallback = "") {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return {
        vi: String(value.vi ?? value.en ?? fallback),
        en: String(value.en ?? value.vi ?? fallback)
      };
    }

    const normalized =
      String(value ?? fallback);

    return {
      vi: normalized,
      en: normalized
    };
  }

  function slugify(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/['’"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return String(value ?? "");
    }

    return new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 2
      }
    ).format(number);
  }

  function formatRetail(retail) {
    if (
      retail == null ||
      retail === "" ||
      retail === "N/A"
    ) {
      return "N/A";
    }

    if (
      typeof retail === "string" ||
      typeof retail === "number"
    ) {
      return String(retail);
    }

    const amount =
      retail.amount;

    const currency =
      String(retail.currency || "USD")
        .toUpperCase();

    if (
      amount == null ||
      amount === ""
    ) {
      return "N/A";
    }

    const formatted =
      formatNumber(amount);

    if (currency === "USD") {
      return `$${formatted} USD`;
    }

    if (currency === "JPY") {
      return `¥${formatted}`;
    }

    if (currency === "CAD") {
      return `CA$${formatted} CAD`;
    }

    if (currency === "EUR") {
      return `€${formatted} EUR`;
    }

    if (currency === "GBP") {
      return `£${formatted} GBP`;
    }

    return `${formatted} ${currency}`;
  }

  function normalizeCondition(value) {
    const raw =
      text(value, "en").trim();

    if (!raw) {
      return bilingual("");
    }

    const canonical =
      raw.toLowerCase() === "deadstock"
        ? "Deadstock"
        : raw.toLowerCase() === "used"
          ? "Used"
          : raw;

    if (!KNOWN_CONDITIONS.has(canonical)) {
      console.warn(
        `[Catalog Engine] Invalid CONDITION "${raw}". ` +
        `Use only "Deadstock" or "Used".`
      );
    }

    return bilingual(canonical);
  }

  function inferCategories(item) {
    if (
      Array.isArray(item.categories) &&
      item.categories.length
    ) {
      return [
        ...new Set(
          item.categories
            .map(value => String(value).trim())
            .filter(Boolean)
        )
      ];
    }

    const corpus = [
      text(item.title, "en"),
      text(item.subtitle, "en"),
      text(item.editionType, "en"),
      item.edition
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    const categories =
      new Set();

    if (
      /\bPE\b/.test(corpus) ||
      corpus.includes("PLAYER EXCLUSIVE")
    ) {
      categories.add("PE");
    }

    if (corpus.includes("SAMPLE")) {
      categories.add("Sample");
    }

    if (
      corpus.includes("F&F") ||
      corpus.includes("FRIENDS & FAMILY") ||
      corpus.includes("FRIENDS AND FAMILY")
    ) {
      categories.add("F&F");
    }

    if (
      corpus.includes("SIGNATURE SIGNED") ||
      (
        corpus.includes("SIGNATURE") &&
        corpus.includes("SIGNED")
      )
    ) {
      categories.add("Signature Signed");
    }

    if (
      corpus.includes("CUSTOM 1/1") ||
      corpus.includes("1-OF-1 CUSTOM") ||
      corpus.includes("1 OF 1 CUSTOM")
    ) {
      categories.add("Custom 1/1");
    }

    if (
      corpus.includes("GENERAL RELEASE") ||
      /\bGR\b/.test(corpus)
    ) {
      categories.add("GR");
    }

    /*
      Unknown edition types remain display metadata,
      but don't create dozens of accidental filter chips.
      If nothing special is detected, classify as GR.
    */
    if (categories.size === 0) {
      categories.add("GR");
    }

    return [...categories];
  }

  function getSizeTokens(item) {
    const raw =
      String(item?.size ?? "")
        .toUpperCase()
        .trim();

    if (!raw) return [];

    const tokens = [];

    /*
      Examples:
      12W/10.5M  -> 12W, 10.5M
      9.5W / 8M  -> 9.5W, 8M
      10.5 US    -> 10.5
      12 US      -> 12
    */
    const gendered =
      raw.match(/\d+(?:\.\d+)?\s*[WM]/g);

    if (gendered?.length) {
      gendered.forEach(token => {
        tokens.push(
          token.replace(/\s+/g, "")
        );
      });

      return [
        ...new Set(tokens)
      ];
    }

    const regular =
      raw.match(/\d+(?:\.\d+)?/);

    if (regular) {
      tokens.push(regular[0]);
    }

    return tokens;
  }

  function getCondition(item) {
    const value =
      text(item?.condition, "en")
        .trim();

    if (value.toLowerCase() === "deadstock") {
      return "Deadstock";
    }

    if (value.toLowerCase() === "used") {
      return "Used";
    }

    return value;
  }

  function normalizeItem(item, index, usedIds) {
    if (
      !item ||
      typeof item !== "object"
    ) {
      return item;
    }

    /*
      New simplified fields -> existing site fields.
    */

    if (item.edition && !item.editionType) {
      item.editionType =
        bilingual(item.edition);
    }

    if (item.condition) {
      item.condition =
        normalizeCondition(item.condition);
    }

    if (item.retail && !item.retailPrice) {
      item.retailPrice =
        formatRetail(item.retail);
    }

    if (!item.retailPrice) {
      item.retailPrice = "N/A";
    }

    if (
      Array.isArray(item.images) &&
      item.images.length
    ) {
      item.images =
        item.images
          .map(value => String(value).trim())
          .filter(Boolean);

      if (!item.image) {
        item.image =
          item.images[0];
      }
    } else if (item.image) {
      item.images = [
        item.image
      ];
    } else {
      item.images = [];
      item.image = "";
    }

    /*
      New entries may provide a plain string title/subtitle.
      Existing bilingual objects are preserved.
    */
    item.title =
      bilingual(item.title);

    item.subtitle =
      bilingual(item.subtitle);

    item.editionType =
      bilingual(item.editionType);

    if (!item.story) {
      item.story = bilingual("");
    } else if (
      typeof item.story === "string"
    ) {
      item.story =
        bilingual(item.story);
    } else {
      item.story =
        bilingual(item.story);
    }

    /*
      ID:
      Existing IDs are preserved.
      Missing IDs are generated from English title.
    */
    let candidate =
      String(item.id || "").trim();

    if (!candidate) {
      candidate =
        slugify(
          text(item.title, "en")
        ) ||
        `sneaker-${index + 1}`;
    }

    let unique =
      candidate;

    let suffix = 2;

    while (
      usedIds.has(unique)
    ) {
      unique =
        `${candidate}-${suffix}`;

      suffix += 1;
    }

    item.id =
      unique;

    usedIds.add(unique);

    item.catalogCategories =
      inferCategories(item);

    /*
      New schema defaults to automatic visual normalization.
      Existing legacy entries remain unchanged unless explicitly
      marked autoFit:true or covered by a migration preset.
    */
    if (
      item.schemaVersion >= 2 &&
      item.autoFit === undefined &&
      !item.display
    ) {
      item.autoFit = true;
    }

    return item;
  }

  function normalizeCollection() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      console.warn(
        "[Catalog Engine] sneakers[] was not found."
      );

      return;
    }

    const usedIds =
      new Set();

    sneakers.forEach(
      (item, index) =>
        normalizeItem(
          item,
          index,
          usedIds
        )
    );

    console.info(
      `[Catalog Engine] ${sneakers.length} sneakers normalized.`
    );
  }

  function getCategories(item) {
    return Array.isArray(
      item?.catalogCategories
    )
      ? item.catalogCategories
      : inferCategories(item || {});
  }

  function getAllCategories() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return [];
    }

    const values =
      new Set();

    sneakers.forEach(item => {
      getCategories(item)
        .forEach(value =>
          values.add(value)
        );
    });

    const known =
      CATEGORY_ORDER
        .filter(value =>
          values.has(value)
        );

    const extras =
      [...values]
        .filter(value =>
          !CATEGORY_ORDER.includes(value)
        )
        .sort(
          (a, b) =>
            a.localeCompare(b)
        );

    return [
      ...known,
      ...extras
    ];
  }

  window.CatalogEngine = {
    normalizeCollection,
    normalizeItem,
    slugify,
    formatRetail,
    getCategories,
    getAllCategories,
    getCondition,
    getSizeTokens,
    text
  };

  normalizeCollection();
})();
