import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();

const SITE =
  "https://locanvvg.github.io/sneaker-room/";

let sharp;

try {
  ({ default: sharp } =
    await import("sharp"));
} catch (_) {
  console.error(
    "Install sharp first: npm install --no-save sharp"
  );
  process.exit(1);
}

function extractArray(
  filename,
  variableName
) {
  const file =
    path.join(
      ROOT,
      filename
    );

  if (!fs.existsSync(file)) {
    return [];
  }

  const source =
    fs.readFileSync(
      file,
      "utf8"
    );

  const marker =
    new RegExp(
      `(?:const|let|var)\\s+${variableName}\\s*=\\s*\\[`
    );

  const match =
    marker.exec(source);

  if (!match) {
    return [];
  }

  const start =
    source.indexOf(
      "[",
      match.index
    );

  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (
    let i = start;
    i < source.length;
    i += 1
  ) {
    const ch =
      source[i];

    const next =
      source[i + 1];

    if (lineComment) {
      if (ch === "\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (
        ch === "*" &&
        next === "/"
      ) {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        quote = "";
      }

      continue;
    }

    if (
      ch === "/" &&
      next === "/"
    ) {
      lineComment = true;
      i += 1;
      continue;
    }

    if (
      ch === "/" &&
      next === "*"
    ) {
      blockComment = true;
      i += 1;
      continue;
    }

    if (
      ch === "'" ||
      ch === '"' ||
      ch === "`"
    ) {
      quote = ch;
      continue;
    }

    if (ch === "[") {
      depth += 1;
      continue;
    }

    if (ch === "]") {
      depth -= 1;

      if (depth === 0) {
        const expression =
          source.slice(
            start,
            i + 1
          );

        return vm.runInNewContext(
          expression,
          Object.create(null),
          { timeout: 1000 }
        );
      }
    }
  }

  throw new Error(
    `Could not parse ${variableName} in ${filename}`
  );
}

function extractObject(
  filename,
  variableName
) {
  const file =
    path.join(
      ROOT,
      filename
    );

  if (!fs.existsSync(file)) {
    return {};
  }

  const source =
    fs.readFileSync(
      file,
      "utf8"
    );

  const marker =
    new RegExp(
      `(?:const|let|var)\\s+${variableName}\\s*=\\s*\\{`
    );

  const match =
    marker.exec(source);

  if (!match) {
    return {};
  }

  const start =
    source.indexOf(
      "{",
      match.index
    );

  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (
    let i = start;
    i < source.length;
    i += 1
  ) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (
        ch === "*" &&
        next === "/"
      ) {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\\\") {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        quote = "";
      }

      continue;
    }

    if (
      ch === "/" &&
      next === "/"
    ) {
      lineComment = true;
      i += 1;
      continue;
    }

    if (
      ch === "/" &&
      next === "*"
    ) {
      blockComment = true;
      i += 1;
      continue;
    }

    if (
      ch === "'" ||
      ch === '"' ||
      ch === "`"
    ) {
      quote = ch;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      continue;
    }

    if (ch === "}") {
      depth -= 1;

      if (depth === 0) {
        const expression =
          source.slice(
            start,
            i + 1
          );

        return vm.runInNewContext(
          `(${expression})`,
          Object.create(null),
          { timeout: 1000 }
        );
      }
    }
  }

  return {};
}

function mergeById(...groups) {
  const map =
    new Map();

  groups
    .flat()
    .forEach(item => {
      if (
        item &&
        item.id
      ) {
        map.set(
          String(item.id),
          item
        );
      }
    });

  return [...map.values()];
}

function localized(
  value,
  lang
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (
    typeof value === "object"
  ) {
    return String(
      value[lang] ??
      value.en ??
      value.vi ??
      ""
    );
  }

  return "";
}

function plainText(value) {
  return String(value || "")
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      " "
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      " "
    )
    .replace(
      /<[^>]+>/g,
      " "
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXML(value) {
  return escapeHTML(value)
    .replace(/'/g, "&apos;");
}

function safeId(value) {
  return String(value || "")
    .trim()
    .replace(
      /[^a-zA-Z0-9_-]+/g,
      "-"
    );
}

function wrapLines(
  text,
  maxCharacters,
  maxLines
) {
  const words =
    String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate =
      line
        ? `${line} ${word}`
        : word;

    if (
      candidate.length <=
        maxCharacters ||
      !line
    ) {
      line = candidate;
      continue;
    }

    lines.push(line);
    line = word;

    if (
      lines.length >=
      maxLines
    ) {
      break;
    }
  }

  if (
    line &&
    lines.length <
      maxLines
  ) {
    lines.push(line);
  }

  if (
    words.join(" ").length >
    lines.join(" ").length
  ) {
    const last =
      lines.length - 1;

    lines[last] =
      lines[last]
        .replace(/[.,;:!?]?$/, "") +
      "…";
  }

  return lines;
}

function normalizedPathForSource(value) {
  const source = String(value || "").trim();

  if (!source.startsWith("pictures/source/")) {
    return source;
  }

  return source
    .replace(/^pictures\/source\//, "pictures/normalized/")
    .replace(/\.(png|jpe?g|webp)$/i, ".png");
}

function itemImages(item) {
  if (
    Array.isArray(item?.images) &&
    item.images.length
  ) {
    return item.images
      .filter(Boolean);
  }

  if (item?.image) {
    return [item.image];
  }

  const sourceImages =
    Array.isArray(item?.sourceImages)
      ? item.sourceImages.filter(Boolean)
      : item?.sourceImage
        ? [item.sourceImage]
        : [];

  if (sourceImages.length) {
    return sourceImages
      .map(normalizedPathForSource)
      .filter(Boolean);
  }

  return [
    "locan-social-preview.png"
  ];
}

function itemImage(
  item,
  imageIndex = 0
) {
  const images =
    itemImages(item);

  return (
    images[imageIndex] ||
    images[0] ||
    "locan-social-preview.png"
  );
}

async function makePreview({
  item,
  lang,
  type,
  title,
  subtitle,
  imageIndex = 0,
  pageVariant = ""
}) {
  const id =
    safeId(item.id);

  const output =
    path.join(
      ROOT,
      "share",
      "previews",
      lang,
      type,
      `${id}${pageVariant}.jpg`
    );

  fs.mkdirSync(
    path.dirname(output),
    { recursive: true }
  );

  const imagePath =
    path.join(
      ROOT,
      itemImage(
        item,
        imageIndex
      )
    );

  let artwork = null;

  if (
    fs.existsSync(imagePath)
  ) {
    artwork =
      await sharp(imagePath)
        .rotate()
        .resize({
          width: 520,
          height: 420,
          fit: "contain",
          withoutEnlargement: true,
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
          }
        })
        .png()
        .toBuffer();
  }

  const titleLength =
    String(title || "").length;

  const titleFontSize =
    titleLength > 72
      ? 30
      : titleLength > 52
        ? 32
        : 35;

  const titleMaxCharacters =
    titleLength > 72
      ? 29
      : titleLength > 52
        ? 27
        : 24;

  const titleLineHeight =
    titleFontSize + 10;

  const titleLines =
    wrapLines(
      title,
      titleMaxCharacters,
      4
    );

  const subtitleLines =
    wrapLines(
      subtitle,
      35,
      2
    );

  const titleStartY = 205;

  const titleSVG =
    titleLines
      .map(
        (line, index) =>
          `<text x="655" y="${titleStartY + index * titleLineHeight}" ` +
          `font-family="Arial,Helvetica,sans-serif" ` +
          `font-size="${titleFontSize}" font-weight="800" fill="#f5f5f7">` +
          `${escapeXML(line)}</text>`
      )
      .join("");

  const subtitleStart =
    titleStartY +
    titleLines.length *
      titleLineHeight +
    28;

  const subtitleSVG =
    subtitleLines
      .map(
        (line, index) =>
          `<text x="655" y="${subtitleStart + index * 30}" ` +
          `font-family="Arial,Helvetica,sans-serif" ` +
          `font-size="20" font-weight="500" fill="#aaaab0">` +
          `${escapeXML(line)}</text>`
      )
      .join("");

  const overlay =
    Buffer.from(`
      <svg
        width="1200"
        height="630"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="1200"
          height="630"
          fill="#0d0d0d"
        />
        <rect
          x="35"
          y="35"
          width="1130"
          height="560"
          rx="28"
          fill="#151517"
          stroke="#29292d"
          stroke-width="2"
        />
        <text
          x="655"
          y="112"
          font-family="Arial,Helvetica,sans-serif"
          font-size="21"
          font-weight="800"
          letter-spacing="3"
          fill="#ffcc00"
        >LỘC AN COLLECTION</text>
        <line
          x1="655"
          y1="137"
          x2="1115"
          y2="137"
          stroke="#3b3b40"
          stroke-width="1"
        />
        ${titleSVG}
        ${subtitleSVG}
        <text
          x="655"
          y="548"
          font-family="Arial,Helvetica,sans-serif"
          font-size="18"
          font-weight="700"
          letter-spacing="2"
          fill="#77777d"
        >PRIVATE DIGITAL ARCHIVE</text>
      </svg>
    `);

  const composites = [
    {
      input: overlay,
      top: 0,
      left: 0
    }
  ];

  if (artwork) {
    composites.push({
      input: artwork,
      left: 80,
      top: 105
    });
  }

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: "#0d0d0d"
    }
  })
    .composite(composites)
    .jpeg({
      quality: 92,
      chromaSubsampling: "4:4:4"
    })
    .toFile(output);

  return (
    `share/previews/${lang}/${type}/${id}${pageVariant}.jpg`
  );
}

function detailURL(
  type,
  id,
  lang,
  imageIndex = 0
) {
  const detailPage =
    type === "sneakers"
      ? "shoe.html"
      : type === "lego"
        ? "lego-detail.html"
        : "sneaker-mask-detail.html";

  let url =
    `${SITE}${detailPage}` +
    `?id=${encodeURIComponent(id)}` +
    `&lang=${encodeURIComponent(lang)}`;

  if (
    type === "sneakers" &&
    imageIndex > 0
  ) {
    url +=
      `&image=${imageIndex + 1}`;
  }

  return url;
}

async function writeSharePage({
  item,
  lang,
  type,
  imageIndex = 0,
  pageVariant = ""
}) {
  const id =
    safeId(item.id);

  const title =
    localized(
      item.title,
      lang
    ) ||
    "Lộc An Collection";

  const subtitle =
    localized(
      item.subtitle,
      lang
    );

  const story =
    plainText(
      localized(
        item.story,
        lang
      )
    );

  const description =
    (
      story ||
      subtitle ||
      title
    )
      .slice(0, 190);

  const preview =
    await makePreview({
      item,
      lang,
      type,
      title,
      subtitle,
      imageIndex,
      pageVariant
    });

  const shareURL =
    `${SITE}share/${lang}/${type}/${id}${pageVariant}.html`;

  const destination =
    detailURL(
      type,
      item.id,
      lang,
      imageIndex
    );

  const previewURL =
    `${SITE}${preview}?v=4`;

  const file =
    path.join(
      ROOT,
      "share",
      lang,
      type,
      `${id}${pageVariant}.html`
    );

  fs.mkdirSync(
    path.dirname(file),
    { recursive: true }
  );

  const html =
`<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <title>${escapeHTML(title)} | Lộc An Collection</title>

  <meta
    name="description"
    content="${escapeHTML(description)}"
  >

  <link
    rel="canonical"
    href="${escapeHTML(destination)}"
  >

  <meta
    property="og:site_name"
    content="Lộc An Sneaker Collection"
  >
  <meta
    property="og:type"
    content="article"
  >
  <meta
    property="og:title"
    content="${escapeHTML(title)}"
  >
  <meta
    property="og:description"
    content="${escapeHTML(description)}"
  >
  <meta
    property="og:url"
    content="${escapeHTML(shareURL)}"
  >
  <meta
    property="og:image"
    content="${escapeHTML(previewURL)}"
  >
  <meta
    property="og:image:secure_url"
    content="${escapeHTML(previewURL)}"
  >
  <meta
    property="og:image:type"
    content="image/jpeg"
  >
  <meta
    property="og:image:width"
    content="1200"
  >
  <meta
    property="og:image:height"
    content="630"
  >
  <meta
    property="og:image:alt"
    content="${escapeHTML(title)}"
  >

  <meta
    name="twitter:card"
    content="summary_large_image"
  >
  <meta
    name="twitter:title"
    content="${escapeHTML(title)}"
  >
  <meta
    name="twitter:description"
    content="${escapeHTML(description)}"
  >
  <meta
    name="twitter:image"
    content="${escapeHTML(previewURL)}"
  >


  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #0d0d0d;
      color: #f5f5f7;
      font-family: Arial, Helvetica, sans-serif;
    }

    a {
      color: #ffcc00;
    }
  </style>

  <script>
    window.setTimeout(
      () => {
        window.location.replace(
          ${JSON.stringify(destination)}
        );
      },
      350
    );
  </script>
</head>
<body>
  <p>
    <a href="${escapeHTML(destination)}">
      ${escapeHTML(title)}
    </a>
  </p>
</body>
</html>`;

  fs.writeFileSync(
    file,
    html,
    "utf8"
  );
}

const sneakers =
  mergeById(
    extractArray(
      "data.js",
      "sneakers"
    ),
    extractArray(
      "catalog-additions.js",
      "CATALOG_ADDITIONS"
    )
  );

const lego =
  extractArray(
    "lego-data.js",
    "legoSets"
  );

const masks =
  extractArray(
    "sneaker-mask-data.js",
    "sneakerMasks"
  );

const galleryFixes =
  extractObject(
    "catalog-additions.js",
    "galleryFixes"
  );

sneakers.forEach(item => {
  const images =
    galleryFixes?.[item.id];

  if (
    Array.isArray(images) &&
    images.length
  ) {
    item.image = images[0];
    item.images = [...images];
  }
});

const groups = [
  {
    type: "sneakers",
    items: sneakers
  },
  {
    type: "lego",
    items: lego
  },
  {
    type: "masks",
    items: masks
  }
];

fs.rmSync(
  path.join(ROOT, "share"),
  {
    recursive: true,
    force: true
  }
);

let count = 0;

for (const group of groups) {
  for (const item of group.items) {
    const images =
      itemImages(item);

    for (const lang of ["vi", "en"]) {
      /*
        Base URL remains available for old links and all
        single-image artifacts. For multi-image sneakers,
        it represents image 1 as a backward-compatible alias.
      */
      await writeSharePage({
        item,
        lang,
        type: group.type,
        imageIndex: 0,
        pageVariant: ""
      });

      count += 1;

      /*
        Multi-image sneaker galleries receive one static share
        page per image. The Share button chooses the page that
        corresponds to the thumbnail currently active on screen.
      */
      if (
        group.type === "sneakers" &&
        images.length > 1
      ) {
        for (
          let imageIndex = 0;
          imageIndex < images.length;
          imageIndex += 1
        ) {
          await writeSharePage({
            item,
            lang,
            type: group.type,
            imageIndex,
            pageVariant:
              `--img-${imageIndex + 1}`
          });

          count += 1;
        }
      }
    }
  }
}

console.log(
  `Generated ${count} share pages with 1200x630 previews.`
);
