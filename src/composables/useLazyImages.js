import { onUnmounted, reactive } from "vue";

/**
 * Load image URLs from a Vite glob only when an element nears the viewport.
 * Pass modules from a literal import.meta.glob(...) at the call site.
 */
export function useLazyImages(modules, options = {}) {
  const { rootMargin = "240px 0px", threshold = 0.01 } = options;
  const urls = reactive({});
  const pending = new Map();
  const observers = new Map();

  function findLoader(fileName) {
    const normalized = fileName.replace(/\\/g, "/");
    const key = Object.keys(modules).find((path) => {
      const base = path.replace(/\\/g, "/").split("/").pop();
      return base === normalized;
    });
    return key ? modules[key] : null;
  }

  async function load(fileName) {
    if (!fileName || urls[fileName]) return urls[fileName];
    if (pending.has(fileName)) return pending.get(fileName);

    const loader = findLoader(fileName);
    if (!loader) return null;

    const promise = loader().then((module) => {
      urls[fileName] = module.default;
      pending.delete(fileName);
      return urls[fileName];
    });
    pending.set(fileName, promise);
    return promise;
  }

  function observe(el, fileName) {
    if (!el || !fileName || urls[fileName]) return;

    const existing = observers.get(el);
    if (existing) existing.disconnect();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        load(fileName);
        io.disconnect();
        observers.delete(el);
      },
      { rootMargin, threshold },
    );

    io.observe(el);
    observers.set(el, io);
  }

  function cleanup() {
    observers.forEach((io) => io.disconnect());
    observers.clear();
  }

  onUnmounted(cleanup);

  return { urls, load, observe, cleanup };
}
