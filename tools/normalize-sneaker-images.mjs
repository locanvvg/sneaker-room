import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PICTURES = path.join(ROOT, "pictures");
const NORMALIZED_ROOT = path.join(PICTURES, "normalized");
const OUTPUT_ROOT = path.join(NORMALIZED_ROOT, "v4b");
const GRID_OUTPUT_ROOT = path.join(OUTPUT_ROOT, "grid");
const WRITE = process.argv.includes("--write");
const BUILD = "20261010-standard-v4b";

/*
  PRODUCT IMAGE STANDARD v4
  -------------------------
  One source image now produces TWO deterministic homepage derivatives:

  1) VIEW3D
     Keeps the already-approved v3 geometry exactly as-is.

  2) GRID
     Uses foreground/subject AREA, not only the outer bounding box.
     This prevents wide/sparse pairs (for example two low shoes placed
     side-by-side) from looking visually smaller than taller compositions.

  There are NO sneaker IDs and NO per-pair scale numbers in this pipeline.
  Every image is measured with the same rules.
*/
const STANDARD = {
  canvasWidth: 1600,
  canvasHeight: 1200,

  view3d: {
    maxSubjectWidth: 1248,   // preserve v3 exactly
    maxSubjectHeight: 816
  },

  grid: {
    /*
      Grid is allowed a little more horizontal room because listing cards
      are where wide/sparse silhouettes otherwise look too small.  The
      actual final size is still chosen automatically from visible-pixel
      area; these are only global safety envelopes.
    */
    maxSubjectWidth: 1440,   // 90% of canvas
    maxSubjectHeight: 864    // 72% of canvas
  },

  alphaThreshold: 96,
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

function catalogInputPath(inputRelative) {
  return `pictures/${outputRelative(inputRelative)}`;
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
  const right = Math.min(
    width - 1,
    bounds.left + bounds.width - 1 + pad
  );
  const bottom = Math.min(
    height - 1,
    bounds.top + bounds.height - 1 + pad
  );

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
        data[(y * width + x) * channels + 3] >=
        STANDARD.alphaThreshold
    );

    if (alphaBounds) {
      return {
        ...paddedBounds(alphaBounds, width, height),
        method: "alpha",
        transparentFraction,
        visiblePixels: alphaBounds.visible,
        sourceWidth: width,
        sourceHeight: height
      };
    }
  }

  /*
    Opaque-image fallback:
    estimate the background from border pixels and detect the subject by
    color distance. This keeps the build deterministic even if an old image
    was exported with a flat background instead of transparency.
  */
  const borderR = [];
  const borderG = [];
  const borderB = [];
  const border = Math.max(
    1,
    Math.round(Math.min(width, height) * 0.025)
  );

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
        transparentFraction,
        visiblePixels: colorBounds.visible,
        sourceWidth: width,
        sourceHeight: height
      };
    }
  }

  /* Last-resort full-frame fallback: never break the asset build. */
  return {
    left: 0,
    top: 0,
    width,
    height,
    method: "full-frame-fallback",
    transparentFraction,
    visiblePixels: pixels,
    sourceWidth: width,
    sourceHeight: height
  };
}

function maxFitScale(bounds, envelope) {
  return Math.min(
    envelope.maxSubjectWidth / Math.max(bounds.width, 1),
    envelope.maxSubjectHeight / Math.max(bounds.height, 1)
  );
}

function predictedVisiblePixels(bounds, envelope) {
  const scale = maxFitScale(bounds, envelope);
  return Math.max(bounds.visiblePixels || 1, 1) * scale * scale;
}

function predictedBoxPixels(bounds, envelope) {
  const scale = maxFitScale(bounds, envelope);
  return Math.max(bounds.width * bounds.height, 1) * scale * scale;
}

async function renderVariant({
  input,
  bounds,
  output,
  mode,
  targetVisiblePixels,
  targetBoxPixels
}) {
  let resizeWidth;
  let resizeHeight;

  if (mode === "view3d") {
    /* Preserve the v3 derivative geometry exactly. */
    const scale = maxFitScale(bounds, STANDARD.view3d);

    resizeWidth = Math.max(1, Math.round(bounds.width * scale));
    resizeHeight = Math.max(1, Math.round(bounds.height * scale));
  } else {
    /*
      Perceptual Grid fit:
      choose one uniform linear scale so the detected foreground area tends
      toward the collection median.  The same global envelope is then used
      as a clipping/padding guard for every pair.
    */
    const visible = Math.max(bounds.visiblePixels || 1, 1);
    const boxPixels = Math.max(bounds.width * bounds.height, 1);

    const visibleAreaScale = Math.sqrt(
      Math.max(targetVisiblePixels, 1) / visible
    );

    const boxAreaScale = Math.sqrt(
      Math.max(targetBoxPixels, 1) / boxPixels
    );

    /*
      Use the stronger of the two collection-wide signals:
      - actual foreground/ink area
      - detected subject bounding-box area

      This is what fixes wide, low-profile compositions without ever naming
      a specific sneaker. A wide pair can grow until its visual footprint is
      comparable with the collection median, subject only to the same global
      padding envelope used by every item.
    */
    const perceptualScale = Math.max(
      visibleAreaScale,
      boxAreaScale
    );

    const envelopeScale = maxFitScale(bounds, STANDARD.grid);

    /*
      Wide + sparse composition guard.

      A wide subject box with relatively low foreground density usually means
      that two separated shoes (or similarly sparse objects) occupy the same
      outer box. In that case the box-area term can over-compensate and make
      the pair visibly larger than the rest of the collection.

      This is a GLOBAL composition rule: no sneaker IDs and no per-pair scale.
      For those wide/sparse layouts, Grid is capped at the same v3 baseline
      envelope already used by 3D. Dense wide layouts (for example NB 2002R)
      remain on the v4 perceptual fit.
    */
    const aspectRatio =
      bounds.width / Math.max(bounds.height, 1);

    const foregroundDensity =
      visible / Math.max(boxPixels, 1);

    const isWideSparseComposition =
      aspectRatio >= 1.90 &&
      foregroundDensity < 0.48;

    const baselineScale =
      maxFitScale(bounds, STANDARD.view3d);

    const scale = isWideSparseComposition
      ? Math.min(
          perceptualScale,
          envelopeScale,
          baselineScale
        )
      : Math.min(
          perceptualScale,
          envelopeScale
        );

    resizeWidth = Math.max(1, Math.round(bounds.width * scale));
    resizeHeight = Math.max(1, Math.round(bounds.height * scale));
  }

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
      width: resizeWidth,
      height: resizeHeight,
      fit: "fill",
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
        background: {
          r: 0,
          g: 0,
          b: 0,
          alpha: 0
        }
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

  return {
    width: subject.info.width,
    height: subject.info.height,
    left,
    top
  };
}

/*
  If both pictures/foo.png and pictures/source/foo.png exist,
  pictures/source/foo.png wins. This lets the archive keep an untouched
  master while the homepage always receives deterministic derivatives.
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

/* First pass: inspect every source before choosing the shared Grid target. */
const inspected = [];

for (const inputRelative of files) {
  const input = path.join(PICTURES, inputRelative);

  try {
    const bounds = await inspectBounds(input);

    inspected.push({
      inputRelative,
      input,
      relative: outputRelative(inputRelative),
      catalogInput: catalogInputPath(inputRelative),
      bounds
    });
  } catch (error) {
    console.error(`Inspection failed for ${inputRelative}:`);
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

/*
  The target is data-driven, not hand-tuned per shoe: use the median visual
  foreground area that the already-approved v3 geometry would produce.
  Full-frame fallbacks are excluded when possible so a bad opaque export
  cannot bias the collection target.
*/
const referenceRecords = inspected.filter(
  record => record.bounds.method !== "full-frame-fallback"
);

const targetPool = referenceRecords.length
  ? referenceRecords
  : inspected;

const gridTargetVisiblePixels = median(
  targetPool.map(record =>
    predictedVisiblePixels(record.bounds, STANDARD.view3d)
  )
);

const gridTargetBoxPixels = median(
  targetPool.map(record =>
    predictedBoxPixels(record.bounds, STANDARD.view3d)
  )
);

if (WRITE) {
  /* Fully generated directory: stale files cannot survive. */
  fs.rmSync(NORMALIZED_ROOT, {
    recursive: true,
    force: true
  });

  fs.mkdirSync(GRID_OUTPUT_ROOT, {
    recursive: true
  });
}

const manifest = {};
const catalogMap = {};

for (const record of inspected) {
  try {
    const view3dPath = `pictures/normalized/v4b/${record.relative}`;
    const gridPath = `pictures/normalized/v4b/grid/${record.relative}`;

    const view3dOutput = path.join(OUTPUT_ROOT, record.relative);
    const gridOutput = path.join(GRID_OUTPUT_ROOT, record.relative);

    const view3dSubject = await renderVariant({
      input: record.input,
      bounds: record.bounds,
      output: view3dOutput,
      mode: "view3d",
      targetVisiblePixels: gridTargetVisiblePixels,
      targetBoxPixels: gridTargetBoxPixels
    });

    const gridSubject = await renderVariant({
      input: record.input,
      bounds: record.bounds,
      output: gridOutput,
      mode: "grid",
      targetVisiblePixels: gridTargetVisiblePixels,
      targetBoxPixels: gridTargetBoxPixels
    });

    const payload = {
      input: `pictures/${record.inputRelative}`,
      catalogInput: record.catalogInput,
      grid: gridPath,
      view3d: view3dPath,
      method: record.bounds.method,
      crop: {
        left: record.bounds.left,
        top: record.bounds.top,
        width: record.bounds.width,
        height: record.bounds.height
      },
      visiblePixels: record.bounds.visiblePixels,
      gridSubject,
      view3dSubject
    };

    manifest[view3dPath] = payload;
    catalogMap[record.catalogInput] = {
      grid: gridPath,
      view3d: view3dPath
    };

    console.log(
      `${record.inputRelative}: ` +
      `${record.bounds.method}; ` +
      `Grid ${gridSubject.width}x${gridSubject.height}; ` +
      `3D ${view3dSubject.width}x${view3dSubject.height}`
    );
  } catch (error) {
    console.error(`Normalization failed for ${record.inputRelative}:`);
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

if (WRITE) {
  const manifestPayload = {
    build: BUILD,
    standard: {
      ...STANDARD,
      gridTargetVisiblePixels,
      gridTargetBoxPixels
    },
    images: manifest,
    catalogMap
  };

  fs.writeFileSync(
    path.join(NORMALIZED_ROOT, "manifest.json"),
    JSON.stringify(manifestPayload, null, 2) + "\n",
    "utf8"
  );

  /*
    Browser-safe synchronous manifest.
    index.html loads this before catalog-normalization.js, so Grid cards use
    the final Grid derivative on their FIRST render.  3D cards are switched
    to the preserved v3 derivative before lazy loading begins.
  */
  fs.writeFileSync(
    path.join(NORMALIZED_ROOT, "manifest.js"),
    `/* Generated file — do not edit by hand. Build: ${BUILD} */\n` +
    `window.CATALOG_NORMALIZED_IMAGE_MAP = Object.freeze(${JSON.stringify(
      catalogMap,
      null,
      2
    )});\n`,
    "utf8"
  );
}

console.log(
  WRITE
    ? `Generated ${Object.keys(manifest).length} dual-mode standardized image set(s).`
    : `Dry run: ${files.length} image(s) validated. Grid targets: visible ${Math.round(gridTargetVisiblePixels)} px, box ${Math.round(gridTargetBoxPixels)} px.`
);
