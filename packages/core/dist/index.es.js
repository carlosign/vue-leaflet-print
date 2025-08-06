import { defineComponent as g, onMounted as h, watch as b, onBeforeUnmount as w, createElementBlock as y, openBlock as x } from "vue";
import * as f from "leaflet";
import { toPng as P } from "html-to-image";
import v from "leaflet-image";
const S = { style: { display: "none" } }, E = /* @__PURE__ */ g({
  __name: "LPrintControl",
  props: {
    map: {},
    position: { default: "topright" },
    mode: { default: "image" },
    title: { default: "Imprimir / Exportar" },
    filename: { default: "map.png" },
    imageScale: { default: 2 },
    includeAttribution: { type: Boolean, default: !0 },
    hideSelectors: { default: () => [".leaflet-control-container", ".no-print"] },
    label: { default: "" },
    iconHtml: { default: "🖨️" },
    ariaLabel: { default: "" }
  },
  emits: ["start", "success", "error"],
  setup(n, { emit: s }) {
    const t = n, u = s;
    let e = null;
    function r() {
      const i = f.Control.extend({
        options: { position: t.position },
        onAdd: () => {
          const d = f.DomUtil.create("div", "leaflet-control leaflet-control-print"), l = f.DomUtil.create("button", "print-btn", d);
          l.type = "button", l.title = t.title || "Imprimir / Exportar", l.setAttribute("role", "button"), l.setAttribute("tabindex", "0");
          const m = t.ariaLabel || t.label || t.title || "Imprimir / Exportar";
          return l.setAttribute("aria-label", m), t.label && t.label.trim().length > 0 ? l.textContent = t.label : l.innerHTML = t.iconHtml || "", f.DomEvent.disableClickPropagation(d), f.DomEvent.on(l, "click", a), l.addEventListener("keydown", (p) => {
            (p.key === "Enter" || p.key === " ") && (p.preventDefault(), p.stopPropagation(), a());
          }), d;
        }
      });
      return new i();
    }
    function o() {
      if (!t.map || e) return;
      const i = r();
      i.addTo(t.map), e = i;
    }
    function c() {
      t.map && (e && (t.map.removeControl(e), e = null), o());
    }
    async function a() {
      try {
        if (u("start"), t.mode === "print")
          t.map.invalidateSize(), window.print();
        else if (t.mode === "image-leaflet") {
          const { exportPngLeafletImage: i } = await Promise.resolve().then(() => k);
          await i(t.map, {
            filename: t.filename,
            pixelRatio: t.imageScale,
            includeAttribution: t.includeAttribution
          });
        } else {
          const { exportPngHtmlToImage: i } = await Promise.resolve().then(() => C);
          await i(t.map, {
            filename: t.filename,
            pixelRatio: t.imageScale,
            hide: t.hideSelectors,
            includeAttribution: t.includeAttribution
          });
        }
        u("success");
      } catch (i) {
        u("error", i), console.error(i);
      }
    }
    return h(o), b(() => t.map, o), b(() => t.position, c), w(() => {
      e && t.map && t.map.removeControl(e), e = null;
    }), (i, d) => (x(), y("div", S));
  }
});
function R(n) {
  if (!n) throw new Error("Map instance is required");
  n.invalidateSize(), window.print();
}
async function _(n, s = {}) {
  if (!n) throw new Error("Map instance is required");
  n.invalidateSize();
  const t = n.getContainer(), u = [];
  (s.hide || []).forEach((r) => {
    t.querySelectorAll(r).forEach((o) => {
      const c = o.style.visibility;
      o.style.visibility = "hidden", u.push(() => o.style.visibility = c);
    });
  });
  let e = null;
  if (s.includeAttribution) {
    const r = t.querySelector(".leaflet-control-attribution");
    r && (e = r.cloneNode(!0), Object.assign(e.style, {
      position: "absolute",
      right: "8px",
      bottom: "6px",
      background: "rgba(255,255,255,.85)",
      padding: "2px 6px",
      borderRadius: "3px"
    }), t.appendChild(e), u.push(() => e && e.remove()));
  }
  try {
    const r = await P(t, {
      cacheBust: !0,
      pixelRatio: (window.devicePixelRatio || 1) * (s.pixelRatio || 2),
      backgroundColor: "#ffffff"
    }), o = document.createElement("a");
    o.href = r, o.download = s.filename || "map.png", o.click();
  } finally {
    u.forEach((r) => r());
  }
}
const C = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPngHtmlToImage: _
}, Symbol.toStringTag, { value: "Module" }));
async function A(n, s = {}) {
  if (!n) throw new Error("Map instance is required");
  n.invalidateSize();
  const t = document.createElement("a"), u = s.filename || "map.png";
  await new Promise((e, r) => {
    v(n, (o, c) => {
      if (o) return r(o);
      try {
        if (s.includeAttribution) {
          const a = c.getContext("2d"), i = "� contributors";
          a.font = "12px sans-serif", a.fillStyle = "rgba(255,255,255,.85)";
          const d = 6, l = a.measureText(i).width + d * 2, m = 20;
          a.fillRect(c.width - l - d, c.height - m - d, l, m), a.fillStyle = "#000", a.fillText(i, c.width - l, c.height - 9);
        }
        t.href = c.toDataURL("image/png"), t.download = u, t.click(), e();
      } catch (a) {
        r(a);
      }
    });
  });
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPngLeafletImage: A
}, Symbol.toStringTag, { value: "Module" }));
function M() {
  return { install(n) {
    n.component("LPrintControl", E);
  } };
}
export {
  E as LPrintControl,
  M as default,
  _ as exportPngHtmlToImage,
  A as exportPngLeafletImage,
  R as printNative
};
