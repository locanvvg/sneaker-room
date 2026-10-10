import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PICTURES = path.join(ROOT, "pictures");
const OUTPUT_ROOT = path.join(PICTURES, "normalized");
const WRITE = process.argv.includes("--write");

const STANDARD = {
  canvasWidth: 1600,
  canvasHeight: 1200,
  maxSubjectWidth: 1248,   // 78% of canvas width
  maxSubjectHeight: 816,   // 68% of canvas height
  alphaThreshold: 96,     // ignores faint glow / soft shadow
  transparentPixelThreshold: 12,
  minimumTransparentFraction: 0.005,
  cropPaddingFraction: 0.018,
  opaqueBackgroundDistance: 34
};

let sharp;

try {
  ({ default: sharp } = await import("sharp"));
} catch (_) {
  console.error("Install sharp first: npm install --no-save sharp");
  process.exit(1);
}

if (!fs.existsSync(PICTURES)) {
  console.error("pictures/ directory not found");
  process.exit(1);
}

function walkImages(dir, prefix = "") {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const relative = prefix
        ? path.posix.join(prefix, entry.name)
        : entry.name;

      const absolute = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (
          relative === "normalized" ||
          relative.startsWith("normalized/") ||
          relative === "optimized" ||
          relative.startsWith("optimized/")
        ) {
          return [];
        }

        return walkImages(absolute, relative);
      }

      if (
        entry.isFile() &&
        /\.(png|jpe?g|webp)$/i.test(entry.name)
      ) {
        return [relative];
      }

      return [];
    });
}

function outputRelative(inputRelative) {
  const withoutSource = inputRelative.startsWith("source/")
    ? inputRelative.slice("source/".length)
    : inputRelative;

  return withoutSource.replace(/\.(png|jpe?g|webp)$/i, ".png");
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function colorDistance(r, g, b, bg) {
  const dr = r - bg.r;
  const dg = g - bg.g;
  const db = b - bg.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function paddedBounds(bounds, width, height) {
  const pad = Math.max(
    2,
    Math.round(
      Math.max(bounds.width, bounds.height) *
      STANDARD.cropPaddingFraction
    )
  );

  const left = Math.max(0, bounds.left - pad);
  const top = Math.max(0, bounds.top - pad);
  const right = Math.min(width - 1, bounds.left + bounds.width - 1 + pad);
  const bottom = Math.min(height - 1, bounds.top + bounds.height - 1 + pad);

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1
  };
}

function boundsFromMask(width, height, visibleAt) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let visible = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!visibleAt(x, y)) continue;

      visible += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (!visible || maxX < minX || maxY < minY) {
    return null;
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    visible
  };
}

async function inspectBounds(input) {
  const { data, info } = await sharp(input)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = width * height;

  let transparent = 0;

  for (let i = 0; i < pixels; i += 1) {
    const alpha = data[i * channels + 3];
    if (alpha <= STANDARD.transparentPixelThreshold) {
      transparent += 1;
    }
  }

  const transparentFraction = transparent / pixels;

  if (transparentFraction >= STANDARD.minimumTransparentFraction) {
    const alphaBounds = boundsFromMask(
      width,
      height,
      (x, y) =>
        data[(y * width + x) * channels + 3] >= STANDARD.alphaThreshold
    );

    if (alphaBounds) {
      return {
        ...paddedBounds(alphaBounds, width, height),
        method: "alpha",
        transparentFraction
      };
    }
  }

  /*
    Opaque-image fallback:
    estimate the background from border pixels and use color distance.
    This keeps the pipeline from failing if an old cutout was exported
    with a flat background instead of transparency.
  */
  const borderR = [];
  const borderG = [];
  const borderB = [];
  const border = Math.max(1, Math.round(Math.min(width, height) * 0.025));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (
        x >= border &&
        x < width - border &&
        y >= border &&
        y < height - border
      ) {
        continue;
      }

      const i = (y * width + x) * channels;
      borderR.push(data[i]);
      borderG.push(data[i + 1]);
      borderB.push(data[i + 2]);
    }
  }

  const bg = {
    r: median(borderR),
    g: median(borderG),
    b: median(borderB)
  };

  const colorBounds = boundsFromMask(
    width,
    height,
    (x, y) => {
      const i = (y * width + x) * channels;
      return colorDistance(
        data[i],
        data[i + 1],
        data[i + 2],
        bg
      ) >= STANDARD.opaqueBackgroundDistance;
    }
  );

  if (colorBounds) {
    const visibleFraction = colorBounds.visible / pixels;

    if (visibleFraction > 0.003 && visibleFraction < 0.96) {
      return {
        ...paddedBounds(colorBounds, width, height),
        method: "border-color",
        transparentFraction
      };
    }
  }

  /* Last-resort full-frame fallback: never break the build. */
  return {
    left: 0,
    top: 0,
    width,
    height,
    method: "full-frame-fallback",
    transparentFraction
  };
}

async function normalizeOne(inputRelative) {
  const input = path.join(PICTURES, inputRelative);
  const relative = outputRelative(inputRelative);
  const output = path.join(OUTPUT_ROOT, relative);

  const bounds = await inspectBounds(input);

  const subject = await sharp(input)
    .rotate()
    .extract({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height
    })
    .ensureAlpha()
    .resize({
      width: STANDARD.maxSubjectWidth,
      height: STANDARD.maxSubjectHeight,
      fit: "inside",
      withoutEnlargement: false
    })
    .png()
    .toBuffer({ resolveWithObject: true });

  const left = Math.round(
    (STANDARD.canvasWidth - subject.info.width) / 2
  );

  const top = Math.round(
    (STANDARD.canvasHeight - subject.info.height) / 2
  );

  if (WRITE) {
    fs.mkdirSync(path.dirname(output), { recursive: true });

    await sharp({
      create: {
        width: STANDARD.canvasWidth,
        height: STANDARD.canvasHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: subject.data, left, top }])
      .png({ compressionLevel: 9 })
      .toFile(output);
  }

  console.log(
    `${inputRelative} -> ${relative}: ` +
    `${bounds.method}, crop ${bounds.width}x${bounds.height}, ` +
    `subject ${subject.info.width}x${subject.info.height}`
  );

  return {
    input: `pictures/${inputRelative}`,
    normalized: `pictures/normalized/${relative}`,
    method: bounds.method,
    crop: {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height
    },
    normalizedSubject: {
      width: subject.info.width,
      height: subject.info.height,
      left,
      top
    }
  };
}

/*
  If both pictures/foo.png and pictures/source/foo.png exist,
  pictures/source/foo.png wins. This makes migration from the v1 test
  safe without requiring the user to restore/delete files first.
*/
const candidates = walkImages(PICTURES);
const selected = new Map();

for (const relative of candidates) {
  const output = outputRelative(relative);
  const isSource = relative.startsWith("source/");
  const existing = selected.get(output);

  if (!existing || isSource) {
    selected.set(output, relative);
  }
}

const files = [...selected.values()].sort();

if (!files.length) {
  console.log("No sneaker images found in pictures/.");
  process.exit(0);
}

if (WRITE) {
  /* Fully generated directory: stale files cannot survive. */
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
}

const manifest = {};

for (const inputRelative of files) {
  try {
    const record = await normalizeOne(inputRelative);
    manifest[record.normalized] = record;
  } catch (error) {
    console.error(`Normalization failed for ${inputRelative}:`);
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

if (WRITE) {
  fs.writeFileSync(
    path.join(OUTPUT_ROOT, "manifest.json"),
    JSON.stringify(
      {
        build: "20261010-unified-v2",
        standard: STANDARD,
        images: manifest
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}

console.log(
  WRITE
    ? `Generated ${Object.keys(manifest).length} normalized image(s).`
    : `Dry run: ${files.length} image(s) validated.`
);
