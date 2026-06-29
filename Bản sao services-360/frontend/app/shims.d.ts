declare module '@vue-leaflet/vue-leaflet' {
  import type { DefineComponent } from 'vue'

  export const LMap: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const LTileLayer: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export const LMarker: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
}
