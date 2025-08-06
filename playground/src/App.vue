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
    <!-- Solo rendereamos el control cuando ya tenemos map -->
    <LPrintControl v-if="instanciaMapa" :map="instanciaMapa" mode="image" filename="demo-mapa.png" />
  </l-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LControl } from '@vue-leaflet/vue-leaflet'
import { LPrintControl } from '@cchar/vue-leaflet-print'


const instanciaMapa = ref<any>(null);
const map = ref<any>(null);
const mapaListo = () => {
  instanciaMapa.value = map.value.leafletObject;
  console.log('Map ready:', instanciaMapa.value)
  }

</script>
