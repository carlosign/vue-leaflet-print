type __VLS_Props = {
    map: any;
    position?: "topleft" | "topright" | "bottomleft" | "bottomright";
    mode?: "print" | "image" | "image-leaflet";
    title?: string;
    filename?: string;
    imageScale?: number;
    includeAttribution?: boolean;
    hideSelectors?: string[];
    label?: string;
    iconHtml?: string;
    ariaLabel?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    start: () => any;
    success: () => any;
    error: (err: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onStart?: (() => any) | undefined;
    onSuccess?: (() => any) | undefined;
    onError?: ((err: any) => any) | undefined;
}>, {
    label: string;
    title: string;
    position: "topleft" | "topright" | "bottomleft" | "bottomright";
    mode: "print" | "image" | "image-leaflet";
    filename: string;
    imageScale: number;
    includeAttribution: boolean;
    hideSelectors: string[];
    iconHtml: string;
    ariaLabel: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=LPrintControl.vue.d.ts.map