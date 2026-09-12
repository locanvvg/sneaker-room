let currentLang = localStorage.getItem('locan_lang') || 'vi';

const translations = {
  vi: {
    mainTitle: "LỘC AN SNEAKER COLLECTION",
    mainSubtitle: "Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số",
    loading: "Đang cập nhật dữ liệu bộ sưu tập..."
  },
  en: {
    mainTitle: "LỘC AN SNEAKER COLLECTION",
    mainSubtitle: "Digital Sneaker Archive & Museum",
    loading: "Updating collection data..."
  }
};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('locan_lang', lang);
  
  const btnVi = document.getElementById('btn-vi');
  const btnEn = document.getElementById('btn-en');
  if (btnVi) btnVi.classList.toggle('active', lang === 'vi');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('sneaker-grid');
  if (!grid) return;

  if (typeof sneakers !== 'undefined' && sneakers.length > 0) {
    const sortedSneakers = [...sneakers].sort((a, b) => 
      a.title[currentLang].localeCompare(b.title[currentLang], 'en', { sensitivity: 'base' })
    );

    grid.innerHTML = sortedSneakers.map(shoe => {
      const badgeText = shoe.editionType[currentLang] ? `<span class="badge">${shoe.editionType[currentLang]}</span>` : `<span class="badge" style="visibility: hidden;">&nbsp;</span>`;
      return `
        <a href="shoe.html?id=${shoe.id}&lang=${currentLang}" class="card-link">
          <div class="card">
            <div class="card-img-wrapper">
              <img src="${shoe.image}" alt="${shoe.title[currentLang]}">
            </div>
            <div class="card-info">
              <h3>${shoe.title[currentLang]}</h3>
              <p class="subtitle">${shoe.subtitle[currentLang]}</p>
              <div class="card-meta">
                ${badgeText}
                <span class="size">${shoe.size || ''}</span>
              </div>
            </div>
          </div>
        </a>
      `;
    }).join('');
  } else {
    grid.innerHTML = `<p style="color: #888; text-align: center; grid-column: 1/-1;">${translations[currentLang].loading}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});
