import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PICTURES = path.join(ROOT, "pictures");
const OUTPUT_ROOT = path.join(PICTURES, "normalized");
const GRID_OUTPUT_ROOT = path.join(OUTPUT_ROOT, "grid");
const WRITE = process.argv.includes("--write");
const BUILD = "20261010-standard-v5";

/*
  PRODUCT IMAGE STANDARD v5
  -------------------------
  Goal:
  - Make the actual sneaker/product read at a consistent visual size.
  - Do NOT use sneaker IDs or per-pair scale numbers.
  - Preserve accessory content (bags, spare laces, tags, boxes) whenever it
    exists, but do not allow small secondary objects to make the shoe itself
    look tiny.

  One source image produces two deterministic homepage derivatives:

  1) GRID
     Uses collection-wide perceptual normalization measured from the
     automatically detected PRIMARY PRODUCT MASS.

  2) VIEW3D
     Keeps the v3/v4 visual target for ordinary images, but uses the same
     primary-product detector when an image contains secondary objects.

  Important:
  - The full foreground is still rendered. Accessories are NOT deleted.
  - Only the measurement/centering target can be based on the primary mass.
  - Ordinary sneaker-only images remain effectively unchanged.
*/
const STANDARD = {
  canvasWidth: 1600,
  canvasHeight: 1200,

  view3d: {
    primaryMaxWidth: 1248,
    primaryMaxHeight: 816,
    baseOuterMaxWidth: 1248,
    baseOuterMaxHeight: 816
  },

  grid: {
    primaryMaxWidth: 1440,
    primaryMaxHeight: 864,
    baseOuterMaxWidth: 1440,
    baseOuterMaxHeight: 864
  },

  /*
    The outer envelope is relaxed only when the detector finds meaningful
    secondary foreground mass. This lets accessories sit closer to the
    canvas edge without forcing the main shoe to shrink.
  */
  maxOuterWidth: 1520,   // 95% of 1600
  maxOuterHeight: 1080,  // 90% of 1200
  accessoryRelaxStrength: 1.35,

  alphaThreshold: 96,
  transparentPixelThreshold: 12,
  minimumTransparentFraction: 0.005,
  cropPaddingFraction: 0.018,
  opaqueBackgroundDistance: 34,

  /*
    Primary-product detection is intentionally generic.
    It operates on a small foreground mask for speed.
  */
  analysisMaxSide: 480,
  componentRelativeMin: 0.055,
  componentCoverageTarget: 0.72,
  componentMaxCount: 4,
  robustTailFraction: 0.07,
  minimumPrimaryCoverage: 0.58,
  significantBoxReduction: 0.88
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function paddedBounds(bounds, width, height, paddingFraction = STANDARD.cropPaddingFraction) {
  const pad = Math.max(
    2,
    Math.round(
      Math.max(bounds.width, bounds.height) *
      paddingFraction
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

function maskBounds(mask, width, height) {
  return boundsFromMask(
    width,
    height,
    (x, y) => mask[y * width + x] === 1
  );
}

function connectedComponents(mask, width, height) {
  const visited = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const components = [];

  const neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1]
  ];

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;

    let head = 0;
    let tail = 0;

    queue[tail++] = start;
    visited[start] = 1;

    let area = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);

      area += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          nx < 0 || nx >= width ||
          ny < 0 || ny >= height
        ) {
          continue;
        }

        const ni = ny * width + nx;

        if (!mask[ni] || visited[ni]) continue;

        visited[ni] = 1;
        queue[tail++] = ni;
      }
    }

    components.push({
      area,
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    });
  }

  return components;
}

function unionBounds(items) {
  if (!items.length) return null;

  const left = Math.min(...items.map(item => item.left));
  const top = Math.min(...items.map(item => item.top));
  const right = Math.max(
    ...items.map(item => item.left + item.width - 1)
  );
  const bottom = Math.max(
    ...items.map(item => item.top + item.height - 1)
  );

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1
  };
}

function projectionQuantile(counts, fraction) {
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (!total) return 0;

  const target = total * fraction;
  let cumulative = 0;

  for (let i = 0; i < counts.length; i += 1) {
    cumulative += counts[i];

    if (cumulative >= target) {
      return i;
    }
  }

  return counts.length - 1;
}

function robustCoreBounds(mask, width, height) {
  const xCounts = new Array(width).fill(0);
  const yCounts = new Array(height).fill(0);
  let total = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;

      xCounts[x] += 1;
      yCounts[y] += 1;
      total += 1;
    }
  }

  if (!total) return null;

  const tail = STANDARD.robustTailFraction;

  const left = projectionQuantile(xCounts, tail);
  const right = projectionQuantile(xCounts, 1 - tail);
  const top = projectionQuantile(yCounts, tail);
  const bottom = projectionQuantile(yCounts, 1 - tail);

  let visible = 0;

  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      if (mask[y * width + x]) {
        visible += 1;
      }
    }
  }

  return {
    left,
    top,
    width: Math.max(1, right - left + 1),
    height: Math.max(1, bottom - top + 1),
    visible,
    totalVisible: total
  };
}

function buildForegroundMask(data, info, method) {
  const { width, height, channels } = info;
  const mask = new Uint8Array(width * height);

  if (method === "alpha") {
    for (let i = 0; i < width * height; i += 1) {
      mask[i] =
        data[i * channels + 3] >= STANDARD.alphaThreshold
          ? 1
          : 0;
    }

    return mask;
  }

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

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;

      mask[y * width + x] =
        colorDistance(
          data[i],
          data[i + 1],
          data[i + 2],
          bg
        ) >= STANDARD.opaqueBackgroundDistance
          ? 1
          : 0;
    }
  }

  return mask;
}

function mapAnalysisBoundsToSource(bounds, analysisInfo, sourceWidth, sourceHeight) {
  const scaleX = sourceWidth / analysisInfo.width;
  const scaleY = sourceHeight / analysisInfo.height;

  const left = Math.max(
    0,
    Math.floor(bounds.left * scaleX)
  );
  const top = Math.max(
    0,
    Math.floor(bounds.top * scaleY)
  );
  const right = Math.min(
    sourceWidth - 1,
    Math.ceil((bounds.left + bounds.width) * scaleX) - 1
  );
  const bottom = Math.min(
    sourceHeight - 1,
    Math.ceil((bounds.top + bounds.height) * scaleY) - 1
  );

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1
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

async function inspectPrimaryMass(input, fullBounds) {
  if (fullBounds.method === "full-frame-fallback") {
    return {
      bounds: { ...fullBounds },
      visiblePixels: fullBounds.visiblePixels,
      coverage: 1,
      method: "full-frame"
    };
  }

  const sourceWidth = fullBounds.sourceWidth;
  const sourceHeight = fullBounds.sourceHeight;

  const analysisScale = Math.min(
    1,
    STANDARD.analysisMaxSide /
      Math.max(sourceWidth, sourceHeight)
  );

  const analysisWidth = Math.max(
    1,
    Math.round(sourceWidth * analysisScale)
  );

  const analysisHeight = Math.max(
    1,
    Math.round(sourceHeight * analysisScale)
  );

  const { data, info } = await sharp(input)
    .rotate()
    .resize({
      width: analysisWidth,
      height: analysisHeight,
      fit: "fill"
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mask = buildForegroundMask(
    data,
    info,
    fullBounds.method
  );

  const overall = maskBounds(
    mask,
    info.width,
    info.height
  );

  if (!overall || !overall.visible) {
    return {
      bounds: { ...fullBounds },
      visiblePixels: fullBounds.visiblePixels,
      coverage: 1,
      method: "full"
    };
  }

  const components = connectedComponents(
    mask,
    info.width,
    info.height
  )
    .filter(component => component.area >= 4)
    .sort((a, b) => b.area - a.area);

  let selectedBounds = null;
  let selectedVisible = 0;
  let selectedMethod = "";

  if (components.length) {
    const largest = components[0].area;
    const meaningful = components.filter(
      component =>
        component.area >=
        Math.max(
          4,
          largest * STANDARD.componentRelativeMin
        )
    );

    const selected = [];
    let covered = 0;

    for (const component of meaningful) {
      selected.push(component);
      covered += component.area;

      if (
        selected.length >= 2 &&
        covered / overall.visible >=
          STANDARD.componentCoverageTarget
      ) {
        break;
      }

      if (
        selected.length >=
        STANDARD.componentMaxCount
      ) {
        break;
      }
    }

    const candidate = unionBounds(selected);
    const candidateCoverage =
      covered / overall.visible;

    if (candidate) {
      const candidateBox =
        candidate.width * candidate.height;
      const overallBox =
        overall.width * overall.height;

      if (
        candidateCoverage >=
          STANDARD.minimumPrimaryCoverage &&
        candidateBox <=
          overallBox *
          STANDARD.significantBoxReduction
      ) {
        selectedBounds = candidate;
        selectedVisible = covered;
        selectedMethod = "components";
      }
    }
  }

  /*
    If connected components do not clearly separate the main product from
    secondary foreground, use a robust central-mass box. It trims only the
    extreme foreground tails and is used only when that reduction is
    substantial enough to indicate a real secondary-object layout.
  */
  if (!selectedBounds) {
    const core = robustCoreBounds(
      mask,
      info.width,
      info.height
    );

    if (core) {
      const coreCoverage =
        core.visible /
        Math.max(core.totalVisible, 1);

      const coreBox =
        core.width * core.height;
      const overallBox =
        overall.width * overall.height;

      if (
        coreCoverage >=
          STANDARD.minimumPrimaryCoverage &&
        coreBox <= overallBox * 0.78
      ) {
        selectedBounds = core;
        selectedVisible = core.visible;
        selectedMethod = "robust-core";
      }
    }
  }

  if (!selectedBounds) {
    return {
      bounds: { ...fullBounds },
      visiblePixels: fullBounds.visiblePixels,
      coverage: 1,
      method: "full"
    };
  }

  let mapped = mapAnalysisBoundsToSource(
    selectedBounds,
    info,
    sourceWidth,
    sourceHeight
  );

  mapped = paddedBounds(
    mapped,
    sourceWidth,
    sourceHeight,
    STANDARD.cropPaddingFraction * 0.65
  );

  const analysisCoverage =
    selectedVisible /
    Math.max(overall.visible, 1);

  const coverage =
    clamp(analysisCoverage, 0, 1);

  return {
    bounds: mapped,
    visiblePixels:
      Math.max(
        1,
        Math.round(
          fullBounds.visiblePixels * coverage
        )
      ),
    coverage,
    method: selectedMethod
  };
}

function primaryFitScale(primary, envelope) {
  return Math.min(
    envelope.primaryMaxWidth /
      Math.max(primary.bounds.width, 1),
    envelope.primaryMaxHeight /
      Math.max(primary.bounds.height, 1)
  );
}

function predictedPrimaryVisiblePixels(profile, envelope) {
  const scale =
    primaryFitScale(profile.primary, envelope);

  return (
    Math.max(profile.primary.visiblePixels, 1) *
    scale *
    scale
  );
}

function predictedPrimaryBoxPixels(profile, envelope) {
  const scale =
    primaryFitScale(profile.primary, envelope);

  return (
    Math.max(
      profile.primary.bounds.width *
      profile.primary.bounds.height,
      1
    ) *
    scale *
    scale
  );
}

function relaxedOuterEnvelope(profile, envelope) {
  const secondaryFraction =
    clamp(
      1 - profile.primary.coverage,
      0,
      0.42
    );

  const relax =
    1 +
    secondaryFraction *
      STANDARD.accessoryRelaxStrength;

  return {
    maxWidth: Math.min(
      STANDARD.maxOuterWidth,
      envelope.baseOuterMaxWidth * relax
    ),
    maxHeight: Math.min(
      STANDARD.maxOuterHeight,
      envelope.baseOuterMaxHeight * relax
    )
  };
}

function fullGuardScale(profile, envelope) {
  const outer =
    relaxedOuterEnvelope(profile, envelope);

  return Math.min(
    outer.maxWidth /
      Math.max(profile.full.width, 1),
    outer.maxHeight /
      Math.max(profile.full.height, 1)
  );
}

function centeredPlacement({
  profile,
  scale,
  renderedWidth,
  renderedHeight
}) {
  const primary = profile.primary.bounds;
  const full = profile.full;

  const primaryCenterX =
    (
      primary.left -
      full.left +
      primary.width / 2
    ) * scale;

  const primaryCenterY =
    (
      primary.top -
      full.top +
      primary.height / 2
    ) * scale;

  let left = Math.round(
    STANDARD.canvasWidth / 2 -
    primaryCenterX
  );

  let top = Math.round(
    STANDARD.canvasHeight / 2 -
    primaryCenterY
  );

  /*
    Keep every accessory visible. Center the main product as much as
    possible, then clamp the full composition inside the canvas.
  */
  left = clamp(
    left,
    0,
    Math.max(
      0,
      STANDARD.canvasWidth -
        renderedWidth
    )
  );

  top = clamp(
    top,
    0,
    Math.max(
      0,
      STANDARD.canvasHeight -
        renderedHeight
    )
  );

  return { left, top };
}

async function renderVariant({
  input,
  profile,
  output,
  mode,
  targetVisiblePixels,
  targetBoxPixels
}) {
  const envelope =
    mode === "view3d"
      ? STANDARD.view3d
      : STANDARD.grid;

  let desiredScale;

  if (mode === "view3d") {
    /*
      For normal sneaker-only images primary == full, so this is identical
      to v3/v4. Only secondary-object compositions receive different sizing.
    */
    desiredScale =
      primaryFitScale(
        profile.primary,
        envelope
      );
  } else {
    const visible =
      Math.max(
        profile.primary.visiblePixels,
        1
      );

    const boxPixels =
      Math.max(
        profile.primary.bounds.width *
        profile.primary.bounds.height,
        1
      );

    const visibleAreaScale =
      Math.sqrt(
        Math.max(
          targetVisiblePixels,
          1
        ) / visible
      );

    const boxAreaScale =
      Math.sqrt(
        Math.max(
          targetBoxPixels,
          1
        ) / boxPixels
      );

    desiredScale = Math.max(
      visibleAreaScale,
      boxAreaScale
    );
  }

  const scale = Math.min(
    desiredScale,
    fullGuardScale(profile, envelope)
  );

  const resizeWidth = Math.max(
    1,
    Math.round(
      profile.full.width * scale
    )
  );

  const resizeHeight = Math.max(
    1,
    Math.round(
      profile.full.height * scale
    )
  );

  const subject = await sharp(input)
    .rotate()
    .extract({
      left: profile.full.left,
      top: profile.full.top,
      width: profile.full.width,
      height: profile.full.height
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

  const placement = centeredPlacement({
    profile,
    scale,
    renderedWidth: subject.info.width,
    renderedHeight: subject.info.height
  });

  if (WRITE) {
    fs.mkdirSync(
      path.dirname(output),
      { recursive: true }
    );

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
          left: placement.left,
          top: placement.top
        }
      ])
      .png({ compressionLevel: 9 })
      .toFile(output);
  }

  return {
    width: subject.info.width,
    height: subject.info.height,
    left: placement.left,
    top: placement.top,
    scale: Number(scale.toFixed(6))
  };
}

/*
  If both pictures/foo.png and pictures/source/foo.png exist,
  pictures/source/foo.png wins.
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

/*
  First pass:
  - detect full foreground
  - detect primary product mass
  - do this before choosing the collection-wide Grid target
*/
const inspected = [];

for (const inputRelative of files) {
  const input = path.join(
    PICTURES,
    inputRelative
  );

  try {
    const full =
      await inspectBounds(input);

    const primary =
      await inspectPrimaryMass(
        input,
        full
      );

    inspected.push({
      inputRelative,
      input,
      relative:
        outputRelative(inputRelative),
      catalogInput:
        catalogInputPath(inputRelative),
      full,
      primary
    });
  } catch (error) {
    console.error(
      `Inspection failed for ${inputRelative}:`
    );
    console.error(
      error?.stack ||
      error?.message ||
      error
    );
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

const referenceRecords = inspected.filter(
  record =>
    record.full.method !==
      "full-frame-fallback"
);

const targetPool =
  referenceRecords.length
    ? referenceRecords
    : inspected;

/*
  Use the median primary-product footprint from the collection.
  No sneaker receives a private target.
*/
const gridTargetVisiblePixels = median(
  targetPool.map(profile =>
    predictedPrimaryVisiblePixels(
      profile,
      STANDARD.view3d
    )
  )
);

const gridTargetBoxPixels = median(
  targetPool.map(profile =>
    predictedPrimaryBoxPixels(
      profile,
      STANDARD.view3d
    )
  )
);

if (WRITE) {
  fs.rmSync(
    OUTPUT_ROOT,
    {
      recursive: true,
      force: true
    }
  );

  fs.mkdirSync(
    GRID_OUTPUT_ROOT,
    { recursive: true }
  );
}

const manifest = {};
const catalogMap = {};

for (const profile of inspected) {
  try {
    const view3dPath =
      `pictures/normalized/${profile.relative}`;

    const gridPath =
      `pictures/normalized/grid/${profile.relative}`;

    const view3dOutput =
      path.join(
        OUTPUT_ROOT,
        profile.relative
      );

    const gridOutput =
      path.join(
        GRID_OUTPUT_ROOT,
        profile.relative
      );

    const view3dSubject =
      await renderVariant({
        input: profile.input,
        profile,
        output: view3dOutput,
        mode: "view3d",
        targetVisiblePixels:
          gridTargetVisiblePixels,
        targetBoxPixels:
          gridTargetBoxPixels
      });

    const gridSubject =
      await renderVariant({
        input: profile.input,
        profile,
        output: gridOutput,
        mode: "grid",
        targetVisiblePixels:
          gridTargetVisiblePixels,
        targetBoxPixels:
          gridTargetBoxPixels
      });

    const payload = {
      input:
        `pictures/${profile.inputRelative}`,
      catalogInput:
        profile.catalogInput,
      grid: gridPath,
      view3d: view3dPath,
      foregroundMethod:
        profile.full.method,
      primaryMethod:
        profile.primary.method,
      primaryCoverage:
        Number(
          profile.primary.coverage.toFixed(4)
        ),
      fullBounds: {
        left: profile.full.left,
        top: profile.full.top,
        width: profile.full.width,
        height: profile.full.height
      },
      primaryBounds: {
        left: profile.primary.bounds.left,
        top: profile.primary.bounds.top,
        width: profile.primary.bounds.width,
        height: profile.primary.bounds.height
      },
      gridSubject,
      view3dSubject
    };

    manifest[view3dPath] = payload;

    catalogMap[
      profile.catalogInput
    ] = {
      grid: gridPath,
      view3d: view3dPath
    };

    console.log(
      `${profile.inputRelative}: ` +
      `${profile.full.method}; ` +
      `primary=${profile.primary.method} ` +
      `coverage=${payload.primaryCoverage}; ` +
      `Grid ${gridSubject.width}x${gridSubject.height}; ` +
      `3D ${view3dSubject.width}x${view3dSubject.height}`
    );
  } catch (error) {
    console.error(
      `Normalization failed for ${profile.inputRelative}:`
    );
    console.error(
      error?.stack ||
      error?.message ||
      error
    );
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
    path.join(
      OUTPUT_ROOT,
      "manifest.json"
    ),
    JSON.stringify(
      manifestPayload,
      null,
      2
    ) + "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(
      OUTPUT_ROOT,
      "manifest.js"
    ),
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
    ? `Generated ${Object.keys(manifest).length} primary-product standardized image set(s).`
    : `Dry run: ${files.length} image(s) validated. Grid targets: visible ${Math.round(
        gridTargetVisiblePixels
      )} px, box ${Math.round(
        gridTargetBoxPixels
      )} px.`
);
