import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "pictures", "source");
const OUTPUT_ROOT = path.join(ROOT, "pictures", "normalized");
const WRITE = process.argv.includes("--write");

const STANDARD = {
  canvasWidth: 1600,
  canvasHeight: 1200,
  maxSubjectWidth: 1248,   // 78% of canvas width
  maxSubjectHeight: 816,   // 68% of canvas height
  alphaThreshold: 18,
  minimumTransparentFraction: 0.01
};

let sharp;

try {
  ({ default: sharp } = await import("sharp"));
} catch (_) {
  console.error("Install sharp first: npm install --no-save sharp");
  process.exit(1);
}

function listImages(dir, prefix = "") {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const relative = prefix
        ? path.posix.join(prefix, entry.name)
        : entry.name;

      const absolute = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return listImages(absolute, relative);
      }

      if (
        entry.isFile() &&
        /\.(png|jpe?g|webp)$/i.test(entry.name)
      ) {
        return [relative];
      }

      return [];
    })
    .sort();
}

function normalizedRelative(sourceRelative) {
  return sourceRelative.replace(/\.(png|jpe?g|webp)$/i, ".png");
}

async function inspectAlphaBounds(input) {
  const { data, info } = await sharp(input)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let visible = 0;
  let transparent = 0;
  const threshold = STANDARD.alphaThreshold;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * channels + 3];

      if (alpha <= threshold) {
        transparent += 1;
        continue;
      }

      visible += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (!visible || maxX < minX || maxY < minY) {
    throw new Error("No visible subject pixels were detected.");
  }

  const pixels = width * height;
  const transparentFraction = transparent / pixels;

  if (transparentFraction < STANDARD.minimumTransparentFraction) {
    throw new Error(
      "Image does not appear to have a transparent background. " +
      "Use a clean sneaker cutout PNG with no opaque background."
    );
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    transparentFraction
  };
}

async function normalizeOne(sourceRelative) {
  const input = path.join(SOURCE_ROOT, sourceRelative);
  const outputRelative = normalizedRelative(sourceRelative);
  const output = path.join(OUTPUT_ROOT, outputRelative);

  const bounds = await inspectAlphaBounds(input);

  const subject = await sharp(input)
    .rotate()
    .extract({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height
    })
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
      .composite([
        {
          input: subject.data,
          left,
          top
        }
      ])
      .png({ compressionLevel: 9 })
      .toFile(output);
  }

  console.log(
    `${sourceRelative}: ` +
    `bbox ${bounds.width}x${bounds.height} -> ` +
    `${subject.info.width}x${subject.info.height} ` +
    `on ${STANDARD.canvasWidth}x${STANDARD.canvasHeight}`
  );

  return {
    source: `pictures/source/${sourceRelative}`,
    normalized: `pictures/normalized/${outputRelative}`,
    sourceBounds: {
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

const files = listImages(SOURCE_ROOT);

if (!files.length) {
  console.log("No sneaker source images found in pictures/source/.");
  process.exit(0);
}

if (WRITE) {
  // This directory is fully generated. Clearing it prevents stale
  // normalized files from surviving after a source image is removed.
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
}

const manifest = {};

for (const sourceRelative of files) {
  try {
    const record = await normalizeOne(sourceRelative);
    manifest[record.source] = record;
  } catch (error) {
    console.error(`Normalization failed for ${sourceRelative}:`);
    console.error(error?.message || error);
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
    ? `Generated ${Object.keys(manifest).length} normalized sneaker image(s).`
    : `Dry run: ${Object.keys(manifest).length} source image(s) validated.`
);
