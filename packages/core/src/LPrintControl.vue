<template>
  <!-- No renderiza nada en el DOM de Vue; el control lo maneja Leaflet -->
  <div style="display:none" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from "vue"
import * as L from "leaflet"

const props = withDefaults(defineProps<{
  map: any
  position?: "topleft" | "topright" | "bottomleft" | "bottomright"
  mode?: "print" | "image" | "image-leaflet"
  title?: string              // tooltip del botón
  filename?: string
  imageScale?: number
  includeAttribution?: boolean
  hideSelectors?: string[]
  label?: string              // texto visible (tiene prioridad)
  iconHtml?: string           // HTML del ícono (se usa si NO hay label)
  ariaLabel?: string          // opcional: aria-label explícito
}>(), {
  position: "topright",
  mode: "image",
  title: "Imprimir / Exportar",
  filename: "map.png",
  imageScale: 2,
  includeAttribution: true,
  hideSelectors: () => [".leaflet-control-container", ".no-print"],
  label: "",                  // vacío => usamos iconHtml
  iconHtml: "🖨️",
  ariaLabel: ""               // si queda vacío, se deriva de label/title
})

const emit = defineEmits<{ (e:"start"):void; (e:"success"):void; (e:"error", err:any):void }>()

let control: L.Control | null = null

function createControl(): L.Control {
  const Print = L.Control.extend({
    options: { position: props.position },
    onAdd: () => {
      const container = L.DomUtil.create("div", "leaflet-control leaflet-control-print")

      const btn = L.DomUtil.create("button", "print-btn", container) as HTMLButtonElement
      btn.type = "button"
      btn.title = props.title || "Imprimir / Exportar"
      btn.setAttribute("role", "button")
      btn.setAttribute("tabindex", "0")


      const aria = props.ariaLabel || props.label || props.title || "Imprimir / Exportar"
      btn.setAttribute("aria-label", aria)


      if (props.label && props.label.trim().length > 0) {
        btn.textContent = props.label
      } else {
        btn.innerHTML = props.iconHtml || ""
      }

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.on(btn, "click", run)

      // Accesibilidad teclado (Enter / Space)
      btn.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          e.stopPropagation()
          run()
        }
      })

      return container
    }
  }) as any

  return new Print()
}

function ensureControlAdded() {
  if (!props.map) return
  if (control) return
  const ctrl = createControl()
  ctrl.addTo(props.map)
  control = ctrl
}

function readdWithNewPosition() {
  if (!props.map) return
  if (control) {
    props.map.removeControl(control)
    control = null
  }
  ensureControlAdded()
}

async function run() {
  try {
    emit("start")
    if (props.mode === "print") {
      props.map.invalidateSize()
      window.print()
    } else if (props.mode === "image-leaflet") {
      const { exportPngLeafletImage } = await import("./strategies/leafletImage")
      await exportPngLeafletImage(props.map, {
        filename: props.filename,
        pixelRatio: props.imageScale,
        includeAttribution: props.includeAttribution
      })
    } else {
      const { exportPngHtmlToImage } = await import("./strategies/htmlToImage")
      await exportPngHtmlToImage(props.map, {
        filename: props.filename,
        pixelRatio: props.imageScale,
        hide: props.hideSelectors,
        includeAttribution: props.includeAttribution
      })
    }
    emit("success")
  } catch (e) {
    emit("error", e as any)
    console.error(e)
  }
}

onMounted(ensureControlAdded)
watch(() => props.map, ensureControlAdded)
watch(() => props.position, readdWithNewPosition)

onBeforeUnmount(() => {
  if (control && props.map) props.map.removeControl(control)
  control = null
})
</script>
