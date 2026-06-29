<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: string
  size?: number
  margin?: number
  fileName?: string
}>(), {
  size: 200,
  margin: 2,
  fileName: 'qrcode.png'
})

const dataUrl = ref<string>('')
const isGenerating = ref(false)

watchEffect(async () => {
  if (!import.meta.client || !props.value) {
    dataUrl.value = ''
    return
  }

  isGenerating.value = true
  try {
    const QRCode = await import('qrcode')
    dataUrl.value = await QRCode.toDataURL(props.value, {
      width: props.size,
      margin: props.margin,
      errorCorrectionLevel: 'M'
    })
  } catch {
    dataUrl.value = ''
  } finally {
    isGenerating.value = false
  }
})

function downloadPng() {
  if (!dataUrl.value) return
  const link = document.createElement('a')
  link.href = dataUrl.value
  link.download = props.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

defineExpose({ downloadPng })
</script>

<template>
  <div class="flex items-center justify-center">
    <img
      v-if="dataUrl"
      :src="dataUrl"
      :alt="value"
      :width="size"
      :height="size"
      class="rounded-lg border border-slate-200 bg-white"
    >
    <div
      v-else
      class="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <UIcon
        v-if="isGenerating"
        name="i-lucide-loader-circle"
        class="size-6 text-slate-400 animate-spin"
      />
      <UIcon
        v-else
        name="i-lucide-qr-code"
        class="size-8 text-slate-300"
      />
    </div>
  </div>
</template>
