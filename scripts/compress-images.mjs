/**
 * Batch-compress raster images under src/asset/image (in-place).
 * Run: node scripts/compress-images.mjs
 */
import { readdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGE_ROOT = path.join(ROOT, "src", "asset", "image");

const SKIP_DIRS = new Set(["icon", "contact"]);
function rulesFor(relPath) {
  const normalized = relPath.replace(/\\/g, "/").toLowerCase();
  if (normalized.includes("_poster.")) {
    return { maxWidth: 1920, quality: 72 };
  }
  if (normalized.includes("/works/")) {
    return { maxWidth: 1400, quality: 76 };
  }
  if (normalized.includes("/destop/")) {
    return { maxWidth: 1600, quality: 78 };
  }
  if (normalized.includes("/about-me/")) {
    return { maxWidth: 1600, quality: 78 };
  }
  return { maxWidth: 1920, quality: 78 };
}

function shouldSkip(relPath, fileName) {
  const normalized = relPath.replace(/\\/g, "/");
  return SKIP_DIRS.has(normalized.split("/")[0]);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function compressRaster(filePath, relPath) {
  const { maxWidth, quality } = rulesFor(relPath);
  const ext = path.extname(filePath).toLowerCase();
  const meta = await sharp(filePath, { failOn: "none" }).metadata();
  let pipeline = sharp(filePath, { failOn: "none" }).rotate();

  if ((meta.width ?? 0) > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const tmp = `${filePath}.tmp`;

  if (ext === ".png") {
    await pipeline
      .png({ compressionLevel: 9, palette: meta.hasAlpha ? false : true })
      .toFile(tmp);
  } else {
    await pipeline.jpeg({ quality, mozjpeg: true }).toFile(tmp);
  }

  await unlink(filePath);
  await rename(tmp, filePath);
}

async function convertGifToWebp(filePath, relPath) {
  const { maxWidth, quality } = rulesFor(relPath);
  const meta = await sharp(filePath, { animated: true, failOn: "none" }).metadata();
  let pipeline = sharp(filePath, { animated: true, failOn: "none" }).rotate();

  if ((meta.width ?? 0) > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const webpPath = filePath.replace(/\.gif$/i, ".webp");
  const tmp = `${webpPath}.tmp`;
  await pipeline.webp({ quality, effort: 4 }).toFile(tmp);
  await unlink(filePath);
  await rename(tmp, webpPath);
  return webpPath;
}

async function main() {
  const files = await walk(IMAGE_ROOT);
  let saved = 0;
  let processed = 0;

  for (const filePath of files) {
    const rel = path.relative(IMAGE_ROOT, filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();

    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) continue;
    if (shouldSkip(rel, fileName)) continue;

    const before = (await stat(filePath)).size;

    try {
      if (ext === ".gif") {
        const webpPath = await convertGifToWebp(filePath, rel);
        const after = (await stat(webpPath)).size;
        saved += Math.max(0, before - after);
        processed += 1;
        console.log(
          `${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB  ${rel} → ${path.basename(webpPath)}`,
        );
        continue;
      }

      await compressRaster(filePath, rel);
      const after = (await stat(filePath)).size;
      saved += Math.max(0, before - after);
      processed += 1;
      console.log(
        `${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB  ${rel}`,
      );
    } catch (error) {
      console.error(`skip ${rel}:`, error.message);
    }
  }

  console.log(`\nProcessed ${processed} files, saved ${(saved / 1024 / 1024).toFixed(2)} MB`);
}

main();
