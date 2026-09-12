<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chi Tiết Tác Phẩm - Lộc An Sneaker Collection</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="site-header">
    <a href="index.html" class="back-btn">← Quay lại Bộ sưu tập</a>
    <h1>Lộc An Sneaker Collection</h1>
  </header>

  <main class="shoe-detail-container">
    <div class="shoe-image-section">
      <img id="shoe-image" src="" alt="Sneaker Image">
    </div>

    <div class="shoe-info-section">
      <h2 id="shoe-title"></h2>
      <p id="shoe-subtitle" class="subtitle"></p>

      <div class="specs-grid">
        <div class="spec-item">
          <span class="spec-label">MÃ SẢN PHẨM (SKU)</span>
          <span id="shoe-sku" class="spec-value"></span>
        </div>
        <div class="spec-item">
          <span class="spec-label">PHỐI MÀU (COLORWAY)</span>
          <span id="shoe-colorway" class="spec-value"></span>
        </div>
        <div class="spec-item">
          <span class="spec-label">GIÁ PHÁT HÀNH (RETAIL)</span>
          <span id="shoe-retail" class="spec-value"></span>
        </div>
        <div class="spec-item">
          <span class="spec-label">NGÀY RA MẮT</span>
          <span id="shoe-date" class="spec-value"></span>
        </div>
        <div class="spec-item">
          <span class="spec-label">TÌNH TRẠNG</span>
          <span id="shoe-condition" class="spec-value highlight"></span>
        </div>
        <div class="spec-item">
          <span class="spec-label">KÍCH CỠ (SIZE)</span>
          <span id="shoe-size" class="spec-value size-highlight"></span>
        </div>
      </div>

      <!-- KHUNG HIỂN THỊ GHI CHÚ LƯU TRỮ -->
      <div id="exhibition-note-box" class="exhibition-note-card">
        <h3>Ghi chú lưu trữ (Exhibition Note)</h3>
        <p id="shoe-exhibition-note"></p>
      </div>
    </div>
  </main>

  <section class="story-section">
    <h3>Câu chuyện & Bối cảnh thiết kế</h3>
    <div id="shoe-story"></div>
  </section>

  <script src="data.js"></script>
  <script>
    // Lấy ID giày từ URL (ví dụ: shoe.html?id=air-jordan-1-black-bloodline-pe)
    const urlParams = new URLSearchParams(window.location.search);
    const shoeId = urlParams.get('id');

    // Tìm đôi giày tương ứng trong mảng sneakers từ file data.js
    const sneaker = sneakers.find(item => item.id === shoeId);

    if (sneaker) {
      document.getElementById('shoe-title').innerText = sneaker.title;
      document.getElementById('shoe-subtitle').innerText = sneaker.subtitle;
      document.getElementById('shoe-sku').innerText = sneaker.sku;
      document.getElementById('shoe-colorway').innerText = sneaker.colorway;
      document.getElementById('shoe-retail').innerText = sneaker.retailPrice;
      document.getElementById('shoe-date').innerText = sneaker.releaseDate;
      document.getElementById('shoe-condition').innerText = sneaker.condition;
      document.getElementById('shoe-size').innerText = sneaker.size;
      document.getElementById('shoe-image').src = sneaker.image;
      document.getElementById('shoe-image').alt = sneaker.title;
      document.getElementById('shoe-story').innerHTML = sneaker.story;

      // Hiển thị ghi chú lưu trữ nếu có
      const noteBox = document.getElementById('exhibition-note-box');
      if (sneaker.exhibitionNote) {
        document.getElementById('shoe-exhibition-note').innerText = sneaker.exhibitionNote;
        noteBox.style.display = 'block';
      } else {
        noteBox.style.display = 'none';
      }
    } else {
      document.querySelector('main').innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1; padding: 50px;">Không tìm thấy thông tin tác phẩm này.</p>';
    }
  </script>

</body>
</html>
