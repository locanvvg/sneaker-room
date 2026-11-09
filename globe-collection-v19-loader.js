/* ===========================================================
   LỘC AN — WORLD MAP / CATALOG SYNC v19
   Companion to the existing globe.js v18 engine.

   This loader keeps the current 360-degree globe renderer, UI,
   orbit, pins, arcs, and card layouts unchanged. It applies a
   narrowly-scoped source adapter to the existing local engine:
   - filter by LIVE collectionStatus (own only)
   - add real geographic / brand-heritage contexts to newly added pairs
   - support explicitly curated future item.mapLocations
   - add Germany and previously missing brand filters
   It never changes sneakers or the collection catalog itself.
=========================================================== */
(() => {
  "use strict";

  const MAP_ENGINE = "./globe.js?v=20261013-v18";

  function installFailure(message) {
    console.error("[Lộc An Map]", message);
    const panel = document.getElementById("globe-panel");
    if (panel) {
      const block = document.createElement("div");
      block.className = "globe-panel-empty";
      const strong = document.createElement("strong");
      strong.textContent = "Không thể khởi động bản đồ / Map could not start";
      const paragraph = document.createElement("p");
      paragraph.textContent = "Vui lòng tải lại trang. Không có dữ liệu bộ sưu tập nào bị thay đổi. / Please reload this page; collection data was not modified.";
      block.append(strong, paragraph);
      panel.replaceChildren(block);
    }
  }

  // This is injected inside the original map's own closure. The original
  // LOCATIONS, STORIES, sneakerById, and render functions remain accessible.
  const GEO_ENHANCEMENT = String.raw`
  /* LOC AN — curated, transparent geographic connections */
  function isInCollection(id) {
    const item = sneakerById(id);
    return Boolean(item && String(item.collectionStatus || "").trim().toLowerCase() === "own");
  }

  function addCollectionGeography() {
    const items = (typeof sneakers !== "undefined" && Array.isArray(sneakers)) ? sneakers : [];
    const originalIds = new Set(STORIES.map(story => story.id));
    const roots = {
      jordan: {
        location: "chicago", brand: "jordan",
        role: { vi:"Jordan Brand · Di sản bóng rổ Chicago", en:"Jordan Brand · Chicago basketball heritage" },
        reason: {
          vi:"Chicago là điểm tham chiếu lịch sử của Air Jordan qua thời kỳ Michael Jordan thi đấu cho Chicago Bulls. Đây là liên hệ di sản thương hiệu, không phải nơi sản xuất hay địa điểm phát hành riêng của phối màu này.",
          en:"Chicago is the historical anchor for Air Jordan through Michael Jordan's years with the Chicago Bulls. This is a brand-heritage reference, not a claim about where this colorway was manufactured or released."
        }
      },
      nike: {
        location: "beaverton", brand: "nike",
        role: { vi:"Nike · Trụ sở tại Oregon", en:"Nike · Oregon headquarters" },
        reason: {
          vi:"Beaverton đại diện cho trung tâm lịch sử và phát triển của Nike tại Oregon. Pin này giải thích nguồn gốc thương hiệu, không khẳng định đôi giày được sản xuất hoặc ra mắt tại Beaverton.",
          en:"Beaverton represents Nike's headquarters and development heritage in Oregon. This is brand context, not a claim that the specific sneaker was made or released in Beaverton."
        }
      },
      offwhite: {
        location: "chicago", brand: "nike",
        role: { vi:"Virgil Abloh · Cộng đồng sáng tạo Chicago", en:"Virgil Abloh · Chicago creative roots" },
        reason: {
          vi:"Chicago gắn với nền tảng sáng tạo và sự nghiệp thời kỳ đầu của Virgil Abloh, người thiết kế nhiều dự án Nike x Off-White. Đây là tham chiếu đến nhà thiết kế, không phải nơi phát hành hay sản xuất Waffle Racer.",
          en:"Chicago is associated with Virgil Abloh's early creative community and career, contextualizing his Nike x Off-White work. This is a designer connection, not a Waffle Racer release or manufacturing location."
        }
      },
      newbalance: {
        location: "boston", brand: "newbalance",
        role: { vi:"New Balance · Di sản Boston", en:"New Balance · Boston heritage" },
        reason: {
          vi:"Boston là nơi New Balance hình thành và phát triển. Đối với một đôi 2002R custom, pin này chỉ phản ánh nguồn gốc thương hiệu; không khẳng định việc custom được thực hiện tại Boston.",
          en:"Boston is where New Balance began and grew. For a custom 2002R, this marker denotes the brand's origins, not the location where the customization was performed."
        }
      },
      balenciaga: {
        location: "paris", brand: "balenciaga",
        role: { vi:"Balenciaga · Nhà mốt tại Paris", en:"Balenciaga · Paris fashion house" },
        reason: {
          vi:"Paris phản ánh bối cảnh nhà mốt Balenciaga hiện đại. Thương hiệu có nguồn gốc Tây Ban Nha, còn pin này là tham chiếu tới bối cảnh sáng tạo tại Paris, không phải nơi sản xuất Defender.",
          en:"Paris represents the contemporary Balenciaga fashion-house context. The house originated in Spain; this marker denotes its Paris creative context, not where the Defender was manufactured."
        }
      },
      vans: {
        location: "anaheim", brand: "vans",
        role: { vi:"Vans · Nguồn gốc Anaheim", en:"Vans · Anaheim roots" },
        reason: {
          vi:"Vans ra đời tại Anaheim, California năm 1966. Liên hệ này đặt Knu Skool vào lịch sử thương hiệu và văn hóa skate California, không phải địa điểm phát hành độc quyền của đôi giày.",
          en:"Vans was founded in Anaheim, California in 1966. This connects Knu Skool to the brand's California skate heritage, not to an exclusive release location."
        }
      },
      adidas: {
        location: "herzogenaurach", brand: "adidas",
        role: { vi:"adidas · Nguồn gốc tại Đức", en:"adidas · German origins" },
        reason: {
          vi:"Herzogenaurach, Đức là quê hương của adidas. Pin thể hiện lịch sử thương hiệu của adiFOM Superstar, không khẳng định mẫu giày được sản xuất hay phát hành lần đầu tại đây.",
          en:"Herzogenaurach, Germany is adidas's home town. The marker supplies brand history for the adiFOM Superstar, not a claim of manufacturing or launch location."
        }
      },
      puma: {
        location: "herzogenaurach", brand: "puma",
        role: { vi:"PUMA · Nguồn gốc tại Đức", en:"PUMA · German origins" },
        reason: {
          vi:"Herzogenaurach là quê hương của PUMA. Vị trí này dành cho những đôi PUMA không có liên hệ địa lý cụ thể hơn như phiên bản ROSÉ đã được gắn với Seoul.",
          en:"Herzogenaurach is PUMA's home town. This is used only for PUMA entries without a more specific connection, such as the existing Seoul-linked ROSÉ collaboration."
        }
      }
    };

    const describe = item => {
      const title = (typeof item.title === "string" ? item.title : (item.title?.en || item.title?.vi || ""));
      return (String(item.id || "") + " " + String(title)).toLowerCase();
    };

    for (const item of items) {
      if (!item || !item.id || !isInCollection(item.id) || originalIds.has(item.id)) continue;
      const title = describe(item);
      let rule;
      if (/off[ -]?white|virgil abloh/.test(title) && /nike|waffle|jordan/.test(title)) rule = roots.offwhite;
      else if (/jordan/.test(title)) rule = roots.jordan;
      else if (/new balance|\bnb\b/.test(title)) rule = roots.newbalance;
      else if (/balenciaga/.test(title)) rule = roots.balenciaga;
      else if (/vans/.test(title)) rule = roots.vans;
      else if (/adidas/.test(title)) rule = roots.adidas;
      else if (/puma/.test(title)) rule = roots.puma;
      else if (/nike/.test(title)) rule = roots.nike;
      else continue; // Do not invent geography for unknown brands or products.

      // If a later catalog entry explicitly records a supported location,
      // honor that over generic brand heritage. Keys must be in LOCATIONS.
      const declared = item.mapLocations ?? item.geoLocations ?? item.mapLocation;
      const raw = Array.isArray(declared) ? declared : (typeof declared === "string" ? [declared] : []);
      const keys = raw.filter(key => typeof key === "string" && LOCATIONS[key]);
      const locations = keys.length ? [...new Set(keys)] : [rule.location];
      const roles = {}, reasons = {};
      for (const key of locations) {
        roles[key] = keys.length ? { vi:"Liên hệ địa lý ghi trong catalog", en:"Catalog-recorded geographic connection" } : rule.role;
        reasons[key] = keys.length ? {
          vi:"Địa điểm được liên kết trong hồ sơ của đôi giày trong bộ sưu tập. Đây là mối liên hệ lưu trữ, không mặc định là nơi sản xuất hoặc phát hành.",
          en:"This location is referenced in the sneaker's collection catalog record. It does not automatically represent where the pair was manufactured or released."
        } : rule.reason;
      }
      STORIES.push({ id:item.id, brand:rule.brand, locations, roles, reasons });
      originalIds.add(item.id);
    }
  }
  addCollectionGeography();
  `;

  const replacements = [
    [
      "  const LOCATIONS = {",
      "  const LOCATIONS = {\n" +
      '    boston: { lat: 42.3601, lon: -71.0589, country: "us", vi: "Boston, Massachusetts", en: "Boston, Massachusetts" },\n' +
      '    anaheim: { lat: 33.8366, lon: -117.9143, country: "us", vi: "Anaheim, California", en: "Anaheim, California" },\n' +
      '    herzogenaurach: { lat: 49.5704, lon: 10.8860, country: "de", vi: "Herzogenaurach, Đức", en: "Herzogenaurach, Germany" },'
    ],
    [
      "  const COUNTRY_FOCUS = {",
      "  const COUNTRY_FOCUS = {\n    de: { lat: 51.2, lon: 10.4, scale: 1.82 },"
    ],
    [
      "  const COPY = {",
      GEO_ENHANCEMENT + "\n\n  const COPY = {"
    ],
    [
      "    return STORIES.filter(story => {",
      "    return STORIES.filter(story => {\n      if (!isInCollection(story.id)) return false;"
    ],
    [
      "state.activeStories=STORIES.slice();",
      "state.activeStories=STORIES.filter(story => isInCollection(story.id));"
    ]
  ];

  function patchSource(source) {
    for (const [oldText, newText] of replacements) {
      if (source.split(oldText).length !== 2) {
        throw Error(`Map source changed: anchor not unique or missing: ${oldText}`);
      }
      source = source.replace(oldText, newText);
    }

    // Preserve original VI/EN labels and append filters for newly supported items.
    let countries = 0, brands = 0;
    source = source.replace(/countries:\s*\{([^{}]+)\}/g, (whole, content) => {
      countries++;
      return `countries: {${content.trim().replace(/,\s*$/, "")}, de: "${content.includes("HOA KỲ") ? "ĐỨC" : "GERMANY"}" }`;
    });
    source = source.replace(/brands:\s*\{([^{}]+)\}/g, (whole, content) => {
      brands++;
      return `brands: {${content.trim().replace(/,\s*$/, "")}, newbalance: "NEW BALANCE", balenciaga: "BALENCIAGA", vans: "VANS", adidas: "ADIDAS" }`;
    });
    if (countries !== 2 || brands !== 2) {
      throw Error(`Map language filters changed (countries=${countries}, brands=${brands})`);
    }

    source += "\n//# sourceURL=locan-world-map-catalog-sync-v19.js\n";
    return source;
  }

  async function load() {
    try {
      const response = await fetch(MAP_ENGINE, { cache:"no-store" });
      if (!response.ok) throw Error(`Map source HTTP ${response.status}`);
      const original = await response.text();
      if (!original.includes("COLLECTION WORLD MAP v18")) {
        throw Error("Unexpected map engine version; do not patch unknown source");
      }
      const patched = patchSource(original);
      const script = document.createElement("script");
      script.textContent = patched;
      document.body.appendChild(script);
      script.remove();
      console.info("[Lộc An Map] Catalog geography and own-only filter enabled (v19)");
    } catch (error) {
      installFailure(error);
    }
  }

  load();
})();
