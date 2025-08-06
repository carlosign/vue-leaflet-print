import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [vue(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "VueLeafletPrint",
      fileName: (f) => `index.${f}.js`
    },
    rollupOptions: {
      external: ["vue", "leaflet", "@vue-leaflet/vue-leaflet", "html-to-image", "leaflet-image"],
      output: { globals: { vue: "Vue", leaflet: "L" } }
    }
  }
})
