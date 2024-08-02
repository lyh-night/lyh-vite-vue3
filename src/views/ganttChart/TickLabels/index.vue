<template>
  <div class="TickLabels">
    <div
      v-for="(item, index) in ticks"
      :key="`TickLabels--label-${index}`"
      class="TickLabels--label"
      :style="item.style"
    >
      {{ item.txt }}
    </div>
  </div>
</template>

<script setup>
import { formatDuration } from '@/utils/time.js'

const props = defineProps({
  numTicks: {
    type: Number,
    default: 4
  },
  startTime: {
    type: Number,
    default: 0
  },
  endTime: {
    type: Number,
    default: 100
  }
})

const ticks = computed(() => {
  const list = []
  for (let i = 0; i < props.numTicks + 1; i++) {
    const portion = i / props.numTicks
    list.push({
      style: portion === 1 ? { right: '0%' } : { left: `${portion * 100}%` },
      txt: formatDuration((props.endTime - props.startTime) * portion + props.startTime)
    })
  }
  return list
})
</script>

<style lang="scss" scoped>
.TickLabels {
  height: 16px;
  position: relative;
}

.TickLabels--label {
  color: #717171;
  font-size: 12px;
  position: absolute;
  user-select: none;
}
</style>
