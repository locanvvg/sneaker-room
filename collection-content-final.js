/* =========================================================
   LỘC AN SNEAKER COLLECTION
   FINAL CONTENT LOCK — 2026-09-17

   PURPOSE
   - Preserve every existing sneaker object's metadata.
   - Replace story copy for the 15 existing owned pairs.
   - Add Nike Dunk Low Pro SB "Raygun Away" as a new owned pair.
   - Add robust multi-image candidates for Quai 54 F&F and
     Yuto Horigome "Matcha".
   - Stories in this file are the canonical locked versions.
========================================================= */

(() => {
  "use strict";

  if (
    typeof sneakers === "undefined" ||
    !Array.isArray(sneakers)
  ) {
    console.error(
      "[Lộc An] collection-content-final.js must load after data.js"
    );
    return;
  }

  const normalize = value =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/\s+/g, " ")
      .trim();

  const titleText = sneaker =>
    normalize(
      typeof sneaker?.title === "string"
        ? sneaker.title
        : `${sneaker?.title?.vi || ""} ${sneaker?.title?.en || ""}`
    );

  const story = {
    bloodline: {
      vi: `
        <p>
          <b>Jordan 1 Retro High OG 'Black Bloodline' PE Sample</b>
          xuất phát từ cùng ngôn ngữ thiết kế với Bloodline năm 2019,
          nhưng thuộc một nhánh hoàn toàn khác với phiên bản thương mại.
          Thay vì sử dụng nền trắng làm trọng tâm, thiết kế Black Bloodline
          chuyển phần lớn upper sang màu đen và giữ những đường viền đỏ
          chạy quanh các panel và Swoosh như một cách nhấn mạnh cấu trúc
          nguyên bản của Jordan 1.
        </p>
        <p>
          Chính cách dùng đường viền màu khiến đôi giày có cảm giác giống
          một bản nghiên cứu hình khối hơn là một phối màu Jordan 1 thông thường:
          các đường may, mép panel và tỷ lệ của silhouette được nhìn thấy rõ
          hơn nhờ tương phản giữa nền đen, Gym Red và midsole trắng.
          Đây cũng là lý do Black Bloodline có bản sắc riêng dù vẫn liên hệ
          trực tiếp với concept Bloodline.
        </p>
        <p>
          Hiện vật trong bộ sưu tập là một <b>PE Sample</b>, tức nằm ngoài
          luồng phát hành bán lẻ phổ thông. Vì vậy, giá trị lưu trữ của đôi giày
          không chỉ đến từ phối màu mà còn đến từ vị trí của nó trong quá trình
          phát triển và phân phối nội bộ của Jordan Brand. Những chi tiết như
          mã sample, cấu trúc sản xuất và provenance của hiện vật quan trọng
          hơn việc so sánh nó với một đôi retail thông thường.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 Retro High OG 'Black Bloodline' PE Sample</b>
          develops the same visual language associated with the 2019 Bloodline,
          but belongs to a very different branch from the standard retail release.
          Instead of allowing white to dominate the upper, Black Bloodline shifts
          the shoe toward a predominantly black construction while retaining
          red piping around the panels and Swoosh to emphasize the architecture
          of the original Jordan 1.
        </p>
        <p>
          That use of contrasting piping makes the sneaker read almost like
          a study of the silhouette itself: seams, panel boundaries and proportions
          become more visible through the relationship between black leather,
          Gym Red accents and the white midsole. It gives Black Bloodline
          a distinct identity while keeping a clear connection to the broader
          Bloodline concept.
        </p>
        <p>
          The artifact preserved in this collection is a <b>PE Sample</b>,
          placing it outside ordinary retail distribution. Its archival importance
          therefore comes not only from the color treatment, but also from its
          position within Jordan Brand's product-development and internal-distribution
          ecosystem. Sample markings, construction and provenance matter more here
          than comparison with a conventional retail pair.
        </p>
      `
    },

    quai54: {
      vi: `
        <p>
          <b>Jordan 1 Retro High OG 'Quai 54' F&amp;F</b> gắn với Quai 54,
          giải đấu streetball tại Paris đã trở thành một trong những điểm giao
          đáng chú ý giữa Jordan Brand, bóng rổ đường phố, âm nhạc và văn hóa
          sneaker châu Âu. Qua nhiều năm, Quai 54 không chỉ là một giải đấu mà
          còn trở thành một nền tảng để Jordan Brand thử nghiệm những phối màu
          và chi tiết thiết kế riêng cho sự kiện.
        </p>
        <p>
          Phiên bản Friends &amp; Family này nổi bật nhờ cách chia màu bất đối xứng:
          xanh và đỏ được đặt đối lập trên hai bên, kết hợp cùng nền đen để tạo
          hiệu ứng split-color rõ rệt. Cách xử lý đó khiến một silhouette quen thuộc
          như Jordan 1 trở nên khác biệt ngay từ khoảng cách xa, đồng thời vẫn giữ
          được dấu ấn thị giác liên quan trực tiếp đến Quai 54.
        </p>
        <p>
          Đây không phải một bản phát hành retail phổ thông. Bản F&amp;F được tạo
          cho mạng lưới những người liên quan tới sự kiện và Jordan Brand, vì thế
          provenance là một phần cốt lõi của câu chuyện. Trong bối cảnh sưu tầm,
          đôi giày đại diện cho mối liên hệ giữa Jordan 1 và văn hóa streetball Paris,
          hơn là chỉ một biến thể màu hiếm.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 Retro High OG 'Quai 54' F&amp;F</b> is tied to Quai 54,
          the Paris streetball tournament that has become a notable meeting point
          for Jordan Brand, street basketball, music and European sneaker culture.
          Over time, Quai 54 evolved beyond a tournament into a platform where
          Jordan Brand could explore event-specific color treatments and details.
        </p>
        <p>
          This Friends &amp; Family edition is defined by its asymmetric split-color
          treatment: blue and red sit in opposition across the pair and are anchored
          by black. The result makes the familiar Jordan 1 silhouette immediately
          recognizable as a Quai 54 object while preserving the underlying structure
          of the model.
        </p>
        <p>
          It was not a conventional retail release. The F&amp;F distribution was
          connected to people within the event and Jordan Brand network, making
          provenance central to the shoe's significance. Within a collection,
          it documents the relationship between the Jordan 1 and Paris streetball
          culture rather than functioning simply as a rare color variation.
        </p>
      `
    },

    yuto: {
      vi: `
        <p>
          <b>Nike SB Dunk Low Yuto Horigome 'Matcha'</b> tiếp tục mối quan hệ
          giữa Nike SB và Yuto Horigome sau thành công của lần hợp tác trước.
          Thiết kế lần này chuyển sang bảng màu trầm, thiên về xanh tự nhiên và
          sắc đất, gợi liên tưởng trực tiếp đến matcha và thẩm mỹ Nhật Bản nhưng
          vẫn giữ cấu trúc quen thuộc của SB Dunk dành cho skateboarding.
        </p>
        <p>
          Những lớp suede và leather được phối theo nhiều sắc xanh khác nhau,
          xen kẽ Light Khaki, Sesame và Burnt Sienna, tạo chiều sâu mà không cần
          sử dụng tương phản quá mạnh. Biểu tượng lông vũ của Yuto tiếp tục đóng
          vai trò chữ ký thị giác, giúp đôi giày được nhận diện như một thiết kế
          mang dấu ấn cá nhân thay vì chỉ là một colorway SB Dunk.
        </p>
        <p>
          Hiện vật trong bộ sưu tập có thêm một lớp provenance đặc biệt:
          <b>chữ ký trực tiếp của Yuto Horigome</b> trên đôi giày. Vì vậy,
          câu chuyện của hiện vật không dừng ở thiết kế sản phẩm; nó còn ghi lại
          mối liên hệ trực tiếp với vận động viên đứng sau dự án hợp tác.
        </p>
      `,
      en: `
        <p>
          The <b>Nike SB Dunk Low Yuto Horigome 'Matcha'</b> continues the
          relationship between Nike SB and Yuto Horigome following their earlier
          collaboration. This edition moves toward a muted palette of natural greens
          and earth tones, drawing a direct association with matcha and Japanese
          visual culture while retaining the familiar skate-focused SB Dunk structure.
        </p>
        <p>
          Suede and leather layers move through several shades of green alongside
          Light Khaki, Sesame and Burnt Sienna, producing depth without relying on
          aggressive contrast. Yuto's feather emblem remains the defining signature
          element, identifying the shoe as a personal collaboration rather than
          merely another SB Dunk colorway.
        </p>
        <p>
          The artifact preserved in this collection carries an additional layer
          of provenance: <b>Yuto Horigome's direct signature</b> on the sneaker.
          The object therefore documents not only the product design, but also
          a direct connection to the athlete behind the collaboration.
        </p>
      `
    },

    alaska: {
      vi: `
        <p>
          <b>Jordan 1 Retro High OG x Virgil Abloh Archive 'Alaska'</b>
          đưa ngôn ngữ deconstructed gắn với Virgil Abloh trở lại trên một
          Jordan 1 gần như đơn sắc. White-on-white khiến cấu trúc của upper,
          các lớp vật liệu, đường may và những phần cố ý để lộ trở thành trọng tâm,
          thay vì dựa vào một bảng màu tương phản mạnh.
        </p>
        <p>
          Tên gọi <b>'Alaska'</b> phù hợp với cảm giác lạnh, sạch và gần như
          kiến trúc của đôi giày. Branding Virgil Abloh Archive và cách bố trí
          typography tiếp tục tinh thần biến một sản phẩm quen thuộc thành
          một đối tượng thiết kế có cảm giác đang ở giữa bản mẫu, tài liệu kỹ thuật
          và sản phẩm hoàn thiện.
        </p>
        <p>
          Trong dòng lịch sử Jordan 1, ý nghĩa của thiết kế nằm ở việc nó tiếp tục
          cuộc đối thoại mà Virgil Abloh từng mở ra với silhouette này:
          giữ nguyên những yếu tố đủ để người xem nhận ra Jordan 1, nhưng đồng thời
          phơi bày và tái sắp xếp các chi tiết cấu tạo để buộc người xem nhìn lại
          một hình dáng vốn đã quá quen thuộc.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 Retro High OG x Virgil Abloh Archive 'Alaska'</b>
          returns the deconstructed visual language associated with Virgil Abloh
          to an almost monochromatic Jordan 1. The white-on-white treatment makes
          the upper's construction, layered materials, stitching and intentionally
          exposed elements the focus rather than relying on a high-contrast palette.
        </p>
        <p>
          The <b>'Alaska'</b> name suits the cold, clean and almost architectural
          character of the shoe. Virgil Abloh Archive branding and typographic
          treatments continue the idea of turning a familiar consumer product
          into an object that sits somewhere between prototype, technical document
          and finished design.
        </p>
        <p>
          Within the Jordan 1 lineage, its importance lies in continuing the
          conversation Virgil Abloh opened around the silhouette: enough original
          cues remain for the shoe to read instantly as a Jordan 1, while its
          construction is exposed and rearranged so that a highly familiar form
          can be examined again.
        </p>
      `
    },

    fragmentUnion: {
      vi: `
        <p>
          <b>Jordan 1 Retro High OG x Fragment x Union LA 'Varsity Red/Sport Royal' Sample</b>
          đặt ba ngôn ngữ thiết kế vào cùng một silhouette: di sản Jordan 1,
          sự tiết chế và cách dùng màu rất dễ nhận diện của Fragment,
          cùng tư duy tái cấu trúc đã trở thành chữ ký của Union Los Angeles.
        </p>
        <p>
          Nền tảng Black Toe quen thuộc đóng vai trò điểm xuất phát, sau đó được
          biến đổi bằng các vùng Varsity Red và Sport Royal để tạo ra cảm giác
          vừa quen vừa sai lệch có chủ đích. Chính sự căng thẳng giữa cấu trúc
          cổ điển và cách ghép nối mới khiến thiết kế hoạt động như một collaboration
          nhiều lớp thay vì chỉ là sự cộng lại của logo.
        </p>
        <p>
          Hiện vật trong bộ sưu tập là <b>Sample</b>, vì vậy cần được hiểu như
          một dấu vết của quá trình phát triển sản phẩm trước giai đoạn retail.
          Với một sample, những khác biệt nhỏ về vật liệu, finishing, tem nhãn
          hoặc cấu trúc có thể quan trọng ngang với phối màu cuối cùng, bởi chúng
          cho thấy cách ý tưởng được chuyển từ thiết kế sang sản xuất.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 Retro High OG x Fragment x Union LA
          'Varsity Red/Sport Royal' Sample</b> brings three design languages
          into one silhouette: the heritage of the Jordan 1, Fragment's restrained
          and highly recognizable use of color, and Union Los Angeles' signature
          approach to reconstruction.
        </p>
        <p>
          A familiar Black Toe framework acts as the starting point before
          Varsity Red and Sport Royal shift the composition into something
          intentionally familiar yet disrupted. The tension between classic
          structure and reconstructed color blocking is what allows the design
          to function as a layered collaboration rather than a simple accumulation
          of branding.
        </p>
        <p>
          The artifact preserved in this collection is a <b>Sample</b>, and is
          therefore best understood as evidence of the product-development process
          before retail production. On a sample, subtle differences in materials,
          finishing, labels or construction can matter as much as the final colorway
          because they reveal how an idea moved from design into manufacture.
        </p>
      `
    },

    shadow: {
      vi: `
        <p>
          <b>Jordan 1 High Retro OG 'Shadow' 2009</b> đánh dấu lần trở lại đầu tiên
          của một trong những phối màu OG kín đáo nhất của Air Jordan 1.
          Shadow xuất hiện từ năm 1985 với bảng màu đen và xám, tách khỏi nhóm
          đỏ-trắng-đen gắn chặt với Chicago Bulls và tạo nên một lựa chọn trung tính
          hơn nhưng vẫn giữ đầy đủ cấu trúc cổ điển của Jordan 1.
        </p>
        <p>
          Sau bản OG, Shadow biến mất khỏi lịch phát hành trong một thời gian dài.
          Bản 2009 vì thế có ý nghĩa đặc biệt: đây là chiếc cầu đầu tiên nối
          Shadow nguyên bản với các thế hệ retro sau này. Nó xuất hiện trước khi
          Jordan 1 trở thành một trong những silhouette retro có tần suất phát hành
          dày đặc nhất của Jordan Brand.
        </p>
        <p>
          Sức hút của Shadow nằm ở sự tiết chế. Black và Shadow Grey làm nổi bật
          chính tỷ lệ, paneling và hình dáng của Jordan 1 thay vì để màu sắc lấn át.
          Theo thời gian, điều này giúp Shadow duy trì vị trí ổn định trong lịch sử
          Jordan 1 và khiến bản retro 2009 trở thành một mốc quan trọng đối với
          những người quan tâm đến lineage của phối màu OG.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 High Retro OG 'Shadow' 2009</b> marked the first return
          of one of the most understated original Air Jordan 1 colorways.
          Shadow first appeared in 1985 with a black-and-grey palette that sat
          apart from the red, white and black combinations closely associated
          with the Chicago Bulls while preserving the classic Jordan 1 structure.
        </p>
        <p>
          After the original release, Shadow disappeared from the calendar for
          an extended period. The 2009 edition therefore holds a specific place
          in the lineage: it became the first bridge between the 1985 original
          and later retro generations, arriving before the Jordan 1 developed
          into one of Jordan Brand's most frequently revisited retro silhouettes.
        </p>
        <p>
          Shadow's appeal is rooted in restraint. Black and Shadow Grey allow
          the proportions, paneling and shape of the Jordan 1 itself to remain
          the visual focus. That quality has helped the colorway remain relevant
          across decades and makes the 2009 retro an important reference point
          for collectors interested in the history of the original palette.
        </p>
      `
    },

    newBalance: {
      vi: `
        <p>
          <b>New Balance 2002R</b> là một ví dụ điển hình cho cách New Balance
          tái khai thác ngôn ngữ running đầu những năm 2000 trong bối cảnh lifestyle
          hiện đại. Silhouette kết hợp upper nhiều lớp, tỷ lệ kỹ thuật và cảm giác
          performance cổ điển với một bộ đế được tinh chỉnh để phù hợp hơn với
          việc sử dụng hàng ngày.
        </p>
        <p>
          Điểm mạnh của 2002R nằm ở việc nó không cố che giấu nguồn gốc running.
          Các lớp mesh, suede và synthetic tạo nên cấu trúc phức tạp, trong khi
          phần đế có độ dày và chi tiết cơ học đủ để giữ đúng tinh thần của
          footwear hiệu năng giai đoạn đầu thế kỷ 21.
        </p>
        <p>
          Trong làn sóng phục hưng retro-runner, 2002R trở thành một trong những
          mẫu giúp New Balance mở rộng mạnh khỏi phạm vi giày chạy truyền thống.
          Nó cho thấy một thiết kế performance cũ có thể được đọc lại như một
          sản phẩm lifestyle mà không cần xóa bỏ DNA kỹ thuật ban đầu.
        </p>
      `,
      en: `
        <p>
          The <b>New Balance 2002R</b> is a strong example of how New Balance
          reintroduced early-2000s running language into a modern lifestyle context.
          Its layered upper, technical proportions and period performance character
          are paired with a refined sole unit that makes the silhouette more suited
          to everyday wear.
        </p>
        <p>
          The strength of the 2002R is that it does not attempt to hide its running
          origins. Mesh, suede and synthetic layers create a complex upper, while
          the substantial and visibly mechanical sole construction preserves the
          feel of performance footwear from the beginning of the twenty-first century.
        </p>
        <p>
          During the wider revival of retro runners, the 2002R became one of the
          models that helped New Balance expand well beyond traditional running use.
          It demonstrates how an older performance vocabulary can be re-read as
          lifestyle design without erasing its original technical DNA.
        </p>
      `
    },

    reverseBred: {
      vi: `
        <p>
          <b>Jordan 1 Low 'Reverse Bred'</b> sử dụng hai màu gắn chặt nhất với
          lịch sử Air Jordan — đen và đỏ — nhưng đảo vị trí của chúng để tạo ra
          cảm giác quen thuộc theo một cách khác. Thay vì sao chép trực tiếp
          một phối màu High OG kinh điển, bản Low khai thác ký ức thị giác của
          Bred rồi tái phân bố màu trên một silhouette thấp hơn.
        </p>
        <p>
          Jordan 1 Low có tỷ lệ khác bản High: cổ thấp, vùng heel và quarter
          được đọc theo chiều ngang rõ hơn, khiến cùng một bảng màu có hiệu ứng
          thị giác khác đáng kể. Reverse Bred tận dụng chính khác biệt này,
          biến đỏ thành vùng màu nổi bật và dùng đen để neo lại cấu trúc.
        </p>
        <p>
          Đây là một ví dụ rõ về cách Jordan Brand liên tục tái diễn giải
          kho lưu trữ màu sắc của Jordan 1. Sức hút không nằm ở việc tạo ra
          một câu chuyện hoàn toàn mới, mà ở cách một bảng màu lịch sử có thể
          được thay đổi thứ tự và tỷ lệ để tạo nên một nhận diện khác trên bản Low.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 Low 'Reverse Bred'</b> uses the two colors most closely
          tied to Air Jordan history—black and red—but reverses their distribution
          to create familiarity in a different form. Rather than directly reproducing
          a classic High OG arrangement, the Low draws on the visual memory of Bred
          and redistributes it across a lower silhouette.
        </p>
        <p>
          The Jordan 1 Low has different proportions from the High: the reduced
          collar and more horizontal reading of the heel and quarter change how
          the same palette behaves. Reverse Bred takes advantage of that shift,
          allowing red to become the dominant visual field while black anchors
          the structure.
        </p>
        <p>
          It is a clear example of Jordan Brand's continuing reinterpretation
          of the Jordan 1 color archive. Its appeal comes less from inventing
          a completely new narrative than from showing how a historic palette
          can change identity when its order and proportions are altered on the Low.
        </p>
      `
    },

    defender: {
      vi: `
        <p>
          <b>Balenciaga Defender</b> thuộc giai đoạn Balenciaga đẩy sneaker
          sang ngôn ngữ gần với sculpture và industrial design hơn là footwear
          thể thao truyền thống. Phần upper tương đối gọn được đặt trên một bộ đế
          oversized với bề mặt răng cưa, khiến silhouette có cảm giác nặng,
          thô và cố ý vượt khỏi tỷ lệ sneaker thông thường.
        </p>
        <p>
          Thiết kế của Defender dựa mạnh vào độ tương phản giữa upper và outsole.
          Bộ đế không chỉ là thành phần chức năng mà trở thành đối tượng thị giác
          chính, với hình dạng gợi liên tưởng tới lốp xe và cấu trúc địa hình.
          Đây là cách tiếp cận phù hợp với xu hướng của Balenciaga trong việc
          phóng đại những thành phần vốn thường bị xem là phụ.
        </p>
        <p>
          Trong lịch sử sneaker thời trang cao cấp, Defender đại diện cho giai đoạn
          mà khái niệm 'dad shoe' được đẩy xa hơn sang những hình dáng gần như
          post-sneaker. Nó quan trọng như một hiện vật thiết kế vì đặt câu hỏi
          về ranh giới giữa sneaker, vật thể thời trang và điêu khắc công nghiệp.
        </p>
      `,
      en: `
        <p>
          The <b>Balenciaga Defender</b> belongs to a period in which Balenciaga
          pushed sneaker design closer to sculpture and industrial design than
          conventional athletic footwear. A relatively compact upper sits above
          an oversized, aggressively toothed sole, giving the silhouette a heavy
          and deliberately exaggerated proportion.
        </p>
        <p>
          The Defender is built around the contrast between upper and outsole.
          The sole is not merely functional support; it becomes the primary visual
          object, with forms that recall tire tread and off-road structures.
          This approach is consistent with Balenciaga's broader tendency to enlarge
          components that would normally remain secondary.
        </p>
        <p>
          Within the history of luxury sneakers, the Defender documents the moment
          when the 'dad shoe' idea was pushed toward an almost post-sneaker form.
          Its design significance comes from questioning the boundary between
          footwear, fashion object and industrial sculpture.
        </p>
      `
    },

    jordan4: {
      vi: `
        <p>
          <b>Jordan 4 Retro 'Black Cement' 1999</b> là một trong những retro
          quan trọng nhất của Air Jordan 4 vì xuất hiện đúng mười năm sau
          lần ra mắt nguyên bản năm 1989. Black Cement gắn chặt với hình ảnh
          Michael Jordan cuối thập niên 1980 và với khoảnh khắc 'The Shot',
          khiến phối màu này trở thành một phần cốt lõi của lịch sử Jordan.
        </p>
        <p>
          Thiết kế kết hợp nubuck đen, các chi tiết Cement Grey, Fire Red
          và phần mesh đặc trưng của Jordan 4. Cấu trúc wing, heel tab và
          visible Air giữ nguyên cảm giác kỹ thuật của mẫu giày do Tinker Hatfield
          thiết kế, đồng thời tạo nên một silhouette có ảnh hưởng lâu dài
          cả trong bóng rổ lẫn streetwear.
        </p>
        <p>
          Bản 1999 đặc biệt đáng chú ý vì thuộc giai đoạn retro đầu tiên,
          trước khi việc tái phát hành Jordan trở thành chu kỳ quen thuộc.
          Vì vậy, nó không chỉ là một Black Cement cũ hơn; nó là tài liệu về
          cách Jordan Brand bắt đầu đưa các mẫu kinh điển trở lại cho một thế hệ mới.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 4 Retro 'Black Cement' 1999</b> is one of the most
          important early Air Jordan 4 retros, arriving ten years after the
          original 1989 release. Black Cement is closely tied to Michael Jordan's
          late-1980s image and to 'The Shot,' giving the colorway a central place
          in Jordan history.
        </p>
        <p>
          Black nubuck is combined with Cement Grey, Fire Red and the Jordan 4's
          characteristic mesh. The wing structure, heel treatment and visible Air
          preserve the technical character of Tinker Hatfield's design while
          creating a silhouette that has had lasting influence in both basketball
          and streetwear.
        </p>
        <p>
          The 1999 edition matters because it belongs to the early retro era,
          before recurring Jordan reissues became routine. It is therefore more
          than simply an older Black Cement: it documents the period when Jordan
          Brand began systematically reintroducing its archive to a new generation.
        </p>
      `
    },

    bapeStussy: {
      vi: `
        <p>
          <b>BAPE x Stüssy Camo Canvas Hi Top 'Green Camo'</b> ghi lại một giai đoạn
          quan trọng khi streetwear Nhật Bản và streetwear California giao nhau.
          BAPE và Stüssy đều xây dựng bản sắc mạnh từ graphic culture, logo,
          limited drops và cộng đồng, nhưng đến từ hai bối cảnh địa lý khác nhau.
        </p>
        <p>
          Green Camo đưa ngôn ngữ camouflage gắn với BAPE lên một high-top canvas
          đơn giản hơn, nhờ đó pattern trở thành yếu tố chính. Sự đối lập giữa
          silhouette tương đối cổ điển và bề mặt camo dày đặc phản ánh đúng cách
          các thương hiệu streetwear thời kỳ đó dùng footwear như phần mở rộng
          của apparel và graphic identity.
        </p>
        <p>
          Giá trị lịch sử của đôi giày nằm ở bối cảnh collaboration:
          trước khi việc hợp tác giữa các thương hiệu trở thành chiến lược phát hành
          gần như mặc định, những dự án kiểu BAPE x Stüssy đã góp phần định hình
          cách streetwear tạo ra sản phẩm, câu chuyện và tính khan hiếm quanh một drop.
        </p>
      `,
      en: `
        <p>
          The <b>BAPE x Stüssy Camo Canvas Hi Top 'Green Camo'</b> documents
          an important meeting point between Japanese streetwear and California
          street culture. BAPE and Stüssy both built strong identities around
          graphics, logos, limited drops and community, but emerged from different
          geographic and cultural contexts.
        </p>
        <p>
          Green Camo places BAPE's camouflage language on a comparatively simple
          canvas high-top, allowing the pattern to become the dominant feature.
          The contrast between a classic footwear shape and a dense graphic surface
          reflects the way streetwear brands of the period treated shoes as an
          extension of apparel and visual identity.
        </p>
        <p>
          The historical value of the pair lies in the collaboration context.
          Before cross-brand projects became an almost default release strategy,
          collaborations such as BAPE x Stüssy helped establish the way streetwear
          could build product, narrative and scarcity around a single drop.
        </p>
      `
    },

    waffle: {
      vi: `
        <p>
          <b>Nike Waffle Racer x Off-White 'White' (W)</b> đưa Virgil Abloh
          tới một silhouette chạy bộ có gốc rễ sâu trong lịch sử Nike.
          Thay vì giữ Waffle Racer ở hình thức retro thuần túy, Off-White
          kéo thiết kế sang hướng experimental bằng vật liệu xuyên thấu,
          hệ thống dây bổ sung và các chi tiết công nghiệp đặc trưng.
        </p>
        <p>
          Bộ đế waffle gợi trực tiếp tới những thử nghiệm running ban đầu của Nike,
          trong khi phần upper và hệ thống overlay thuộc về ngôn ngữ thiết kế
          cuối thập niên 2010. Sự va chạm giữa hai thời kỳ này là phần thú vị nhất:
          một biểu tượng performance cũ được đọc lại bằng deconstruction,
          exposed construction và những chi tiết vốn không xuất hiện trên bản gốc.
        </p>
        <p>
          Đây là một thiết kế cho thấy Off-White không chỉ tập trung vào
          những silhouette quá nổi tiếng như Jordan 1 hay Air Force 1.
          Việc chọn Waffle Racer giúp collaboration kết nối trực tiếp hơn
          với lịch sử running và với chính nguồn gốc thử nghiệm vật liệu của Nike.
        </p>
      `,
      en: `
        <p>
          The <b>Nike Waffle Racer x Off-White 'White' (W)</b> applies
          Virgil Abloh's design language to a running silhouette with deep roots
          in Nike history. Rather than treating the Waffle Racer as a straightforward
          retro, Off-White shifts it into an experimental object through translucent
          materials, an added lacing system and characteristic industrial details.
        </p>
        <p>
          The waffle sole refers directly to Nike's earliest running experiments,
          while the upper and overlay system belong to a late-2010s design vocabulary.
          The collision of those two periods is the central idea: an older performance
          icon is re-read through deconstruction, exposed construction and elements
          absent from the original.
        </p>
        <p>
          The design also demonstrates that Off-White's Nike work was not limited
          to obvious icons such as the Jordan 1 or Air Force 1. Choosing the
          Waffle Racer created a more direct connection to running history and
          to Nike's own culture of material experimentation.
        </p>
      `
    },

    cityFlight: {
      vi: `
        <p>
          <b>Jordan 1 Retro High OG 'City of Flight'</b> được xây dựng quanh
          Los Angeles và bối cảnh All-Star Weekend, dùng Jordan 1 như một bề mặt
          để kể câu chuyện về thành phố, bóng rổ và văn hóa đường phố.
          Phối màu đen-vàng tạo cảm giác sang trọng hơn nhiều bản Jordan 1 truyền thống.
        </p>
        <p>
          Upper đen giữ silhouette gọn và thống nhất, trong khi các chi tiết vàng
          làm nổi bật branding và những điểm cấu trúc quan trọng. Những họa tiết
          liên quan tới bản đồ và thành phố đưa thiết kế vượt khỏi một colorway
          đơn thuần, biến nó thành một sản phẩm mang bối cảnh địa phương rõ ràng.
        </p>
        <p>
          City of Flight thuộc nhóm Jordan release dùng một thành phố cụ thể
          làm nền cho câu chuyện sản phẩm. Điều đó phản ánh cách Jordan Brand
          ngày càng kết nối archive basketball với những sự kiện văn hóa và
          địa điểm có ý nghĩa, thay vì chỉ dựa vào lịch sử thi đấu của Michael Jordan.
        </p>
      `,
      en: `
        <p>
          The <b>Jordan 1 Retro High OG 'City of Flight'</b> was built around
          Los Angeles and the All-Star Weekend context, using the Jordan 1 as
          a surface for a story about city, basketball and street culture.
          Its black-and-gold palette gives it a more refined character than
          many traditional Jordan 1 releases.
        </p>
        <p>
          A black upper keeps the silhouette visually controlled while gold details
          highlight branding and key structural areas. City- and map-related graphics
          move the design beyond a simple colorway and give it a clear geographic context.
        </p>
        <p>
          City of Flight belongs to a broader group of Jordan releases that use
          a specific city as the narrative framework. It reflects the way Jordan Brand
          increasingly connected its basketball archive to cultural events and places,
          rather than relying only on moments from Michael Jordan's playing career.
        </p>
      `
    },

    vans: {
      vi: `
        <p>
          <b>Vans Knu Skool</b> là một bản phóng đại có chủ đích của ngôn ngữ
          skate shoe cuối thập niên 1990 và đầu 2000. Tongue dày, collar phồng,
          dây bản lớn và Jazz Stripe ba chiều khiến silhouette có cảm giác nặng
          và mềm hơn nhiều mẫu Vans cổ điển.
        </p>
        <p>
          Trong khi Old Skool dựa vào tỷ lệ mảnh và đường nét tương đối phẳng,
          Knu Skool biến chính những chi tiết quen thuộc đó thành các khối lớn hơn.
          Kết quả là một đôi giày vẫn được nhận diện ngay là Vans nhưng phù hợp
          với làn sóng quay trở lại của Y2K, baggy skatewear và footwear có volume lớn.
        </p>
        <p>
          Sự trở lại của Knu Skool cho thấy archive skate không chỉ được phục dựng
          nguyên trạng. Một silhouette cũ có thể trở nên mới khi tỷ lệ thời trang
          đương đại thay đổi cách người dùng nhìn vào padding, chiều rộng và volume.
        </p>
      `,
      en: `
        <p>
          The <b>Vans Knu Skool</b> is a deliberate exaggeration of late-1990s
          and early-2000s skate-shoe language. A padded tongue, inflated collar,
          wide laces and dimensional Jazz Stripe give the silhouette a heavier,
          softer volume than classic Vans models.
        </p>
        <p>
          Where the Old Skool relies on relatively slim proportions and flat lines,
          the Knu Skool enlarges those familiar elements into more substantial forms.
          The result remains immediately recognizable as Vans while fitting the
          renewed interest in Y2K references, baggy skatewear and high-volume footwear.
        </p>
        <p>
          The return of the Knu Skool shows that skate archives do not need to be
          reproduced unchanged. An older silhouette can feel current again when
          contemporary proportions alter the way padding, width and volume are read.
        </p>
      `
    },

    puma: {
      vi: `
        <p>
          <b>Puma Speedcat Leather Rosé White</b> bắt nguồn từ mối liên hệ lâu dài
          của Puma với motorsport. Speedcat được tạo với dáng thấp, đế mỏng
          và phần toe thuôn để phù hợp với cảm giác gần bàn đạp hơn so với
          một sneaker lifestyle thông thường.
        </p>
        <p>
          Chính tỷ lệ thấp và gọn khiến Speedcat khác biệt trong bối cảnh sneaker
          hiện đại vốn đã trải qua nhiều năm bị chi phối bởi đế dày và silhouette
          oversized. Phối Rosé White làm mềm ngôn ngữ motorsport bằng một bảng màu
          nhẹ hơn, trong khi Formstrip vẫn giữ nhận diện Puma rất rõ.
        </p>
        <p>
          Sự hồi sinh của Speedcat phản ánh chu kỳ của thời trang sneaker:
          sau giai đoạn chunky-shoe thống trị, những thiết kế mỏng, thấp và gần
          với footwear đầu những năm 2000 quay trở lại. Speedcat vì thế vừa là
          một sản phẩm motorsport heritage vừa là tài liệu của sự thay đổi tỷ lệ
          trong xu hướng sneaker đương đại.
        </p>
      `,
      en: `
        <p>
          The <b>Puma Speedcat Leather Rosé White</b> grows out of Puma's
          long relationship with motorsport. The Speedcat was designed with a
          low profile, thin sole and tapered toe to create a closer-to-the-pedal
          feel than a conventional lifestyle sneaker.
        </p>
        <p>
          Those compact proportions make the Speedcat distinctive after years
          in which thick soles and oversized silhouettes dominated sneaker design.
          The Rosé White palette softens the motorsport language while the Formstrip
          keeps the shoe immediately identifiable as Puma.
        </p>
        <p>
          The Speedcat revival reflects the cyclical nature of sneaker fashion.
          After the long dominance of chunky footwear, slim and low-profile shapes
          associated with the early 2000s returned to relevance. The Speedcat is
          therefore both motorsport heritage and evidence of changing proportions
          in contemporary sneaker culture.
        </p>
      `
    },

    raygun: {
      vi: `
        <p>
          <b>Nike Dunk Low Pro SB 'Raygun Away'</b> là một trong những thiết kế
          tiêu biểu nhất của giai đoạn Pink Box đầu tiên của Nike SB. Câu chuyện
          bắt đầu trước đôi giày: Nike từng tạo ra <b>Roswell Rayguns</b>,
          một đội bóng rổ ABA hư cấu cho chiến dịch quảng cáo năm 2002,
          xây dựng cả một thế giới retro-futuristic xoay quanh bóng rổ,
          UFO và văn hóa đại chúng.
        </p>
        <p>
          Khi Nike SB đưa concept này lên Dunk Low Pro SB năm 2005,
          hình alien cầm raygun thêu ở gót trở thành dấu hiệu nhận diện quan trọng.
          Bản Away sử dụng toe trắng kết hợp orange side panel, yellow heel và
          black Swoosh. Cách phối này vừa mang màu sắc của đội bóng hư cấu,
          vừa tạo nên một trong những hình ảnh dễ nhận ra nhất của SB Dunk thời kỳ đầu.
        </p>
        <p>
          Rayguns cũng có vị trí đặc biệt trong lịch sử Nike SB vì dòng này
          gắn với giai đoạn thương hiệu đang định hình bản sắc riêng cho skateboarding.
          Concept được Nike SB nhắc lại nhiều năm sau, cho thấy sức sống lâu dài
          của mascot Roswell Rayguns và vai trò của thiết kế này trong archive SB.
        </p>
      `,
      en: `
        <p>
          The <b>Nike Dunk Low Pro SB 'Raygun Away'</b> is one of the defining
          designs of Nike SB's early Pink Box era. Its story begins before the shoe:
          Nike created the <b>Roswell Rayguns</b>, a fictional ABA basketball team
          for a 2002 advertising campaign, building a retro-futurist world around
          basketball, UFO mythology and popular culture.
        </p>
        <p>
          When Nike SB translated the concept to the Dunk Low Pro SB in 2005,
          the raygun-wielding alien embroidered on the heel became the central mark.
          The Away version pairs a white toe with an orange side panel, yellow heel
          and black Swoosh, turning the fictional team's visual identity into one
          of the most recognizable early SB Dunk combinations.
        </p>
        <p>
          Rayguns also occupies a specific place in Nike SB history because it
          belongs to the period when the brand was establishing a distinct identity
          around skateboarding. Nike SB revisited the Roswell Rayguns concept years
          later, demonstrating the longevity of the mascot and the original design's
          place within the SB archive.
        </p>
      `
    }
  };

  const rules = [
    {
      match: t => t.includes("black bloodline"),
      story: story.bloodline
    },
    {
      match: t => t.includes("quai 54") || t.includes("quai54"),
      story: story.quai54,
      images: [
        "pictures/jordan1_quai54_ff_v2.png",
        "pictures/jordan1_quai54.png",
        "pictures/jordan1_quai54_1.png",
        "pictures/jordan1_quai54_ff_v2_1.png",
        "pictures/jordan_quai54_friendsandfamily.png"
      ]
    },
    {
      match: t => t.includes("yuto") && t.includes("matcha"),
      story: story.yuto,
      images: [
        "pictures/sbdunk_yutohorigome_matcha.png",
        "pictures/sbdunk_yutohorigome_matcha_1.png",
        "pictures/jordan1_yuto_matcha.png",
        "pictures/jordan1_yuto_matcha_1.png"
      ]
    },
    {
      match: t => t.includes("virgil") && t.includes("alaska"),
      story: story.alaska
    },
    {
      match: t =>
        t.includes("fragment") &&
        t.includes("union") &&
        t.includes("sport royal"),
      story: story.fragmentUnion
    },
    {
      match: t => t.includes("shadow") && t.includes("2009"),
      story: story.shadow
    },
    {
      match: t => t.includes("new balance 2002r"),
      story: story.newBalance
    },
    {
      match: t => t.includes("reverse bred"),
      story: story.reverseBred
    },
    {
      match: t => t.includes("balenciaga") && t.includes("defender"),
      story: story.defender
    },
    {
      match: t =>
        t.includes("jordan 4") &&
        t.includes("black cement") &&
        t.includes("1999"),
      story: story.jordan4
    },
    {
      match: t => t.includes("bape") && t.includes("stussy"),
      story: story.bapeStussy
    },
    {
      match: t =>
        t.includes("waffle racer") &&
        (t.includes("off-white") || t.includes("off white")),
      story: story.waffle
    },
    {
      match: t => t.includes("city of flight"),
      story: story.cityFlight
    },
    {
      match: t => t.includes("vans") && t.includes("knu skool"),
      story: story.vans
    },
    {
      match: t => t.includes("puma") && t.includes("speedcat"),
      story: story.puma
    }
  ];

  sneakers.forEach(sneaker => {
    const t = titleText(sneaker);
    const rule = rules.find(item => item.match(t));

    if (!rule) return;

    sneaker.story = rule.story;

    if (Array.isArray(rule.images)) {
      sneaker.imageCandidates = [...rule.images];

      // Keep the existing cover exactly as the homepage currently uses it.
      if (sneaker.image) {
        sneaker.imageCandidates.unshift(sneaker.image);
      }

      sneaker.imageCandidates = [
        ...new Set(
          sneaker.imageCandidates.filter(Boolean)
        )
      ];
    }
  });

  const raygunExists = sneakers.some(
    sneaker =>
      normalize(sneaker?.id).includes("raygun") ||
      titleText(sneaker).includes("raygun")
  );

  if (!raygunExists) {
    sneakers.push({
      id: "nike-sb-dunk-low-raygun-away-2005",

      title: {
        vi: "Nike Dunk Low Pro SB 'Raygun Away'",
        en: "Nike Dunk Low Pro SB 'Raygun Away'"
      },

      subtitle: {
        vi: "Pink Box Era — Roswell Rayguns (2005)",
        en: "Pink Box Era — Roswell Rayguns (2005)"
      },

      sku: "304292-802",

      colorway: "Orange Flash/Black-White",

      retailPrice: "$65 USD",

      releaseDate: "2005-02-01",

      editionType: {
        vi: "GR",
        en: "GR"
      },

      condition: {
        vi: "Used",
        en: "Used"
      },

      size: "9 US",

      image: "pictures/sb_raygun.png",

      collectionStatus: "own",

      story: story.raygun
    });
  }

  // Mark all currently displayed collection entries as owned without
  // overwriting a status that may intentionally say otherwise.
  sneakers.forEach(sneaker => {
    if (!("collectionStatus" in sneaker)) {
      sneaker.collectionStatus = "own";
    }
  });

  window.LOCAN_CONTENT_LOCK_VERSION =
    "2026-09-17-final-stories-raygun-gallery";
})();
