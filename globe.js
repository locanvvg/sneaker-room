/* =========================================================
   LỘC AN — COLLECTION WORLD MAP v18
   Pure WebGL globe: no external libraries, no map API.

   v18:
   - free 360° rotation on both axes
   - deeper zoom + auto focus on selected countries/locations
   - collision-safe desktop location labels
   - brand/country filters render matching sneaker cards
   - NIKE replaces NIKE SB in brand filter
   - click sneaker card to reveal why it belongs at that location
   - normalized Raygun + BAPE x Stüssy thumbnails
========================================================= */
(() => {
  "use strict";

  const LOCATIONS = {
    beaverton: { lat: 45.4871, lon: -122.8037, country: "us", vi: "Beaverton, Oregon", en: "Beaverton, Oregon" },
    paris: { lat: 48.8566, lon: 2.3522, country: "fr", vi: "Paris, Pháp", en: "Paris, France" },
    tokyo: { lat: 35.6762, lon: 139.6503, country: "jp", vi: "Tokyo, Nhật Bản", en: "Tokyo, Japan" },
    london: { lat: 51.5074, lon: -0.1278, country: "uk", vi: "London, Vương quốc Anh", en: "London, United Kingdom" },
    losangeles: { lat: 34.0522, lon: -118.2437, country: "us", vi: "Los Angeles, California", en: "Los Angeles, California" },
    lagunabeach: { lat: 33.5427, lon: -117.7854, country: "us", vi: "Laguna Beach, California", en: "Laguna Beach, California" },
    seoul: { lat: 37.5665, lon: 126.9780, country: "kr", vi: "Seoul, Hàn Quốc", en: "Seoul, South Korea" },
    richfield: { lat: 41.2398, lon: -81.6382, country: "us", vi: "Richfield, Ohio", en: "Richfield, Ohio" },
    chicago: { lat: 41.8781, lon: -87.6298, country: "us", vi: "Chicago, Illinois", en: "Chicago, Illinois" },
    roswell: { lat: 33.3943, lon: -104.5230, country: "us", vi: "Roswell, New Mexico", en: "Roswell, New Mexico" }
  };

  const COUNTRY_FOCUS = {
    us: { lat: 38.2, lon: -98.0, scale: 1.42 },
    fr: { lat: 46.4, lon: 2.2, scale: 1.88 },
    jp: { lat: 36.1, lon: 138.2, scale: 1.88 },
    uk: { lat: 54.0, lon: -2.5, scale: 1.90 },
    kr: { lat: 36.3, lon: 127.9, scale: 1.95 }
  };

  const STORIES = [
    {
      id: "air-jordan-1-black-bloodline-pe",
      brand: "jordan",
      locations: ["beaverton"],
      roles: {
        beaverton: {
          vi: "Nike World Headquarters · Bối cảnh phát triển Sample",
          en: "Nike World Headquarters · Sample development context"
        }
      },
      reasons: {
        beaverton: {
          vi: "Beaverton được dùng làm điểm đại diện cho bối cảnh phát triển của bản PE Sample này. Nike World Headquarters đặt tại Beaverton; vì đôi trong collection là một sample nằm ngoài hệ thống retail thông thường, bản đồ gắn nó với trung tâm phát triển của Nike/Jordan. Đây không phải là tuyên bố rằng đôi giày được phát hành bán lẻ tại Beaverton.",
          en: "Beaverton represents the development context of this PE Sample. Nike World Headquarters is based in Beaverton, and because the pair in the collection is a sample outside normal retail distribution, the map connects it to Nike/Jordan's development center. This does not mean the sneaker was a Beaverton retail release."
        }
      }
    },
    {
      id: "jordan-1-quai54-ff",
      brand: "jordan",
      locations: ["paris"],
      roles: {
        paris: { vi: "Quai 54 · Paris streetball", en: "Quai 54 · Paris streetball" }
      },
      reasons: {
        paris: {
          vi: "Paris là trung tâm câu chuyện của Quai 54. Phiên bản Friends & Family này gắn trực tiếp với giải streetball Quai 54 và mối liên hệ lâu dài giữa Jordan Brand với văn hóa bóng rổ đường phố tại Paris.",
          en: "Paris is central to the Quai 54 story. This Friends & Family edition is directly tied to the Quai 54 streetball tournament and Jordan Brand's long-running connection with Paris street basketball culture."
        }
      }
    },
    {
      id: "nike-sb-dunk-yuto-matcha",
      brand: "nike",
      locations: ["tokyo"],
      roles: {
        tokyo: { vi: "Yuto Horigome · Bản sắc Nhật Bản", en: "Yuto Horigome · Japanese identity" }
      },
      reasons: {
        tokyo: {
          vi: "Tokyo đại diện cho câu chuyện cá nhân của Yuto Horigome. Thiết kế Matcha nhấn mạnh nguồn gốc Nhật Bản của Yuto qua cảm hứng matcha và biểu tượng gia đình xuất hiện trên đôi giày, nên Tokyo là điểm địa lý tự nhiên nhất cho signature này.",
          en: "Tokyo represents Yuto Horigome's personal story. The Matcha design emphasizes his Japanese identity through matcha-inspired colors and his family crest, making Tokyo the natural geographic anchor for this signature pair."
        }
      }
    },
    {
      id: "virgil-abloh-archive-jordan-1-alaska",
      brand: "jordan",
      locations: ["london"],
      roles: {
        london: { vi: "Alaska Alaska · Creative studio", en: "Alaska Alaska · Creative studio" }
      },
      reasons: {
        london: {
          vi: "London được chọn vì Alaska Alaska là studio sáng tạo gắn trực tiếp với Virgil Abloh tại London. Tên 'Alaska' của đôi giày kết nối với studio này, nên London đại diện cho phần creative context của thiết kế.",
          en: "London is used because Alaska Alaska was a London-based creative studio closely associated with Virgil Abloh. The sneaker's 'Alaska' name connects to that studio, so London represents the design's creative context."
        }
      }
    },
    {
      id: "fragment-union-air-jordan-1-varsity-red-sport-royal-sample",
      brand: "jordan",
      locations: ["beaverton", "tokyo", "losangeles"],
      roles: {
        beaverton: { vi: "Nike World Headquarters · Bối cảnh phát triển Sample", en: "Nike World Headquarters · Sample development context" },
        tokyo: { vi: "Fragment · Tokyo", en: "Fragment · Tokyo" },
        losangeles: { vi: "Union LA · Los Angeles", en: "Union LA · Los Angeles" }
      },
      reasons: {
        beaverton: {
          vi: "Beaverton đại diện cho lớp phát triển của pre-release Sample trong dự án Jordan/Nike. Vì đây không phải một đôi retail thông thường, Nike World Headquarters được dùng như điểm tham chiếu cho bối cảnh phát triển sản phẩm, không phải địa điểm phát hành.",
          en: "Beaverton represents the development layer of this Jordan/Nike pre-release sample. Because it is not a conventional retail pair, Nike World Headquarters is used as a reference point for product development rather than as a release location."
        },
        tokyo: {
          vi: "Tokyo đại diện cho Fragment và Hiroshi Fujiwara. Fragment gắn chặt với ảnh hưởng của Fujiwara trong văn hóa thời trang và streetwear Nhật Bản, nên Tokyo thể hiện phần Fragment của collaboration này.",
          en: "Tokyo represents Fragment and Hiroshi Fujiwara. Fragment is closely tied to Fujiwara's influence on Japanese fashion and streetwear, so Tokyo represents the Fragment side of this collaboration."
        },
        losangeles: {
          vi: "Los Angeles đại diện trực tiếp cho Union LA. Ngôn ngữ tái cấu trúc vintage và nhãn UN/LA trên đôi giày gắn với Union Los Angeles, vì vậy LA là một trong ba điểm chính của collaboration.",
          en: "Los Angeles directly represents Union LA. The reconstructed vintage language and UN/LA branding connect the sneaker to Union Los Angeles, making LA one of the collaboration's three key geographic points."
        }
      },
      arcs: [["beaverton", "tokyo"], ["tokyo", "losangeles"]]
    },
    {
      id: "bape-stussy-camo-canvas-hi-top-green",
      brand: "bapestussy",
      locations: ["tokyo", "lagunabeach"],
      roles: {
        tokyo: { vi: "BAPE · Harajuku / Tokyo", en: "BAPE · Harajuku / Tokyo" },
        lagunabeach: { vi: "Stüssy · California surf/street culture", en: "Stüssy · California surf/street culture" }
      },
      reasons: {
        tokyo: {
          vi: "Tokyo đại diện cho phía BAPE của collaboration. A Bathing Ape hình thành từ Harajuku và bản sắc Harajuku/Tokyo là một phần cốt lõi trong lịch sử của thương hiệu.",
          en: "Tokyo represents the BAPE side of the collaboration. A Bathing Ape emerged from Harajuku, and Harajuku/Tokyo remains central to the brand's identity and history."
        },
        lagunabeach: {
          vi: "Laguna Beach đại diện cho phía Stüssy. Thương hiệu bắt nguồn từ văn hóa surf Southern California của Shawn Stüssy, nên đường nối Tokyo–Laguna Beach thể hiện sự gặp nhau giữa Harajuku streetwear và California surf/street culture.",
          en: "Laguna Beach represents the Stüssy side. The brand grew from Shawn Stüssy's Southern California surf culture, so the Tokyo–Laguna Beach connection shows the meeting of Harajuku streetwear and California surf/street culture."
        }
      },
      arcs: [["tokyo", "lagunabeach"]]
    },
    {
      id: "puma-rose-speedcat-leather-warm-white",
      brand: "puma",
      locations: ["seoul"],
      roles: {
        seoul: { vi: "ROSÉ · Seoul", en: "ROSÉ · Seoul" }
      },
      reasons: {
        seoul: {
          vi: "Seoul được dùng làm điểm đại diện cho lớp văn hóa và nghệ sĩ của dự án PUMA x ROSÉ. Đôi Speedcat được xây dựng quanh phong cách cá nhân của ROSÉ, nên Seoul là điểm kể chuyện phù hợp cho mối liên hệ K-pop và creative identity của collaboration. Đây không phải là tuyên bố rằng đôi giày chỉ được phát hành tại Seoul.",
          en: "Seoul represents the cultural and artist side of the PUMA x ROSÉ project. The Speedcat collaboration is built around ROSÉ's personal style, making Seoul a fitting storytelling point for its K-pop and creative identity. This does not mean the sneaker was released only in Seoul."
        }
      }
    },
    {
      id: "jordan-4-black-cement-1999",
      brand: "jordan",
      locations: ["richfield"],
      roles: {
        richfield: { vi: "The Shot · Richfield Coliseum (1989)", en: "The Shot · Richfield Coliseum (1989)" }
      },
      reasons: {
        richfield: {
          vi: "Richfield được chọn vì lịch sử Air Jordan 4 gắn với 'The Shot' năm 1989. Michael Jordan ghi cú buzzer-beater nổi tiếng trước Cleveland Cavaliers tại Richfield Coliseum khi mang Air Jordan 4. Bản Black Cement 1999 là retro của silhouette gắn với khoảnh khắc đó; pin này kể lịch sử của thiết kế, không phải nơi bản 1999 được phát hành.",
          en: "Richfield is used because Air Jordan 4 history is tied to 'The Shot' in 1989. Michael Jordan hit the famous buzzer-beater against the Cleveland Cavaliers at Richfield Coliseum while wearing the Air Jordan 4. The 1999 Black Cement is a retro of that historically linked silhouette; this pin tells the design story rather than identifying the 1999 release location."
        }
      }
    },
    {
      id: "jordan-13-retro-dmp-finals-pack-2017",
      brand: "jordan",
      locations: ["chicago"],
      roles: {
        chicago: { vi: "Chicago Bulls · Chức vô địch thứ sáu", en: "Chicago Bulls · Sixth championship" }
      },
      reasons: {
        chicago: {
          vi: "Chicago đại diện cho chương cuối của triều đại Michael Jordan cùng Bulls. DMP Finals Pack kỷ niệm chức vô địch NBA thứ sáu và cuối cùng của Jordan với Chicago Bulls năm 1998, nên Chicago là điểm địa lý phù hợp cho câu chuyện mà đôi Jordan 13 này tưởng niệm.",
          en: "Chicago represents the final chapter of Michael Jordan's Bulls dynasty. The DMP Finals Pack commemorates Jordan's sixth and final NBA championship with the Chicago Bulls in 1998, making Chicago the natural geographic anchor for the history celebrated by this Jordan 13."
        }
      }
    },
    {
      id: "nike-sb-dunk-low-raygun-away-2005",
      brand: "nike",
      locations: ["roswell"],
      roles: {
        roswell: { vi: "Roswell Rayguns · UFO / alien storytelling", en: "Roswell Rayguns · UFO / alien storytelling" }
      },
      reasons: {
        roswell: {
          vi: "Roswell là địa điểm của thế giới hư cấu Roswell Rayguns. Nike xây dựng Rayguns như một đội basketball giả tưởng với alien mascot, UFO imagery và retro-futuristic storytelling. Bản 'Away' mang chính mascot đó trên heel, nên Roswell trở thành pin kể chuyện của đôi giày. Đây là narrative location, không phải nơi phát hành độc quyền của sneaker.",
          en: "Roswell is the setting of the fictional Roswell Rayguns universe. Nike created the Rayguns as an imaginary basketball team using an alien mascot, UFO imagery and retro-futurist storytelling. The 'Away' Dunk carries that mascot on the heel, making Roswell the narrative location for the pair rather than an exclusive release city."
        }
      }
    }
  ];

  const COPY = {
    vi: {
      about: "GIỚI THIỆU",
      mainTitle: "BỘ SƯU TẬP GIÀY LỘC AN",
      subtitle: "Không gian lưu trữ & Bảo tàng Giày Kỹ thuật số",
      sneakers: "GIÀY",
      lego: "LEGO",
      mask: "MẶT NẠ GIÀY",
      eyebrow: "TRONG BỘ SƯU TẬP — CÂU CHUYỆN ĐỊA LÝ",
      title: "BẢN ĐỒ BỘ SƯU TẬP",
      description: "Xoay địa cầu để khám phá những thành phố, câu chuyện và mối liên hệ đứng sau các đôi giày đang có trong bộ sưu tập.",
      count: "CÂU CHUYỆN",
      brand: "THƯƠNG HIỆU",
      country: "QUỐC GIA",
      reset: "ĐẶT LẠI",
      guide: "KÉO / VUỐT 360° ĐỂ XOAY · CUỘN / CHỤM ĐỂ PHÓNG TO · BẤM ĐIỂM VÀNG ĐỂ KHÁM PHÁ",
      orbit: "KÉO 360° ĐỂ XOAY",
      allBrands: "TẤT CẢ THƯƠNG HIỆU",
      allCountries: "TẤT CẢ QUỐC GIA",
      countries: { us: "HOA KỲ", fr: "PHÁP", jp: "NHẬT BẢN", uk: "VƯƠNG QUỐC ANH", kr: "HÀN QUỐC" },
      brands: { jordan: "JORDAN", nike: "NIKE", bapestussy: "BAPE x STÜSSY", puma: "PUMA" },
      emptyTitle: "CHỌN MỘT ĐỊA ĐIỂM",
      emptyText: "Bấm vào một điểm vàng trên địa cầu để xem những đôi giày và câu chuyện gắn với địa điểm đó.",
      results: "KẾT QUẢ",
      location: "ĐỊA ĐIỂM",
      pair: "ĐÔI GIÀY",
      pairs: "ĐÔI GIÀY",
      view: "XEM ĐÔI GIÀY →",
      why: "TẠI SAO Ở ĐÂY?",
      hideWhy: "THU GỌN",
      legendPin: "ĐỊA ĐIỂM CÂU CHUYỆN",
      legendLine: "LIÊN KẾT COLLAB",
      footer: "© 2026 Bộ sưu tập giày Lộc An. Bảo lưu mọi quyền."
    },
    en: {
      about: "ABOUT",
      mainTitle: "LỘC AN SNEAKER COLLECTION",
      subtitle: "Digital Sneaker Archive & Museum",
      sneakers: "SNEAKERS",
      lego: "LEGO",
      mask: "SNEAKER MASK",
      eyebrow: "IN COLLECTION — GEOGRAPHIC STORIES",
      title: "COLLECTION WORLD MAP",
      description: "Rotate the globe to explore the cities, stories and connections behind selected pairs currently in the collection.",
      count: "STORIES",
      brand: "BRAND",
      country: "COUNTRY",
      reset: "RESET",
      guide: "DRAG / SWIPE 360° TO ROTATE · SCROLL / PINCH TO ZOOM · SELECT A GOLD POINT TO EXPLORE",
      orbit: "DRAG 360° TO ROTATE",
      allBrands: "ALL BRANDS",
      allCountries: "ALL COUNTRIES",
      countries: { us: "UNITED STATES", fr: "FRANCE", jp: "JAPAN", uk: "UNITED KINGDOM", kr: "SOUTH KOREA" },
      brands: { jordan: "JORDAN", nike: "NIKE", bapestussy: "BAPE x STÜSSY", puma: "PUMA" },
      emptyTitle: "SELECT A LOCATION",
      emptyText: "Select a gold point on the globe to view the pairs and stories connected to that place.",
      results: "RESULTS",
      location: "LOCATION",
      pair: "PAIR",
      pairs: "PAIRS",
      view: "VIEW PAIR →",
      why: "WHY HERE?",
      hideWhy: "COLLAPSE",
      legendPin: "STORY LOCATION",
      legendLine: "COLLAB CONNECTION",
      footer: "© 2026 Lộc An Sneaker Collection. All Rights Reserved."
    }
  };

  const DEFAULT_VIEW = { rotationX: 0.30, rotationY: 1.73, scale: 0.88 };

  const state = {
    lang: "vi",
    brand: "all",
    country: "all",
    selectedLocation: null,
    rotationX: DEFAULT_VIEW.rotationX,
    rotationY: DEFAULT_VIEW.rotationY,
    targetRotationX: null,
    targetRotationY: null,
    scale: DEFAULT_VIEW.scale,
    targetScale: null,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastInteraction: performance.now(),
    activeStories: STORIES.slice()
  };

  const $ = id => document.getElementById(id);

  function initialLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "en" || query === "vi") return query;
    try {
      return localStorage.getItem("locan_lang") === "en" ? "en" : "vi";
    } catch (_) {
      return "vi";
    }
  }

  function setStoredLanguage(lang) {
    try { localStorage.setItem("locan_lang", lang); } catch (_) {}
  }

  function localized(value) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    return String(value[state.lang] ?? value.vi ?? value.en ?? "");
  }

  function sneakerById(id) {
    const catalog = (typeof sneakers !== "undefined" && Array.isArray(sneakers)) ? sneakers : [];
    return catalog.find(item => item?.id === id) || null;
  }

  function setText(id, value) {
    const node = $(id);
    if (node) node.textContent = value;
  }

  function buildFilterOptions() {
    const t = COPY[state.lang];
    const brand = $("globe-brand-filter");
    const country = $("globe-country-filter");
    if (!brand || !country) return;

    brand.innerHTML = [
      `<option value="all">${t.allBrands}</option>`,
      ...Object.entries(t.brands).map(([value, label]) => `<option value="${value}">${label}</option>`)
    ].join("");

    country.innerHTML = [
      `<option value="all">${t.allCountries}</option>`,
      ...Object.entries(t.countries).map(([value, label]) => `<option value="${value}">${label}</option>`)
    ].join("");

    brand.value = state.brand;
    country.value = state.country;
  }

  function updateNavigationLinks() {
    const suffix = `?lang=${encodeURIComponent(state.lang)}`;
    const links = {
      "globe-about-link": `./about.html${suffix}`,
      "globe-nav-sneakers": `./index.html${suffix}`,
      "globe-nav-lego": `./lego.html${suffix}`,
      "globe-nav-mask": `./sneaker-mask.html${suffix}`,
      "timeline-feature-link": `./timeline.html${suffix}`,
      "map-feature-link": `./globe.html${suffix}`
    };
    Object.entries(links).forEach(([id, href]) => {
      const node = $(id);
      if (node) node.href = href;
    });
  }

  function applyCopy() {
    const t = COPY[state.lang];
    document.documentElement.lang = state.lang;

    $("btn-vi")?.classList.toggle("active", state.lang === "vi");
    $("btn-en")?.classList.toggle("active", state.lang === "en");

    setText("globe-about-link", t.about);
    setText("globe-main-title", t.mainTitle);
    setText("globe-brand-subtitle", t.subtitle);
    setText("globe-nav-sneakers", t.sneakers);
    setText("globe-nav-lego", t.lego);
    setText("globe-nav-mask", t.mask);
    setText("globe-eyebrow", t.eyebrow);
    setText("globe-title", t.title);
    setText("globe-description", t.description);
    setText("globe-count-label", t.count);
    setText("globe-brand-label", t.brand);
    setText("globe-country-label", t.country);
    setText("globe-reset", t.reset);
    setText("globe-guide", t.guide);
    setText("globe-orbit-hint", t.orbit);
    setText("globe-legend-pin", t.legendPin);
    setText("globe-legend-line", t.legendLine);
    setText("globe-footer-copy", t.footer);

    buildFilterOptions();
    updateNavigationLinks();
    renderPins();
    renderPanel();

    document.title = state.lang === "vi"
      ? "Bản đồ bộ sưu tập | Lộc An Sneaker Collection"
      : "Collection World Map | Lộc An Sneaker Collection";
  }

  window.setGlobeLanguage = lang => {
    state.lang = lang === "en" ? "en" : "vi";
    setStoredLanguage(state.lang);
    const url = new URL(location.href);
    url.searchParams.set("lang", state.lang);
    history.replaceState({}, "", url.pathname + url.search + url.hash);
    applyCopy();
  };

  function filteredStories() {
    return STORIES.filter(story => {
      if (state.brand !== "all" && story.brand !== state.brand) return false;
      if (state.country !== "all") {
        const hasCountry = story.locations.some(key => LOCATIONS[key]?.country === state.country);
        if (!hasCountry) return false;
      }
      return true;
    });
  }

  function applyFilters() {
    state.activeStories = filteredStories();
    setText("globe-visible-count", String(state.activeStories.length));

    if (state.selectedLocation) {
      const stillUsed = state.activeStories.some(story => story.locations.includes(state.selectedLocation));
      if (!stillUsed) state.selectedLocation = null;
    }

    renderPins();
    renderPanel();
  }

  function storiesAtLocation(locationKey) {
    return state.activeStories.filter(story => story.locations.includes(locationKey));
  }

  function visibleLocations() {
    return Object.keys(LOCATIONS).filter(key => {
      if (storiesAtLocation(key).length === 0) return false;
      if (state.country !== "all" && LOCATIONS[key]?.country !== state.country) return false;
      return true;
    });
  }

  const pinElements = new Map();

  function renderPins() {
    const host = $("globe-pins");
    if (!host) return;

    const allowed = new Set(visibleLocations());

    [...pinElements.entries()].forEach(([key, node]) => {
      if (!allowed.has(key)) {
        node.wrapper.remove();
        pinElements.delete(key);
      }
    });

    allowed.forEach(key => {
      if (pinElements.has(key)) return;

      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = "0";
      wrapper.style.top = "0";
      wrapper.style.pointerEvents = "none";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "globe-pin";
      button.dataset.location = key;
      button.setAttribute("aria-label", LOCATIONS[key][state.lang]);
      button.addEventListener("click", event => {
        event.stopPropagation();
        focusLocation(key);
      });

      const label = document.createElement("span");
      label.className = "globe-location-label";
      label.textContent = LOCATIONS[key][state.lang];

      wrapper.append(button, label);
      host.appendChild(wrapper);
      pinElements.set(key, { wrapper, button, label });
    });

    pinElements.forEach((nodes, key) => {
      nodes.label.textContent = LOCATIONS[key][state.lang];
      nodes.button.setAttribute("aria-label", LOCATIONS[key][state.lang]);
      nodes.button.classList.toggle("active", state.selectedLocation === key);
    });
  }

  function roleFor(story, locationKey) {
    return story.roles?.[locationKey]?.[state.lang]
      ?? story.roles?.[locationKey]?.vi
      ?? "";
  }

  function reasonFor(story, locationKey) {
    return story.reasons?.[locationKey]?.[state.lang]
      ?? story.reasons?.[locationKey]?.vi
      ?? "";
  }

  function locationNamesForStory(story) {
    return story.locations
      .filter(key => !state.country || state.country === "all" || LOCATIONS[key]?.country === state.country)
      .map(key => LOCATIONS[key]?.[state.lang])
      .filter(Boolean);
  }

  function storyCardHTML(story, locationKey = null) {
    const item = sneakerById(story.id);
    if (!item) return "";

    const t = COPY[state.lang];
    const title = localized(item.title);
    const image = item.image || item.images?.[0] || "";
    const href = `./shoe.html?id=${encodeURIComponent(story.id)}&lang=${encodeURIComponent(state.lang)}`;
    const locationKeys = locationKey ? [locationKey] : story.locations.filter(key => state.country === "all" || LOCATIONS[key]?.country === state.country);
    const locations = locationKeys.map(key => LOCATIONS[key]?.[state.lang]).filter(Boolean);
    const role = locationKey
      ? roleFor(story, locationKey)
      : locations.join(" · ");

    const whyBlocks = locationKeys.map(key => {
      const reason = reasonFor(story, key);
      if (!reason) return "";
      return `
        <div class="globe-shoe-why-block">
          ${locationKeys.length > 1 ? `<div class="globe-shoe-why-location">${LOCATIONS[key][state.lang]}</div>` : ""}
          <p>${reason}</p>
        </div>
      `;
    }).join("");

    return `
      <article class="globe-shoe-card" data-story-id="${story.id}" data-location="${locationKey || "all"}">
        <div class="globe-shoe-image">
          <img src="${image}" alt="${title.replaceAll('"', '&quot;')}" loading="lazy">
        </div>
        <div class="globe-shoe-content">
          <div class="globe-shoe-role">${role}</div>
          <h4 class="globe-shoe-title">${title}</h4>
          <div class="globe-shoe-actions">
            <button type="button" class="globe-shoe-why-toggle" aria-expanded="false">${t.why}</button>
            <a class="globe-shoe-link" href="${href}">${t.view}</a>
          </div>
          <div class="globe-shoe-why" hidden>${whyBlocks}</div>
        </div>
      </article>
    `;
  }

  function renderPanel() {
    const panel = $("globe-panel");
    if (!panel) return;
    const t = COPY[state.lang];

    if (state.selectedLocation) {
      const locationData = LOCATIONS[state.selectedLocation];
      const stories = storiesAtLocation(state.selectedLocation);

      if (!locationData || stories.length === 0) {
        state.selectedLocation = null;
        renderPanel();
        return;
      }

      panel.innerHTML = `
        <div class="globe-place-kicker">${t.location}</div>
        <h3 class="globe-place-title">${locationData[state.lang]}</h3>
        <div class="globe-place-meta">${stories.length} ${stories.length === 1 ? t.pair : t.pairs}</div>
        <div class="globe-shoe-list">${stories.map(story => storyCardHTML(story, state.selectedLocation)).join("")}</div>
      `;
      return;
    }

    if (state.brand !== "all" || state.country !== "all") {
      const stories = state.activeStories;
      let title = t.results;
      if (state.brand !== "all" && state.country === "all") title = t.brands[state.brand] || t.results;
      if (state.brand === "all" && state.country !== "all") title = t.countries[state.country] || t.results;
      if (state.brand !== "all" && state.country !== "all") {
        title = `${t.brands[state.brand] || state.brand} · ${t.countries[state.country] || state.country}`;
      }

      panel.innerHTML = `
        <div class="globe-place-kicker">${t.results}</div>
        <h3 class="globe-place-title">${title}</h3>
        <div class="globe-place-meta">${stories.length} ${stories.length === 1 ? t.pair : t.pairs}</div>
        <div class="globe-shoe-list">${stories.map(story => storyCardHTML(story)).join("")}</div>
      `;
      return;
    }

    panel.innerHTML = `
      <div class="globe-panel-empty">
        <strong>${t.emptyTitle}</strong>
        <p>${t.emptyText}</p>
      </div>
    `;
  }

  function latLonVector(latDeg, lonDeg) {
    const lat = latDeg * Math.PI / 180;
    const lon = lonDeg * Math.PI / 180;
    const c = Math.cos(lat);
    return {
      x: c * Math.sin(lon),
      y: Math.sin(lat),
      z: c * Math.cos(lon)
    };
  }

  function rotateVector(v) {
    const cx = Math.cos(state.rotationX);
    const sx = Math.sin(state.rotationX);
    const cy = Math.cos(state.rotationY);
    const sy = Math.sin(state.rotationY);

    // Y first, then X. This makes geographic focus exact:
    // rotationY = -longitude, rotationX = latitude.
    const x1 = v.x * cy + v.z * sy;
    const z1 = -v.x * sy + v.z * cy;
    const y1 = v.y;

    return {
      x: x1,
      y: y1 * cx - z1 * sx,
      z: y1 * sx + z1 * cx
    };
  }

  function projectLocation(key) {
    const stage = $("globe-stage");
    const loc = LOCATIONS[key];
    if (!stage || !loc) return null;

    const rect = stage.getBoundingClientRect();
    const v = rotateVector(latLonVector(loc.lat, loc.lon));
    const radius = state.scale * rect.height / 2;

    return {
      x: rect.width / 2 + v.x * radius,
      y: rect.height / 2 - v.y * radius,
      z: v.z,
      width: rect.width,
      height: rect.height
    };
  }

  function boxesOverlap(a, b, pad = 7) {
    return !(
      a.right + pad < b.left ||
      a.left - pad > b.right ||
      a.bottom + pad < b.top ||
      a.top - pad > b.bottom
    );
  }

  function updatePinPositions() {
    const candidates = [];

    pinElements.forEach((nodes, key) => {
      const p = projectLocation(key);
      if (!p) return;

      const visible = p.z > 0.02;
      nodes.wrapper.style.transform = `translate(${p.x}px, ${p.y}px)`;
      nodes.wrapper.style.opacity = visible ? String(Math.min(1, 0.35 + p.z * 0.9)) : "0";
      nodes.wrapper.style.pointerEvents = visible ? "auto" : "none";
      nodes.button.style.pointerEvents = visible ? "auto" : "none";
      nodes.button.style.scale = `${0.84 + Math.max(0, p.z) * 0.28}`;
      nodes.label.style.opacity = "0";
      nodes.label.style.visibility = "hidden";

      if (visible) candidates.push({ key, nodes, p, selected: state.selectedLocation === key });
    });

    if (window.innerWidth <= 650) return;

    candidates.sort((a, b) => {
      if (a.selected !== b.selected) return a.selected ? -1 : 1;
      return b.p.z - a.p.z;
    });

    const placed = [];
    for (const item of candidates) {
      const text = LOCATIONS[item.key][state.lang];
      const width = Math.max(88, Math.min(220, 31 + text.length * 6.0));
      const box = {
        left: item.p.x + 14,
        top: item.p.y - 12,
        right: item.p.x + 14 + width,
        bottom: item.p.y + 12
      };

      const collides = !item.selected && placed.some(other => boxesOverlap(box, other));
      if (!collides) {
        item.nodes.label.style.visibility = "visible";
        item.nodes.label.style.opacity = item.selected ? "1" : "0.94";
        placed.push(box);
      }
    }
  }

  function normalizeAngle(value) {
    const tau = Math.PI * 2;
    value = (value + Math.PI) % tau;
    if (value < 0) value += tau;
    return value - Math.PI;
  }

  function setFocus(lat, lon, scale) {
    state.targetRotationY = normalizeAngle(-(lon * Math.PI / 180));
    state.targetRotationX = normalizeAngle(lat * Math.PI / 180);
    state.targetScale = Math.max(0.58, Math.min(2.20, scale));
    state.lastInteraction = performance.now();
  }

  function focusLocation(key) {
    const loc = LOCATIONS[key];
    if (!loc) return;

    state.selectedLocation = key;
    setFocus(loc.lat, loc.lon, Math.max(state.scale, 1.72));

    pinElements.forEach((nodes, locationKey) => {
      nodes.button.classList.toggle("active", locationKey === key);
    });

    renderPanel();
  }

  function focusCountry(country) {
    const focus = COUNTRY_FOCUS[country];
    if (!focus) return;
    setFocus(focus.lat, focus.lon, focus.scale);
  }

  function slerpLatLon(a, b, t) {
    const va = latLonVector(a.lat, a.lon);
    const vb = latLonVector(b.lat, b.lon);
    const dot = Math.max(-1, Math.min(1, va.x*vb.x + va.y*vb.y + va.z*vb.z));
    const omega = Math.acos(dot);
    if (omega < 1e-6) return va;
    const so = Math.sin(omega);
    const s1 = Math.sin((1-t)*omega) / so;
    const s2 = Math.sin(t*omega) / so;
    return {
      x: va.x*s1 + vb.x*s2,
      y: va.y*s1 + vb.y*s2,
      z: va.z*s1 + vb.z*s2
    };
  }

  function drawArcs() {
    const canvas = $("globe-arc-canvas");
    const stage = $("globe-stage");
    if (!canvas || !stage) return;

    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,rect.width,rect.height);

    const radius = state.scale * rect.height / 2;
    const active = state.activeStories.filter(story => Array.isArray(story.arcs));
    const allowedLocations = new Set(visibleLocations());

    active.forEach(story => {
      story.arcs.forEach(([fromKey, toKey]) => {
        if (!allowedLocations.has(fromKey) || !allowedLocations.has(toKey)) return;
        const from = LOCATIONS[fromKey];
        const to = LOCATIONS[toKey];
        if (!from || !to) return;

        ctx.beginPath();
        let drawing = false;

        for (let i=0;i<=56;i++) {
          const t = i/56;
          const base = slerpLatLon(from,to,t);
          const lift = 1 + Math.sin(Math.PI*t)*0.095;
          const rotated = rotateVector({x:base.x*lift,y:base.y*lift,z:base.z*lift});
          const visible = rotated.z > -0.015;
          const x = rect.width/2 + rotated.x*radius;
          const y = rect.height/2 - rotated.y*radius;

          if (!visible) {
            drawing = false;
            continue;
          }

          if (!drawing) {
            ctx.moveTo(x,y);
            drawing = true;
          } else {
            ctx.lineTo(x,y);
          }
        }

        const selected = state.selectedLocation && story.locations.includes(state.selectedLocation);
        ctx.strokeStyle = selected ? "rgba(255,204,0,0.90)" : "rgba(255,204,0,0.38)";
        ctx.lineWidth = selected ? 1.8 : 1.0;
        ctx.shadowColor = "rgba(255,204,0,0.35)";
        ctx.shadowBlur = selected ? 10 : 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    });
  }

  // ------------------------- WebGL globe -------------------------
  let gl = null;
  let program = null;
  let uniforms = null;
  let buffers = null;
  let texture = null;

  function compileShader(glContext, type, source) {
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      const message = glContext.getShaderInfoLog(shader);
      glContext.deleteShader(shader);
      throw new Error(message || "Shader compilation failed");
    }
    return shader;
  }

  function createProgram(glContext, vertexSource, fragmentSource) {
    const vertex = compileShader(glContext, glContext.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(glContext, glContext.FRAGMENT_SHADER, fragmentSource);
    const p = glContext.createProgram();
    glContext.attachShader(p, vertex);
    glContext.attachShader(p, fragment);
    glContext.linkProgram(p);
    if (!glContext.getProgramParameter(p, glContext.LINK_STATUS)) {
      const message = glContext.getProgramInfoLog(p);
      glContext.deleteProgram(p);
      throw new Error(message || "Program link failed");
    }
    return p;
  }

  function buildSphere(latSegments=58, lonSegments=92) {
    const positions=[];
    const uvs=[];
    const indices=[];

    for (let iy=0; iy<=latSegments; iy++) {
      const v = iy / latSegments;
      const lat = Math.PI/2 - v*Math.PI;
      const cl = Math.cos(lat);
      const sl = Math.sin(lat);

      for (let ix=0; ix<=lonSegments; ix++) {
        const u = ix / lonSegments;
        const lon = -Math.PI + u*Math.PI*2;
        positions.push(cl*Math.sin(lon), sl, cl*Math.cos(lon));
        uvs.push(u, v);
      }
    }

    const row = lonSegments+1;
    for (let iy=0; iy<latSegments; iy++) {
      for (let ix=0; ix<lonSegments; ix++) {
        const a=iy*row+ix;
        const b=a+row;
        indices.push(a,b,a+1, b,b+1,a+1);
      }
    }

    return {
      positions: new Float32Array(positions),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices)
    };
  }

  function initWebGL() {
    const canvas = $("globe-canvas");
    if (!canvas) return false;

    gl = canvas.getContext("webgl", { alpha:true, antialias:true, powerPreference:"high-performance" });
    if (!gl) return false;

    const vertexSource = `
      attribute vec3 aPosition;
      attribute vec2 aUV;
      uniform float uRX;
      uniform float uRY;
      uniform float uScale;
      uniform float uAspect;
      varying vec2 vUV;
      varying float vShade;
      varying float vFront;
      void main() {
        float cx=cos(uRX), sx=sin(uRX);
        float cy=cos(uRY), sy=sin(uRY);
        vec3 p=aPosition;
        p = vec3(p.x*cy+p.z*sy, p.y, -p.x*sy+p.z*cy);
        p = vec3(p.x, p.y*cx-p.z*sx, p.y*sx+p.z*cx);
        vec3 lightDir=normalize(vec3(-0.35,0.55,1.0));
        vShade=0.58+0.42*max(0.0,dot(normalize(p),lightDir));
        vFront=p.z;
        vUV=aUV;
        gl_Position=vec4(p.x*uScale/uAspect, p.y*uScale, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform sampler2D uTexture;
      varying vec2 vUV;
      varying float vShade;
      varying float vFront;
      void main() {
        if (vFront <= 0.0) discard;
        vec4 tex=texture2D(uTexture,vUV);
        float edge=smoothstep(0.0,0.16,vFront);
        vec3 color=tex.rgb*vShade;
        color += vec3(0.06,0.052,0.0)*pow(max(vFront,0.0),4.0);
        gl_FragColor=vec4(color, edge);
      }
    `;

    program = createProgram(gl, vertexSource, fragmentSource);
    gl.useProgram(program);

    const sphere = buildSphere();
    const posBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,sphere.positions,gl.STATIC_DRAW);

    const uvBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,sphere.uvs,gl.STATIC_DRAW);

    const indexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,sphere.indices,gl.STATIC_DRAW);

    const aPosition=gl.getAttribLocation(program,"aPosition");
    const aUV=gl.getAttribLocation(program,"aUV");

    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer);
    gl.enableVertexAttribArray(aUV);
    gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,0,0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);

    uniforms = {
      rx: gl.getUniformLocation(program,"uRX"),
      ry: gl.getUniformLocation(program,"uRY"),
      scale: gl.getUniformLocation(program,"uScale"),
      aspect: gl.getUniformLocation(program,"uAspect"),
      tex: gl.getUniformLocation(program,"uTexture")
    };

    buffers={ count:sphere.indices.length };

    texture=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([14,14,16,255]));

    const image=new Image();
    image.onload=()=>{
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    };
    image.src="./globe-world.png?v=20261013-v18";

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    return true;
  }

  function resizeGlobe() {
    if (!gl) return;
    const canvas=$("globe-canvas");
    const stage=$("globe-stage");
    if (!canvas || !stage) return;
    const rect=stage.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1, window.innerWidth<700?1.35:1.7);
    const w=Math.max(1,Math.round(rect.width*dpr));
    const h=Math.max(1,Math.round(rect.height*dpr));
    if (canvas.width!==w || canvas.height!==h) {
      canvas.width=w; canvas.height=h;
      gl.viewport(0,0,w,h);
    }
  }

  function renderGlobe() {
    if (!gl || !program) return;
    resizeGlobe();
    const canvas=$("globe-canvas");
    const aspect=canvas.width/canvas.height;

    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(uniforms.rx,state.rotationX);
    gl.uniform1f(uniforms.ry,state.rotationY);
    gl.uniform1f(uniforms.scale,state.scale);
    gl.uniform1f(uniforms.aspect,aspect);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.uniform1i(uniforms.tex,0);
    gl.drawElements(gl.TRIANGLES,buffers.count,gl.UNSIGNED_SHORT,0);
  }

  function shortestAngle(current, target) {
    let delta=(target-current)%(Math.PI*2);
    if (delta>Math.PI) delta-=Math.PI*2;
    if (delta<-Math.PI) delta+=Math.PI*2;
    return delta;
  }

  function tick(now) {
    if (!state.dragging) {
      if (state.targetRotationY != null || state.targetRotationX != null) {
        const dy=state.targetRotationY == null ? 0 : shortestAngle(state.rotationY,state.targetRotationY);
        const dx=state.targetRotationX == null ? 0 : shortestAngle(state.rotationX,state.targetRotationX);
        state.rotationY = normalizeAngle(state.rotationY + dy*0.09);
        state.rotationX = normalizeAngle(state.rotationX + dx*0.09);
        if (Math.abs(dy)<0.0015 && Math.abs(dx)<0.0015) {
          state.targetRotationY=null;
          state.targetRotationX=null;
        }
      } else if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        now-state.lastInteraction>3200
      ) {
        state.rotationY = normalizeAngle(state.rotationY + 0.00042);
      }

      if (state.targetScale != null) {
        const ds = state.targetScale - state.scale;
        state.scale += ds * 0.09;
        if (Math.abs(ds) < 0.002) {
          state.scale = state.targetScale;
          state.targetScale = null;
        }
      }
    }

    renderGlobe();
    updatePinPositions();
    drawArcs();
    requestAnimationFrame(tick);
  }

  function installInteraction() {
    const stage=$("globe-stage");
    if (!stage) return;

    stage.addEventListener("pointerdown",event=>{
      if (event.target.closest(".globe-pin")) return;
      state.dragging=true;
      state.pointerId=event.pointerId;
      state.lastX=event.clientX;
      state.lastY=event.clientY;
      state.targetRotationX=null;
      state.targetRotationY=null;
      state.targetScale=null;
      state.lastInteraction=performance.now();
      stage.setPointerCapture?.(event.pointerId);
    });

    stage.addEventListener("pointermove",event=>{
      if (!state.dragging || event.pointerId!==state.pointerId) return;
      const dx=event.clientX-state.lastX;
      const dy=event.clientY-state.lastY;
      state.lastX=event.clientX;
      state.lastY=event.clientY;
      state.rotationY = normalizeAngle(state.rotationY + dx*0.0062);
      state.rotationX = normalizeAngle(state.rotationX + dy*0.0062);
      state.lastInteraction=performance.now();
    });

    const stop=event=>{
      if (event.pointerId!==state.pointerId) return;
      state.dragging=false;
      state.pointerId=null;
      state.lastInteraction=performance.now();
      try { stage.releasePointerCapture?.(event.pointerId); } catch (_) {}
    };
    stage.addEventListener("pointerup",stop);
    stage.addEventListener("pointercancel",stop);

    stage.addEventListener("wheel",event=>{
      event.preventDefault();
      state.targetScale=null;
      state.scale=Math.max(0.58,Math.min(2.20,state.scale-event.deltaY*0.0009));
      state.lastInteraction=performance.now();
    },{passive:false});

    let touchDistance=null;
    stage.addEventListener("touchmove",event=>{
      if (event.touches.length!==2) { touchDistance=null; return; }
      const [a,b]=event.touches;
      const dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
      if (touchDistance!=null) {
        state.targetScale=null;
        state.scale=Math.max(0.58,Math.min(2.20,state.scale+(dist-touchDistance)*0.0032));
      }
      touchDistance=dist;
      state.lastInteraction=performance.now();
    },{passive:true});
    stage.addEventListener("touchend",()=>{ touchDistance=null; },{passive:true});
  }

  function installFilters() {
    $("globe-brand-filter")?.addEventListener("change",event=>{
      state.brand=event.target.value;
      state.selectedLocation=null;
      applyFilters();
    });

    $("globe-country-filter")?.addEventListener("change",event=>{
      state.country=event.target.value;
      state.selectedLocation=null;
      applyFilters();
      if (state.country !== "all") focusCountry(state.country);
    });

    $("globe-reset")?.addEventListener("click",()=>{
      state.brand="all";
      state.country="all";
      state.selectedLocation=null;
      state.rotationX=DEFAULT_VIEW.rotationX;
      state.rotationY=DEFAULT_VIEW.rotationY;
      state.targetRotationX=null;
      state.targetRotationY=null;
      state.scale=DEFAULT_VIEW.scale;
      state.targetScale=null;
      buildFilterOptions();
      applyFilters();
    });
  }

  function installPanelActions() {
    const panel = $("globe-panel");
    if (!panel) return;

    panel.addEventListener("click", event => {
      const toggle = event.target.closest(".globe-shoe-why-toggle");
      if (!toggle) return;

      const card = toggle.closest(".globe-shoe-card");
      const why = card?.querySelector(".globe-shoe-why");
      if (!why) return;

      const opening = why.hidden;
      why.hidden = !opening;
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.textContent = opening ? COPY[state.lang].hideWhy : COPY[state.lang].why;
    });
  }

  function init() {
    state.lang=initialLanguage();
    state.activeStories=STORIES.slice();
    applyCopy();
    applyFilters();
    installFilters();
    installPanelActions();
    installInteraction();

    if (!initWebGL()) {
      const panel=$("globe-panel");
      if (panel) panel.innerHTML='<div class="globe-panel-empty"><strong>WebGL unavailable</strong><p>This browser cannot render the interactive globe.</p></div>';
      return;
    }

    window.addEventListener("resize",()=>{
      updatePinPositions();
      drawArcs();
    },{passive:true});

    requestAnimationFrame(tick);
  }

  if (document.readyState==="loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
