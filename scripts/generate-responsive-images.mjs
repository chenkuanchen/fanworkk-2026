/**
 * Restore best-available sources (prefer git ORIGINAL_COMMIT when larger),
 * then emit WebP width variants as name@WIDTH.webp beside each raster.
 *
 * Run: node scripts/generate-responsive-images.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdir, readdir, stat, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGE_ROOT = path.join(ROOT, "src", "asset", "image");
/** Pre-compression commit with higher-resolution project / feature assets. */
const ORIGINAL_COMMIT = "7c471ce";
const CANDIDATE_WIDTHS = [800, 1600, 2400];
const MAX_EMIT_WIDTH = 2400;
const WEBP_QUALITY = 84;
const JPEG_QUALITY = 86;
const SKIP_DIRS = new Set(["icon", "contact"]);
const TARGET_TOP = new Set(["destop", "works", "project"]);
/** Skip decorative / unused rasters that are not shown via responsive pipeline. */
const SKIP_FILES = new Set(["destop/hero-filp-water-end.png"]);

function shouldProcess(relPath) {
  const normalized = relPath.replace(/\\/g, "/");
  const top = normalized.split("/")[0];
  if (SKIP_DIRS.has(top) || !TARGET_TOP.has(top)) return false;
  if (SKIP_FILES.has(normalized)) return false;
  if (/@\d+\.(webp|jpe?g|png)$/i.test(normalized)) return false;
  return /\.(jpe?g|png|webp)$/i.test(normalized);
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

function gitShow(commitPath) {
  try {
    return execFileSync("git", ["show", commitPath], {
      cwd: ROOT,
      maxBuffer: 80 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

async function bestSourceBuffer(filePath, relPath) {
  const currentMeta = await sharp(filePath, {
    failOn: "none",
    animated: true,
  }).metadata();
  const animated = (currentMeta.pages ?? 1) > 1;
  const current = await sharp(filePath, { failOn: "none", animated })
    .rotate()
    .toBuffer({ resolveWithObject: true });
  const gitBuf = gitShow(
    `${ORIGINAL_COMMIT}:src/asset/image/${relPath.replace(/\\/g, "/")}`,
  );
  if (!gitBuf) {
    return {
      buffer: current.data,
      width: current.info.width,
      from: "workspace",
      animated,
    };
  }
  const gitMeta = await sharp(gitBuf, {
    failOn: "none",
    animated: true,
  }).metadata();
  if ((gitMeta.width ?? 0) > current.info.width) {
    const gitAnimated = (gitMeta.pages ?? 1) > 1;
    return {
      buffer: gitBuf,
      width: gitMeta.width,
      from: ORIGINAL_COMMIT,
      animated: gitAnimated,
    };
  }
  return {
    buffer: current.data,
    width: current.info.width,
    from: "workspace",
    animated,
  };
}

function widthsFor(sourceWidth) {
  const capped = Math.min(sourceWidth, MAX_EMIT_WIDTH);
  const set = new Set(CANDIDATE_WIDTHS.filter((w) => w <= capped));
  // Keep native width when between candidates (e.g. 1080 / 1280 / 1920).
  if (sourceWidth <= MAX_EMIT_WIDTH) set.add(sourceWidth);
  return [...set].sort((a, b) => a - b);
}

async function writeVariant(buffer, outPath, width, sourceWidth, { animated = false } = {}) {
  let pipeline = sharp(buffer, { failOn: "none", animated }).rotate();
  if (width < sourceWidth) {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }
  const tmp = `${outPath}.tmp`;
  await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(tmp);
  const after = (await stat(tmp)).size;
  try {
    await unlink(outPath);
  } catch {
    // new file
  }
  const { rename } = await import("node:fs/promises");
  await rename(tmp, outPath);
  return after;
}

async function refreshBaseJpeg(buffer, filePath, sourceWidth, ext) {
  if (!/\.jpe?g$/i.test(ext)) return null;
  const maxKeep = Math.min(sourceWidth, 1920);
  let pipeline = sharp(buffer, { failOn: "none" }).rotate();
  if (sourceWidth > maxKeep) {
    pipeline = pipeline.resize({ width: maxKeep, withoutEnlargement: true });
  }
  const tmp = `${filePath}.tmp`;
  await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
  const after = (await stat(tmp)).size;
  const { rename, unlink: rm } = await import("node:fs/promises");
  await rm(filePath);
  await rename(tmp, filePath);
  return { width: Math.min(sourceWidth, maxKeep), size: after };
}

async function main() {
  await mkdir(IMAGE_ROOT, { recursive: true });
  const files = (await walk(IMAGE_ROOT)).filter((f) =>
    shouldProcess(path.relative(IMAGE_ROOT, f)),
  );

  let processed = 0;
  for (const filePath of files) {
    const rel = path.relative(IMAGE_ROOT, filePath);
    const ext = path.extname(filePath);
    const base = filePath.slice(0, -ext.length);

    try {
      const source = await bestSourceBuffer(filePath, rel);
      const widths = widthsFor(source.width);
      const parts = [];

      if (source.animated) {
        // Keep the animated base as-is; static @w variants would flatten frames.
        for (const w of widthsFor(source.width)) {
          try {
            await unlink(`${base}@${w}.webp`);
          } catch {
            // no prior variant
          }
        }
        processed += 1;
        console.log(
          `${rel.replace(/\\/g, "/")}  src=${source.width}px(${source.from})  → animated (no srcset variants)`,
        );
        continue;
      }

      for (const w of widths) {
        const out = `${base}@${w}.webp`;
        const size = await writeVariant(source.buffer, out, w, source.width, {
          animated: false,
        });
        parts.push(`${w}w=${(size / 1024).toFixed(0)}KB`);
      }

      let baseNote = "";
      const refreshed = await refreshBaseJpeg(
        source.buffer,
        filePath,
        source.width,
        ext,
      );
      if (refreshed) {
        baseNote = ` base→${refreshed.width}px/${(refreshed.size / 1024).toFixed(0)}KB`;
      }

      processed += 1;
      console.log(
        `${rel.replace(/\\/g, "/")}  src=${source.width}px(${source.from})  → ${parts.join(", ")}${baseNote}`,
      );
    } catch (error) {
      console.error(`skip ${rel}:`, error.message);
    }
  }

  console.log(`\nProcessed ${processed} images.`);
}

main();
