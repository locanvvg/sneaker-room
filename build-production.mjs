import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { minify as minifyJS } from "terser";
import { minify as minifyHTML } from "html-minifier-terser";
import CleanCSS from "clean-css";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  ".idea",
  ".vscode",
  "node_modules",
  "dist",
  "scripts",
  "tools"
]);

const EXCLUDED_FILES = new Set([
  ".DS_Store",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml"
]);

function shouldExclude(relativePath, dirent) {
  const normalized = relativePath.replaceAll("\\", "/");
  const parts = normalized.split("/");

  if (parts.some(part => EXCLUDED_DIRS.has(part))) {
    return true;
  }

  if (EXCLUDED_FILES.has(dirent.name)) {
    return true;
  }

  if (/^README(?:[-_.].*)?$/i.test(dirent.name)) {
    return true;
  }

  if (/\.(zip|tar|gz|7z|map)$/i.test(dirent.name)) {
    return true;
  }

  return false;
}

async function listFiles(dir, relativeBase = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeBase, entry.name);

    if (shouldExclude(relativePath, entry)) {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await listFiles(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

async function ensureParent(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function transformText(relativePath, source) {
  const extension = path.extname(relativePath).toLowerCase();

  if (extension === ".js" || extension === ".mjs") {
    const result = await minifyJS(source, {
      compress: {
        passes: 2,
        ecma: 2020
      },
      mangle: true,
      module: extension === ".mjs",
      toplevel: false,
      format: {
        comments: false,
        ascii_only: false
      },
      sourceMap: false
    });

    if (!result.code) {
      throw new Error(`Terser produced no output for ${relativePath}`);
    }

    return result.code + "\n";
  }

  if (extension === ".css") {
    const result = new CleanCSS({
      level: 2,
      format: false,
      sourceMap: false
    }).minify(source);

    if (result.errors?.length) {
      throw new Error(
        `CleanCSS failed for ${relativePath}: ${result.errors.join("; ")}`
      );
    }

    return result.styles + "\n";
  }

  if (extension === ".html" || extension === ".htm") {
    return await minifyHTML(source, {
      collapseWhitespace: true,
      conservativeCollapse: false,
      removeComments: true,
      removeAttributeQuotes: false,
      removeRedundantAttributes: false,
      removeEmptyAttributes: false,
      removeOptionalTags: false,
      sortAttributes: false,
      sortClassName: false,
      minifyCSS: true,
      minifyJS: {
        compress: {
          passes: 2,
          ecma: 2020
        },
        mangle: true,
        toplevel: false,
        format: {
          comments: false
        }
      }
    }) + "\n";
  }

  if (extension === ".json") {
    try {
      return JSON.stringify(JSON.parse(source));
    } catch {
      return source;
    }
  }

  return source;
}

function isTextFile(relativePath) {
  return /\.(html?|css|js|mjs|json|xml|txt|webmanifest)$/i.test(relativePath);
}

async function sha256(filePath) {
  const data = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function main() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  const files = await listFiles(ROOT);
  const manifest = [];

  for (const relativePath of files) {
    const sourcePath = path.join(ROOT, relativePath);
    const destinationPath = path.join(DIST, relativePath);

    await ensureParent(destinationPath);

    if (isTextFile(relativePath)) {
      const source = await fs.readFile(sourcePath, "utf8");
      const output = await transformText(relativePath, source);
      await fs.writeFile(destinationPath, output, "utf8");
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }

    manifest.push({
      path: relativePath.replaceAll("\\", "/"),
      sha256: await sha256(destinationPath)
    });
  }

  await fs.writeFile(
    path.join(DIST, ".nojekyll"),
    "",
    "utf8"
  );

  manifest.sort((a, b) => a.path.localeCompare(b.path));

  await fs.writeFile(
    path.join(DIST, "deploy-manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceCommit: process.env.GITHUB_SHA || null,
        files: manifest
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  console.log(`Built ${manifest.length} files into dist/`);
  console.log("HTML/CSS/JS minified; source maps disabled.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
