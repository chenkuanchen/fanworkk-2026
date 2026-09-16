/**
 * Build src / srcset from Vite glob modules keyed by path.
 * Companion files use name@WIDTH.webp next to the base asset.
 */
export function pickResponsive(modules, baseFileName) {
  const normalizedBase = baseFileName.replace(/\\/g, "/");
  const stem = normalizedBase.replace(/\.[^.]+$/, "");
  const stemLower = stem.toLowerCase();
  const baseLower = normalizedBase.toLowerCase();

  let fallback = null;
  const variants = [];

  for (const [modulePath, url] of Object.entries(modules)) {
    const file = modulePath.replace(/\\/g, "/").split("/").pop() || "";
    const lower = file.toLowerCase();
    const variant = lower.match(/^(.*)@(\d+)\.(webp|jpe?g|png)$/);

    if (variant && variant[1] === stemLower) {
      variants.push({ width: Number(variant[2]), url });
      continue;
    }

    if (lower === baseLower) {
      fallback = url;
    }
  }

  variants.sort((a, b) => a.width - b.width);

  const src =
    variants.find((v) => v.width >= 1600)?.url ||
    variants.at(-1)?.url ||
    fallback;

  const srcset =
    variants.length > 0
      ? variants.map((v) => `${v.url} ${v.width}w`).join(", ")
      : undefined;

  return {
    src: src || fallback || "",
    srcset,
    width: variants.at(-1)?.width,
  };
}
