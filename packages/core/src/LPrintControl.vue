<template>
  <!-- No renderiza nada en el DOM de Vue; el control lo maneja Leaflet -->
  <div style="display:none" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from "vue"
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

const isProcessing = ref(false)

let control: L.Control | null = null
let buttonEl: HTMLButtonElement | null = null
let keydownHandler: ((e: KeyboardEvent) => void) | null = null
let currentMap: L.Map | null = null

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

      buttonEl = btn
      if (isProcessing.value) {
        buttonEl.disabled = true
      }


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
      keydownHandler = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          e.stopPropagation()
          run()
        }
      }
      btn.addEventListener("keydown", keydownHandler)

      return container
    }
  }) as any

  return new Print()
}

function ensureControlAdded(map: L.Map | null | undefined) {
  if (!map) return
  if (control) return
  const ctrl = createControl()
  ctrl.addTo(map)
  control = ctrl
}

function readdWithNewPosition() {
  if (!currentMap) return
  removeControl(currentMap)
  ensureControlAdded(currentMap)
}

function removeControl(map: L.Map | null) {
  if (buttonEl) {
    if (keydownHandler) buttonEl.removeEventListener("keydown", keydownHandler)
    L.DomEvent.off(buttonEl, "click", run)
  }
  if (control && map) map.removeControl(control)
  control = null
  buttonEl = null
  keydownHandler = null
}

async function run() {
  if (isProcessing.value) return

  isProcessing.value = true
  if (buttonEl) buttonEl.disabled = true

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
  } finally {
    isProcessing.value = false
    if (buttonEl) buttonEl.disabled = false
  }
}

onMounted(() => ensureControlAdded(props.map))
watch(
  () => props.map,
  (newMap) => {
    if (currentMap && currentMap !== newMap) {
      removeControl(currentMap)
    }
    if (newMap) {
      ensureControlAdded(newMap)
    } else if (currentMap) {
      removeControl(currentMap)
    }
    currentMap = newMap ?? null
  },
  { immediate: true }
)
watch(() => props.position, readdWithNewPosition)

onBeforeUnmount(() => {
  removeControl(currentMap)
  currentMap = null
})
</script>
