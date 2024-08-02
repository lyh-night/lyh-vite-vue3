<template>
  <rect
    key="fill"
    :class="`ViewingLayer--draggedShift ${avtiveName}`"
    :x="layout.x"
    :y="0"
    :width="layout.width"
    :height="props.height - 2"
  />,
  <rect
    key="edge"
    :class="`ViewingLayer--draggedEdge ${avtiveName}`"
    :x="layout.leadingX"
    :y="0"
    :width="1"
    :height="props.height - 2"
  />,
</template>

<script setup>
const props = defineProps({
  height: {
    type: Number,
    default: 60
  },
  from: {
    type: Number,
    defualt: 0
  },
  to: {
    type: Number,
    defualt: 0
  },
  isShift: {
    type: Boolean,
    defualt: false
  }
})
const avtiveName = computed(() => {
  return props.isShift ? 'isShiftDrag' : 'isReframeDrag'
})

const layout = computed(() => {
  const [left, right] = props.from < props.to ? [props.from, props.to] : [props.to, props.from]
  return {
    x: `${left * 100}%`,
    width: `${(right - left) * 100}%`,
    leadingX: `${props.to * 100}%`
  }
})
</script>

<style lang="scss" scoped>
.ViewingLayer--draggedShift {
  fill-opacity: 0.2;
}

.ViewingLayer--draggedShift.isShiftDrag,
.ViewingLayer--draggedEdge.isShiftDrag {
  fill: #44f;
}

.ViewingLayer--draggedShift.isReframeDrag,
.ViewingLayer--draggedEdge.isReframeDrag {
  fill: #f44;
}
</style>
