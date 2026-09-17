import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const base = '/fanworkk-2026/'
const heroImageDevPath = 'src/asset/image/destop/hero-filp-water-start.svg'

function preloadHeroImage() {
  return {
    name: 'preload-hero-image',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        let href

        if (ctx.bundle) {
          const fileName = Object.keys(ctx.bundle).find((name) =>
            name.includes('hero-filp-water-start'),
          )
          if (!fileName) return
          href = `${base}${fileName}`
        } else {
          href = `${base}${heroImageDevPath}`
        }

        return [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              href,
              fetchpriority: 'high',
            },
            injectTo: 'head',
          },
        ]
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    vueDevTools(),
    preloadHeroImage(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
