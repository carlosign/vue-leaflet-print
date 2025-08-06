import type { App } from 'vue'
import LPrintControl from './LPrintControl.vue'
export { printNative } from './strategies/native'
export { exportPngHtmlToImage } from './strategies/htmlToImage'
export { exportPngLeafletImage } from './strategies/leafletImage'
import './styles.css'
export default function createPrintPlugin() {
  return { install(app: App) { app.component('LPrintControl', LPrintControl) } }
}
export { LPrintControl }
