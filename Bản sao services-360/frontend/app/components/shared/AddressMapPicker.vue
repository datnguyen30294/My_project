<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import type { LatLng, LeafletEvent } from 'leaflet'

interface Props {
  modelValue?: string
  latitude?: number | null
  longitude?: number | null
  disabled?: boolean
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  latitude: null,
  longitude: null,
  disabled: false,
  collapsible: false
})

const showMap = ref(!props.collapsible)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:latitude': [value: number | null]
  'update:longitude': [value: number | null]
}>()

// Default center: Ho Chi Minh City
const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009]
const DEFAULT_ZOOM = 15

const mapCenter = ref<[number, number]>([...DEFAULT_CENTER])
const markerLatLng = ref<[number, number] | null>(null)
const zoom = ref(DEFAULT_ZOOM)
const addressInput = ref(props.modelValue)
const isGeocoding = ref(false)
const isLocating = ref(false)
const locationError = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Leaflet components (lazy loaded client-side)
const LMap = shallowRef<ReturnType<typeof defineComponent> | null>(null)
const LTileLayer = shallowRef<ReturnType<typeof defineComponent> | null>(null)
const LMarker = shallowRef<ReturnType<typeof defineComponent> | null>(null)

onMounted(async () => {
  const leafletModule = await import('@vue-leaflet/vue-leaflet')
  LMap.value = leafletModule.LMap
  LTileLayer.value = leafletModule.LTileLayer
  LMarker.value = leafletModule.LMarker
})

// Sync props to local state
watch(() => props.modelValue, (val) => {
  addressInput.value = val
})

watch(() => [props.latitude, props.longitude] as const, ([lat, lng]) => {
  if (lat != null && lng != null) {
    markerLatLng.value = [Number(lat), Number(lng)]
    mapCenter.value = [Number(lat), Number(lng)]
  }
}, { immediate: true })

function handleAddressInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  addressInput.value = value
  emit('update:modelValue', value)

  if (debounceTimer) clearTimeout(debounceTimer)

  if (!value.trim()) {
    markerLatLng.value = null
    emit('update:latitude', null)
    emit('update:longitude', null)
    return
  }

  debounceTimer = setTimeout(() => {
    forwardGeocode(value.trim())
  }, 500)
}

async function forwardGeocode(address: string) {
  if (isGeocoding.value) return
  isGeocoding.value = true

  try {
    const results = await $fetch<Array<{ lat: string, lon: string, display_name: string }>>(
      'https://nominatim.openstreetmap.org/search', {
        params: { q: address, format: 'json', limit: 1 }
      }
    )

    if (results.length > 0 && results[0]) {
      const lat = parseFloat(results[0].lat)
      const lng = parseFloat(results[0].lon)
      markerLatLng.value = [lat, lng]
      mapCenter.value = [lat, lng]
      emit('update:latitude', lat)
      emit('update:longitude', lng)
    }
  } catch {
    // Silently fail
  } finally {
    isGeocoding.value = false
  }
}

async function reverseGeocode(lat: number, lng: number) {
  if (isGeocoding.value) return
  isGeocoding.value = true

  try {
    const result = await $fetch<{ display_name?: string }>(
      'https://nominatim.openstreetmap.org/reverse', {
        params: { lat, lon: lng, format: 'json' }
      }
    )

    if (result.display_name) {
      addressInput.value = result.display_name
      emit('update:modelValue', result.display_name)
    }
  } catch {
    // Silently fail
  } finally {
    isGeocoding.value = false
  }
}

function handleMarkerDragEnd(event: LeafletEvent) {
  const latLng = (event.target as { getLatLng(): LatLng }).getLatLng()
  markerLatLng.value = [latLng.lat, latLng.lng]
  emit('update:latitude', latLng.lat)
  emit('update:longitude', latLng.lng)
  reverseGeocode(latLng.lat, latLng.lng)
}

async function fillCurrentLocation() {
  if (props.disabled || isLocating.value || isGeocoding.value) return

  if (!navigator.geolocation) {
    showLocationError('Trình duyệt không hỗ trợ định vị.')
    return
  }

  locationError.value = ''
  isLocating.value = true

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })

    const lat = position.coords.latitude
    const lng = position.coords.longitude

    markerLatLng.value = [lat, lng]
    mapCenter.value = [lat, lng]
    emit('update:latitude', lat)
    emit('update:longitude', lng)

    await reverseGeocode(lat, lng)
  } catch (err) {
    const geoErr = err as GeolocationPositionError
    if (geoErr.code === 1) {
      showLocationError('Bạn đã chặn quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt.')
    } else if (geoErr.code === 3) {
      showLocationError('Hết thời gian chờ định vị. Vui lòng thử lại.')
    } else {
      showLocationError('Không thể lấy vị trí hiện tại. Vui lòng thử lại.')
    }
  } finally {
    isLocating.value = false
  }
}

function showLocationError(message: string) {
  locationError.value = message
  setTimeout(() => {
    locationError.value = ''
  }, 5000)
}

function handleMapClick(event: { latlng: LatLng }) {
  if (props.disabled) return
  const { lat, lng } = event.latlng
  markerLatLng.value = [lat, lng]
  emit('update:latitude', lat)
  emit('update:longitude', lng)
  reverseGeocode(lat, lng)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-bold text-slate-600">
      <span
        class="material-symbols-outlined align-middle mr-1"
        style="font-size: 14px"
      >location_on</span>
      Địa chỉ
    </label>

    <!-- Address input -->
    <div class="relative">
      <input
        :value="addressInput"
        type="text"
        placeholder="Nhập địa chỉ hoặc kéo marker trên bản đồ..."
        :disabled="disabled"
        class="w-full h-10 rounded-xl border px-3.5 pr-16 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500"
        @input="handleAddressInput"
      >
      <!-- Current location button -->
      <button
        v-if="!disabled"
        type="button"
        class="absolute right-8 top-1/2 -translate-y-1/2 size-6 rounded-md hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
        title="Dùng vị trí hiện tại"
        @click="fillCurrentLocation"
      >
        <span
          class="material-symbols-outlined transition-colors"
          :class="isLocating ? 'text-indigo-500 animate-pulse' : 'text-slate-400 hover:text-indigo-500'"
          style="font-size: 16px"
        >
          my_location
        </span>
      </button>
      <!-- Status indicator -->
      <span
        v-if="isGeocoding || isLocating"
        class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-indigo-400 animate-spin"
        style="font-size: 16px"
      >
        progress_activity
      </span>
      <span
        v-else-if="markerLatLng"
        class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-500"
        style="font-size: 16px"
      >
        check_circle
      </span>
    </div>

    <!-- Location error -->
    <p
      v-if="locationError"
      class="text-[11px] text-amber-600 flex items-center gap-1"
    >
      <span
        class="material-symbols-outlined"
        style="font-size: 14px"
      >warning</span>
      {{ locationError }}
    </p>

    <!-- Map toggle (collapsible mode) -->
    <button
      v-if="collapsible"
      type="button"
      class="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
      @click="showMap = !showMap"
    >
      <span
        class="material-symbols-outlined"
        style="font-size: 14px"
      >map</span>
      <span>{{ showMap ? 'Ẩn bản đồ' : 'Chọn trên bản đồ' }}</span>
      <span
        class="material-symbols-outlined"
        style="font-size: 14px"
      >{{ showMap ? 'expand_less' : 'expand_more' }}</span>
    </button>

    <!-- Leaflet Map -->
    <ClientOnly v-if="showMap">
      <div
        v-if="LMap && LTileLayer && LMarker"
        class="rounded-xl border border-slate-200 overflow-hidden h-[250px]"
      >
        <component
          :is="LMap"
          :center="mapCenter"
          :zoom="zoom"
          :use-global-leaflet="false"
          style="width: 100%; height: 100%"
          @click="handleMapClick"
        >
          <component
            :is="LTileLayer"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            :attribution="'&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a>'"
          />
          <component
            :is="LMarker"
            v-if="markerLatLng"
            :lat-lng="markerLatLng"
            :draggable="!disabled"
            @dragend="handleMarkerDragEnd"
          />
        </component>
      </div>

      <template #fallback>
        <div class="rounded-xl border border-slate-200 bg-slate-50 h-[250px] flex items-center justify-center">
          <span
            class="material-symbols-outlined text-slate-300 animate-spin"
            style="font-size: 24px"
          >progress_activity</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
