# @carloschar/vue-leaflet-print

Control de **impresión/exportación** para **Leaflet** en **Vue 3** (Vue-Leaflet).  
Incluye 3 modos: **print nativo**, **PNG por html-to-image**, **PNG por leaflet-image**.
Asimismo, el botón es personalizable con html (se puede usar fontawesome por ejemplo)

[![npm version](https://img.shields.io/npm/v/@carloschar/vue-leaflet-print.svg)](https://www.npmjs.com/package/@carloschar/vue-leaflet-print)
[![CI](https://github.com/carlosign/vue-leaflet-print/actions/workflows/ci.yml/badge.svg)](https://github.com/carlosign/vue-leaflet-print/actions/workflows/ci.yml)

## Instalación

```bash
pnpm add @carloschar/vue-leaflet-print
pnpm add vue leaflet @vue-leaflet/vue-leaflet
```

## Uso rápido

```vue
<!-- App.vue -->
<template>
  <l-map
    ref="map"
    :zoom="13"
    :center="[-34.6037, -58.3816]"
    style="height:80vh"
    @ready="mapaListo"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      :options="{ crossOrigin: true }"
      attribution="&copy; OSM contributors"
    />
    <!-- Solo rendereamos el control cuando ya tenemos el mapa -->
    <LPrintControl v-if="instanciaMapa" :map="instanciaMapa" mode="image" filename="demo-mapa.png" />
  </l-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { LPrintControl } from '@carloschar/vue-leaflet-print'


const instanciaMapa = ref<any>(null);
const map = ref<any>(null);
const mapaListo = () => {
  instanciaMapa.value = map.value.leafletObject;
  console.log('Mapa listo:', instanciaMapa.value)
  }

</script>
```

## Props
| Prop                 | Tipo                                                       | Default                                      | Descripción                                          |
| -------------------- | ---------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `map`                | `L.Map`                                                    | — (requerido)                                | Instancia real de Leaflet (`@ready` de Vue-Leaflet). |
| `position`           | `"topleft" \| "topright" \| "bottomleft" \| "bottomright"` | `"topright"`                                 | Posición del control.                                |
| `mode`               | `"print" \| "image" \| "image-leaflet"`                    | `"image"`                                    | Estrategia de salida.                                |
| `filename`           | `string`                                                   | `"map.png"`                                  | Nombre de archivo para PNG.                          |
| `imageScale`         | `number`                                                   | `2`                                          | Multiplica `devicePixelRatio` en modo `image`.       |
| `includeAttribution` | `boolean`                                                  | `true`                                       | Intenta incluir atribución en la imagen.             |
| `hideSelectors`      | `string[]`                                                 | `[".leaflet-control-container",".no-print"]` | Elementos a ocultar durante la captura.              |
| `title`              | `string`                                                   | `"Imprimir / Exportar"`                      | `title` del botón (tooltip).                         |
| `label`              | `string`                                                   | `""`                                         | Texto visible del botón (tiene prioridad).           |
| `iconHtml`           | `string`                                                   | `"🖨️"`                                      | HTML del ícono (se usa si `label` es vacío).         |
| `ariaLabel`          | `string`                                                   | derivado de label/title                      | Accesibilidad (lector de pantalla).                  |

## Notas importantes
    CORS de tiles: para mode="image" (html-to-image) el tile server debe permitir crossOrigin. En LTileLayer añadir :options="{ crossOrigin: true }".

    image-leaflet: más robusto para rasterizar el mapa (puede ignorar overlays DOM).

    Accesibilidad: el botón soporta Enter y Espacio, aria-label y title.

    SSR: Solo cliente.

## Eventos

El componente emite: start, success, error(err).

## Pruebas manuales

Para verificar que el control se monta correctamente al cambiar la instancia de mapa:

1. Instala las dependencias y levanta el playground: `pnpm install` seguido de `pnpm --filter playground dev`.
2. Abre el navegador en la URL indicada por Vite.
3. Haz clic en **Crear nueva instancia de mapa** para forzar que se destruya y recree el mapa Leaflet.
4. Comprueba que el botón de impresión vuelve a aparecer en el mapa recién creado y que sigue funcionando.
