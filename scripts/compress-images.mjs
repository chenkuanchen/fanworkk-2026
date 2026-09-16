/**
 * Batch-compress raster images under src/asset/image (in-place).
 * Round-2 settings: smaller max widths + lower JPEG quality.
 * Run: node scripts/compress-images.mjs
 */
import { readdir, rename, stat, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGE_ROOT = path.join(ROOT, "src", "asset", "image");
const SKIP_DIRS = new Set(["icon", "contact"]);

function rulesFor(relPath) {
  const normalized = relPath.replace(/\\/g, "/").toLowerCase();
  if (normalized.includes("_poster.")) {
    return { maxWidth: 1600, quality: 68 };
  }
  if (normalized.includes("/works/")) {
    return { maxWidth: 1200, quality: 70 };
  }
  if (normalized.includes("/destop/")) {
    return { maxWidth: 1400, quality: 72 };
  }
  if (normalized.includes("/about-me/")) {
    return { maxWidth: 1400, quality: 72 };
  }
  return { maxWidth: 1600, quality: 72 };
}

function shouldSkip(relPath) {
  const top = relPath.replace(/\\/g, "/").split("/")[0];
  return SKIP_DIRS.has(top);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
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
      .png({ compressionLevel: 9, palette: !meta.hasAlpha })
      .toFile(tmp);
  } else {
    await pipeline.jpeg({ quality, mozjpeg: true }).toFile(tmp);
  }

  const before = (await stat(filePath)).size;
  const after = (await stat(tmp)).size;
  if (after >= before) {
    await unlink(tmp);
    return { before, after: before, skipped: true };
  }

  await unlink(filePath);
  await rename(tmp, filePath);
  return { before, after, skipped: false };
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
  await pipeline.webp({ quality, effort: 5 }).toFile(tmp);

  const before = (await stat(filePath)).size;
  try {
    await unlink(filePath);
  } catch {
    // keep webp even if gif is locked; prefer webp as final
  }
  await rename(tmp, webpPath);
  const after = (await stat(webpPath)).size;
  return { before, after, webpPath };
}

async function main() {
  await mkdir(path.dirname(IMAGE_ROOT), { recursive: true });
  const files = await walk(IMAGE_ROOT);
  let saved = 0;
  let processed = 0;

  for (const filePath of files) {
    const rel = path.relative(IMAGE_ROOT, filePath);
    const ext = path.extname(filePath).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) continue;
    if (shouldSkip(rel)) continue;

    try {
      if (ext === ".gif") {
        const { before, after, webpPath } = await convertGifToWebp(filePath, rel);
        saved += Math.max(0, before - after);
        processed += 1;
        console.log(
          `${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB  ${rel} → ${path.basename(webpPath)}`,
        );
        continue;
      }

      const { before, after, skipped } = await compressRaster(filePath, rel);
      if (!skipped) saved += before - after;
      processed += 1;
      console.log(
        `${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB  ${rel}${skipped ? " (keep)" : ""}`,
      );
    } catch (error) {
      console.error(`skip ${rel}:`, error.message);
    }
  }

  console.log(`\nProcessed ${processed} files, saved ${(saved / 1024 / 1024).toFixed(2)} MB`);
}

main();
