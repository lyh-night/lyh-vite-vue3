<template>
  <div class="TimelineRowCell">
    <div class="Ticks">
      <div
        v-for="(item, index) in ticks"
        :key="`Ticks--tick-${index}`"
        class="Ticks--tick"
        :style="`left: ${item.x}`"
      />
    </div>
    <div class="SpanBar">
      <div
        v-if="barShow"
        class="SpanBar--bar"
        :style="`background: ${props.data.fillColor};left: ${barPosition.left}; width: ${barPosition.width}`"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  numTicks: {
    type: Number,
    default: 4
  },
  data: {
    type: Object,
    defualt: () => {}
  },
  viewRange: {
    type: Object,
    default: () => {}
  }
})

const barShow = computed(() => {
  const [start, end] = props.viewRange.current
  const { viewStart, viewEnd } = props.data
  if (start >= viewEnd || end <= viewStart) {
    return false
  }
  return true
})

const barPosition = computed(() => {
  const [start, end] = props.viewRange.current
  const { viewStart, viewEnd } = props.data
  let left = viewStart
  let width = viewEnd - viewStart
  if (start < viewStart && viewEnd > end) {
    left = (viewStart - start) / (end - start)
    width = 1 - left
  }
  if (start > viewStart && end < viewEnd) {
    left = 0
    width = 1
  }
  if (viewStart < start && viewEnd < end) {
    left = 0
    width = (viewEnd - start) / (end - start)
  }
  if (start < viewStart && viewEnd < end) {
    left = (viewStart - start) / (end - start)
    width = (viewEnd - viewStart) / (end - start)
  }
  return {
    left: toPercent(left),
    width: toPercent(width)
  }
})

const ticks = computed(() => {
  const list = []
  for (let i = 1; i < props.numTicks; i++) {
    const x = `${(i / props.numTicks) * 100}%`
    list.push({ x })
  }
  return list
})

function toPercent(value) {
  return `${(value * 100).toFixed(2)}%`
}
</script>

<style lang="scss" scoped>
.TimelineRowCell {
  position: relative;
  width: 100%;
  height: 100%;
  .Ticks {
    width: 100%;
    height: 100%;
    .Ticks--tick {
      position: absolute;
      width: 1px;
      height: 100%;
      background-color: #d8d8d8;
    }
  }
  .SpanBar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    .SpanBar--bar {
      position: absolute;
      height: 36%;
      top: 32%;
      border-radius: 3px;
      min-width: 2px;
    }
  }
}
</style>
