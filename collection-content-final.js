/* =========================================================
   LỘC AN SNEAKER COLLECTION
   CONTENT LOCK — 15 OWNED PAIRS — 2026-09-17

   IMPORTANT:
   - Load AFTER data.js and BEFORE the shoe detail rendering logic.
   - This file ONLY locks the finalized long-form VI/EN stories
     for the 15 sneakers whose collectionStatus is "own".
   - It does NOT modify catalog metadata such as SKU, retail,
     release date, condition, size, edition type or ownership.
   - Quai 54 and Yuto retain their multi-image gallery support.
   - These 15 stories are canonical and must not be rewritten,
     shortened or otherwise altered unless explicitly requested.
========================================================= */

(() => {
  "use strict";

  if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) {
    console.error(
      "[Lộc An] data.js must load before collection-content-final.js"
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

  const LOCKED_STORIES = {
    bloodline: {
      vi: `
        <p>Air Jordan 1 “Bloodline” vốn khai thác một trong những đặc điểm dễ nhận biết nhất của dòng Jordan: khả năng biến những tổ hợp màu tưởng như quen thuộc thành một ngôn ngữ hoàn toàn khác chỉ bằng cách thay đổi tỷ lệ và vị trí màu sắc. Với phiên bản Black Bloodline PE, ý tưởng đó được đẩy sang hướng tối và hiếm hơn đáng kể. Phần upper gần như chìm hoàn toàn trong màu đen, trong khi những đường viền đỏ chạy quanh các panel, Swoosh và cấu trúc của thân giày tạo ra cảm giác như một bản phác họa bằng ánh sáng trên nền tối. Thay vì dùng những mảng đỏ lớn như nhiều Jordan 1 mang DNA “Bred”, Black Bloodline sử dụng màu đỏ để nhấn vào cấu trúc của chính silhouette.</p>
        <p>Điều làm Black Bloodline đặc biệt không chỉ nằm ở phối màu. Phiên bản PE gắn với một chương trình phát hành nội bộ dành cho các vận động viên Jordan Brand và được ghi nhận rộng rãi là được sản xuất với số lượng cực kỳ giới hạn. Đây không phải một colorway được xây dựng cho hệ thống retail thông thường mà thuộc nhóm sản phẩm có mục đích phân phối riêng, khiến nó tồn tại ở một vùng rất khác so với một đôi Jordan 1 general release. Chính yếu tố này làm Black Bloodline trở thành một ví dụ rõ ràng về cách Jordan Brand sử dụng Player Exclusive như một lớp văn hóa riêng nằm bên cạnh các sản phẩm thương mại.</p>
        <p>Đôi nằm trong bộ sưu tập này được xác định là <b>PE Sample</b>, vì vậy giá trị lưu trữ của nó cần được nhìn khác với một đôi PE hoàn thiện được trao cho athlete. Sample là một dấu vết của quá trình phát triển sản phẩm: một vật thể tồn tại trước hoặc song song với phiên bản cuối cùng, nơi cấu trúc, vật liệu, màu sắc hoặc cách hoàn thiện có thể được kiểm tra trước khi thiết kế đi đến trạng thái chính thức. Không nên mặc định sample này là một trong số các đôi PE hoàn thiện được phân phối cho athlete; ý nghĩa của nó nằm ở chính vị trí khác biệt đó trong chu trình sản phẩm.</p>
        <p>Trong bối cảnh của bộ sưu tập, Black Bloodline PE Sample đại diện cho một nhánh ít được nhìn thấy của Air Jordan 1 — không phải một biểu tượng được tạo ra nhờ độ phổ biến đại chúng, mà là một hiện vật liên quan đến quá trình phát triển và hệ thống phân phối giới hạn của Jordan Brand. Khi đặt cạnh những Jordan 1 retail, collaboration và Friends &amp; Family khác trong collection, nó giúp cho câu chuyện về silhouette này đầy đủ hơn: từ sản phẩm thương mại, tới collaboration, tới những đôi chưa bao giờ được thiết kế để xuất hiện rộng rãi trên kệ hàng.</p>
      `,
      en: `
        <p>The Air Jordan 1 “Bloodline” explores one of the most recognizable strengths of the Jordan line: the ability to transform a familiar color combination into a completely different visual language simply by changing proportion and placement. With the Black Bloodline PE, that idea moves into a much darker and rarer direction. The upper is almost entirely submerged in black, while red piping traces the panels, Swoosh and construction of the shoe like lines of light drawn over a dark surface. Instead of relying on large red color blocks as many Jordan 1s associated with “Bred” DNA do, Black Bloodline uses red to emphasize the architecture of the silhouette itself.</p>
        <p>What makes Black Bloodline special is not limited to its colorway. The PE edition is connected to an internal distribution program for Jordan Brand athletes and has been widely documented as being produced in extremely limited numbers. It was not conceived as a conventional retail colorway, but as a product intended for a restricted distribution network, placing it in a very different category from a general-release Jordan 1. That context makes Black Bloodline a clear example of how Jordan Brand uses Player Exclusives as a cultural layer that exists alongside its commercial products.</p>
        <p>The pair preserved in this collection is identified as a <b>PE Sample</b>, so its archival value should be understood differently from a completed PE distributed to an athlete. A sample is evidence of the product-development process: an object that can exist before or alongside a final version, allowing construction, materials, colors or finishing to be evaluated before a design reaches its official form. This sample should not automatically be treated as one of the completed PE pairs distributed to athletes; its importance lies precisely in its different position within the product-development cycle.</p>
        <p>Within the collection, the Black Bloodline PE Sample represents a less visible branch of Air Jordan 1 history — not an icon created through mass popularity, but an artifact connected to product development and Jordan Brand’s restricted distribution system. Placed beside retail Jordan 1s, collaborations and Friends &amp; Family editions in the collection, it helps complete the story of the silhouette: from commercial product, to collaboration, to footwear that was never intended to appear broadly on retail shelves.</p>
      `
    },

    quai54: {
      vi: `
        <p>Quai 54 là một trong những điểm giao thú vị nhất giữa Jordan Brand và văn hóa bóng rổ đường phố. Giải đấu tại Paris không chỉ là một sự kiện thể thao; qua nhiều năm, nó trở thành một nền tảng nơi basketball, âm nhạc, thời trang và sneaker culture gặp nhau. Những đôi Jordan được tạo ra cho Quai 54 vì thế thường mang thiết kế mạnh hơn các phối màu thông thường, đồng thời một số năm còn xuất hiện các phiên bản Friends &amp; Family với cách xử lý khác biệt đáng kể so với bản bán rộng rãi.</p>
        <p>Phiên bản F&amp;F của Air Jordan 1 Quai 54 nổi bật ngay lập tức bởi cấu trúc <b>mismatched</b>: hai chiếc không đơn thuần là bản sao của nhau. Một bên khai thác nhóm màu đỏ–đen, bên còn lại chuyển sang xanh–đen, tạo ra một cặp có tính bất đối xứng có chủ đích. Việc sử dụng những mảng màu chia cắt trên thân giày khiến mỗi chiếc gần giống một đối tượng thiết kế riêng, nhưng khi đặt cạnh nhau chúng lại hoàn thành một bố cục thống nhất. Các nguồn lưu trữ sneaker cũng ghi nhận đây là biến thể Friends &amp; Family khác với phiên bản Quai 54 thông thường và thuộc nhóm khó tiếp cận hơn đáng kể.</p>
        <p>Điểm hay của thiết kế này là nó không cần thay đổi silhouette của Jordan 1 để trở nên khác biệt. Form cơ bản vẫn quen thuộc, nhưng cách phân chia màu sắc khiến mắt người xem liên tục di chuyển giữa hai chiếc. Đỏ và xanh cũng gợi đến tính đối đầu của thể thao — hai phía, hai đội, hai trạng thái — trong khi màu đen giữ cho toàn bộ thiết kế không trở nên rời rạc. Logo và chi tiết Quai 54 đặt đôi giày vào đúng bối cảnh của Paris streetball thay vì để nó trở thành một Jordan 1 phối màu đơn thuần.</p>
        <p>Trong bộ sưu tập, đôi này có ý nghĩa vượt ra ngoài độ hiếm. Nó đại diện cho một dạng sneaker được tạo ra quanh <b>một cộng đồng và một sự kiện cụ thể</b>, rồi sau đó tiếp tục sống trong văn hóa sneaker như một vật phẩm lưu trữ. Friends &amp; Family ở đây không phải chỉ là nhãn để nói rằng một đôi giày khó mua; nó phản ánh một hệ thống phân phối khác, nơi sản phẩm được tạo ra cho những cá nhân có liên hệ trực tiếp với sự kiện, thương hiệu hoặc dự án. Vì vậy, Quai 54 F&amp;F phù hợp với tinh thần archive của collection: một phiên bản kể được cả câu chuyện về Jordan 1 lẫn một lát cắt của basketball culture ngoài nước Mỹ.</p>
      `,
      en: `
        <p>Quai 54 is one of the most compelling intersections between Jordan Brand and street-basketball culture. The tournament in Paris is more than a sporting event; over time, it became a platform where basketball, music, fashion and sneaker culture meet. Jordan footwear created for Quai 54 therefore often carries a stronger visual identity than conventional colorways, while certain years have also produced Friends &amp; Family editions with treatments significantly different from the broadly released versions.</p>
        <p>The F&amp;F Air Jordan 1 Quai 54 is immediately distinguished by its <b>mismatched</b> construction: the two shoes are not simple copies of one another. One side develops a red-and-black palette while the other shifts toward blue and black, creating a deliberately asymmetric pair. The divided color fields make each shoe feel almost like an independent design object, yet together they complete a unified composition. Sneaker archives have also documented this as a Friends &amp; Family variation distinct from the standard Quai 54 release and considerably more difficult to access.</p>
        <p>The strength of the design is that it does not need to alter the Jordan 1 silhouette in order to feel different. The fundamental form remains familiar, but the color division constantly moves the viewer’s eye between the two shoes. Red and blue can also suggest the oppositional nature of sport — two sides, two teams, two states — while black prevents the composition from becoming visually fragmented. Quai 54 branding and detailing place the pair firmly within the context of Paris streetball rather than allowing it to become merely another Jordan 1 colorway.</p>
        <p>Within the collection, the significance of this pair extends beyond rarity. It represents a type of sneaker created around <b>a specific community and event</b>, then preserved within sneaker culture as an archival object. Friends &amp; Family here is not simply a label meaning that a shoe is difficult to buy; it reflects a different distribution system in which product is created for individuals directly connected to an event, brand or project. Quai 54 F&amp;F therefore fits the archival character of the collection: a version capable of telling both the story of the Jordan 1 and a chapter of basketball culture outside the United States.</p>
      `
    },

    yuto: {
      vi: `
        <p>Yuto Horigome bước vào lịch sử skateboarding hiện đại với tư cách một trong những vận động viên định hình lại cách thế giới nhìn về skate Nhật Bản. Collaboration thứ hai của anh với Nike SB không cố gắng lặp lại đôi Dunk đầu tiên bằng một bảng màu khác. “Matcha” được xây dựng quanh một yếu tố rất đời thường và rất Nhật Bản: thức uống matcha mà Yuto yêu thích, rồi mở rộng ý tưởng đó thành một hệ màu và hệ vật liệu gắn với văn hóa, thiên nhiên và thói quen cá nhân.</p>
        <p>Nike mô tả đôi giày với các tông xanh asparagus, nâu hữu cơ và những chi tiết lấy cảm hứng từ matcha, đồng thời sử dụng suede cao cấp cùng những điểm nhấn từ sợi tre. Một số chi tiết nhỏ chỉ thực sự lộ ra khi quan sát gần: texture dạng bong bóng trên overlay, phần eyelet và aglet được xử lý với ngôn ngữ gợi đến dụng cụ chuẩn bị matcha, cùng branding riêng của Yuto. Sockliner tiếp tục khai thác sự giao thoa giữa Nhật Bản cũ và mới — một chủ đề rất phù hợp với Yuto, người đại diện cho một thế hệ skater Nhật Bản mang kỹ thuật và bản sắc địa phương lên sân khấu toàn cầu.</p>
        <p>Bên dưới lớp kể chuyện đó vẫn là một Nike SB Dunk được tạo ra để skate. Form thấp, cấu trúc đệm và hệ thống Zoom Air giữ nguyên tính thực dụng của dòng SB, giúp thiết kế không rơi vào trạng thái chỉ đẹp để trưng bày. Đây là một trong những điểm quan trọng của những collaboration SB thành công: storytelling không thay thế công năng mà được xây xung quanh một nền tảng vốn sinh ra cho skateboard.</p>
        <p>Đối với đôi trong bộ sưu tập này, câu chuyện còn có một lớp provenance đặc biệt hơn: <b>đôi giày mang chữ ký trực tiếp của Yuto Horigome</b>. Chữ ký biến một sản phẩm collaboration thành một vật thể có liên hệ vật lý với chính người đứng sau thiết kế và câu chuyện của nó. Trong một collection được xây dựng như archive, điều này quan trọng hơn việc đôi giày chỉ thuộc một release nổi tiếng; nó tạo ra một đường nối trực tiếp giữa athlete, sản phẩm và người lưu giữ. Đây là một trong những trường hợp mà giá trị văn hóa của đôi giày không chỉ nằm ở mẫu mã, mà còn ở lịch sử cụ thể của chính hiện vật đang được trưng bày.</p>
      `,
      en: `
        <p>Yuto Horigome entered modern skateboarding history as one of the athletes who reshaped how the world views Japanese skateboarding. His second collaboration with Nike SB does not simply repeat his first Dunk in a different palette. “Matcha” is built around something both everyday and distinctly Japanese: Yuto’s appreciation for matcha, expanding that idea into a system of colors and materials connected to culture, nature and personal habit.</p>
        <p>Nike describes the shoe through asparagus greens, organic browns and matcha-inspired details, supported by premium suede and bamboo-derived accents. Several smaller features reveal themselves only under close inspection: bubble-like texture across the overlays, eyelet and aglet treatments that reference tools used in preparing matcha, and Yuto’s personal branding. The sockliner continues the dialogue between older and contemporary Japan — an especially fitting theme for Yuto, who represents a generation of Japanese skaters bringing local technique and identity onto the global stage.</p>
        <p>Beneath that storytelling, the shoe remains a Nike SB Dunk built to skate. Its low profile, padded construction and Zoom Air system preserve the practical foundation of the SB line, preventing the design from becoming an object made only for display. This is one of the defining qualities of successful SB collaborations: storytelling does not replace function, but is built around a platform originally created for skateboarding.</p>
        <p>For the pair preserved in this collection, the story carries an additional layer of provenance: <b>the shoe bears Yuto Horigome’s direct signature</b>. The autograph turns a collaboration product into an object with a physical connection to the person at the center of its design and narrative. In a collection conceived as an archive, that connection matters beyond the fact that the shoe belongs to a notable release; it creates a direct line between athlete, product and custodian. This is a case in which the cultural value of the sneaker lies not only in its design, but also in the specific history of the exact artifact being displayed.</p>
      `
    },

    alaska: {
      vi: `
        <p>Air Jordan 1 của Virgil Abloh là một trong những thiết kế có ảnh hưởng lớn nhất của sneaker culture cuối thập niên 2010. Thay vì xem Jordan 1 như một sản phẩm đã hoàn thiện và bất khả xâm phạm, Abloh tiếp cận nó như một vật thể có thể tháo ra để người xem nhìn thấy cách nó được xây dựng. Những đường may lộ, foam không che giấu, Swoosh có cảm giác được gắn thêm vào bề mặt, typography công nghiệp và các chi tiết tưởng như chưa hoàn thiện trở thành một phần của ngôn ngữ thiết kế. Đó là nền tảng của cách Virgil đặt câu hỏi về “sản phẩm hoàn chỉnh” — và đồng thời cũng là lý do những Jordan 1 của ông nhanh chóng trở thành tài liệu tham chiếu cho cả sneaker design lẫn thời trang.</p>
        <p>Phiên bản toàn trắng từng xuất hiện trong giai đoạn Off-White x Nike mang cách tiếp cận đó đến trạng thái gần như kiến trúc. Khi màu sắc bị thu lại, cấu trúc của đôi giày trở thành nhân vật chính: đường cắt, lớp vật liệu, foam, stitching và typography hiện ra rõ hơn. Phiên bản Virgil Abloh Archive tiếp tục bảo tồn ngôn ngữ này, nhưng thay đổi branding từ Off-White sang <b>V.A.A.</b>, đưa thiết kế vào một bối cảnh mới liên quan trực tiếp đến việc gìn giữ và quản lý di sản sáng tạo của Virgil sau khi ông qua đời. Các nguồn về dự án mô tả đôi này như một sự tái hiện rất sát thiết kế trắng năm 2018, với V.A.A. thay cho branding Off-White quen thuộc.</p>
        <p>Sự thay đổi tưởng như nhỏ về chữ viết thực tế làm thay đổi cách đọc toàn bộ đôi giày. Nó không còn chỉ là một chapter khác của “The Ten” hay Off-White x Nike; nó trở thành một vật thể trong quá trình bảo tồn kho lưu trữ của Virgil Abloh. Điều đó khiến thiết kế vừa hướng về quá khứ vừa tồn tại trong hiện tại: hình thức quen thuộc được giữ lại, nhưng ngữ cảnh đã thay đổi.</p>
        <p>Trong collection này, “Alaska” vì vậy được lưu giữ như một phần của câu chuyện lớn hơn về <b>design legacy</b>. Giá trị của nó không chỉ nằm ở Jordan 1 hay ở một collaboration có sức ảnh hưởng, mà ở việc nó cho thấy một thiết kế có thể tiếp tục tồn tại sau thời điểm ban đầu của nó như thế nào. Đây là một đôi giày nằm ở ranh giới giữa sneaker release, design archive và việc bảo tồn di sản của một nhà thiết kế có tác động sâu rộng đến cách thời trang đương đại nhìn về collaboration.</p>
      `,
      en: `
        <p>Virgil Abloh’s Air Jordan 1 is one of the most influential sneaker designs of the late 2010s. Rather than treating the Jordan 1 as a finished and untouchable product, Abloh approached it as an object that could be taken apart so the viewer could see how it was constructed. Exposed stitching, uncovered foam, a Swoosh that appears almost attached onto the surface, industrial typography and deliberately unfinished-looking details became part of the design language. This was central to Virgil’s questioning of the idea of a “finished product” — and one reason his Jordan 1s quickly became reference points for both sneaker design and fashion.</p>
        <p>The all-white edition from the Off-White x Nike era pushed that approach toward an almost architectural state. Once color was reduced, the construction of the shoe became the main subject: cuts, layered materials, foam, stitching and typography appeared more clearly. The Virgil Abloh Archive edition preserves that language while changing the branding from Off-White to <b>V.A.A.</b>, placing the design within a new context directly connected to preserving and managing Virgil’s creative legacy after his death. Documentation around the project has described the shoe as a very close re-creation of the 2018 white design, with V.A.A. replacing the familiar Off-White branding.</p>
        <p>That seemingly small typographic change fundamentally alters how the entire shoe is read. It is no longer simply another chapter of “The Ten” or Off-White x Nike; it becomes an object within the preservation of the Virgil Abloh archive. The design therefore looks backward while existing in the present: the familiar form remains, but its context has changed.</p>
        <p>Within this collection, “Alaska” is consequently preserved as part of a larger story about <b>design legacy</b>. Its significance lies not only in the Jordan 1 or in an influential collaboration, but in the way it demonstrates how a design can continue to exist beyond its original moment. The shoe sits at the boundary between sneaker release, design archive and the preservation of the legacy of a designer who profoundly influenced how contemporary fashion understands collaboration.</p>
      `
    },

    fragmentUnion: {
      vi: `
        <p>Sự kết hợp giữa Jordan Brand, Fragment Design và Union Los Angeles đặt ba dòng lịch sử khác nhau lên cùng một Air Jordan 1. Jordan mang đến silhouette gốc và di sản basketball; Fragment mang cách tiếp cận tối giản nhưng cực kỳ có ảnh hưởng của Hiroshi Fujiwara; Union mang ngôn ngữ tái cấu trúc Jordan 1 với stitching lộ và cảm giác hai đôi vintage được ghép lại. Khi cả ba gặp nhau, mục tiêu không còn đơn giản là tạo một colorway mới, mà là xây một đôi Jordan 1 có thể đọc được theo nhiều lớp.</p>
        <p>Bảng màu Varsity Red và Sport Royal cố ý đặt những ký ức quen thuộc cạnh nhau. Red/black/white kéo người xem về lịch sử “Bred” của Jordan 1, trong khi sắc blue liên hệ trực tiếp đến Fragment và phối màu đã trở thành một trong những dấu mốc quan trọng của Jordan collaborations. Union sau đó phá vỡ sự sạch sẽ của bố cục bằng những đường stitching nổi, mép panel có cảm giác được đánh dấu và chi tiết UN/LA quen thuộc. Thay vì để ba thương hiệu cạnh tranh bằng logo lớn, thiết kế cho phép DNA của từng bên xuất hiện thông qua màu sắc, cấu trúc và kỹ thuật hoàn thiện.</p>
        <p>Điều đáng chú ý là đôi trong collection này được xác định là <b>Sample</b>. Vì vậy, nó không nên được đọc đơn giản như một đôi retail của collaboration. Sample tồn tại trong không gian phát triển sản phẩm — nơi ý tưởng đã đủ rõ để trở thành một vật thể hoàn chỉnh, nhưng vẫn gắn với quá trình thử nghiệm, kiểm tra và quyết định trước khi sản phẩm thương mại đi đến hình thức cuối cùng. Khi không có tài liệu xác nhận cụ thể từng khác biệt sản xuất, việc quan trọng nhất là không gán cho sample những đặc điểm không thể chứng minh; chính trạng thái sample đã là một phần provenance đáng kể.</p>
        <p>Với một archive tập trung nhiều vào Jordan 1, đôi này hoạt động gần giống một “bản tổng hợp” của sneaker collaboration hiện đại. Nó nối Nike/Jordan với streetwear Los Angeles, thiết kế Nhật Bản và lịch sử của một silhouette từ năm 1985. Đồng thời, sample status làm cho câu chuyện không dừng ở sản phẩm cuối cùng mà mở rộng sang quá trình một collaboration quy mô lớn được hình thành. Đây là kiểu hiện vật giúp collection kể câu chuyện về <b>cách sneaker được tạo ra</b>, chứ không chỉ về những gì cuối cùng được bán ra thị trường.</p>
      `,
      en: `
        <p>The combination of Jordan Brand, Fragment Design and Union Los Angeles places three different historical lineages onto a single Air Jordan 1. Jordan contributes the original silhouette and basketball heritage; Fragment brings Hiroshi Fujiwara’s restrained but highly influential design approach; Union contributes its reconstructed Jordan 1 language, exposed stitching and the impression of two vintage shoes joined together. When all three meet, the objective is no longer simply to create a new colorway, but to build a Jordan 1 that can be read in multiple layers.</p>
        <p>The Varsity Red and Sport Royal palette deliberately places familiar memories beside one another. Red, black and white pull the viewer toward the “Bred” history of the Jordan 1, while blue connects directly to Fragment and to a color language that became one of the important reference points in Jordan collaboration history. Union then disrupts the cleanliness of the composition with visible stitching, marked-looking panel edges and familiar UN/LA detailing. Rather than forcing the three names to compete through oversized logos, the design allows each party’s DNA to appear through color, construction and finishing technique.</p>
        <p>What makes the pair in this collection especially significant is its identification as a <b>Sample</b>. It should therefore not be read simply as a retail version of the collaboration. A sample exists within the product-development space — where an idea is developed enough to become a complete physical object, yet remains connected to testing, evaluation and decision-making before a commercial product reaches its final form. Without documentation confirming every production difference, it is important not to assign unsupported characteristics to the sample; its sample status itself is already a meaningful component of provenance.</p>
        <p>Within an archive that places strong emphasis on the Jordan 1, this pair functions almost like a synthesis of modern sneaker collaboration. It connects Nike/Jordan with Los Angeles streetwear, Japanese design and the history of a silhouette dating back to 1985. At the same time, its sample status extends the story beyond the final product and into the process through which a large-scale collaboration is formed. It is the kind of artifact that allows the collection to document <b>how sneakers are created</b>, not only what eventually reaches the market.</p>
      `
    },

    shadow: {
      vi: `
        <p>“Shadow” thuộc nhóm colorway chứng minh rằng Air Jordan 1 không cần màu sắc rực rỡ để có cá tính mạnh. Black và Shadow Grey tạo ra một bố cục trầm, cân bằng và đặc biệt linh hoạt, khác hoàn toàn sự đối lập mạnh của Chicago hay Bred. Chính sự tiết chế đó khiến Shadow dần trở thành một trong những phối màu được xem như nền tảng của lịch sử Jordan 1.</p>
        <p>Phiên bản 2009 đặc biệt bởi nó nằm ở một giai đoạn retro mà Jordan Brand chưa theo đuổi mức độ phục dựng OG như những năm sau này. Đây là lần retro đầu tiên của phối màu Shadow từ bản gốc năm 1985, nhưng nó mang nhiều dấu hiệu của thời kỳ Jordan Brand lúc đó: Jumpman thay cho Nike Air ở những vị trí quan trọng và logo Jumpman xuất hiện trên heel. Một chi tiết khác thường được nhắc đến trên phiên bản này là phần xử lý elephant-print tonal ở khu vực gót — một lựa chọn không thuộc cấu trúc nguyên bản năm 1985 và khiến bản 2009 có bản sắc riêng thay vì chỉ là bản sao của OG.</p>
        <p>Chính những khác biệt này làm đôi 2009 trở nên thú vị từ góc nhìn archive. Trong sneaker culture hiện đại, người ta thường đánh giá retro dựa trên mức độ giống nguyên bản: shape, Nike Air, material, color blocking. Nhưng lịch sử retro của Jordan không phải một đường thẳng hướng tới độ chính xác. Mỗi giai đoạn phản ánh triết lý thương hiệu, kỹ thuật sản xuất và thị hiếu của thời điểm đó. Bản Shadow 2009 lưu giữ một chương trong quá trình Jordan Brand còn chủ động tái diễn giải di sản thay vì luôn cố gắng phục dựng nó.</p>
        <p>Đôi trong collection đã trải qua sử dụng, và điều đó phù hợp với tính chất của một sneaker hơn mười năm tuổi. Những dấu vết thời gian khiến nó khác với một reissue mới: vật liệu đã già đi, bề mặt và form phản ánh lịch sử sử dụng thực tế. Trong archive này, Shadow 2009 vì vậy không chỉ đại diện cho một colorway OG; nó đại diện cho <b>một thời kỳ cụ thể của Jordan retro</b>, khi những quy tắc về “OG accuracy” mà sneaker community quen thuộc ngày nay vẫn chưa trở thành tiêu chuẩn.</p>
      `,
      en: `
        <p>“Shadow” belongs to the group of colorways that prove the Air Jordan 1 does not need bright color to carry a strong identity. Black and Shadow Grey create a subdued, balanced and highly versatile composition, very different from the sharper contrast of Chicago or Bred. That restraint gradually established Shadow as one of the foundational colorways in Jordan 1 history.</p>
        <p>The 2009 edition is particularly important because it belongs to a retro period in which Jordan Brand had not yet pursued the level of OG restoration seen in later years. It was the first retro of the Shadow colorway since the 1985 original, but it carries many signatures of Jordan Brand’s approach at the time: Jumpman branding replaced Nike Air in key positions, and a Jumpman appeared on the heel. Another feature often associated with the 2009 edition is the tonal elephant-print treatment around the heel — a choice absent from the original 1985 construction and one that gives this retro its own identity rather than making it simply a copy of the OG.</p>
        <p>Those differences are precisely what make the 2009 pair interesting from an archival perspective. In contemporary sneaker culture, retros are often judged by how closely they reproduce an original: shape, Nike Air, materials and color blocking. Jordan retro history, however, is not a straight line toward ever-greater accuracy. Each period reflects the brand philosophy, manufacturing methods and consumer taste of its own time. The 2009 Shadow preserves a chapter in which Jordan Brand still actively reinterpreted its heritage rather than always attempting to reproduce it.</p>
        <p>The pair in this collection has been worn, which is entirely consistent with the character of a sneaker more than a decade old. Signs of time distinguish it from a new reissue: materials have aged, and the surface and form carry evidence of real use. Within this archive, the 2009 Shadow therefore represents more than an OG colorway; it represents <b>a specific period of Jordan retro history</b>, before the rules of “OG accuracy” familiar to today’s sneaker community became the dominant standard.</p>
      `
    },

    bapeStussy: {
      vi: `
        <p>BAPE và Stüssy đại diện cho hai chương khác nhau nhưng liên kết chặt chẽ của streetwear. Stüssy hình thành từ Southern California và trở thành một trong những thương hiệu đặt nền móng cho streetwear hiện đại; BAPE xuất hiện tại Tokyo và góp phần biến Harajuku thành một trung tâm văn hóa có ảnh hưởng toàn cầu. Sự giao thoa giữa hai thương hiệu vì vậy không đơn thuần là việc đặt hai logo cạnh nhau — nó là cuộc gặp giữa một trong những nguồn gốc của streetwear Mỹ và thế hệ Nhật Bản đã hấp thụ, tái diễn giải rồi đưa văn hóa đó sang một hướng mới.</p>
        <p>Collaboration của hai thương hiệu trong giai đoạn này gắn với dịp kỷ niệm 30 năm của Stüssy và trải rộng trên nhiều loại sản phẩm, từ apparel đến footwear và accessories. Các thiết kế thường cho hai hệ nhận diện hoạt động song song: handwriting của Stüssy, BAPE camouflage và Ape Head cùng xuất hiện trong một visual language đậm chất đầu thập niên 2010.</p>
        <p>Trên đôi Camo Canvas Hi Top, yếu tố nổi bật nhất không phải một công nghệ footwear phức tạp mà là <b>surface design</b>. Canvas trở thành tấm nền cho camouflage xanh đặc trưng, đưa đôi giày gần hơn với thế giới của streetwear graphic và textile. Silhouette cao cổ tương đối đơn giản giúp pattern giữ vai trò chính; thay vì cạnh tranh với một cấu trúc sneaker quá phức tạp, hình dáng giày hoạt động như một khung để bản sắc của hai thương hiệu được thể hiện rõ nhất.</p>
        <p>Ngày nay, đôi này có giá trị đặc biệt khi nhìn lại thời kỳ collaboration chưa vận hành với mật độ như hiện tại. BAPE x Stüssy xuất hiện trong một giai đoạn mà những dự án giao thoa giữa các thương hiệu streetwear lớn vẫn mang cảm giác của một sự kiện văn hóa rõ rệt. Đối với collection, Green Camo không chỉ là một đôi high-top hiếm gặp; nó là tài liệu về mối liên hệ xuyên Thái Bình Dương đã góp phần xây dựng streetwear như một ngôn ngữ toàn cầu. Việc đôi giày đã được sử dụng càng phù hợp với nguồn gốc của nó: đây vốn là một sản phẩm được sinh ra từ văn hóa đường phố, không phải một vật thể chỉ tồn tại phía sau kính trưng bày.</p>
      `,
      en: `
        <p>BAPE and Stüssy represent two different yet closely connected chapters of streetwear history. Stüssy emerged from Southern California and became one of the brands that helped establish the foundations of modern streetwear; BAPE emerged in Tokyo and contributed to turning Harajuku into a cultural center with global influence. Their intersection is therefore more than the placement of two logos on a product — it is a meeting between one of the American origins of streetwear and a Japanese generation that absorbed, reinterpreted and redirected that culture.</p>
        <p>The collaboration between the two brands during this period was connected to Stüssy’s 30th anniversary and extended across multiple product categories, from apparel to footwear and accessories. The designs allowed both identity systems to operate in parallel: Stüssy handwriting, BAPE camouflage and the Ape Head appeared together within a visual language strongly associated with the early 2010s.</p>
        <p>On the Camo Canvas Hi Top, the defining feature is not complex footwear technology but <b>surface design</b>. Canvas becomes the ground for the signature green camouflage, moving the shoe closer to the world of streetwear graphics and textiles. The relatively simple high-top silhouette allows the pattern to remain dominant; rather than competing with an overly complex sneaker structure, the form acts as a frame through which the identities of both brands can be read clearly.</p>
        <p>Today, the pair carries additional value when viewed against a period in which collaborations did not appear at the volume seen now. BAPE x Stüssy arrived at a time when crossover projects between major streetwear brands still felt distinctly like cultural events. Within the collection, Green Camo is more than an uncommon high-top; it is a document of the trans-Pacific relationship that helped establish streetwear as a global language. The fact that the pair has been worn is also consistent with its origins: it was born from street culture, not as an object intended to exist only behind display glass.</p>
      `
    },

    waffle: {
      vi: `
        <p>Waffle Racer nằm rất xa Air Jordan 1 trong lịch sử Nike. Thay vì basketball, nguồn gốc của nó gắn với running và những thử nghiệm outsole của Bill Bowerman — một giai đoạn Nike còn đang định hình cách giày chạy có thể trở nên nhẹ hơn, linh hoạt hơn và bám mặt đường tốt hơn. Chính vì vậy, khi Virgil Abloh lựa chọn Waffle Racer cho dự án <b>Athlete in Progress</b>, ông không chỉ lấy một silhouette retro; ông quay trở lại một phần rất sớm trong tư duy thiết kế hiệu năng của Nike.</p>
        <p>Athlete in Progress khai thác hình ảnh của track &amp; field và ý niệm rằng vận động viên luôn ở trong trạng thái phát triển, không bao giờ thực sự “hoàn thành”. Waffle Racer của Off-White biến tư tưởng đó thành một sản phẩm mang cảm giác vừa chạy bộ, vừa prototype, vừa runway. Phần upper được phủ bởi lớp vật liệu translucent, hệ thống dây truyền thống được đặt cạnh dây cord kiểu hiking và outsole xuất hiện các gai cao su nổi bật, tạo ra một silhouette cố ý nằm giữa nhiều loại footwear khác nhau.</p>
        <p>Đây cũng là một ví dụ tốt về cách Virgil Abloh thường làm việc: ông ít khi che giấu cấu trúc. Ngược lại, những thứ thông thường bị xem là thành phần kỹ thuật — overlay, dây buộc, tape, lớp phủ, foam — được đưa ra mặt trước và biến thành thẩm mỹ. Trên Waffle Racer, triết lý đó đặc biệt phù hợp vì bản thân lịch sử của Nike running cũng bắt đầu từ thử nghiệm, sửa đổi và tìm kiếm giải pháp kỹ thuật.</p>
        <p>Khi được đặt trong collection cùng Air Jordan 1 Virgil Abloh Archive, đôi Waffle Racer giúp mở rộng hình ảnh của Virgil vượt ra ngoài những silhouette hype nhất. Nó cho thấy mối quan hệ Nike x Abloh còn là một cuộc đối thoại với <b>archive thể thao của Nike</b>: basketball ở một phía, running và athletics ở phía còn lại. Dấu vết thời gian trên đôi giày cũng không làm mất đi câu chuyện này; ngược lại, vật liệu trắng và translucent thay đổi theo tuổi giúp người xem thấy rõ rằng đây là một vật thể thật đã đi qua thời gian, chứ không phải một render bất biến.</p>
      `,
      en: `
        <p>The Waffle Racer sits far from the Air Jordan 1 within Nike history. Rather than basketball, its origins are tied to running and to Bill Bowerman’s experiments with outsole design — a period when Nike was still defining how a running shoe could become lighter, more flexible and more effective in gripping the ground. When Virgil Abloh selected the Waffle Racer for <b>Athlete in Progress</b>, he was therefore not simply choosing a retro silhouette; he was returning to an early chapter in Nike’s performance-design thinking.</p>
        <p>Athlete in Progress draws from track &amp; field and from the idea that an athlete is always developing, never truly “finished.” Off-White’s Waffle Racer translates that idea into a product that feels simultaneously like a running shoe, a prototype and a runway object. The upper is covered by translucent material, a traditional lacing system sits beside hiking-style cord laces, and prominent rubber spikes appear across the outsole, intentionally positioning the silhouette between several different categories of footwear.</p>
        <p>It is also a strong example of Virgil Abloh’s working method: he rarely hides construction. Instead, components normally treated as technical necessities — overlays, laces, tape, films and foam — are brought to the foreground and turned into aesthetics. On the Waffle Racer, that philosophy is especially appropriate because Nike running history itself began through experimentation, modification and the search for technical solutions.</p>
        <p>Placed in the collection beside the Air Jordan 1 Virgil Abloh Archive, the Waffle Racer expands Virgil’s story beyond his most celebrated hype silhouettes. It shows that Nike x Abloh was also a dialogue with <b>Nike’s sporting archive</b>: basketball on one side, running and athletics on the other. Signs of age on the shoe do not diminish that story; instead, changes in the white and translucent materials make it clear that this is a physical object that has moved through time rather than an unchanging render.</p>
      `
    },

    puma: {
      vi: `
        <p>Speedcat bắt đầu ở một thế giới hoàn toàn khác với sân khấu K-pop. Nguồn gốc của silhouette nằm trong motorsport: PUMA phát triển footwear có profile thấp dành cho môi trường đua xe, nơi người lái cần cảm nhận bàn đạp chính xác và phần đế không được quá dày. Dòng thiết kế đó sau đó được chuyển hóa thành Speedcat dành cho lifestyle, giữ lại dáng thấp, đường nét gọn và tinh thần racing ngay cả khi rời khỏi đường đua. PUMA ghi nhận Speedcat lifestyle xuất hiện vào cuối thập niên 1990 dựa trên footwear motorsport trước đó.</p>
        <p>Nhiều năm sau, silhouette này tìm được một đời sống mới trong thời trang khi xu hướng footwear bắt đầu dịch chuyển khỏi những đôi sneaker quá lớn sang form thấp và thanh hơn. Collaboration với ROSÉ đặt Speedcat vào đúng khoảnh khắc đó nhưng không đơn giản dựa vào tên tuổi celebrity. Capsule đầu tiên PUMA x ROSÉ được xây dựng quanh phong cách cá nhân của cô, kết hợp streetwear với những yếu tố được thương hiệu mô tả là mang tinh thần “elevated country-club”, từ đó tạo ra một hình ảnh mềm hơn và tinh tế hơn so với nguồn gốc motorsport thuần túy.</p>
        <p>Warm White đặc biệt phù hợp với sự chuyển đổi này. Leather sáng màu làm các đường cong thấp của Speedcat dễ nhìn hơn, trong khi những chi tiết co-branding đưa silhouette từ archive motorsport sang bối cảnh thời trang và pop culture đương đại. Đây không phải trường hợp collaboration phá bỏ thiết kế gốc; ngược lại, nó dựa vào tỷ lệ đặc trưng của Speedcat rồi thay đổi cách người xem diễn giải nó.</p>
        <p>Trong collection, đôi này đóng vai trò khác với những Jordan PE, sample hay Friends &amp; Family. Nó ghi lại một <b>thời điểm văn hóa hiện tại</b>: một silhouette từ cuối thế kỷ XX được tái khám phá bởi thế hệ mới, đồng thời kết nối performance heritage với một nghệ sĩ có ảnh hưởng toàn cầu. Nếu những đôi archive lâu năm cho thấy sneaker culture đã đi qua đâu, PUMA x ROSÉ cho thấy một archive sống cũng cần ghi lại những gì đang xảy ra ngay trong hiện tại.</p>
      `,
      en: `
        <p>Speedcat began in a world completely different from the K-pop stage. The silhouette originates in motorsport: PUMA developed low-profile footwear for racing environments, where drivers needed precise pedal feel and a sole that was not excessively thick. That design lineage was later transformed into the lifestyle Speedcat, retaining its low stance, compact lines and racing character even after leaving the track. PUMA traces the lifestyle Speedcat to the late 1990s, building on earlier motorsport footwear.</p>
        <p>Years later, the silhouette found a new life in fashion as footwear trends began moving away from oversized sneakers toward lower and slimmer forms. The collaboration with ROSÉ places the Speedcat directly within that moment, but it does not rely solely on celebrity name recognition. The first PUMA x ROSÉ capsule was built around her personal style, combining streetwear with elements the brand described through an “elevated country-club” sensibility, creating an image that feels softer and more refined than the model’s purely motorsport origins.</p>
        <p>Warm White is particularly well suited to that transition. Light-colored leather makes the low curves of the Speedcat easier to read, while co-branding details move the silhouette from motorsport archive into contemporary fashion and pop culture. This is not a collaboration that destroys the original design; instead, it relies on the characteristic proportions of the Speedcat and changes the way the viewer interprets them.</p>
        <p>Within the collection, this pair occupies a different role from Jordan PEs, samples or Friends &amp; Family editions. It documents a <b>current cultural moment</b>: a silhouette from the end of the twentieth century being rediscovered by a new generation while connecting performance heritage with a globally influential artist. If older archival pairs show where sneaker culture has been, PUMA x ROSÉ demonstrates that a living archive must also record what is happening in the present.</p>
      `
    },

    jordan4: {
      vi: `
        <p>Air Jordan 4 “Black Cement” là một trong những thiết kế gắn chặt nhất với hình ảnh Michael Jordan cuối thập niên 1980. Tinker Hatfield tiếp tục ngôn ngữ mà ông đã thiết lập với Air Jordan 3 nhưng đẩy nó theo hướng kỹ thuật hơn: mesh panel, support wings, lacing system có thể tùy chỉnh và visible Air đều trở thành những thành phần dễ nhận biết của AJ4. Trong Black Cement, black nubuck tạo nền cho grey, white và red, hình thành một bảng màu không cần nhiều trang trí vẫn lập tức được nhận ra là Jordan.</p>
        <p>Silhouette này còn mang sức nặng văn hóa nhờ gắn với mùa giải 1989 và khoảnh khắc “The Shot” trước Cleveland — một trong những hình ảnh thường xuyên được nhắc lại khi kể lịch sử Michael Jordan. Nhưng điều làm đôi trong collection đặc biệt là nó không phải một retro hiện đại được sản xuất sau khi Jordan Brand đã xây dựng một hệ thống phục dựng OG rất hoàn chỉnh. Đây là bản retro năm 1999, được tạo ra để kỷ niệm mười năm của Air Jordan 4 và thuộc <b>làn sóng retro đầu tiên của silhouette</b>.</p>
        <p>Bản 1999 vì vậy có một vị trí đặc biệt trong lịch sử Jordan collecting. Nike Air ở heel, tỷ lệ của upper, vật liệu và cách đôi giày già đi đều gắn với một thời điểm sản xuất khác. Ngày nay, khi “Nike Air” trở lại trên nhiều retro OG, người ta có thể dễ quên rằng trong nhiều năm chi tiết này từng là yếu tố khiến những bản retro cũ được giới sưu tầm săn tìm mạnh mẽ.</p>
        <p>Một đôi 1999 đã được sử dụng cũng mang vẻ đẹp archive rất khác với một đôi mới. Midsole, nubuck, plastic wing và các vật liệu tổng hợp đều ghi dấu tuổi đời của chúng. Những dấu vết đó không nên được đọc đơn giản như khuyết điểm thẩm mỹ; chúng giúp xác định hiện vật thuộc về một thời kỳ mà ngày nay không thể tái tạo hoàn toàn chỉ bằng việc sản xuất thêm một retro mới. Trong collection, Black Cement 1999 là một <b>historical object</b>: vừa kể câu chuyện về AJ4 năm 1989, vừa kể câu chuyện riêng về lần Jordan Brand bắt đầu đưa silhouette đó trở lại một thập niên sau.</p>
      `,
      en: `
        <p>The Air Jordan 4 “Black Cement” is one of the designs most closely associated with Michael Jordan at the end of the 1980s. Tinker Hatfield continued the language he had established with the Air Jordan 3 but pushed it in a more technical direction: mesh panels, support wings, an adjustable lacing system and visible Air all became defining components of the AJ4. On Black Cement, black nubuck provides the ground for grey, white and red, creating a palette that needs very little decoration to be immediately recognizable as Jordan.</p>
        <p>The silhouette also carries cultural weight through its association with the 1989 season and “The Shot” against Cleveland — one of the images most frequently revisited when Michael Jordan’s history is told. What makes the pair in this collection especially important, however, is that it is not a modern retro produced after Jordan Brand had established a highly developed OG-restoration system. This is the 1999 retro, created ten years after the original Air Jordan 4 and part of <b>the silhouette’s first major retro wave</b>.</p>
        <p>The 1999 edition therefore occupies a special place in Jordan collecting history. Nike Air at the heel, the proportions of the upper, the materials and even the way the shoe ages all belong to a different production period. Today, with “Nike Air” restored on many OG retros, it is easy to forget that for many years this detail was one of the features that made older retros especially desirable to collectors.</p>
        <p>A worn 1999 pair also carries an archival beauty very different from a new shoe. The midsole, nubuck, plastic wings and synthetic materials all record their age. Those signs should not be read simply as cosmetic flaws; they help identify the artifact as belonging to a period that cannot be fully recreated merely by producing another modern retro. Within the collection, the 1999 Black Cement is a <b>historical object</b>: it tells the story of the AJ4 in 1989 while also documenting the moment Jordan Brand began bringing that silhouette back a decade later.</p>
      `
    },

    newBalance: {
      vi: `
        <p>New Balance 2002R là một silhouette đặc biệt thích hợp cho custom bởi thiết kế của nó vốn đã có nhiều lớp. Phiên bản hiện đại lấy cảm hứng từ dòng 2002 đầu thập niên 2010, kết hợp mesh, suede và các panel phức tạp của một technical runner với hệ tooling sử dụng ABZORB, N-ergy và Stability Web. Kết quả là một đôi giày có cấu trúc đủ dày để tạo chiều sâu nhưng vẫn có rất nhiều bề mặt riêng biệt để người custom can thiệp.</p>
        <p>Trên đôi trong collection này, cấu trúc đó trở thành canvas cho một dự án cá nhân 1/1. Các mảng <b>đen, trắng, đỏ và xám</b> không được xử lý theo color blocking công nghiệp thông thường mà được đưa lên nhiều panel theo ngôn ngữ splatter và gestural mark-making. Cách tiếp cận lấy cảm hứng từ hội họa hành động của Jackson Pollock: thay vì cố gắng tạo những đường biên hoàn hảo, năng lượng của chuyển động, giọt màu và sự ngẫu nhiên có kiểm soát trở thành một phần của hình ảnh cuối cùng.</p>
        <p>Điểm quan trọng của câu chuyện này là đây <b>không phải collaboration chính thức giữa New Balance và Jackson Pollock</b>, cũng không phải sản phẩm được Pollock-Krasner Foundation cấp phép. Nó là một personal custom, được người sở hữu tự phát triển dựa trên cảm hứng mỹ thuật. Sự phân biệt đó giúp provenance của đôi giày rõ ràng: giá trị của nó không đến từ một partnership thương mại mà từ việc nó là một vật thể cá nhân và duy nhất.</p>
        <p>Trong một collection có nhiều đôi quan trọng vì lịch sử thương hiệu, sample status hay distribution, 2002R này đại diện cho một dạng giá trị khác: <b>ownership as authorship</b>. Người sưu tầm không chỉ mua và lưu giữ một vật thể đã hoàn tất; ở đây, người sở hữu tham gia trực tiếp vào việc tạo ra diện mạo cuối cùng của nó. Vì vậy, “1/1” không được dùng theo nghĩa một phiên bản factory-exclusive được New Balance phát hành, mà theo nghĩa rất cụ thể: trong collection này chỉ tồn tại một đôi được custom theo đúng cách đó, với chính quá trình cá nhân hóa trở thành một phần không thể tách rời khỏi lịch sử hiện vật.</p>
      `,
      en: `
        <p>The New Balance 2002R is particularly well suited to customization because its design is already highly layered. The modern version draws from the early-2010s 2002 line, combining mesh, suede and the complex paneling of a technical runner with tooling that incorporates ABZORB, N-ergy and Stability Web. The result is a shoe with enough structural depth to create dimension while still providing many separate surfaces for a customizer to intervene.</p>
        <p>On the pair in this collection, that structure becomes the canvas for a personal 1/1 project. Areas of <b>black, white, red and grey</b> are not treated through conventional industrial color blocking, but spread across multiple panels through splatter and gestural mark-making. The approach is inspired by the action-painting language associated with Jackson Pollock: instead of pursuing perfect boundaries, the energy of movement, droplets and controlled chance becomes part of the final image.</p>
        <p>An important part of the story is that this is <b>not an official collaboration between New Balance and Jackson Pollock</b>, nor is it a product licensed by the Pollock-Krasner Foundation. It is a personal custom developed by the owner from an artistic point of reference. That distinction keeps the provenance clear: its value does not come from a commercial partnership, but from its status as a personal and unique object.</p>
        <p>In a collection containing many sneakers that are important because of brand history, sample status or distribution, this 2002R represents a different kind of value: <b>ownership as authorship</b>. The collector does not merely purchase and preserve a finished object; here, the owner participates directly in creating its final appearance. “1/1” therefore does not mean a factory-exclusive edition released by New Balance. It has a very specific meaning: within this collection, only one pair exists customized in exactly this way, and the process of personalization itself becomes inseparable from the history of the artifact.</p>
      `
    },

    defender: {
      vi: `
        <p>Dưới thời Demna, Balenciaga nhiều lần đặt câu hỏi về tỷ lệ: một vật thể quen thuộc sẽ trở nên thế nào nếu được phóng đại đến mức gần như phi lý? Defender là một trong những ví dụ rõ nhất của tư duy đó trong footwear. Thay vì cố gắng làm sneaker gọn, nhẹ hoặc khí động học, thiết kế cố tình xây một phần đế khổng lồ với tread sâu bao quanh toàn bộ đáy giày, tạo cảm giác gần với một chiếc lốp xe hơn là outsole sneaker truyền thống.</p>
        <p>Balenciaga giới thiệu Defender trong bối cảnh Spring 2022, mô tả nó như một <b>super-chunky sneaker với extreme tire tread</b>. Điều này đặt Defender vào cùng hệ tư duy với những silhouette oversized khác của nhà mốt, nhưng hình dạng tròn, phần sole kéo rộng và texture dày khiến nó vẫn có nhận diện riêng. Một số phiên bản còn được hoàn thiện với hiệu ứng pre-worn hoặc distressed có chủ đích, phù hợp với cách Balenciaga thường làm mờ ranh giới giữa vật thể xa xỉ và những dấu hiệu thông thường của hao mòn.</p>
        <p>Màu Beige làm cách tiếp cận này thậm chí rõ hơn. Khi không có những mảng màu tương phản mạnh để thu hút mắt, silhouette và texture trở thành nội dung chính. Upper có vẻ tương đối kiềm chế khi so với outsole, tạo ra một tỷ lệ gần như cố ý mất cân bằng. Đôi giày vì vậy không đẹp theo tiêu chuẩn sneaker cổ điển; nó được thiết kế để khiến người xem phải nhận thức lại chính khái niệm tỷ lệ và công năng.</p>
        <p>Trong collection, Defender mở rộng archive ra khỏi sportswear và streetwear truyền thống để đi vào <b>luxury fashion footwear</b>. Đặt nó cạnh Jordan 4 hay Speedcat sẽ thấy ba triết lý hoàn toàn khác nhau: một đôi được xây quanh basketball performance, một đôi bắt nguồn từ motorsport và một đôi cố ý sử dụng sự phóng đại như tuyên ngôn thời trang. Sự khác biệt đó là lý do Defender có vị trí trong collection — nó ghi lại giai đoạn mà sneaker đã trở thành một medium để các fashion house tranh luận về hình dạng, taste và thậm chí cả định nghĩa của “đẹp”.</p>
      `,
      en: `
        <p>Under Demna, Balenciaga repeatedly questioned proportion: what happens when a familiar object is enlarged to the point of near absurdity? The Defender is one of the clearest examples of that thinking in footwear. Rather than attempting to make a sneaker compact, light or aerodynamic, the design deliberately builds an enormous sole with deep tread wrapping across the bottom of the shoe, creating an impression closer to a tire than to a conventional sneaker outsole.</p>
        <p>Balenciaga introduced the Defender in the Spring 2022 context, describing it as a <b>super-chunky sneaker with extreme tire tread</b>. This places the Defender within the same conceptual system as the house’s other oversized silhouettes, yet its rounded form, extended sole and heavy texture give it an identity of its own. Certain versions are also finished with intentionally pre-worn or distressed effects, consistent with Balenciaga’s tendency to blur the boundary between luxury objects and ordinary signs of wear.</p>
        <p>The Beige color makes that approach even clearer. Without strong contrasting color blocks pulling attention away, silhouette and texture become the primary content. The upper appears relatively restrained beside the outsole, creating a proportion that feels intentionally unbalanced. The shoe is therefore not designed to be beautiful according to classical sneaker standards; it is designed to force the viewer to reconsider the ideas of proportion and utility themselves.</p>
        <p>Within the collection, the Defender expands the archive beyond traditional sportswear and streetwear into <b>luxury fashion footwear</b>. Placed beside a Jordan 4 or a Speedcat, three completely different design philosophies become visible: one built around basketball performance, one originating in motorsport, and one deliberately using exaggeration as a fashion statement. That difference is why the Defender belongs in the collection — it records a period in which the sneaker became a medium through which fashion houses could debate shape, taste and even the definition of “beauty.”</p>
      `
    },

    reverseBred: {
      vi: `
        <p>“Bred” là một trong những tổ hợp màu gần như đồng nghĩa với Air Jordan. Black và red không chỉ gợi lại chiếc Air Jordan 1 đầu tiên mà còn gắn với toàn bộ mythology đã được xây dựng quanh Michael Jordan, Nike và sự ra đời của Jordan Brand. Chính vì bảng màu đó quá quen thuộc, việc đảo ngược tỷ lệ màu có thể tạo ra một đôi giày vừa dễ nhận ra vừa đủ khác biệt.</p>
        <p>Jordan 1 Low “Reverse Bred” thực hiện chính thao tác đó. Thay vì tái tạo một bố cục OG theo cách trực tiếp, đôi giày sử dụng black làm phần nền cho toe box và mid-panel rồi đưa Gym Red lên các overlay và Swoosh. White midsole tách hai lớp màu tối–đỏ khỏi outsole, giúp toàn bộ thiết kế không bị chìm trong một khối màu duy nhất. Các nguồn catalog thường mô tả pair này như một cách sắp xếp lại motif Bred trên form Jordan 1 Low.</p>
        <p>Điểm thú vị của Reverse Bred nằm ở việc nó cho thấy một colorway có thể trở thành <b>ngôn ngữ</b>, không còn là một công thức cố định. Một khi black/red đã đủ gắn với Jordan, thương hiệu có thể hoán đổi vị trí của chúng mà người xem vẫn nhận ra ngay nguồn gốc tham chiếu. Điều đó khác với việc tạo ra một phối màu hoàn toàn mới: Reverse Bred hoạt động dựa trên ký ức của người nhìn về những Jordan đã xuất hiện trước nó.</p>
        <p>Trong collection, đôi này đóng vai trò như một entry gần với everyday sneaker hơn nhiều PE hay sample hiếm. Nhưng chính sự bình thường tương đối đó lại hữu ích cho archive. Một bộ sưu tập không chỉ cần những cực điểm của rarity; nó cũng cần những đôi cho thấy <b>DNA của Jordan được chuyển hóa thành sản phẩm đời thường như thế nào</b>. Reverse Bred là ví dụ rõ ràng: lịch sử từ Jordan 1 High được nén xuống một Low dễ sử dụng hơn, trong khi màu sắc tiếp tục giữ mối liên hệ với một trong những chapter quan trọng nhất của thương hiệu.</p>
      `,
      en: `
        <p>“Bred” is one of the color combinations most closely associated with Air Jordan. Black and red do more than recall the earliest Air Jordan 1s; they are tied to the mythology built around Michael Jordan, Nike and the emergence of Jordan Brand. Because the palette is so familiar, reversing the proportion and placement of those colors can create a shoe that remains immediately recognizable while still feeling different.</p>
        <p>The Jordan 1 Low “Reverse Bred” performs exactly that operation. Rather than directly reproducing an OG arrangement, the shoe uses black as the base across the toe box and mid-panel, then moves Gym Red onto the overlays and Swoosh. A white midsole separates the dark-and-red upper from the outsole, preventing the design from collapsing into a single uninterrupted block of color. Catalog references commonly describe the pair as a rearrangement of the Bred motif on the Jordan 1 Low form.</p>
        <p>The most interesting quality of Reverse Bred is the way it demonstrates that a colorway can become a <b>language</b> rather than a fixed formula. Once black and red became strongly enough associated with Jordan, the brand could exchange their positions and the viewer would still immediately recognize the reference. That differs from creating an entirely new palette: Reverse Bred works through the viewer’s memory of Jordan shoes that came before it.</p>
        <p>Within the collection, this pair operates as a more everyday entry than a rare PE or sample. That relative normality is precisely what makes it useful in an archive. A collection does not need only the extreme points of rarity; it also needs shoes that show <b>how Jordan DNA is translated into everyday product</b>. Reverse Bred is a clear example: the history of the Jordan 1 High is compressed into a more wearable Low, while the color language remains connected to one of the most important chapters of the brand.</p>
      `
    },

    vans: {
      vi: `
        <p>Knu Skool nhìn như một sản phẩm hoàn toàn phù hợp với xu hướng chunky skate shoes hiện nay, nhưng thiết kế của nó thực ra bắt nguồn từ cuối thập niên 1990. Vans phát triển silhouette này trong thời kỳ skate footwear trở nên dày hơn, mềm hơn và phóng đại hơn: tongue được padding mạnh, collar lớn, lace dày và branding có nhiều chiều sâu hơn. Theo tư liệu từ Vans và các nguồn lịch sử sneaker, Knu Skool xuất hiện lần đầu vào năm 1998 trước khi được đưa trở lại nhiều năm sau.</p>
        <p>So với Old Skool cổ điển, Knu Skool gần giống một bản remix của chính DNA Vans. 3D Sidestripe dày hơn thay cho đường stripe phẳng quen thuộc; tongue và collar được puff lên; hệ dây trở thành một thành phần thị giác lớn thay vì chỉ là chi tiết chức năng. Trong Black/True White, tương phản đơn giản giúp tỷ lệ của các bộ phận này hiện ra đặc biệt rõ: upper đen tạo nền để Sidestripe trắng và sole trở thành bộ khung của toàn silhouette.</p>
        <p>Đôi thuộc collection tiếp tục được cá nhân hóa bằng <b>rope lace modification</b>. Đây không phải cấu hình xuất xưởng của Vans và cũng không phải một collaboration riêng; phần dây được thay đổi bởi người sở hữu để đẩy cảm giác chunky của Knu Skool xa hơn. Rope lace làm phần vamp và tongue nặng về thị giác hơn, đồng thời khiến một colorway vốn rất quen thuộc trở thành một object mang dấu ấn cá nhân.</p>
        <p>Cũng giống chiếc New Balance custom trong collection, giá trị của đôi Knu Skool này đến một phần từ lịch sử sau khi rời nhà máy. Sneaker culture luôn có một nhánh gắn với việc người mang thay dây, vẽ, cắt, distress hoặc sửa một sản phẩm để biến nó thành của mình. Knu Skool ghi lại phần văn hóa đó ở mức nhẹ nhưng rõ ràng: <b>một đôi mass-produced được cá nhân hóa qua cách sử dụng</b>, thay vì được bảo tồn trong trạng thái factory-original tuyệt đối.</p>
      `,
      en: `
        <p>The Knu Skool looks perfectly aligned with today’s chunky skate-shoe trend, yet its design actually originates in the late 1990s. Vans developed the silhouette during a period when skate footwear became thicker, softer and more exaggerated: tongues gained heavy padding, collars became larger, laces became thicker and branding gained more dimensionality. According to Vans documentation and sneaker-history references, the Knu Skool first appeared in 1998 before returning many years later.</p>
        <p>Compared with the classic Old Skool, the Knu Skool feels almost like a remix of Vans DNA. A thicker three-dimensional Sidestripe replaces the familiar flat stripe; the tongue and collar are puffed up; and the lacing system becomes a major visual component rather than only a functional detail. In Black/True White, the simple contrast makes those proportions especially easy to read: the black upper becomes a ground against which the white Sidestripe and sole form the visual framework of the silhouette.</p>
        <p>The pair in the collection is further personalized through a <b>rope lace modification</b>. This is not the factory configuration from Vans and is not a separate official collaboration; the laces were changed by the owner to push the chunky character of the Knu Skool further. Rope laces add visual weight to the vamp and tongue while turning an otherwise familiar colorway into an object carrying a personal mark.</p>
        <p>Like the customized New Balance elsewhere in the collection, part of the value of this Knu Skool comes from its history after leaving the factory. Sneaker culture has always included a branch in which wearers replace laces, paint, cut, distress or otherwise modify a product to make it their own. The Knu Skool records that culture in a subtle but unmistakable way: <b>a mass-produced shoe personalized through use</b>, rather than preserved in an absolutely factory-original state.</p>
      `
    },

    jordan13: {
      vi: `
        <p>Air Jordan 13 gắn với giai đoạn cuối cùng của triều đại Chicago Bulls trong thập niên 1990. Thiết kế của Tinker Hatfield lấy cảm hứng từ hình ảnh một con báo đen — cách Michael Jordan được liên tưởng đến sự nhanh nhẹn và cách di chuyển trên sân — thể hiện qua outsole có cấu trúc như bàn chân động vật và hologram ở khu vực heel. Trong lịch sử Jordan signature line, AJ13 vì vậy luôn mang một cảm giác khác: thấp hơn về thị giác, hữu cơ hơn trong hình dạng và có mối liên kết rất cụ thể với mùa giải cuối cùng trước khi Jordan rời Bulls lần thứ hai.</p>
        <p>DMP “Finals Pack” khai thác chính chương lịch sử đó bằng cách ghép Air Jordan 13 và Air Jordan 14, hai silhouette gắn với hành trình của Jordan trong NBA Finals 1998. Trên AJ13, white và metallic gold biến câu chuyện championship thành ngôn ngữ vật liệu. Gold liên hệ trực tiếp đến Larry O’Brien Trophy, trong khi hologram được thay đổi để đưa “98” và imagery kỷ niệm vào một chi tiết vốn đã là đặc trưng của silhouette.</p>
        <p>Cách kể chuyện của pack còn đi sâu vào những chi tiết nhỏ. Các dòng chữ ẩn ở phía trong tongue — “They Can’t Win” và “Until We Quit” — biến đôi giày thành một vật thể có narrative chỉ được hoàn chỉnh khi người sở hữu quan sát bên trong. Đây là kiểu storytelling mà Jordan Brand thường sử dụng hiệu quả ở các sản phẩm kỷ niệm: thay vì in toàn bộ câu chuyện lên bề mặt, hãng để một phần lịch sử được khám phá dần qua từng chi tiết.</p>
        <p>Trong collection, AJ13 DMP đóng vai trò quan trọng vì nó mở câu chuyện Jordan ra ngoài Air Jordan 1 và 4. Nếu Jordan 1 đại diện cho khởi đầu của signature line và Jordan 4 gắn với giai đoạn Jordan bắt đầu trở thành biểu tượng toàn cầu, Jordan 13 nằm gần đoạn kết của Bulls dynasty. DMP Finals Pack nhìn lại khoảnh khắc đó từ nhiều năm sau, biến championship history thành một commemorative object. Vì thế, đôi này không chỉ được lưu giữ vì màu trắng–vàng nổi bật; nó đại diện cho cách Jordan Brand <b>đóng gói ký ức thể thao thành thiết kế</b>, để một trận đấu và một mùa giải có thể tiếp tục tồn tại dưới hình thức một đôi sneaker.</p>
      `,
      en: `
        <p>The Air Jordan 13 is tied to the closing stage of the Chicago Bulls dynasty in the 1990s. Tinker Hatfield’s design drew inspiration from the image of a black panther — a comparison connected to Michael Jordan’s agility and movement on the court — expressed through an outsole shaped with paw-like geometry and the hologram at the heel. Within the Jordan signature line, the AJ13 therefore has a distinct character: visually lower, more organic in form and closely connected to the final season before Jordan left the Bulls for the second time.</p>
        <p>The DMP “Finals Pack” draws directly from that historical chapter by pairing the Air Jordan 13 and Air Jordan 14, two silhouettes associated with Jordan’s journey through the 1998 NBA Finals. On the AJ13, white and metallic gold translate the championship story into material language. Gold connects directly to the Larry O’Brien Trophy, while the hologram is altered to incorporate “98” and commemorative imagery into a detail that was already a defining feature of the silhouette.</p>
        <p>The pack’s storytelling extends into smaller details. Hidden wording inside the tongues — “They Can’t Win” and “Until We Quit” — turns the shoe into an object whose narrative is completed only when the owner looks inside it. This is a form of storytelling Jordan Brand often uses effectively on commemorative products: rather than printing the entire story across the surface, the brand allows part of the history to be discovered gradually through individual details.</p>
        <p>Within the collection, the AJ13 DMP plays an important role because it expands the Jordan story beyond Air Jordan 1 and 4. If the Jordan 1 represents the beginning of the signature line and the Jordan 4 belongs to the period when Jordan was becoming a global icon, the Jordan 13 sits close to the end of the Bulls dynasty. The DMP Finals Pack looks back on that moment years later and turns championship history into a commemorative object. The pair is therefore preserved for more than its striking white-and-gold appearance; it represents the way Jordan Brand <b>translates sporting memory into design</b>, allowing a game and a season to continue existing in the form of a sneaker.</p>
      `
    }
  };

  const STORY_RULES = [
    {
      key: "bloodline",
      match: t =>
        t.includes("black bloodline")
    },
    {
      key: "quai54",
      match: t =>
        t.includes("quai 54") ||
        t.includes("quai54")
    },
    {
      key: "yuto",
      match: t =>
        t.includes("yuto") &&
        t.includes("matcha")
    },
    {
      key: "alaska",
      match: t =>
        t.includes("virgil") &&
        t.includes("alaska")
    },
    {
      key: "fragmentUnion",
      match: t =>
        t.includes("fragment") &&
        t.includes("union") &&
        t.includes("sport royal")
    },
    {
      key: "shadow",
      match: t =>
        t.includes("shadow") &&
        t.includes("2009")
    },
    {
      key: "bapeStussy",
      match: t =>
        t.includes("bape") &&
        t.includes("stussy")
    },
    {
      key: "waffle",
      match: t =>
        t.includes("waffle racer") &&
        (
          t.includes("off-white") ||
          t.includes("off white")
        )
    },
    {
      key: "puma",
      match: t =>
        t.includes("puma") &&
        t.includes("rose") &&
        t.includes("speedcat")
    },
    {
      key: "jordan4",
      match: t =>
        t.includes("jordan 4") &&
        t.includes("black cement") &&
        t.includes("1999")
    },
    {
      key: "newBalance",
      match: t =>
        t.includes("new balance 2002r")
    },
    {
      key: "defender",
      match: t =>
        t.includes("balenciaga") &&
        t.includes("defender")
    },
    {
      key: "reverseBred",
      match: t =>
        t.includes("jordan 1 low") &&
        t.includes("reverse bred")
    },
    {
      key: "vans",
      match: t =>
        t.includes("vans") &&
        t.includes("knu skool")
    },
    {
      key: "jordan13",
      match: t =>
        t.includes("jordan 13") &&
        t.includes("dmp")
    }
  ];

  let lockedCount = 0;

  sneakers.forEach(sneaker => {
    if (normalize(sneaker?.collectionStatus) !== "own") {
      return;
    }

    const t = titleText(sneaker);
    const rule = STORY_RULES.find(item => item.match(t));

    if (rule) {
      sneaker.story = LOCKED_STORIES[rule.key];
      lockedCount += 1;
    }

    if (
      t.includes("quai 54") ||
      t.includes("quai54")
    ) {
      sneaker.images = [
        sneaker.image,
        "pictures/jordan1_quai54_ff_v2_1.png",
        "pictures/jordan1_quai54_1.png",
        "pictures/jordan1_quai54.png",
        "pictures/jordan1_quai54_ff_1.png"
      ].filter(Boolean);
    }

    if (
      t.includes("yuto") &&
      t.includes("matcha")
    ) {
      sneaker.images = [
        sneaker.image,
        "pictures/sbdunk_yutohorigome_matcha_1.png",
        "pictures/jordan1_yuto_matcha_1.png",
        "pictures/jordan1_yuto_matcha.png",
        "pictures/yuto_matcha_1.png"
      ].filter(Boolean);
    }
  });

  if (lockedCount !== 15) {
    console.warn(
      `[Lộc An] Expected to lock 15 OWN stories, but locked ${lockedCount}.`
    );
  }

  window.LOCAN_CONTENT_LOCK_VERSION =
    "2026-09-17-15owned-stories-canonical";
})();
