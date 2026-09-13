<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta
    name="description"
    content="Lộc An Sneaker Collection - Digital Sneaker Archive & Museum"
  >

  <meta
    name="theme-color"
    content="#0d0d0d"
  >

  <title>Lộc An Sneaker Collection</title>

  <link
    rel="icon"
    type="image/svg+xml"
    href="./favicon.svg"
  >

  <link
    rel="apple-touch-icon"
    href="./apple-touch-icon.png"
  >

  <link
    rel="manifest"
    href="./site.webmanifest"
  >

  <link
    rel="stylesheet"
    href="./style.css?v=20260912-spa1"
  >

  <link
    rel="stylesheet"
    href="./collection-menu.css?v=20260912-spa1"
  >
</head>


<body>

  <div class="container">

    <!-- =====================================================
         GLOBAL HEADER
    ====================================================== -->

    <header class="home-header">

      <div class="header-corner-tools">

        <a
          href="#about"
          id="about-nav-link"
          class="about-corner-link"
        >
          ABOUT
        </a>


        <div class="lang-switcher">

          <button
            type="button"
            id="btn-vi"
            class="lang-btn active"
            onclick="setLanguage('vi')"
          >
            VI
          </button>

          <button
            type="button"
            id="btn-en"
            class="lang-btn"
            onclick="setLanguage('en')"
          >
            EN
          </button>

        </div>

      </div>


      <h1 id="site-main-title">
        LỘC AN SNEAKER COLLECTION
      </h1>


      <p
        id="site-main-subtitle"
        data-vi="Không gian lưu trữ & Bảo tàng Sneaker Kỹ thuật số"
        data-en="Digital Sneaker Archive & Museum"
      >
        Không gian lưu trữ &amp; Bảo tàng Sneaker Kỹ thuật số
      </p>


      <!-- =================================================
           MAIN COLLECTION NAV
      ================================================== -->

      <nav
        class="museum-nav"
        aria-label="Collection navigation"
      >

        <a
          href="#sneakers"
          class="museum-nav-link"
          data-route="sneakers"
        >
          SNEAKERS
        </a>


        <a
          href="#lego"
          class="museum-nav-link"
          data-route="lego"
        >
          LEGO
        </a>


        <a
          href="#masks"
          class="museum-nav-link"
          data-route="masks"
        >
          SNEAKER MASK
        </a>

      </nav>

    </header>


    <!-- =====================================================
         SNEAKERS
    ====================================================== -->

    <section
      id="section-sneakers"
      class="site-section"
      data-section="sneakers"
    >

      <!-- SORT -->

      <section class="collection-toolbar">

        <div class="sort-control">

          <label
            for="sort-select"
            id="sort-label"
          >
            SẮP XẾP
          </label>


          <select
            id="sort-select"
            onchange="changeSort(this.value)"
          >

            <option value="default">
              Mặc định
            </option>

            <option value="az">
              A → Z
            </option>

            <option value="za">
              Z → A
            </option>

            <option value="date-desc">
              Ngày phát hành: Mới → Cũ
            </option>

            <option value="date-asc">
              Ngày phát hành: Cũ → Mới
            </option>

            <option value="size-asc">
              Size nhỏ → lớn
            </option>

            <option value="size-desc">
              Size lớn → nhỏ
            </option>

          </select>

        </div>

      </section>


      <!-- FILTER -->

      <section class="filter-panel">

        <div class="filter-panel-header">

          <span
            class="filter-main-label"
            id="filter-title"
          >
            BỘ LỌC BỘ SƯU TẬP
          </span>


          <button
            type="button"
            id="clear-filters"
            class="clear-filter-btn"
            onclick="clearAllFilters()"
          >
            XÓA BỘ LỌC
          </button>

        </div>


        <!-- EDITION -->

        <div class="filter-group">

          <div
            id="edition-filter-label"
            class="filter-group-label"
          >
            PHÂN KHÚC
          </div>


          <div class="filter-chips">

            <button
              type="button"
              class="filter-chip"
              data-group="edition"
              data-value="PE"
              onclick="toggleFilter('edition','PE')"
            >
              PE
            </button>


            <button
              type="button"
              class="filter-chip"
              data-group="edition"
              data-value="Sample"
              onclick="toggleFilter('edition','Sample')"
            >
              SAMPLE
            </button>


            <button
              type="button"
              class="filter-chip"
              data-group="edition"
              data-value="F&F"
              onclick="toggleFilter('edition','F&F')"
            >
              F&amp;F
            </button>


            <button
              type="button"
              class="filter-chip"
              data-group="edition"
              data-value="Signature Signed"
              onclick="toggleFilter('edition','Signature Signed')"
            >
              SIGNATURE SIGNED
            </button>


            <button
              type="button"
              class="filter-chip"
              data-group="edition"
              data-value="GR"
              onclick="toggleFilter('edition','GR')"
            >
              GR
            </button>

          </div>

        </div>


        <!-- CONDITION -->

        <div class="filter-group">

          <div
            id="condition-filter-label"
            class="filter-group-label"
          >
            TÌNH TRẠNG
          </div>


          <div class="filter-chips">

            <button
              type="button"
              class="filter-chip"
              data-group="condition"
              data-value="Deadstock"
              onclick="toggleFilter('condition','Deadstock')"
            >
              DEADSTOCK
            </button>


            <button
              type="button"
              class="filter-chip"
              data-group="condition"
              data-value="Used"
              onclick="toggleFilter('condition','Used')"
            >
              USED
            </button>

          </div>

        </div>


        <!-- SIZE -->

        <div class="filter-group">

          <div
            id="size-filter-label"
            class="filter-group-label"
          >
            KÍCH CỠ
          </div>

          <div
            id="size-filter-chips"
            class="filter-chips"
          ></div>

        </div>

      </section>


      <div
        id="collection-count"
        class="collection-count"
      >
        TỔNG SỐ: 0 ĐÔI
      </div>


      <div
        id="sneaker-grid"
        class="grid"
      ></div>

    </section>


    <!-- =====================================================
         LEGO
    ====================================================== -->

    <section
      id="section-lego"
      class="site-section"
      data-section="lego"
      hidden
    >

      <section class="collection-category-hero">

        <p class="collection-category-eyebrow">
          LEGO ARCHIVE
        </p>


        <h2>
          Nike x LEGO
        </h2>


        <p
          id="lego-description"
          data-vi="Kho lưu trữ các bộ Nike x LEGO trong Lộc An Sneaker Collection, ghi nhận sự giao thoa giữa sneaker culture, basketball và thiết kế LEGO."
          data-en="An archive of Nike x LEGO sets within the Lộc An Sneaker Collection, documenting the intersection of sneaker culture, basketball, and LEGO design."
        >
          Kho lưu trữ các bộ Nike x LEGO trong
          Lộc An Sneaker Collection, ghi nhận sự giao thoa
          giữa sneaker culture, basketball và thiết kế LEGO.
        </p>

      </section>


      <div
        id="lego-count"
        class="collection-count"
      ></div>


      <div
        id="lego-grid"
        class="grid"
      ></div>

    </section>


    <!-- =====================================================
         SNEAKER MASK
    ====================================================== -->

    <section
      id="section-masks"
      class="site-section"
      data-section="masks"
      hidden
    >

      <section class="collection-category-hero">

        <p class="collection-category-eyebrow">
          SNEAKER MASK ARCHIVE
        </p>


        <h2>
          Handcrafted Sneaker Masks
        </h2>


        <p
          id="mask-description"
          data-vi="Kho lưu trữ các tác phẩm Sneaker Mask độc bản được cắt tay và chế tác hoàn toàn thủ công từ những đôi sneaker nguyên bản."
          data-en="An archive of unique Sneaker Mask artifacts, hand-cut and entirely handmade from original sneakers."
        >
          Kho lưu trữ các tác phẩm Sneaker Mask độc bản
          được cắt tay và chế tác hoàn toàn thủ công
          từ những đôi sneaker nguyên bản.
        </p>

      </section>


      <div
        id="mask-count"
        class="collection-count"
      ></div>


      <div
        id="mask-grid"
        class="grid mask-grid"
      ></div>

    </section>


    <!-- =====================================================
         ABOUT
    ====================================================== -->

    <section
      id="section-about"
      class="site-section about-page"
      data-section="about"
      hidden
    >

      <!-- VI -->

      <section
        class="about-hero lang-panel"
        data-lang="vi"
      >

        <p class="about-kicker">
          VỀ BỘ SƯU TẬP
        </p>


        <h2>
          Sneaker như một hiện vật thiết kế,
          văn hóa và lịch sử.
        </h2>


        <p>
          Lộc An Sneaker Collection là một kho lưu trữ sneaker tư nhân
          được xây dựng theo hướng catalogue kỹ thuật số.
          Mỗi đôi giày được ghi nhận không chỉ bằng hình ảnh,
          mà còn bằng thông tin phát hành, nguồn gốc,
          tình trạng và câu chuyện thiết kế.
        </p>


        <p>
          Bộ sưu tập bao gồm General Release,
          Player Exclusive, Friends &amp; Family,
          Sample, Signature Signed
          cùng những hiện vật đặc biệt khác thuộc văn hóa sneaker.
        </p>

      </section>


      <!-- EN -->

      <section
        class="about-hero lang-panel"
        data-lang="en"
        hidden
      >

        <p class="about-kicker">
          ABOUT THE COLLECTION
        </p>


        <h2>
          Sneakers as objects of design,
          culture, and history.
        </h2>


        <p>
          Lộc An Sneaker Collection is a private sneaker archive
          built as a digital catalogue.
          Each pair is documented through imagery,
          release information, provenance,
          condition and design context.
        </p>


        <p>
          The collection includes General Releases,
          Player Exclusives, Friends &amp; Family editions,
          Samples, Signature Signed pieces
          and other distinctive sneaker-culture artifacts.
        </p>

      </section>


      <section class="archive-principles">


        <!-- VI CLASSIFICATION -->

        <article
          class="archive-panel lang-panel"
          data-lang="vi"
        >

          <p class="about-kicker">
            PHÂN LOẠI PHIÊN BẢN
          </p>


          <h3>
            Hệ thống phân loại trong bộ sưu tập
          </h3>


          <div class="definition-item">

            <strong>
              General Release (GR)
            </strong>

            <span>
              Phiên bản được sản xuất và phân phối thương mại công khai
              thông qua các kênh bán lẻ chính thức hoặc được ủy quyền,
              dành cho thị trường người tiêu dùng nói chung.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Player Exclusive (PE)
            </strong>

            <span>
              Phiên bản được thương hiệu sản xuất hoặc tùy chỉnh
              dành riêng cho vận động viên, đội thi đấu
              hay cá nhân được chỉ định,
              và thường không phát hành bán lẻ công khai.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Friends &amp; Family (F&amp;F)
            </strong>

            <span>
              Phiên bản không phát hành bán lẻ công khai,
              được thương hiệu, nhà thiết kế hoặc đối tác sáng tạo
              phân phối trực tiếp cho gia đình, bạn bè,
              cộng sự và những cá nhân thuộc
              mạng lưới thân cận của dự án.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Sample
            </strong>

            <span>
              Phiên bản được tạo trong quá trình phát triển,
              thử nghiệm hoặc tiền sản xuất nhằm đánh giá
              thiết kế, vật liệu, màu sắc hay cấu trúc
              trước khi sản phẩm được hoàn thiện
              hoặc phát hành chính thức.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Signature Signed
            </strong>

            <span>
              Hiện vật có chữ ký trực tiếp của vận động viên,
              nhà thiết kế, nghệ sĩ hoặc nhân vật
              gắn liền với sản phẩm,
              qua đó bổ sung provenance
              và giá trị lưu trữ cho hiện vật.
            </span>

          </div>


          <p class="about-small">
            Một hiện vật có thể thuộc nhiều nhóm cùng lúc.
            Ví dụ, một đôi có thể vừa là Player Exclusive,
            vừa là Sample hoặc Friends &amp; Family.
          </p>

        </article>


        <!-- EN CLASSIFICATION -->

        <article
          class="archive-panel lang-panel"
          data-lang="en"
          hidden
        >

          <p class="about-kicker">
            EDITION CLASSIFICATION
          </p>


          <h3>
            Collection classification system
          </h3>


          <div class="definition-item">

            <strong>
              General Release (GR)
            </strong>

            <span>
              An edition produced and distributed
              for public commercial release
              through official or authorized retail channels,
              intended for the general consumer market.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Player Exclusive (PE)
            </strong>

            <span>
              An edition produced or customized by the brand
              specifically for athletes, teams
              or designated individuals,
              and typically not offered through public retail.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Friends &amp; Family (F&amp;F)
            </strong>

            <span>
              A non-public-retail edition distributed directly
              by the brand, designer or creative partner
              to family, friends, collaborators
              and individuals within the project's close network.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Sample
            </strong>

            <span>
              An edition created during development,
              testing or pre-production to evaluate
              design, materials, colors or construction
              before the product is finalized
              or officially released.
            </span>

          </div>


          <div class="definition-item">

            <strong>
              Signature Signed
            </strong>

            <span>
              An artifact carrying a direct signature
              from an athlete, designer, artist
              or individual associated with the product,
              adding documented provenance
              and archival significance.
            </span>

          </div>


          <p class="about-small">
            An artifact may belong to more than one category.
            For example, a pair may simultaneously be
            a Player Exclusive, Sample
            or Friends &amp; Family edition.
          </p>

        </article>


        <!-- VI CONDITION -->

        <article
          class="archive-panel lang-panel"
          data-lang="vi"
        >

          <p class="about-kicker">
            TÌNH TRẠNG
          </p>


          <h3>
            Hệ thống Condition
          </h3>


          <div class="condition-key">

            <span class="condition-pill deadstock">
              Deadstock
            </span>

            <span>
              Chưa qua sử dụng.
            </span>

          </div>


          <div class="condition-key">

            <span class="condition-pill used">
              Used
            </span>

            <span>
              Đã qua sử dụng.
            </span>

          </div>


          <p class="about-small">
            GR, PE, F&amp;F, Sample và Signature Signed
            mô tả loại phiên bản hoặc provenance,
            không phải tình trạng sử dụng.
          </p>

        </article>


        <!-- EN CONDITION -->

        <article
          class="archive-panel lang-panel"
          data-lang="en"
          hidden
        >

          <p class="about-kicker">
            CONDITION
          </p>


          <h3>
            Condition system
          </h3>


          <div class="condition-key">

            <span class="condition-pill deadstock">
              Deadstock
            </span>

            <span>
              Unworn.
            </span>

          </div>


          <div class="condition-key">

            <span class="condition-pill used">
              Used
            </span>

            <span>
              Previously worn.
            </span>

          </div>


          <p class="about-small">
            GR, PE, F&amp;F, Sample and Signature Signed
            describe edition type or provenance,
            not condition.
          </p>

        </article>

      </section>


      <!-- CATALOGUE -->

      <section class="catalogue-section">

        <div
          class="lang-panel"
          data-lang="vi"
        >

          <p class="about-kicker">
            HỒ SƠ HIỆN VẬT
          </p>

          <h3>
            Những thông tin được lưu trữ
          </h3>

          <div class="catalogue-grid">
            <span>Title</span>
            <span>SKU / Style Code</span>
            <span>Colorway</span>
            <span>Retail Price</span>
            <span>Release Date</span>
            <span>Condition</span>
            <span>Size</span>
            <span>Provenance &amp; Story</span>
          </div>

        </div>


        <div
          class="lang-panel"
          data-lang="en"
          hidden
        >

          <p class="about-kicker">
            OBJECT RECORD
          </p>

          <h3>
            Information recorded in the archive
          </h3>

          <div class="catalogue-grid">
            <span>Title</span>
            <span>SKU / Style Code</span>
            <span>Colorway</span>
            <span>Retail Price</span>
            <span>Release Date</span>
            <span>Condition</span>
            <span>Size</span>
            <span>Provenance &amp; Story</span>
          </div>

        </div>

      </section>

    </section>


    <footer>

      <p>
        &copy; 2026 Lộc An Sneaker Collection.
        All Rights Reserved.
      </p>

    </footer>

  </div>


  <!-- =====================================================
       DATA
  ====================================================== -->

  <script src="./data.js?v=20260912-spa1"></script>
  <script src="./lego-data.js?v=20260912-spa1"></script>
  <script src="./sneaker-mask-data.js?v=20260912-spa1"></script>

  <script src="./main.js?v=20260912-spa1"></script>

</body>

</html>
