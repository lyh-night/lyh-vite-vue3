<template>
  <canvas class="CanvasSpanGraph" ref="canvasRef" />
</template>

<script setup>
import { nextTick } from 'vue'
import renderIntoCanvas from '../js/renderIntoCanvas.js'

const props = defineProps({
  items: {
    type: Array,
    default: () => [] // { valueWidth: number; valueOffset: number; serviceName: string }[]
  },
  valueWidth: {
    type: Number,
    default: 100
  }
})

const canvasRef = ref(null)
watch(
  () => props.items,
  (val) => {
    nextTick(() => {
      renderIntoCanvas(canvasRef.value, props.items, props.valueWidth)
    })
  }
)
</script>

<style lang="scss" scoped>
.CanvasSpanGraph {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
