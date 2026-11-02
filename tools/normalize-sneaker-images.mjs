import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PICTURES = path.join(ROOT, "pictures");
const NORMALIZED_ROOT = path.join(PICTURES, "normalized");
const OUTPUT_ROOT = path.join(NORMALIZED_ROOT, "v6");
const GRID_OUTPUT_ROOT = path.join(OUTPUT_ROOT, "grid");
const WRITE = process.argv.includes("--write");
const BUILD = "20261101-global-visual-v6";

/*
  GLOBAL VISUAL STANDARD v6
  -------------------------
  Grid and 3D now use the SAME automatic visual-footprint model.

  No sneaker IDs.
  No per-pair scale values.
  No "special shoe" exceptions.

  Every source is:
    1. measured from visible foreground pixels,
    2. cropped automatically,
    3. assigned one collection-wide visual-footprint target,
    4. fitted inside one global safety envelope,
    5. centered on the same 1600 x 1200 transparent canvas.

  Visual footprint combines:
    - true visible foreground area
    - outer subject bounding-box area

  The geometric mean of those two areas prevents:
    - sparse/wide pairs from becoming too large,
    - dense/tall shoes from becoming too small,
    - open sandals from being judged only by their empty bounding box.
*/
const STANDARD = {
  canvasWidth: 1600,
  canvasHeight: 1200,

  /*
    SAME envelope in both modes.
    Responsive CSS can resize the card, but every normalized bitmap starts
    from the same collection-wide geometry.
  */
  envelope: {
    maxSubjectWidth: 1280,
    maxSubjectHeight: 816
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
  console.error(
    "Install sharp first: npm install --no-save sharp"
  );
  process.exit(1);
}

if (!fs.existsSync(PICTURES)) {
  console.error(
    "pictures/ directory not found"
  );
  process.exit(1);
}

function walkImages(
  dir,
  prefix = ""
) {
  return fs
    .readdirSync(
      dir,
      {
        withFileTypes:
          true
      }
    )
    .flatMap(
      entry => {
        const relative =
          prefix
            ? path.posix.join(
                prefix,
                entry.name
              )
            : entry.name;

        const absolute =
          path.join(
            dir,
            entry.name
          );

        if (
          entry.isDirectory()
        ) {
          if (
            relative ===
              "normalized" ||
            relative.startsWith(
              "normalized/"
            ) ||
            relative ===
              "optimized" ||
            relative.startsWith(
              "optimized/"
            )
          ) {
            return [];
          }

          return walkImages(
            absolute,
            relative
          );
        }

        if (
          entry.isFile() &&
          /\.(png|jpe?g|webp)$/i.test(
            entry.name
          )
        ) {
          return [
            relative
          ];
        }

        return [];
      }
    );
}

function outputRelative(
  inputRelative
) {
  const withoutSource =
    inputRelative.startsWith(
      "source/"
    )
      ? inputRelative.slice(
          "source/".length
        )
      : inputRelative;

  return withoutSource.replace(
    /\.(png|jpe?g|webp)$/i,
    ".png"
  );
}

function catalogInputPath(
  inputRelative
) {
  return (
    `pictures/` +
    outputRelative(
      inputRelative
    )
  );
}

function median(values) {
  if (!values.length) {
    return 0;
  }

  const sorted =
    [...values].sort(
      (a, b) =>
        a - b
    );

  const middle =
    Math.floor(
      sorted.length / 2
    );

  return sorted.length % 2
    ? sorted[middle]
    : (
        sorted[
          middle - 1
        ] +
        sorted[
          middle
        ]
      ) / 2;
}

function colorDistance(
  r,
  g,
  b,
  bg
) {
  const dr =
    r - bg.r;

  const dg =
    g - bg.g;

  const db =
    b - bg.b;

  return Math.sqrt(
    dr * dr +
    dg * dg +
    db * db
  );
}

function paddedBounds(
  bounds,
  width,
  height
) {
  const pad =
    Math.max(
      2,
      Math.round(
        Math.max(
          bounds.width,
          bounds.height
        ) *
        STANDARD
          .cropPaddingFraction
      )
    );

  const left =
    Math.max(
      0,
      bounds.left -
        pad
    );

  const top =
    Math.max(
      0,
      bounds.top -
        pad
    );

  const right =
    Math.min(
      width - 1,
      bounds.left +
        bounds.width -
        1 +
        pad
    );

  const bottom =
    Math.min(
      height - 1,
      bounds.top +
        bounds.height -
        1 +
        pad
    );

  return {
    left,
    top,
    width:
      right -
      left +
      1,
    height:
      bottom -
      top +
      1
  };
}

function boundsFromMask(
  width,
  height,
  visibleAt
) {
  let minX =
    width;

  let minY =
    height;

  let maxX =
    -1;

  let maxY =
    -1;

  let visible =
    0;

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      if (
        !visibleAt(
          x,
          y
        )
      ) {
        continue;
      }

      visible +=
        1;

      if (x < minX) {
        minX = x;
      }

      if (x > maxX) {
        maxX = x;
      }

      if (y < minY) {
        minY = y;
      }

      if (y > maxY) {
        maxY = y;
      }
    }
  }

  if (
    !visible ||
    maxX < minX ||
    maxY < minY
  ) {
    return null;
  }

  return {
    left:
      minX,
    top:
      minY,
    width:
      maxX -
      minX +
      1,
    height:
      maxY -
      minY +
      1,
    visible
  };
}

async function inspectBounds(
  input
) {
  const {
    data,
    info
  } =
    await sharp(
      input
    )
      .rotate()
      .ensureAlpha()
      .raw()
      .toBuffer({
        resolveWithObject:
          true
      });

  const {
    width,
    height,
    channels
  } =
    info;

  const pixels =
    width *
    height;

  let transparent =
    0;

  for (
    let i = 0;
    i < pixels;
    i += 1
  ) {
    const alpha =
      data[
        i *
          channels +
        3
      ];

    if (
      alpha <=
      STANDARD
        .transparentPixelThreshold
    ) {
      transparent +=
        1;
    }
  }

  const transparentFraction =
    transparent /
    pixels;

  if (
    transparentFraction >=
    STANDARD
      .minimumTransparentFraction
  ) {
    const alphaBounds =
      boundsFromMask(
        width,
        height,
        (x, y) =>
          data[
            (
              y *
                width +
              x
            ) *
              channels +
            3
          ] >=
          STANDARD
            .alphaThreshold
      );

    if (
      alphaBounds
    ) {
      return {
        ...paddedBounds(
          alphaBounds,
          width,
          height
        ),
        method:
          "alpha",
        transparentFraction,
        visiblePixels:
          alphaBounds.visible,
        sourceWidth:
          width,
        sourceHeight:
          height
      };
    }
  }

  /*
    Opaque fallback:
    estimate the border color and detect foreground by color distance.
  */
  const borderR =
    [];

  const borderG =
    [];

  const borderB =
    [];

  const border =
    Math.max(
      1,
      Math.round(
        Math.min(
          width,
          height
        ) *
        0.025
      )
    );

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      if (
        x >= border &&
        x <
          width -
            border &&
        y >= border &&
        y <
          height -
            border
      ) {
        continue;
      }

      const i =
        (
          y *
            width +
          x
        ) *
        channels;

      borderR.push(
        data[i]
      );

      borderG.push(
        data[
          i + 1
        ]
      );

      borderB.push(
        data[
          i + 2
        ]
      );
    }
  }

  const bg = {
    r:
      median(
        borderR
      ),
    g:
      median(
        borderG
      ),
    b:
      median(
        borderB
      )
  };

  const colorBounds =
    boundsFromMask(
      width,
      height,
      (x, y) => {
        const i =
          (
            y *
              width +
            x
          ) *
          channels;

        return (
          colorDistance(
            data[i],
            data[
              i + 1
            ],
            data[
              i + 2
            ],
            bg
          ) >=
          STANDARD
            .opaqueBackgroundDistance
        );
      }
    );

  if (
    colorBounds
  ) {
    const visibleFraction =
      colorBounds.visible /
      pixels;

    if (
      visibleFraction >
        0.003 &&
      visibleFraction <
        0.96
    ) {
      return {
        ...paddedBounds(
          colorBounds,
          width,
          height
        ),
        method:
          "border-color",
        transparentFraction,
        visiblePixels:
          colorBounds.visible,
        sourceWidth:
          width,
        sourceHeight:
          height
      };
    }
  }

  return {
    left:
      0,
    top:
      0,
    width,
    height,
    method:
      "full-frame-fallback",
    transparentFraction,
    visiblePixels:
      pixels,
    sourceWidth:
      width,
    sourceHeight:
      height
  };
}

function maxFitScale(
  bounds
) {
  return Math.min(
    STANDARD
      .envelope
      .maxSubjectWidth /
      Math.max(
        bounds.width,
        1
      ),

    STANDARD
      .envelope
      .maxSubjectHeight /
      Math.max(
        bounds.height,
        1
      )
  );
}

/*
  One global perceptual metric.

  visiblePixels:
    how much actual sneaker ink is present.

  boxPixels:
    how large the outer silhouette spans.

  Geometric mean:
    balances both without allowing either one to dominate.
*/
function rawVisualFootprint(
  bounds
) {
  const visible =
    Math.max(
      bounds.visiblePixels ||
        1,
      1
    );

  const box =
    Math.max(
      bounds.width *
        bounds.height,
      1
    );

  return Math.sqrt(
    visible *
    box
  );
}

function predictedVisualFootprint(
  bounds
) {
  const scale =
    maxFitScale(
      bounds
    );

  return (
    rawVisualFootprint(
      bounds
    ) *
    scale *
    scale
  );
}

function automaticScale(
  bounds,
  targetVisualFootprint
) {
  const raw =
    rawVisualFootprint(
      bounds
    );

  const visualScale =
    Math.sqrt(
      Math.max(
        targetVisualFootprint,
        1
      ) /
      Math.max(
        raw,
        1
      )
    );

  /*
    Global envelope is the only size cap.
    No shape-specific or sneaker-specific branch.
  */
  return Math.min(
    visualScale,
    maxFitScale(
      bounds
    )
  );
}

async function renderVariant({
  input,
  bounds,
  output,
  targetVisualFootprint
}) {
  const scale =
    automaticScale(
      bounds,
      targetVisualFootprint
    );

  const resizeWidth =
    Math.max(
      1,
      Math.round(
        bounds.width *
        scale
      )
    );

  const resizeHeight =
    Math.max(
      1,
      Math.round(
        bounds.height *
        scale
      )
    );

  const subject =
    await sharp(
      input
    )
      .rotate()
      .extract({
        left:
          bounds.left,
        top:
          bounds.top,
        width:
          bounds.width,
        height:
          bounds.height
      })
      .ensureAlpha()
      .resize({
        width:
          resizeWidth,
        height:
          resizeHeight,
        fit:
          "fill",
        withoutEnlargement:
          false
      })
      .png()
      .toBuffer({
        resolveWithObject:
          true
      });

  const left =
    Math.round(
      (
        STANDARD
          .canvasWidth -
        subject
          .info
          .width
      ) /
      2
    );

  const top =
    Math.round(
      (
        STANDARD
          .canvasHeight -
        subject
          .info
          .height
      ) /
      2
    );

  if (WRITE) {
    fs.mkdirSync(
      path.dirname(
        output
      ),
      {
        recursive:
          true
      }
    );

    await sharp({
      create: {
        width:
          STANDARD
            .canvasWidth,
        height:
          STANDARD
            .canvasHeight,
        channels:
          4,
        background: {
          r:
            0,
          g:
            0,
          b:
            0,
          alpha:
            0
        }
      }
    })
      .composite([
        {
          input:
            subject.data,
          left,
          top
        }
      ])
      .png({
        compressionLevel:
          9
      })
      .toFile(
        output
      );
  }

  return {
    width:
      subject.info.width,
    height:
      subject.info.height,
    left,
    top,
    scale
  };
}

/*
  If both pictures/foo.png and pictures/source/foo.png exist,
  the source/ master wins.
*/
const candidates =
  walkImages(
    PICTURES
  );

const selected =
  new Map();

for (
  const relative of
    candidates
) {
  const output =
    outputRelative(
      relative
    );

  const isSource =
    relative.startsWith(
      "source/"
    );

  const existing =
    selected.get(
      output
    );

  if (
    !existing ||
    isSource
  ) {
    selected.set(
      output,
      relative
    );
  }
}

const files =
  [
    ...selected.values()
  ].sort();

if (!files.length) {
  console.log(
    "No sneaker images found in pictures/."
  );

  process.exit(0);
}

/*
  PASS 1:
  inspect every source before choosing the ONE collection-wide target.
*/
const inspected =
  [];

for (
  const inputRelative of
    files
) {
  const input =
    path.join(
      PICTURES,
      inputRelative
    );

  try {
    const bounds =
      await inspectBounds(
        input
      );

    inspected.push({
      inputRelative,
      input,
      relative:
        outputRelative(
          inputRelative
        ),
      catalogInput:
        catalogInputPath(
          inputRelative
        ),
      bounds
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

    process.exitCode =
      1;
  }
}

if (
  process.exitCode
) {
  process.exit(
    process.exitCode
  );
}

/*
  Use the median visual footprint produced by the common safety envelope.
  Full-frame fallbacks are excluded when possible.
*/
const referenceRecords =
  inspected.filter(
    record =>
      record
        .bounds
        .method !==
      "full-frame-fallback"
  );

const targetPool =
  referenceRecords.length
    ? referenceRecords
    : inspected;

const targetVisualFootprint =
  median(
    targetPool.map(
      record =>
        predictedVisualFootprint(
          record.bounds
        )
    )
  );

if (WRITE) {
  fs.rmSync(
    NORMALIZED_ROOT,
    {
      recursive:
        true,
      force:
        true
    }
  );

  fs.mkdirSync(
    GRID_OUTPUT_ROOT,
    {
      recursive:
        true
    }
  );
}

const manifest =
  {};

const catalogMap =
  {};

for (
  const record of
    inspected
) {
  try {
    const view3dPath =
      `pictures/normalized/v6/${record.relative}`;

    const gridPath =
      `pictures/normalized/v6/grid/${record.relative}`;

    const view3dOutput =
      path.join(
        OUTPUT_ROOT,
        record.relative
      );

    const gridOutput =
      path.join(
        GRID_OUTPUT_ROOT,
        record.relative
      );

    /*
      SAME algorithm + SAME target in both modes.
      Separate files are retained only for architecture compatibility.
    */
    const view3dSubject =
      await renderVariant({
        input:
          record.input,
        bounds:
          record.bounds,
        output:
          view3dOutput,
        targetVisualFootprint
      });

    const gridSubject =
      await renderVariant({
        input:
          record.input,
        bounds:
          record.bounds,
        output:
          gridOutput,
        targetVisualFootprint
      });

    const payload = {
      input:
        `pictures/${record.inputRelative}`,
      catalogInput:
        record.catalogInput,
      grid:
        gridPath,
      view3d:
        view3dPath,
      method:
        record.bounds.method,
      crop: {
        left:
          record.bounds.left,
        top:
          record.bounds.top,
        width:
          record.bounds.width,
        height:
          record.bounds.height
      },
      visiblePixels:
        record.bounds.visiblePixels,
      rawVisualFootprint:
        rawVisualFootprint(
          record.bounds
        ),
      gridSubject,
      view3dSubject
    };

    manifest[
      view3dPath
    ] =
      payload;

    catalogMap[
      record.catalogInput
    ] = {
      grid:
        gridPath,
      view3d:
        view3dPath
    };

    console.log(
      `${record.inputRelative}: ` +
      `${record.bounds.method}; ` +
      `Grid ${gridSubject.width}x${gridSubject.height}; ` +
      `3D ${view3dSubject.width}x${view3dSubject.height}`
    );
  } catch (error) {
    console.error(
      `Normalization failed for ${record.inputRelative}:`
    );

    console.error(
      error?.stack ||
      error?.message ||
      error
    );

    process.exitCode =
      1;
  }
}

if (
  process.exitCode
) {
  process.exit(
    process.exitCode
  );
}

if (WRITE) {
  const manifestPayload = {
    build:
      BUILD,
    standard: {
      ...STANDARD,
      targetVisualFootprint
    },
    images:
      manifest,
    catalogMap
  };

  fs.writeFileSync(
    path.join(
      NORMALIZED_ROOT,
      "manifest.json"
    ),
    JSON.stringify(
      manifestPayload,
      null,
      2
    ) +
      "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(
      NORMALIZED_ROOT,
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
    ? `Generated ${Object.keys(manifest).length} globally normalized image set(s).`
    : `Dry run: ${files.length} image(s); target visual footprint ${Math.round(
        targetVisualFootprint
      )}.`
);
