/* =========================================================
   LỘC AN SNEAKER COLLECTION
   CONTENT LOCK — 16 OWNED PAIRS — 2026-09-17

   IMPORTANT:
   This file MUST load AFTER data.js and BEFORE main.js.
   It preserves existing metadata for the original 15 pairs,
   locks the long-form VI/EN stories, adds Raygun as pair #16,
   and provides multi-image galleries for Quai 54 + Yuto.
========================================================= */

(() => {
  "use strict";

  if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) {
    console.error("[Lộc An] data.js must load before collection-content-final.js");
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
        <p>Jordan 1 Retro High OG 'Black Bloodline' PE Sample xuất phát từ cùng hệ ngôn ngữ thiết kế với Bloodline năm 2019 nhưng đi theo một hướng hiếm hơn nhiều so với bản phát hành thương mại. Bloodline vốn dùng các đường piping đỏ để nhấn mạnh cấu trúc panel của Air Jordan 1; ở Black Bloodline, nền đen chiếm phần lớn upper khiến những đường đỏ đó trở thành bộ khung thị giác của toàn bộ đôi giày. Kết quả là một Jordan 1 trông tối, sắc và mang cảm giác prototype rõ hơn so với phối màu trắng–đen–đỏ quen thuộc.</p>
        <p>Điểm đáng chú ý nhất của thiết kế là cách màu sắc không chỉ được dùng để trang trí mà để “vẽ” lại cấu trúc của silhouette. Gym Red chạy quanh Swoosh, mép panel và các đường cắt làm nổi bật từng mảng da, trong khi midsole trắng tách phần upper khỏi outsole đỏ. Ở khoảng cách gần, hiệu ứng này khiến người xem chú ý tới kỹ thuật dựng form, đường may và cách các panel chồng lên nhau—những yếu tố vốn dễ bị bỏ qua trên một Jordan 1 màu đơn giản hơn.</p>
        <p>Bản PE đặt đôi giày vào một bối cảnh khác với retail. Player Exclusive và Friends & Family thường tồn tại bên ngoài hệ thống phát hành đại trà, được tạo cho vận động viên, đối tác hoặc mạng lưới nội bộ của thương hiệu. Với loại hiện vật này, giá trị lưu trữ không nằm ở việc so sánh giá thị trường mà nằm ở provenance: đôi giày đến từ đâu, thuộc giai đoạn phát triển nào và mang những dấu hiệu nào cho thấy nó không phải một bản retail thông thường.</p>
        <p>Hiện vật trong bộ sưu tập còn mang trạng thái Sample, vì vậy nó đặc biệt hữu ích khi nhìn Jordan 1 như một sản phẩm được phát triển qua nhiều vòng thử nghiệm. Sample có thể tồn tại để kiểm tra vật liệu, finishing, màu sắc, cấu trúc hoặc khả năng sản xuất trước khi một cấu hình cuối cùng được chốt. Chính vì thế, những khác biệt nhỏ trên tem, vật liệu hoặc cách hoàn thiện có thể quan trọng không kém phối màu tổng thể.</p>
        <p>Trong Lộc An Sneaker Collection, Black Bloodline được lưu như một tài liệu về mặt “hậu trường” của Jordan Brand: một silhouette cực kỳ quen thuộc nhưng ở một trạng thái ít người có cơ hội tiếp cận. Câu chuyện của đôi giày vì vậy không chỉ là Black Bloodline trông như thế nào, mà còn là cách một Jordan 1 có thể tồn tại bên ngoài retail—dưới dạng PE, Sample và hiện vật phát triển sản phẩm.</p>
      `,
      en: `
        <p>The Jordan 1 Retro High OG 'Black Bloodline' PE Sample grows out of the same visual language as the 2019 Bloodline, but occupies a much rarer space than the commercial release. Bloodline used red piping to emphasize the panel architecture of the Air Jordan 1; Black Bloodline pushes that idea further by allowing black to dominate the upper, turning the red piping into a visible framework around the entire shoe. The result feels darker, sharper and more prototype-like than the familiar white, black and red retail configuration.</p>
        <p>What makes the design interesting is that color is used structurally rather than simply decoratively. Gym Red traces the Swoosh, panel edges and cut lines, while the white midsole separates the upper from the red outsole. Up close, the treatment directs attention toward the construction of the Jordan 1 itself—its stitching, layered panels and proportions—details that can disappear visually on a more conventional color blocking scheme.</p>
        <p>The PE context places the object outside ordinary retail culture. Player Exclusive and Friends & Family footwear is generally created for athletes, partners or people within a brand network rather than distributed through the normal commercial channel. For an artifact like this, archival value depends less on market comparison and more on provenance: where the pair came from, what stage of the product process it represents and which details distinguish it from a standard retail shoe.</p>
        <p>This example also carries Sample provenance, which makes it especially useful as a record of product development. Samples can be produced to evaluate materials, finishing, color execution, construction or manufacturability before a final configuration is established. Small differences in labeling, materials or assembly can therefore be as meaningful as the overall colorway when the object is studied as an archive piece.</p>
        <p>Within the Lộc An Sneaker Collection, Black Bloodline is preserved as a document of the less visible side of Jordan Brand: an extremely familiar silhouette encountered in a form that sits outside normal retail. Its story is therefore not only about how Black Bloodline looks, but about how a Jordan 1 can exist as PE, Sample and evidence of the development process.</p>
      `
    },
    quai54: {
      vi: `
        <p>Jordan 1 Retro High OG 'Quai 54' F&F gắn trực tiếp với Quai 54, giải streetball tại Paris đã trở thành một trong những điểm giao quan trọng giữa Jordan Brand, bóng rổ đường phố, âm nhạc và văn hóa sneaker châu Âu. Qua nhiều năm, Quai 54 không chỉ là một giải đấu; nó còn là một sân khấu văn hóa, nơi Jordan Brand có thể xây dựng những sản phẩm có bản sắc riêng, tách khỏi các phối màu Jordan chỉ dựa trên lịch sử NBA của Michael Jordan.</p>
        <p>Bản Friends & Family này dễ nhận diện nhờ cách xử lý split-color bất đối xứng. Italy Blue và University Red được đặt ở hai phía khác nhau của đôi giày, trong khi black đóng vai trò nền trung tính nối hai nửa thiết kế lại với nhau. Trên một silhouette có cấu trúc đối xứng như Air Jordan 1, việc cố tình phá đối xứng tạo ra hiệu ứng rất mạnh: mỗi góc nhìn gần như cho cảm giác đang nhìn một phối màu khác.</p>
        <p>Các dấu hiệu Quai 54 trên tongue và nội thất làm rõ nguồn gốc sự kiện thay vì biến đôi giày thành một Jordan 1 chỉ có màu lạ. Điều này quan trọng vì các sản phẩm Quai 54 thường được đọc như vật lưu niệm của một cộng đồng và một địa điểm cụ thể. Paris, streetball và Jordan Brand cùng tồn tại trong thiết kế, khiến đôi giày có ý nghĩa văn hóa rộng hơn một release thông thường.</p>
        <p>Yếu tố F&F thay đổi hoàn toàn cách hiện vật nên được hiểu. Đây không phải sản phẩm được tạo ra chủ yếu để đáp ứng nhu cầu retail, mà là một phiên bản gắn với mạng lưới của sự kiện và thương hiệu. Vì vậy, provenance trở thành phần cốt lõi của câu chuyện: tính hiếm không chỉ đến từ số lượng ít mà còn từ việc đối tượng phân phối ban đầu vốn đã rất giới hạn.</p>
        <p>Trong Lộc An Sneaker Collection, đôi Quai 54 này được giữ như một hiện vật về cách Jordan Brand sử dụng Air Jordan 1 để kết nối bóng rổ với văn hóa địa phương. Split-color tạo sức hút thị giác, nhưng phần quan trọng hơn nằm ở bối cảnh: đây là một Jordan 1 đại diện cho Paris streetball và cho lớp sản phẩm Friends & Family vốn thường chỉ tồn tại bên lề thị trường đại chúng.</p>
      `,
      en: `
        <p>The Jordan 1 Retro High OG 'Quai 54' F&F is inseparable from Quai 54, the Paris streetball tournament that became an important meeting point for Jordan Brand, street basketball, music and European sneaker culture. Over time, Quai 54 grew beyond the competition itself and became a cultural platform where Jordan Brand could create product with a distinct identity rather than relying only on stories drawn from Michael Jordan's NBA career.</p>
        <p>The Friends & Family edition is immediately recognizable through its asymmetric split-color treatment. Italy Blue and University Red occupy different sides of the pair, while black acts as the neutral structure connecting both halves. On a silhouette as fundamentally symmetrical as the Air Jordan 1, deliberately breaking that symmetry creates a powerful effect: the shoe can appear to be a different colorway depending on the viewing angle.</p>
        <p>Quai 54 branding on the tongue and interior establishes the event connection clearly instead of leaving the design as simply an unusual Jordan 1 palette. That matters because Quai 54 footwear is often understood as a cultural artifact tied to a specific community and place. Paris, streetball and Jordan Brand coexist within the object, giving it a context wider than an ordinary seasonal release.</p>
        <p>The F&F designation changes how the artifact should be read. It was not created primarily for standard retail demand, but for a restricted network around the event and brand. Provenance therefore becomes central to the story: rarity comes not only from low availability, but from the fact that the original distribution audience was intentionally narrow.</p>
        <p>Within the Lộc An Sneaker Collection, this Quai 54 pair is preserved as evidence of the way Jordan Brand uses the Air Jordan 1 to connect basketball history with local culture. The split-color execution gives the shoe its immediate visual impact, but the deeper significance lies in its relationship to Paris streetball and to the Friends & Family layer of sneaker culture that usually sits outside mass retail.</p>
      `
    },
    yuto: {
      vi: `
        <p>Nike SB Dunk Low Yuto Horigome 'Matcha' tiếp nối mối quan hệ giữa Nike SB và Yuto Horigome sau lần hợp tác đầu tiên của anh. Yuto là một trong những gương mặt có ảnh hưởng lớn của skateboarding đương đại, và cách Nike SB xây dựng signature collaboration cho anh cho thấy vị trí của skateboarding Nhật Bản trong bức tranh toàn cầu đã thay đổi mạnh như thế nào. 'Matcha' vì vậy không chỉ là một màu mới của Dunk Low mà là phần tiếp theo của một ngôn ngữ cá nhân.</p>
        <p>Bảng màu sử dụng nhiều lớp xanh đất—Asparagus, Legion Green, Dark Loden—đi cùng Light Khaki, Sesame và Burnt Sienna. Các sắc độ gần nhau tạo chiều sâu thay vì dùng tương phản gắt. Cách xử lý này phù hợp với tên Matcha: cảm giác tự nhiên, trầm và có liên hệ rõ với thẩm mỹ Nhật Bản, nhưng không biến đôi giày thành một thiết kế minh họa quá trực tiếp.</p>
        <p>Vật liệu suede và leather giúp các vùng màu thay đổi theo ánh sáng, đặc biệt khi nhìn ở nhiều góc. Đây là điểm quan trọng trên SB Dunk vì silhouette vốn có nhiều panel; khi các panel sử dụng những sắc gần nhau, người xem vẫn nhận ra cấu trúc nhờ texture và hướng lông suede. Logo lông vũ gắn với Yuto hoạt động như chữ ký thị giác, phân biệt collaboration này với một GR Dunk thông thường.</p>
        <p>Điểm provenance quan trọng nhất của hiện vật trong bộ sưu tập là chữ ký trực tiếp của Yuto Horigome. Với một đôi signature shoe, chữ ký của chính vận động viên tạo ra mối liên hệ giữa vật thể thương mại và người đứng sau câu chuyện thiết kế. Nó biến hiện vật từ một release có thể tìm thấy trên thị trường thành một tài liệu cá nhân hóa có liên hệ trực tiếp với Yuto.</p>
        <p>Trong Lộc An Sneaker Collection, 'Matcha' được lưu như một ví dụ về giai đoạn Nike SB tiếp tục mở rộng ngôn ngữ Dunk thông qua vận động viên chứ không chỉ thông qua brand collaboration. Câu chuyện của đôi giày nằm ở sự giao nhau giữa hiệu năng skate, thẩm mỹ Nhật Bản, signature identity của Yuto và provenance của chính hiện vật được ký.</p>
      `,
      en: `
        <p>The Nike SB Dunk Low Yuto Horigome 'Matcha' continues the relationship between Nike SB and Yuto Horigome after his first collaboration. Yuto is one of the defining figures of contemporary skateboarding, and Nike SB's decision to build an ongoing signature collaboration around him reflects the increasingly global importance of Japanese skate culture. Matcha is therefore more than another Dunk Low colorway; it is a continuation of a personal design language.</p>
        <p>The palette layers earthy greens—Asparagus, Legion Green and Dark Loden—with Light Khaki, Sesame and Burnt Sienna. Rather than relying on aggressive contrast, the design builds depth through closely related tones. That approach supports the Matcha name: natural, subdued and clearly connected to Japanese visual references without turning the shoe into a literal illustration.</p>
        <p>Suede and leather allow the color fields to shift subtly with light, which is especially effective on the heavily paneled SB Dunk. When neighboring panels use similar tones, texture and nap direction become part of the visual structure. Yuto's feather emblem functions as the identifying signature element, separating the collaboration from a standard general-release Dunk.</p>
        <p>The most important provenance detail of the artifact in this collection is Yuto Horigome's direct signature. On a signature shoe, the athlete's autograph creates a direct connection between the commercial object and the person at the center of its story. It transforms the pair from a release that can circulate on the market into a personalized document connected to Yuto himself.</p>
        <p>Within the Lộc An Sneaker Collection, Matcha is preserved as an example of a period in which Nike SB continued expanding the Dunk through athlete-led identity rather than only brand collaborations. Its story sits at the intersection of skate performance, Japanese aesthetics, Yuto's signature language and the specific provenance of the signed artifact.</p>
      `
    },
    alaska: {
      vi: `
        <p>Jordan 1 Retro High OG x Virgil Abloh Archive 'Alaska' tiếp tục cuộc đối thoại mà Virgil Abloh từng mở ra với Air Jordan 1: thay vì xem silhouette như một biểu tượng bất biến, thiết kế bóc tách nó thành những lớp cấu tạo, nhãn, đường may và dấu vết sản xuất. Cách tiếp cận đó từng khiến người xem phải nhìn lại một đôi giày vốn đã quá quen thuộc, và Alaska giữ tinh thần ấy trong một bảng màu gần như đơn sắc.</p>
        <p>White/White-Metallic Silver làm giảm vai trò của color blocking để đẩy vật liệu và cấu trúc lên trước. Khi hầu hết upper nằm trong cùng một phổ màu trắng, những mảng mesh, da, stitching, cạnh panel và các bộ phận cố ý để lộ trở thành yếu tố tạo tương phản. Đây là kiểu thiết kế trong đó khoảng cách giữa 'hoàn thiện' và 'chưa hoàn thiện' được cố ý làm mờ.</p>
        <p>Dấu ấn Virgil Abloh Archive đặt đôi giày vào bối cảnh di sản sau thời kỳ Off-White ban đầu. Typography và cách xử lý graphic tiếp tục tinh thần biến sneaker thành một vật thể gần với tài liệu thiết kế: chữ, mã, nhãn và dấu hiệu kỹ thuật không bị giấu đi mà được đưa lên bề mặt như một phần của thẩm mỹ. Tên Alaska đồng thời phù hợp với cảm giác lạnh, sáng và tối giản của phối màu.</p>
        <p>Air Jordan 1 là một lựa chọn đặc biệt phù hợp cho cách làm này vì cấu trúc của nó đã trở thành ký ức thị giác chung của sneaker culture. Khi một chi tiết bị dịch chuyển, để lộ hoặc phóng đại, người xem nhận ra ngay sự sai lệch. Chính sự quen thuộc của Jordan 1 cho phép ngôn ngữ deconstruction hoạt động mạnh hơn: thiết kế mới dựa trên việc người xem đã biết bản gốc trông ra sao.</p>
        <p>Trong bộ sưu tập, Alaska được lưu như một hiện vật về di sản thiết kế của Virgil Abloh hơn là chỉ một Jordan 1 trắng. Nó ghi lại cách những ý tưởng deconstruction, typography và 'process as design' tiếp tục được đọc sau thời kỳ The Ten, đồng thời cho thấy Air Jordan 1 vẫn là một bề mặt có khả năng chứa thêm những lớp diễn giải mới.</p>
      `,
      en: `
        <p>The Jordan 1 Retro High OG x Virgil Abloh Archive 'Alaska' continues the conversation Virgil Abloh opened around the Air Jordan 1: rather than treating the silhouette as an untouchable icon, the design breaks it into layers of construction, labels, stitching and visible production logic. That approach originally forced viewers to reconsider a shoe they already knew extremely well, and Alaska carries the same idea through an almost monochromatic palette.</p>
        <p>White/White-Metallic Silver reduces the role of conventional color blocking and pushes material and construction to the foreground. With most of the upper living within the same white spectrum, mesh, leather, stitching, panel edges and intentionally exposed components become the sources of contrast. It is a design in which the boundary between 'finished' and 'unfinished' is deliberately blurred.</p>
        <p>Virgil Abloh Archive branding places the shoe in a legacy context beyond the original Off-White period. Typography and graphic treatment continue the idea of turning a sneaker into something close to a design document: text, codes, labels and technical cues are not hidden but presented as part of the aesthetic. The Alaska name also suits the cold, bright and restrained character of the palette.</p>
        <p>The Air Jordan 1 is particularly effective for this strategy because its construction has become part of sneaker culture's shared visual memory. When a component is shifted, exposed or exaggerated, the change is instantly legible. The familiarity of the Jordan 1 allows deconstruction to communicate more strongly because the viewer already carries an image of the original in mind.</p>
        <p>Within the collection, Alaska is preserved as an artifact of Virgil Abloh's design legacy rather than simply a white Jordan 1. It records the continued relevance of deconstruction, typography and 'process as design' after The Ten era, while showing that the Air Jordan 1 remains capable of supporting new layers of interpretation.</p>
      `
    },
    fragmentUnion: {
      vi: `
        <p>Jordan 1 Retro High OG x Fragment x Union LA 'Varsity Red/Sport Royal' Sample đặt ba hệ ngôn ngữ rất khác nhau vào cùng một silhouette: di sản Jordan 1, sự tiết chế của Fragment Design và cách tái cấu trúc đầy chủ ý của Union Los Angeles. Thay vì chỉ đặt nhiều logo lên một sản phẩm, sức hút của thiết kế nằm ở việc mỗi bên đóng góp một lớp nhận diện có thể đọc được trong cấu trúc và màu sắc.</p>
        <p>Nền tảng Black Toe tạo cảm giác quen thuộc ngay từ đầu, nhưng Varsity Red và Sport Royal làm bố cục lệch khỏi ký ức về những Jordan 1 kinh điển. Sự kết hợp đỏ–xanh trên nền đen–trắng tạo một cấu trúc gần như modular: từng khu vực màu có thể gợi một phối màu Jordan khác, nhưng khi ghép lại chúng hình thành một phiên bản mới với độ căng thị giác rõ rệt.</p>
        <p>Fragment thường gắn với cách sử dụng màu rất có kiểm soát và branding tương đối kín, trong khi Union nổi tiếng với việc làm cho quá trình ghép, may và tái cấu trúc trở thành một phần của thiết kế. Khi hai cách tiếp cận này gặp Jordan 1, kết quả thú vị nhất không nằm ở sự phô trương mà ở những chi tiết khiến người xem phải nhìn kỹ: đường nối, cách phân vùng màu và cảm giác của một sản phẩm được xây dựng từ nhiều nguồn tham chiếu.</p>
        <p>Hiện vật trong bộ sưu tập là Sample, vì vậy câu chuyện quan trọng hơn bản retail tương ứng nằm ở giai đoạn phát triển sản phẩm. Một sample có thể phản ánh lựa chọn trước khi sản xuất đại trà: vật liệu, tỷ lệ, màu, stitching hoặc nhãn có thể khác cấu hình cuối. Đối với một collaboration nhiều bên, những dấu vết đó càng có giá trị vì chúng cho thấy quá trình thương lượng giữa nhiều ngôn ngữ thiết kế.</p>
        <p>Trong Lộc An Sneaker Collection, đôi này được lưu như một tài liệu về collaboration hiện đại và quá trình phát triển trước phát hành. Nó cho thấy Jordan 1 có thể tiếp tục được tái diễn giải không chỉ bằng một màu mới, mà bằng việc chồng nhiều lịch sử thương hiệu và nhiều phương pháp thiết kế lên cùng một cấu trúc đã tồn tại từ năm 1985.</p>
      `,
      en: `
        <p>The Jordan 1 Retro High OG x Fragment x Union LA 'Varsity Red/Sport Royal' Sample brings three very different design systems into one silhouette: Jordan 1 heritage, Fragment Design's restraint and Union Los Angeles' deliberate approach to reconstruction. Rather than functioning as a product covered in multiple logos, the design is most interesting where each collaborator contributes an identity that can be read through structure and color.</p>
        <p>A Black Toe foundation creates immediate familiarity, but Varsity Red and Sport Royal shift the composition away from the memory of classic Jordan 1 colorways. Red and blue against black and white create an almost modular structure: individual zones can recall different Jordan references, yet together they form a new configuration with clear visual tension.</p>
        <p>Fragment is often associated with controlled color and relatively quiet branding, while Union is known for making joining, stitching and reconstruction part of the visible design language. When those approaches meet the Jordan 1, the strongest details are not necessarily the loudest. Seams, color boundaries and the sense of a product assembled from multiple references reward close viewing.</p>
        <p>The artifact in this collection is a Sample, so its most important story concerns the stage before final retail production. A sample may preserve choices that were later revised—materials, proportions, color execution, stitching or labeling. On a collaboration involving several creative parties, those traces become especially valuable because they provide evidence of how different design languages were negotiated into a manufacturable object.</p>
        <p>Within the Lộc An Sneaker Collection, the pair is preserved as a document of modern collaboration and pre-release product development. It demonstrates how the Jordan 1 can still be reinterpreted not simply through a new colorway, but by layering multiple brand histories and design methods onto a structure that has existed since 1985.</p>
      `
    },
    shadow: {
      vi: `
        <p>Jordan 1 High Retro OG 'Shadow' 2009 có vị trí đặc biệt trong lịch sử Air Jordan 1 vì đây là lần Shadow trở lại sau một khoảng thời gian rất dài kể từ phối màu nguyên bản năm 1985. Trong khi phần lớn ký ức về Jordan 1 thường xoay quanh Chicago, Bred hoặc Royal, Shadow chọn cách kín đáo hơn với black và grey, tách silhouette khỏi bảng màu Chicago Bulls mà vẫn giữ nguyên cấu trúc OG.</p>
        <p>Sức mạnh của Shadow nằm ở sự tiết chế. Black và Shadow Grey không cạnh tranh với hình dáng của đôi giày mà làm nổi bật nó: toe box, Swoosh, collar, heel và các đường panel được đọc rất rõ nhờ sự khác nhau vừa đủ giữa hai sắc trung tính. Đây là một phối màu cho thấy Jordan 1 không cần màu đỏ để giữ được cá tính và sự liên hệ với giai đoạn đầu của dòng Air Jordan.</p>
        <p>Bản retro 2009 xuất hiện trong một thời kỳ rất khác hiện nay, khi Jordan 1 chưa được tái phát hành với tần suất dày đặc như những năm sau. Vì vậy, nó hoạt động như một chiếc cầu giữa OG 1985 và những lần retro Shadow tiếp theo. Các khác biệt về shape, vật liệu và cách hoàn thiện của giai đoạn đó cũng khiến bản 2009 mang cảm giác riêng, đặc biệt với người quan tâm tới evolution của Jordan 1 qua từng thế hệ.</p>
        <p>Khi một đôi 2009 được sử dụng và già đi tự nhiên, creasing, patina và biến đổi vật liệu trở thành một phần của lịch sử vật thể. Với sneaker archive, những dấu hiệu đó không nhất thiết làm mất giá trị kể chuyện; chúng cho thấy đôi giày đã tồn tại qua thời gian như một vật được sử dụng thực sự, khác với một deadstock pair chỉ được bảo quản trong hộp.</p>
        <p>Trong Lộc An Sneaker Collection, Shadow 2009 được lưu như một mốc trong lineage của phối màu OG và của Jordan retro era. Câu chuyện của nó không cần dựa vào collaboration hay hype: sức hút đến từ màu sắc nguyên bản, sự hiếm tương đối của early retro và khả năng cho thấy Jordan 1 đã thay đổi thế nào trước khi trở thành một trong những silhouette phổ biến nhất của sneaker culture hiện đại.</p>
      `,
      en: `
        <p>The Jordan 1 High Retro OG 'Shadow' 2009 occupies a specific place in Air Jordan 1 history because it marked the return of Shadow after a long gap from the original 1985 colorway. While much of Jordan 1 mythology revolves around Chicago, Bred or Royal, Shadow takes a quieter route through black and grey, separating the silhouette from the Chicago Bulls palette while preserving the original architecture.</p>
        <p>Shadow's strength is restraint. Black and Shadow Grey do not compete with the shape of the shoe; they reveal it. The toe box, Swoosh, collar, heel and panel lines remain clearly legible because the two neutral tones are different enough to define structure without overwhelming it. The colorway demonstrates that an Air Jordan 1 does not need red to retain a strong connection to the earliest period of the line.</p>
        <p>The 2009 retro arrived in a very different release environment from today, before the Jordan 1 became one of the most frequently revisited silhouettes in the Jordan archive. It therefore acts as a bridge between the 1985 original and later Shadow retros. Period-specific differences in shape, materials and finishing also give the 2009 edition its own character for collectors interested in the evolution of the model.</p>
        <p>When a 2009 pair is worn and allowed to age naturally, creasing, patina and material changes become part of the object's history. In a sneaker archive, those signs do not necessarily reduce narrative value; they document the fact that the shoe existed through time as a used object rather than remaining untouched in a box.</p>
        <p>Within the Lộc An Sneaker Collection, Shadow 2009 is preserved as a marker in the lineage of an original colorway and in the history of Jordan retro production. Its significance does not depend on collaboration or hype. It comes from original color language, the character of an early retro and the way the pair documents the Air Jordan 1 before it became one of the dominant silhouettes of modern sneaker culture.</p>
      `
    },
    newBalance: {
      vi: `
        <p>New Balance 2002R là một trong những ví dụ rõ nhất về cách một thương hiệu có thể hồi sinh ngôn ngữ performance cũ mà không đơn giản sao chép lại sản phẩm nguyên bản. 2002R lấy cảm hứng trực tiếp từ MR2002 cao cấp của đầu thập niên 2010, nhưng được tái cấu trúc cho bối cảnh lifestyle hiện đại bằng cách kết hợp upper retro-running với tooling thực dụng hơn từ hệ 860.</p>
        <p>Upper nhiều lớp mesh, suede và synthetic giữ đúng cảm giác running kỹ thuật của giai đoạn cuối 2000s–đầu 2010s. Các panel không cố tối giản; chúng tạo ra độ sâu, texture và cảm giác cơ khí—một thẩm mỹ từng được xem là thuần performance nhưng sau này trở thành trọng tâm của làn sóng retro runner. Logo N lớn vẫn giữ nhận diện New Balance rõ ràng giữa hệ thống panel phức tạp.</p>
        <p>Phần đế là lý do 2002R không chỉ là một bản phục dựng hoài cổ. Hệ thống cushioning và stability được lấy từ nền tảng chạy bộ khác của New Balance, giúp đôi giày có trải nghiệm phù hợp với sử dụng hằng ngày. Sự kết hợp upper mang tính archive với sole unit thực dụng tạo ra một sản phẩm nằm giữa lịch sử và hiện tại.</p>
        <p>Sự nổi lên của 2002R cũng gắn với giai đoạn New Balance mở rộng mạnh trong sneaker culture thông qua cả GR lẫn collaboration. Silhouette này chứng minh rằng một model không cần nguồn gốc bóng rổ hay skateboarding để có sức ảnh hưởng thời trang; chính hình ảnh 'technical runner' từng rất chức năng đã trở thành một mã thẩm mỹ độc lập.</p>
        <p>Trong bộ sưu tập, 2002R đại diện cho nhánh retro-running bên cạnh Jordan, Nike SB và luxury sneaker. Nó giúp archive không chỉ kể câu chuyện về hype hoặc rarity mà còn cho thấy sự thay đổi của taste: những chi tiết kỹ thuật từng được thiết kế để phục vụ chạy bộ đã trở thành những yếu tố được người dùng tìm kiếm vì hình dáng, texture và cảm giác thời kỳ.</p>
      `,
      en: `
        <p>The New Balance 2002R is one of the clearest examples of a brand reviving an older performance language without simply reproducing the original product. It draws directly from the premium MR2002 of the early 2010s, but reconstructs the idea for a modern lifestyle context by combining a retro-running upper with more practical tooling derived from the 860 family.</p>
        <p>Layered mesh, suede and synthetic materials preserve the technical running character of the late-2000s and early-2010s period. The upper does not attempt to simplify itself; its many panels create depth, texture and a mechanical feel—an aesthetic that was once read primarily as performance design and later became central to the retro-runner revival. The large N logo keeps New Balance identity visible within the complex structure.</p>
        <p>The sole unit is a major reason the 2002R feels like more than a nostalgic reproduction. Cushioning and stability technology borrowed from another New Balance running platform gives the shoe a practical everyday experience. The combination of an archive-inspired upper and functional modernized tooling places the model between historical reference and contemporary use.</p>
        <p>The rise of the 2002R also coincided with a period in which New Balance expanded strongly within sneaker culture through both general releases and collaborations. The silhouette demonstrated that a model did not need basketball or skateboarding origins to become culturally relevant; the image of the technical runner itself became an independent fashion code.</p>
        <p>Within the collection, the 2002R represents the retro-running branch alongside Jordan, Nike SB and luxury footwear. It allows the archive to document not only hype or rarity, but changing taste: technical details once designed primarily for running performance became desirable for their shape, texture and period character.</p>
      `
    },
    reverseBred: {
      vi: `
        <p>Jordan 1 Low 'Reverse Bred' khai thác một trong những mã màu quan trọng nhất của Air Jordan—đen và đỏ—nhưng thay đổi cách phân bố để tạo ra cảm giác vừa quen vừa khác. Thay vì sao chép trực tiếp cách blocking của Bred High, phiên bản Low sử dụng ký ức về Bred như điểm xuất phát rồi đảo trọng tâm màu sắc, cho phép red trở thành vùng thị giác mạnh hơn.</p>
        <p>Sự khác biệt giữa Jordan 1 Low và High khiến thao tác 'reverse' không chỉ là đổi màu. Cổ thấp làm thay đổi tỷ lệ của quarter, heel và vùng quanh mắt cá; vì vậy cùng một cặp màu đen–đỏ sẽ được đọc theo cách khác. Trên bản Low, các vùng màu tạo cảm giác rộng hơn theo chiều ngang và khiến silhouette gần với sneaker lifestyle hằng ngày hơn.</p>
        <p>Bred là một trong những color languages có sức sống lâu nhất của Jordan Brand vì nó gắn với giai đoạn đầu của Air Jordan và với hình ảnh Chicago Bulls. Reverse Bred cho thấy Jordan Brand có thể tiếp tục khai thác một bảng màu lịch sử mà không cần tái tạo nguyên bản. Chỉ cần thay đổi thứ tự màu, tỷ lệ và model, ký ức cũ có thể tạo ra một sản phẩm mới.</p>
        <p>Ở góc độ thiết kế, đây là một ví dụ thú vị về sự khác nhau giữa 'reference' và 'retro'. Một retro cố gắng đưa một sản phẩm cũ trở lại, còn Reverse Bred dùng lịch sử như nguyên liệu. Người xem nhận ra DNA Bred ngay lập tức nhưng không thể nhầm nó với một bản OG reproduction.</p>
        <p>Trong Lộc An Sneaker Collection, Reverse Bred đại diện cho cách Jordan 1 đã vượt khỏi vai trò một performance basketball shoe để trở thành một nền tảng màu sắc có thể được tái cấu trúc liên tục. Nó là một hiện vật giản dị hơn các bản F&F hay Sample, nhưng hữu ích để cho thấy cách archive Jordan được tái sử dụng trong sản phẩm đại chúng.</p>
      `,
      en: `
        <p>The Jordan 1 Low 'Reverse Bred' uses one of the most important color codes in Air Jordan history—black and red—but redistributes it to create something familiar without being a direct copy. Rather than reproducing the blocking of a Bred High, the Low uses the memory of Bred as a starting point and shifts the balance so that red becomes a stronger visual field.</p>
        <p>The proportional difference between the Jordan 1 Low and High means that 'reversing' the colors is not simply a palette swap. A lower collar changes the relationship between the quarter, heel and ankle area, so the same black-and-red combination reads differently. On the Low, color zones feel more horizontal and the silhouette sits closer to everyday lifestyle footwear.</p>
        <p>Bred is one of Jordan Brand's longest-lasting visual languages because of its connection to the earliest Air Jordan era and to the Chicago Bulls image. Reverse Bred demonstrates how the brand can continue using a historical palette without reproducing an original release. Changes in color order, proportion and model are enough to turn familiar memory into a different product.</p>
        <p>From a design perspective, it is a useful example of the difference between reference and retro. A retro attempts to bring an older product back, while Reverse Bred treats history as raw material. The Bred DNA is immediately recognizable, yet the shoe cannot be mistaken for an OG reproduction.</p>
        <p>Within the Lộc An Sneaker Collection, Reverse Bred represents the way the Jordan 1 moved beyond its identity as a performance basketball shoe and became a color-and-form platform that can be repeatedly reconstructed. It is less rare than the F&F or Sample objects in the archive, but valuable for showing how Jordan history is continually reused in accessible product.</p>
      `
    },
    defender: {
      vi: `
        <p>Balenciaga Defender thuộc giai đoạn luxury sneaker rời xa logic của footwear thể thao truyền thống và tiến gần hơn tới sculpture, industrial design và sự phóng đại tỷ lệ. Upper tương đối gọn được đặt lên một outsole cực lớn với các khối tread sâu, tạo cảm giác như một phần lốp xe hoặc thiết bị địa hình được gắn vào sneaker.</p>
        <p>Điểm quan trọng của Defender là sole unit không còn đóng vai trò nền cho upper; nó trở thành nhân vật chính. Các răng đế lớn, đường cong dày và khối lượng thị giác nặng khiến người xem nhận biết đôi giày từ phần đế trước cả branding. Đây là cách Balenciaga thường làm với footwear: lấy một chi tiết chức năng rồi phóng đại nó tới mức trở thành biểu tượng.</p>
        <p>Thiết kế này xuất hiện sau nhiều năm chunky sneaker và 'dad shoe' đã trở thành ngôn ngữ phổ biến. Defender đẩy xu hướng đó xa hơn: thay vì chỉ tăng độ dày midsole, nó làm outsole thành một cấu trúc gần như độc lập. Nhờ vậy, đôi giày nằm ở ranh giới giữa sneaker, runway object và một thử nghiệm về tỷ lệ cơ thể.</p>
        <p>Khi mang trên chân, Defender thay đổi silhouette của người mang rõ rệt vì chiều rộng và độ dày của đế. Đây là một đặc điểm quan trọng của fashion footwear: mục tiêu không chỉ là làm một đôi giày đẹp khi đứng riêng, mà còn thay đổi cách quần, chân và toàn bộ outfit được đọc trong không gian.</p>
        <p>Trong Lộc An Sneaker Collection, Defender đại diện cho nhánh luxury/fashion sneaker và tạo đối trọng với những model bắt nguồn từ basketball, skateboarding hay running. Nó ghi lại một thời điểm khi sneaker không còn chỉ vay mượn công nghệ thể thao, mà có thể hoạt động như một vật thể thời trang chủ động thách thức khái niệm về tỷ lệ và công năng.</p>
      `,
      en: `
        <p>The Balenciaga Defender belongs to a period in which luxury sneakers moved away from conventional athletic-footwear logic and closer to sculpture, industrial design and exaggerated proportion. A relatively compact upper sits on an enormous outsole with deep tread blocks, producing the impression of a tire or off-road component attached to a sneaker.</p>
        <p>The crucial feature of the Defender is that the sole unit no longer acts as a supporting base for the upper; it becomes the main character. Large teeth, thick curves and heavy visual mass allow the shoe to be recognized through its outsole before its branding. This is consistent with Balenciaga's footwear language: take a functional component and enlarge it until it becomes the icon.</p>
        <p>The design arrived after years in which chunky sneakers and 'dad shoes' had already become mainstream fashion language. Defender pushes that logic further. Instead of merely thickening the midsole, it turns the outsole into an almost independent structure, placing the shoe between sneaker, runway object and experiment in bodily proportion.</p>
        <p>On foot, the Defender visibly changes the silhouette of the wearer because of the width and depth of the sole. That is significant in fashion footwear: the objective is not only to create a shoe that looks distinctive in isolation, but to change how trousers, legs and the overall outfit are read in space.</p>
        <p>Within the Lộc An Sneaker Collection, the Defender represents the luxury/fashion branch and contrasts with models rooted in basketball, skateboarding or running. It records a period when the sneaker no longer needed to borrow legitimacy from sport and could instead function as a fashion object actively challenging ideas of proportion and utility.</p>
      `
    },
    jordan4: {
      vi: `
        <p>Jordan 4 Retro 'Black Cement' 1999 là một hiện vật quan trọng trong lịch sử retro Jordan vì xuất hiện đúng một thập niên sau Air Jordan 4 nguyên bản năm 1989. Black Cement gắn với một trong những thời kỳ được nhớ nhiều nhất trong sự nghiệp Michael Jordan, và đặc biệt với hình ảnh Air Jordan 4 trong khoảnh khắc 'The Shot' trước Cleveland—một trong những hình ảnh định hình mythology của model.</p>
        <p>Thiết kế của Tinker Hatfield đưa nhiều yếu tố kỹ thuật ra bên ngoài: mesh panel, plastic wing, lacing support, visible Air và heel structure đều có vai trò thị giác rõ ràng. Trên Black Cement, nubuck đen tạo nền để Cement Grey và Fire Red xuất hiện như các điểm đánh dấu. Kết quả là một đôi giày có cảm giác performance mạnh nhưng vẫn giữ được cấu trúc đủ sạch để tồn tại lâu dài trong streetwear.</p>
        <p>Bản 1999 đặc biệt vì thuộc giai đoạn đầu của khái niệm Jordan retro. Ngày nay việc một OG colorway quay lại theo chu kỳ là điều quen thuộc, nhưng cuối thập niên 1990 Jordan Brand vẫn đang xây dựng cách đưa archive trở lại thị trường. Vì vậy, 1999 Black Cement không chỉ là một lần tái phát hành; nó là tài liệu về thời điểm retro culture bắt đầu định hình.</p>
        <p>Những early retro thường có shape, vật liệu và cảm giác sản xuất khác các lần phát hành hiện đại. Với người sưu tầm, điều đó tạo ra một tầng giá trị riêng: cùng một phối màu, nhưng mỗi generation phản ánh tiêu chuẩn sản xuất và cách Jordan Brand diễn giải archive ở thời điểm của nó. Một đôi 1999 vì thế cho phép so sánh trực tiếp lịch sử sản phẩm, không chỉ lịch sử màu sắc.</p>
        <p>Trong Lộc An Sneaker Collection, Black Cement 1999 được lưu như một cầu nối giữa OG era và retro era. Nó kể đồng thời ba câu chuyện: di sản thi đấu của Air Jordan 4, ngôn ngữ thiết kế kỹ thuật của Tinker Hatfield và quá trình Jordan Brand biến những model cũ thành một archive sống được tái phát hành qua nhiều thế hệ.</p>
      `,
      en: `
        <p>The Jordan 4 Retro 'Black Cement' 1999 is an important object in Jordan retro history because it arrived exactly a decade after the original Air Jordan 4 in 1989. Black Cement is tied to one of the most remembered periods of Michael Jordan's career and especially to the image of the Air Jordan 4 during 'The Shot' against Cleveland—one of the moments that helped define the mythology of the model.</p>
        <p>Tinker Hatfield's design moved technical elements onto the exterior: mesh panels, plastic wings, lacing supports, visible Air and heel structure all contribute to the visual identity. On Black Cement, black nubuck acts as the base while Cement Grey and Fire Red operate as markers. The result feels strongly performance-driven yet structurally clean enough to remain relevant in streetwear decades later.</p>
        <p>The 1999 edition matters because it belongs to the early era of the Jordan retro concept. Today, recurring returns of original colorways are expected, but in the late 1990s Jordan Brand was still developing the practice of bringing its archive back to market. The 1999 Black Cement is therefore more than another reissue; it documents a period when retro culture itself was taking shape.</p>
        <p>Early retros often differ from modern releases in shape, materials and production character. For collectors, that creates another layer of value: the same colorway can reveal how manufacturing standards and Jordan Brand's interpretation of its archive changed from one generation to the next. A 1999 pair makes product history physically comparable rather than purely theoretical.</p>
        <p>Within the Lộc An Sneaker Collection, Black Cement 1999 is preserved as a bridge between the OG era and the retro era. It tells three stories at once: the competitive legacy of the Air Jordan 4, Tinker Hatfield's technical design language and the process by which Jordan Brand transformed older models into a living archive revisited across generations.</p>
      `
    },
    bapeStussy: {
      vi: `
        <p>BAPE x Stüssy Camo Canvas Hi Top 'Green Camo' ghi lại một giai đoạn quan trọng của streetwear khi các thương hiệu Nhật Bản và California bắt đầu giao nhau mạnh hơn trong cùng một hệ văn hóa. Stüssy mang di sản surf, skate và graphic culture của bờ Tây Hoa Kỳ; BAPE đại diện cho làn sóng Harajuku và cách Nhật Bản biến logo, camouflage và limited product thành một ngôn ngữ streetwear toàn cầu.</p>
        <p>Green Camo đặt pattern camouflage gắn chặt với BAPE lên một high-top canvas có cấu trúc tương đối cổ điển. Chính sự đơn giản của form làm pattern trở thành trung tâm. Thay vì dùng quá nhiều chi tiết kỹ thuật, đôi giày dựa vào graphic surface, logo và phối vật liệu để tạo nhận diện—một cách tiếp cận rất điển hình của streetwear footwear giai đoạn đó.</p>
        <p>Điều thú vị là hai thương hiệu đều hiểu rất rõ sức mạnh của community và scarcity trước khi collaboration trở thành chiến lược gần như mặc định của ngành sneaker hiện đại. Những dự án như BAPE x Stüssy giúp hình thành cách người dùng nhìn sản phẩm collaboration: không chỉ là một món hàng, mà là điểm gặp của hai cộng đồng, hai lịch sử và hai hệ biểu tượng.</p>
        <p>Với một đôi vintage streetwear, sự già đi của canvas, print và cao su cũng là một phần của câu chuyện. Khác với performance sneaker nơi công nghệ thường là trọng tâm, những thay đổi bề mặt trên một đôi canvas có thể làm rõ tuổi đời và cách vật liệu phản ứng qua thời gian. Điều này khiến hiện vật có cảm giác như một mảnh thời kỳ hơn là một sản phẩm được tái tạo mới.</p>
        <p>Trong Lộc An Sneaker Collection, BAPE x Stüssy Green Camo đại diện cho lịch sử streetwear collaboration bên cạnh những Jordan và Nike SB. Nó cho thấy sneaker culture không chỉ được xây dựng từ thể thao; graphic design, thời trang đường phố, retail culture ở Tokyo và California cũng đóng vai trò quan trọng trong cách sneaker trở thành vật sưu tầm.</p>
      `,
      en: `
        <p>The BAPE x Stüssy Camo Canvas Hi Top 'Green Camo' documents an important period in streetwear when Japanese and Californian brands increasingly occupied the same cultural space. Stüssy brought a West Coast history rooted in surf, skate and graphic culture, while BAPE represented the Harajuku wave and the Japanese transformation of logos, camouflage and limited product into a global streetwear language.</p>
        <p>Green Camo places the camouflage pattern closely associated with BAPE onto a comparatively classic canvas high-top. The simplicity of the form allows the surface graphic to become the main event. Rather than depending on technical footwear components, the shoe builds identity through pattern, branding and material treatment—an approach strongly associated with streetwear footwear of the period.</p>
        <p>Both brands understood community and scarcity long before collaboration became an almost default strategy in the modern sneaker industry. Projects such as BAPE x Stüssy helped shape the way consumers understand collaborative product: not simply as merchandise, but as a meeting point between two communities, two histories and two visual systems.</p>
        <p>On vintage streetwear footwear, the aging of canvas, print and rubber can also become part of the story. Unlike performance sneakers where technology often dominates the narrative, surface changes on a canvas shoe can make age and material behavior visible. The object begins to feel like a surviving piece of a period rather than a newly recreated product.</p>
        <p>Within the Lộc An Sneaker Collection, BAPE x Stüssy Green Camo represents the history of streetwear collaboration alongside Jordan and Nike SB. It demonstrates that sneaker culture was not built through sport alone; graphic design, street fashion and retail culture in Tokyo and California also played major roles in turning footwear into collectible cultural objects.</p>
      `
    },
    waffle: {
      vi: `
        <p>Nike Waffle Racer x Off-White 'White' (W) là một phần của cách Virgil Abloh khai thác lịch sử running của Nike thay vì chỉ tập trung vào những icon basketball và lifestyle. Waffle Racer có liên hệ trực tiếp với một trong những ngôn ngữ nền tảng của Nike—đế waffle và tư duy thử nghiệm running—nên khi được Off-White tái diễn giải, đôi giày tạo ra cuộc đối thoại giữa lịch sử rất sớm của Nike và thẩm mỹ deconstruction cuối thập niên 2010.</p>
        <p>Upper sử dụng vật liệu xuyên thấu, các lớp overlay và một hệ thống dây bổ sung mang tính công nghiệp. Những yếu tố này làm silhouette trông như đang ở giữa sản phẩm performance, prototype và fashion object. Thay vì che giấu cách đôi giày được dựng, thiết kế cố ý cho người xem thấy lớp, dây, mối nối và các bộ phận vốn thường bị làm gọn trong footwear thương mại.</p>
        <p>Đế waffle giữ một liên hệ quan trọng với nguồn gốc running của Nike. Trong khi upper nói ngôn ngữ Virgil Abloh, outsole gợi về thời kỳ Nike xây dựng danh tiếng bằng thử nghiệm traction và footwear chạy bộ. Sự chồng hai thời kỳ lên nhau khiến Waffle Racer collaboration khác với nhiều Off-White Nike khác: nó nhìn sâu hơn vào archive performance thay vì chỉ khai thác những silhouette đã nổi tiếng trong streetwear.</p>
        <p>Phiên bản White cũng có một đặc điểm quan trọng khi già đi: vật liệu sáng và translucent làm yellowing, bụi, creasing và biến đổi bề mặt trở nên dễ thấy. Với một archive pair đã được sử dụng, những dấu vết đó có thể được đọc như aging tự nhiên của vật liệu thử nghiệm, phản ánh cách một thiết kế fashion-performance thực sự thay đổi sau thời gian.</p>
        <p>Trong Lộc An Sneaker Collection, Waffle Racer Off-White đại diện cho một nhánh ít obvious hơn trong di sản Virgil x Nike. Nó cho thấy tư duy deconstruction có thể hoạt động trên một running model tương đối mảnh, và nhắc lại rằng lịch sử Nike không bắt đầu từ Air Jordan hay Air Force 1 mà từ các thử nghiệm chạy bộ rất cơ bản.</p>
      `,
      en: `
        <p>The Nike Waffle Racer x Off-White 'White' (W) reflects Virgil Abloh's interest in Nike running history rather than only the brand's basketball and lifestyle icons. The Waffle Racer connects directly to one of Nike's foundational languages—the waffle sole and a culture of running experimentation—so the Off-White reinterpretation creates a conversation between Nike's earliest performance history and late-2010s deconstruction.</p>
        <p>The upper uses translucent materials, layered overlays and an additional industrial-looking lacing system. These elements make the silhouette feel suspended between performance product, prototype and fashion object. Instead of hiding how the shoe is assembled, the design deliberately exposes layers, cords, joins and components that conventional commercial footwear usually resolves into a cleaner surface.</p>
        <p>The waffle outsole preserves an important connection to Nike's running origins. While the upper speaks in Virgil Abloh's language, the outsole points back to the period when Nike built its reputation through traction experiments and running footwear. That overlap of two eras separates the Waffle Racer collaboration from many other Off-White Nike projects because it reaches deeper into the performance archive.</p>
        <p>The White edition also reveals aging very clearly. Light and translucent materials make yellowing, dust, creasing and surface change more visible. On an archive pair that has been worn, those marks can be read as the natural aging of experimental materials and as evidence of how a fashion-performance design changes through actual use.</p>
        <p>Within the Lộc An Sneaker Collection, the Off-White Waffle Racer represents a less obvious branch of the Virgil x Nike legacy. It shows that deconstruction can operate on a relatively slim running model and reminds the viewer that Nike history did not begin with Air Jordan or Air Force 1, but with much more basic experiments in running footwear.</p>
      `
    },
    cityFlight: {
      vi: `
        <p>Jordan 1 Retro High OG 'City of Flight' được xây dựng quanh Los Angeles và bối cảnh NBA All-Star Weekend 2018, khi Jordan Brand sử dụng thành phố như một phần trực tiếp của câu chuyện sản phẩm. Thay vì quay lại một khoảnh khắc thi đấu của Michael Jordan, thiết kế nhìn vào địa điểm, nhịp sống đô thị và văn hóa basketball rộng hơn—một cách kể chuyện đã trở nên ngày càng quan trọng với các release Jordan hiện đại.</p>
        <p>Black leather tạo một bề mặt tối, tương đối trang trọng, trong khi Metallic Gold làm nổi branding và các điểm nhấn. Sự kết hợp đen–vàng tạo cảm giác khác với những phối màu OG thường dựa nhiều vào red, royal blue hoặc white. Nhờ vậy, City of Flight vẫn đọc ngay là Jordan 1 nhưng có mood gần với một sản phẩm event-specific hơn.</p>
        <p>Các chi tiết liên quan tới Los Angeles và map graphics đưa địa lý vào trong thiết kế. Đây là điểm khiến đôi giày khác một black-and-gold Jordan thông thường: thành phố không chỉ xuất hiện trong marketing mà được chuyển thành dấu hiệu trên chính sản phẩm. Khi lưu trữ lâu dài, những chi tiết kiểu này giúp người xem xác định đôi giày thuộc một thời điểm và sự kiện văn hóa cụ thể.</p>
        <p>City of Flight cũng phản ánh cách All-Star Weekend trở thành một sân khấu quan trọng cho sneaker releases. Các thương hiệu sử dụng một vài ngày của sự kiện để kết nối basketball, celebrity, retail và local culture. Những đôi giày phát hành quanh All-Star vì vậy thường hoạt động như capsule time-stamp của thành phố đăng cai.</p>
        <p>Trong Lộc An Sneaker Collection, City of Flight bổ sung một loại provenance khác với PE hay Sample: provenance của event và place. Nó cho thấy Jordan 1 có thể đóng vai trò như một 'souvenir' thiết kế cao cấp của một thành phố, đồng thời ghi lại thời kỳ mà sneaker release calendar ngày càng gắn chặt với những sự kiện văn hóa lớn.</p>
      `,
      en: `
        <p>The Jordan 1 Retro High OG 'City of Flight' was built around Los Angeles and the 2018 NBA All-Star Weekend, with Jordan Brand using the city itself as a direct part of the product narrative. Rather than returning to a specific Michael Jordan game moment, the design focuses on place, urban rhythm and wider basketball culture—an approach that became increasingly important in modern Jordan storytelling.</p>
        <p>Black leather creates a dark, relatively formal base while Metallic Gold highlights branding and key details. The black-and-gold combination feels distinct from original Jordan palettes that often depend on red, royal blue or white. As a result, City of Flight remains immediately recognizable as a Jordan 1 while carrying the mood of an event-specific release.</p>
        <p>Los Angeles references and map-related graphics bring geography into the object. This is what separates the shoe from a generic black-and-gold Jordan: the city is not only present in marketing but translated into details on the product itself. In a long-term archive, those elements help locate the sneaker within a specific time and cultural event.</p>
        <p>City of Flight also reflects the way All-Star Weekend became an important stage for sneaker releases. Brands use the event to connect basketball, celebrity, retail and local culture within a concentrated period. Footwear released around All-Star can therefore function as a time-stamped capsule of the host city.</p>
        <p>Within the Lộc An Sneaker Collection, City of Flight adds a different kind of provenance from PE or Sample objects: provenance of event and place. It demonstrates how the Jordan 1 can operate as a sophisticated design souvenir for a city while documenting a period when the sneaker release calendar became closely connected to major cultural events.</p>
      `
    },
    vans: {
      vi: `
        <p>Vans Knu Skool là một ví dụ điển hình cho việc archive skate của thập niên 1990 có thể quay lại mà không cần giữ nguyên tỷ lệ cũ. Model lấy những mã thiết kế quen thuộc của Vans—suede upper, side stripe, vulcanized-style identity—rồi phóng đại padding, tongue, laces và volume để tạo ra một silhouette có cảm giác gần với skate shoe cuối 1990s–đầu 2000s.</p>
        <p>Tongue dày và collar phồng là hai chi tiết thay đổi cảm giác của đôi giày nhiều nhất. Chúng khiến Knu Skool trông nặng và mềm hơn Old Skool, trong khi oversized Jazz Stripe tạo hiệu ứng gần như ba chiều trên side panel. Đây không phải một thay đổi công nghệ lớn; nó là một thay đổi về tỷ lệ, nhưng tỷ lệ đủ mạnh để biến toàn bộ personality của model.</p>
        <p>Sự trở lại của Knu Skool trùng với làn sóng Y2K, baggy denim, skatewear rộng và sự quan tâm mới tới footwear có volume lớn. Điều thú vị là một model archive có thể phù hợp với hiện tại không phải vì nó được hiện đại hóa hoàn toàn, mà vì chính những chi tiết từng mang cảm giác cũ lại trở nên đúng với taste mới.</p>
        <p>Vans có một vị trí riêng trong sneaker culture vì nhiều model của hãng không dựa vào scarcity hoặc công nghệ phức tạp. Giá trị của chúng đến từ mối liên hệ lâu dài với skateboarding, music và subculture. Knu Skool giữ nền tảng đó nhưng cho thấy Vans cũng có những giai đoạn thiết kế dày, phóng đại và ít tối giản hơn hình ảnh checkerboard/Old Skool thường thấy.</p>
        <p>Trong Lộc An Sneaker Collection, Knu Skool đóng vai trò như một hiện vật về chu kỳ thời trang. Nó cho thấy một silhouette có thể biến mất khỏi spotlight rồi trở lại khi tỷ lệ quần áo và sở thích của người dùng thay đổi, đồng thời mở rộng câu chuyện Vans vượt khỏi những model cổ điển quen thuộc nhất.</p>
      `,
      en: `
        <p>The Vans Knu Skool is a clear example of how a 1990s skate archive can return without preserving old proportions unchanged. The model takes familiar Vans codes—suede construction, a side stripe and vulcanized-shoe identity—and exaggerates padding, tongue, laces and overall volume to create a silhouette associated with late-1990s and early-2000s skate footwear.</p>
        <p>The padded tongue and inflated collar change the character of the shoe most dramatically. They make the Knu Skool feel heavier and softer than an Old Skool, while the oversized Jazz Stripe becomes almost three-dimensional on the side panel. This is not primarily a technological transformation; it is a change in proportion, but one strong enough to reshape the entire personality of the model.</p>
        <p>The return of the Knu Skool coincided with renewed interest in Y2K references, baggy denim, loose skatewear and high-volume footwear. What makes the revival interesting is that the archive model feels current not because it was completely modernized, but because details that once looked dated became aligned with a new cycle of taste.</p>
        <p>Vans occupies a distinct position in sneaker culture because many of its models do not depend on scarcity or complex technology. Their value comes from long relationships with skateboarding, music and subculture. Knu Skool preserves that foundation while showing that Vans also produced periods of thicker, exaggerated design far removed from the minimal image of its most familiar classics.</p>
        <p>Within the Lộc An Sneaker Collection, Knu Skool functions as an artifact of fashion cycles. It demonstrates how a silhouette can leave the spotlight and return when clothing proportions and consumer taste shift, while also expanding the Vans story beyond its most familiar archive models.</p>
      `
    },
    puma: {
      vi: `
        <p>Puma Speedcat Leather Rosé White bắt nguồn từ lịch sử motorsport lâu dài của Puma. Khác với sneaker running hoặc basketball, Speedcat được xây dựng quanh nhu cầu của driving footwear: profile thấp, đế mỏng và toe tương đối thuôn giúp bàn chân giữ cảm giác gần với pedal. Chính logic chức năng này tạo ra silhouette rất khác với những đôi sneaker chunky phổ biến nhiều năm trước đó.</p>
        <p>Formstrip kéo dài dọc thân giày giữ nhận diện Puma rõ ràng, trong khi upper leather làm Speedcat có cảm giác tinh gọn hơn các bản suede motorsport cổ điển. Rosé White làm mềm ngôn ngữ racing bằng bảng màu sáng và thanh hơn, cho phép đôi giày chuyển dễ từ nguồn gốc performance sang styling hằng ngày.</p>
        <p>Sự hồi sinh của Speedcat phản ánh một chuyển động lớn trong sneaker fashion: sau thời kỳ đế dày, dad shoe và oversized sole chiếm ưu thế, người dùng bắt đầu quan tâm trở lại tới footwear mỏng, thấp và gần mặt đất. Những model từng bị xem là quá đơn giản hoặc quá '2000s' bỗng phù hợp với quần ống rộng, váy dài và các tỷ lệ thời trang mới.</p>
        <p>Speedcat cũng cho thấy motorsport heritage có thể trở thành lifestyle code mà không cần mô phỏng racing một cách quá trực tiếp. Phần đế cong lên quanh heel, profile thấp và đường nét gọn đủ để gợi nguồn gốc lái xe; phần còn lại của sản phẩm có thể tồn tại như một sneaker thời trang độc lập.</p>
        <p>Trong Lộc An Sneaker Collection, Rosé White Speedcat đại diện cho một loại performance heritage khác với basketball, running và skateboarding. Nó ghi lại sự quay trở lại của low-profile footwear và cho thấy một thiết kế chức năng tương đối chuyên biệt có thể được đọc lại nhiều thập niên sau như một silhouette thời trang đương đại.</p>
      `,
      en: `
        <p>The Puma Speedcat Leather Rosé White grows out of Puma's long motorsport history. Unlike running or basketball sneakers, the Speedcat was shaped around driving-footwear logic: a low profile, thin sole and relatively tapered toe keep the foot visually and physically closer to the pedal. That functional origin produces a silhouette very different from the chunky sneakers that dominated the previous fashion cycle.</p>
        <p>The Formstrip running along the side keeps Puma identity immediately visible, while the leather upper gives this Speedcat a cleaner character than classic suede motorsport versions. Rosé White softens the racing language through a lighter, more refined palette, allowing the model to move easily from performance heritage into everyday styling.</p>
        <p>The Speedcat revival reflects a broader shift in sneaker fashion. After years dominated by thick soles, dad shoes and oversized footwear, consumers returned to slim, low-to-the-ground silhouettes. Models that once appeared too simple or too closely tied to the 2000s suddenly worked with wide trousers, long skirts and new clothing proportions.</p>
        <p>Speedcat also demonstrates how motorsport heritage can become lifestyle language without relying on literal racing graphics. The heel wrap, low stance and compact lines provide enough evidence of its driving origins, while the rest of the shoe can operate independently as a fashion sneaker.</p>
        <p>Within the Lộc An Sneaker Collection, the Rosé White Speedcat represents a performance lineage distinct from basketball, running and skateboarding. It documents the return of low-profile footwear and shows how a relatively specialized functional design can be re-read decades later as a contemporary fashion silhouette.</p>
      `
    },
    raygun: {
      vi: `
        <p>Nike Dunk Low Pro SB 'Raygun Away' là một trong những thiết kế tiêu biểu của giai đoạn đầu Nike SB và của thời kỳ Pink Box. Câu chuyện của nó bắt đầu trước khi đôi Dunk xuất hiện: Nike từng tạo ra Roswell Rayguns, một đội bóng rổ hư cấu được xây dựng như một thế giới quảng cáo retro-futuristic, trộn basketball với hình ảnh UFO, người ngoài hành tinh và văn hóa đại chúng Mỹ.</p>
        <p>Khi concept Rayguns được chuyển sang Nike SB Dunk Low Pro, mascot alien cầm raygun trở thành dấu hiệu nhận diện quan trọng nhất. Hình thêu ở heel nhỏ nhưng đủ mạnh để biến toàn bộ đôi giày thành một phần của thế giới Roswell Rayguns. Đây là kiểu storytelling rất đặc trưng của Nike SB thời kỳ đầu: một Dunk có thể bắt nguồn từ một câu chuyện kỳ lạ, một graphic hoặc một reference văn hóa thay vì chỉ là phối màu mới.</p>
        <p>Bản Away được nhận biết bởi toe màu trắng, kết hợp orange ở mid-panel, yellow ở heel và black Swoosh. White toe làm phần trước sáng hơn rõ rệt so với bản toe đen thường được gọi là Home. Bảng màu orange–yellow–black–white vừa gắn với uniform của đội bóng hư cấu vừa tạo ra một bố cục cực kỳ dễ nhận ra, ngay cả khi nhìn đôi giày từ xa.</p>
        <p>Raygun cũng quan trọng vì nó thuộc giai đoạn Nike SB đang xây dựng bản sắc riêng trong sneaker culture. Dunk SB lúc đó chưa đơn giản là một silhouette retro được phát hành liên tục; mỗi release thường gắn với skate shop, artist, câu chuyện hoặc concept có personality mạnh. Chính cách làm đó góp phần tạo nên sức hút sưu tầm của SB Dunk trong những năm 2000.</p>
        <p>Nhiều năm sau, Nike SB quay lại với Roswell Rayguns trong những dự án mới, cho thấy mascot này đã trở thành một phần bền vững của archive SB. Việc một campaign hư cấu đầu những năm 2000 có thể tiếp tục sống trong footwear nhiều năm sau là minh chứng cho sức mạnh của storytelling khi nó được gắn vào một hình ảnh đủ rõ và một silhouette đủ có ảnh hưởng.</p>
        <p>Trong Lộc An Sneaker Collection, Raygun Away được lưu như một đại diện của Nike SB thời kỳ đầu: một đôi giày vừa có lịch sử skate, vừa mang dấu vết của advertising culture và graphic storytelling. Patina và dấu hiệu sử dụng trên hiện vật càng làm rõ tuổi đời của nó, khiến đôi giày được đọc như một vật thể đã đi qua gần hai thập niên sneaker culture thay vì một retro reproduction mới.</p>
      `,
      en: `
        <p>The Nike Dunk Low Pro SB 'Raygun Away' is one of the defining designs of early Nike SB and the Pink Box era. Its story begins before the Dunk itself: Nike created the Roswell Rayguns as a fictional basketball team inside a retro-futurist advertising world that mixed basketball with UFO imagery, aliens and American popular culture.</p>
        <p>When the Rayguns concept moved onto the Nike SB Dunk Low Pro, the raygun-wielding alien became the crucial identifying mark. The heel embroidery is physically small but strong enough to place the entire shoe inside the Roswell Rayguns universe. This kind of storytelling was characteristic of early Nike SB: a Dunk could originate from an odd narrative, graphic or cultural reference rather than functioning as just another colorway.</p>
        <p>The Away edition is identified by its white toe, combined with orange at the mid-panel, yellow at the heel and a black Swoosh. The white toe gives the front of the shoe a noticeably brighter appearance than the black-toe version commonly called Home. Orange, yellow, black and white connect the sneaker to the fictional team's visual identity while creating one of the most recognizable early SB Dunk palettes.</p>
        <p>Raygun is also important because it belongs to the period when Nike SB was still establishing a distinct identity within sneaker culture. The SB Dunk was not yet simply a retro silhouette released at constant volume; individual releases were often tied to skate shops, artists, stories or concepts with strong personality. That approach helped build the collecting culture around SB Dunk during the 2000s.</p>
        <p>Nike SB returned to the Roswell Rayguns concept years later, showing that the mascot had become a durable part of the SB archive. The fact that a fictional advertising campaign from the early 2000s could continue living through footwear years later demonstrates the power of storytelling when it is attached to a clear graphic identity and an influential silhouette.</p>
        <p>Within the Lộc An Sneaker Collection, Raygun Away is preserved as an artifact of early Nike SB: a shoe carrying skate history, advertising culture and graphic storytelling at the same time. The patina and signs of use on the object further emphasize its age, allowing it to read as a pair that has lived through nearly two decades of sneaker culture rather than as a newly reproduced retro.</p>
      `
    },
  };

  const STORY_RULES = [
    { key: "bloodline", match: t => t.includes("black bloodline") },
    { key: "quai54", match: t => t.includes("quai 54") || t.includes("quai54") },
    { key: "yuto", match: t => t.includes("yuto") && t.includes("matcha") },
    { key: "alaska", match: t => t.includes("virgil") && t.includes("alaska") },
    { key: "fragmentUnion", match: t => t.includes("fragment") && t.includes("union") && t.includes("sport royal") },
    { key: "shadow", match: t => t.includes("shadow") && t.includes("2009") },
    { key: "newBalance", match: t => t.includes("new balance 2002r") },
    { key: "reverseBred", match: t => t.includes("reverse bred") },
    { key: "defender", match: t => t.includes("balenciaga") && t.includes("defender") },
    { key: "jordan4", match: t => t.includes("jordan 4") && t.includes("black cement") },
    { key: "bapeStussy", match: t => t.includes("bape") && t.includes("stussy") },
    { key: "waffle", match: t => t.includes("waffle racer") && (t.includes("off-white") || t.includes("off white")) },
    { key: "cityFlight", match: t => t.includes("city of flight") },
    { key: "vans", match: t => t.includes("vans") && t.includes("knu skool") },
    { key: "puma", match: t => t.includes("puma") && t.includes("speedcat") },
  ];

  sneakers.forEach(sneaker => {
    const t = titleText(sneaker);
    const rule = STORY_RULES.find(item => item.match(t));
    if (rule) {
      sneaker.story = LOCKED_STORIES[rule.key];
    }

    if (t.includes("quai 54") || t.includes("quai54")) {
      sneaker.images = [
        sneaker.image,
        "pictures/jordan1_quai54_ff_v2_1.png",
        "pictures/jordan1_quai54_1.png",
        "pictures/jordan1_quai54.png",
        "pictures/jordan1_quai54_ff_1.png"
      ].filter(Boolean);
    }

    if (t.includes("yuto") && t.includes("matcha")) {
      sneaker.images = [
        sneaker.image,
        "pictures/sbdunk_yutohorigome_matcha_1.png",
        "pictures/jordan1_yuto_matcha_1.png",
        "pictures/jordan1_yuto_matcha.png",
        "pictures/yuto_matcha_1.png"
      ].filter(Boolean);
    }
  });

  const hasRaygun = sneakers.some(sneaker =>
    normalize(sneaker?.id).includes("raygun") ||
    titleText(sneaker).includes("raygun")
  );

  if (!hasRaygun) {
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
      releaseDate: "2005-02",
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
      story: LOCKED_STORIES.raygun
    });
  }

  window.LOCAN_CONTENT_LOCK_VERSION = "2026-09-17-16pairs-final";
})();
