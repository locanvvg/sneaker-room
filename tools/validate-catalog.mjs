import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function extractArrayAssignment(source, variableName) {
  const assignment = new RegExp(`\\b(?:const|let|var)\\s+${variableName}\\s*=`, "m");
  const match = assignment.exec(source);
  if (!match) throw new Error(`Could not find ${variableName}`);

  const start = source.indexOf("[", match.index + match[0].length);
  if (start < 0) throw new Error(`Could not find array start for ${variableName}`);

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (ch === "*" && next === "/") {
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
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  throw new Error(`Unclosed array for ${variableName}`);
}

function evaluateArray(file, variableName) {
  const source = fs.readFileSync(path.join(ROOT, file), "utf8");
  const literal = extractArrayAssignment(source, variableName);
  return vm.runInNewContext(`(${literal})`, Object.create(null), {
    filename: file,
    timeout: 1500
  });
}

function localize(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") return String(value.vi ?? value.en ?? "");
  return "";
}

function collectImageRefs(item) {
  const refs = [];
  if (typeof item?.image === "string") refs.push(item.image);
  if (Array.isArray(item?.images)) {
    refs.push(...item.images.filter(value => typeof value === "string"));
  }
  return [...new Set(refs)];
}

function validateImage(ref, id) {
  if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:")) return;
  const clean = ref.replace(/^\.\//, "");
  const target = path.join(ROOT, clean);
  if (!fs.existsSync(target)) {
    fail(`${id}: missing image file ${ref}`);
    return;
  }

  const size = fs.statSync(target).size;
  if (size > 1_500_000) {
    warn(`${id}: large image ${ref} (${(size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

function validateItem(item, sourceLabel) {
  const id = String(item?.id || "").trim();
  if (!id) {
    fail(`${sourceLabel}: entry without id`);
    return;
  }

  if (!localize(item.title).trim()) fail(`${id}: missing title`);

  const condition = localize(item.condition).trim();
  if (condition && !["Deadstock", "Used"].includes(condition)) {
    fail(`${id}: invalid condition "${condition}"; expected Deadstock or Used`);
  }

  const size = String(item.size || "").trim();
  if (size && !/^\d+(?:\.5)?\s+US$/i.test(size)) {
    warn(`${id}: unusual size format "${size}"`);
  }

  const status = String(item.collectionStatus || "").trim().toLowerCase();
  if (status && !["own", "sold"].includes(status)) {
    warn(`${id}: unusual collectionStatus "${item.collectionStatus}"`);
  }

  const imageRefs = collectImageRefs(item);
  if (!imageRefs.length) warn(`${id}: no image reference`);
  imageRefs.forEach(ref => validateImage(ref, id));
}

function scanKnownGalleryFixes() {
  const file = path.join(ROOT, "catalog-additions.js");
  if (!fs.existsSync(file)) return;
  const source = fs.readFileSync(file, "utf8");
  const refs = [...source.matchAll(/["'`](pictures\/[^"'`]+\.(?:png|jpe?g|webp))["'`]/gi)]
    .map(match => match[1]);
  [...new Set(refs)].forEach(ref => validateImage(ref, "catalog-additions.js"));
}

let base = [];
let additions = [];

try {
  base = evaluateArray("data.js", "sneakers");
} catch (error) {
  fail(`data.js parse failed: ${error.message}`);
}

try {
  additions = evaluateArray("catalog-additions.js", "CATALOG_ADDITIONS");
} catch (error) {
  fail(`catalog-additions.js parse failed: ${error.message}`);
}

const all = [...base, ...additions];
const seen = new Map();
all.forEach((item, index) => {
  const id = String(item?.id || "").trim();
  if (id) {
    if (seen.has(id)) {
      fail(`duplicate id "${id}" (${seen.get(id)} and entry ${index + 1})`);
    } else {
      seen.set(id, `entry ${index + 1}`);
    }
  }
  validateItem(item, index < base.length ? "data.js" : "catalog-additions.js");
});

scanKnownGalleryFixes();

for (const file of ["site-enhancements.js", "collection-stats.js", "sw.js"]) {
  const target = path.join(ROOT, file);
  if (!fs.existsSync(target)) warn(`optional enhancement file missing: ${file}`);
}

console.log(`Catalog entries checked: ${all.length}`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach(message => console.log(`WARN: ${message}`));

if (errors.length) {
  console.error(`Errors: ${errors.length}`);
  errors.forEach(message => console.error(`ERROR: ${message}`));
  process.exit(1);
}

console.log("Catalog validation passed.");
