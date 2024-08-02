<template>
  <g data-test="ticks" aria-hidden="true">
    <line v-for="item in ticks" class="GraphTick" :x1="item.x" y1="0%" :x2="item.x" y2="100%" :key="item.key" />
  </g>
</template>

<script setup>
const props = defineProps({
  numTicks: {
    type: Number,
    default: 4
  }
})

const ticks = computed(() => {
  const list = []
  for (let i = 1; i < props.numTicks; i++) {
    list.push({
      x: `${(i / props.numTicks) * 100}%`,
      key: i / props.numTicks
    })
  }
  return list
})
</script>

<style lang="scss" scoped>
.GraphTick {
  stroke: #aaa;
  stroke-width: 1px;
}
</style>
