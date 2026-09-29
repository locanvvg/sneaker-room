import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PICTURES = path.join(ROOT, "pictures");
const WRITE = process.argv.includes("--write");

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

const files = fs
  .readdirSync(PICTURES, { withFileTypes: true })
  .filter(entry => entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name))
  .map(entry => entry.name)
  .sort();

const outputRoot = path.join(PICTURES, "optimized");
if (WRITE) fs.mkdirSync(outputRoot, { recursive: true });

let originalBytes = 0;
let optimizedBytes = 0;
const manifest = {};

for (const file of files) {
  const input = path.join(PICTURES, file);
  const outputName = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const output = path.join(outputRoot, outputName);
  const sourceBytes = fs.statSync(input).size;
  originalBytes += sourceBytes;

  if (!WRITE) {
    console.log(`${file}: ${(sourceBytes / 1024).toFixed(0)} KB`);
    continue;
  }

  const isPng = /\.png$/i.test(file);
  await sharp(input)
    .webp(isPng ? { lossless: true, effort: 6 } : { quality: 88, effort: 6 })
    .toFile(output);

  const outBytes = fs.statSync(output).size;
  optimizedBytes += outBytes;
  manifest[`pictures/${file}`] = `pictures/optimized/${outputName}`;
  console.log(`${file}: ${(sourceBytes / 1024).toFixed(0)} KB -> ${(outBytes / 1024).toFixed(0)} KB`);
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
  console.log("Original image files were not modified.");
} else {
  console.log("Dry run only. Use --write to create pictures/optimized/*.webp without touching originals.");
}
