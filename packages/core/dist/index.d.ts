import { App } from 'vue';
import { default as LPrintControl } from './LPrintControl.vue';
export { printNative } from './strategies/native';
export { exportPngHtmlToImage } from './strategies/htmlToImage';
export { exportPngLeafletImage } from './strategies/leafletImage';
export default function createPrintPlugin(): {
    install(app: App): void;
};
export { LPrintControl };
//# sourceMappingURL=index.d.ts.map