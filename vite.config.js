import { defineConfig } from 'vite'
import {resolve} from 'node:path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // Build in library-mode, https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: resolve(__dirname, 'src/library.js'),
      name: 'DevWorldBadgeLib',
      fileName: 'devworld-badge',
    },
    minify: false,
    rollupOptions: {
      external: ['vue', 'regl'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          regl: 'createREGL',
        },
      },
    },
    sourcemap: true,
  },
})
