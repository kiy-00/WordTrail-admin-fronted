import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    UnoCss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons()
      ],
      rules: [
        ['frosted-glass', {
          'background-color': 'rgba(255, 255, 255, 0.3)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)'
        }]
      ]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
