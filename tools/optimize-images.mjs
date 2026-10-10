import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PICTURES = path.join(ROOT, "pictures");
const WRITE = process.argv.includes("--write");

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
        // source/ is archival input; normalized/ is the display source.
        if (relative === "optimized" || relative.startsWith("optimized/")) {
          return [];
        }

        if (relative === "source" || relative.startsWith("source/")) {
          return [];
        }

        return walkImages(absolute, relative);
      }

      if (
        entry.isFile() &&
        /\.(png|jpe?g)$/i.test(entry.name)
      ) {
        return [relative];
      }

      return [];
    });
}

const files = walkImages(PICTURES).sort();
const outputRoot = path.join(PICTURES, "optimized");

if (WRITE) {
  // Fully regenerate this derived directory so deleted/replaced source
  // images cannot leave stale optimized files behind.
  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });
}

let originalBytes = 0;
let optimizedBytes = 0;
const manifest = {};

for (const relative of files) {
  const input = path.join(PICTURES, relative);
  const outputRelative = relative.replace(/\.(png|jpe?g)$/i, ".webp");
  const output = path.join(outputRoot, outputRelative);

  const sourceBytes = fs.statSync(input).size;
  originalBytes += sourceBytes;

  if (!WRITE) {
    console.log(
      `${relative}: ${(sourceBytes / 1024).toFixed(0)} KB`
    );
    continue;
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });

  await sharp(input)
    .rotate()
    .resize({
      width: 1800,
      height: 1800,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({
      quality: 92,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true
    })
    .toFile(output);

  const outBytes = fs.statSync(output).size;
  optimizedBytes += outBytes;

  manifest[`pictures/${relative}`] =
    `pictures/optimized/${outputRelative}`;

  console.log(
    `${relative}: ` +
    `${(sourceBytes / 1024).toFixed(0)} KB -> ` +
    `${(outBytes / 1024).toFixed(0)} KB`
  );
}

if (WRITE) {
  fs.writeFileSync(
    path.join(outputRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8"
  );

  const reduction = originalBytes
    ? ((1 - optimizedBytes / originalBytes) * 100).toFixed(1)
    : "0.0";

  console.log(`Total reduction: ${reduction}%`);
  console.log("Original and normalized PNG files were not modified.");
} else {
  console.log("Dry run only. Use --write to create optimized WebP copies.");
}
