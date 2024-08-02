<template>
  <g class="Scrubber">
    <g
      class="Scrubber--handles"
      @mousedown="props.onMouseDown"
      @mouseenter="props.onMouseEnter"
      @mouseleave="props.onMouseLeave"
    >
      <rect
        :x="xPercent"
        class="Scrubber--handleExpansion"
        style="transform: translate(-4.5px)"
        width="9"
        height="20"
      />
      <rect :x="xPercent" class="Scrubber--handle" style="transform: translate(-1.5px)" width="3" height="20" />
    </g>
    <line class="Scrubber--line" y2="100%" :x1="xPercent" :x2="xPercent" />
  </g>
</template>

<script setup>
const props = defineProps({
  position: {
    type: Number
  },
  onMouseDown: {
    type: Function
  },
  onMouseEnter: {
    type: Function
  },
  onMouseLeave: {
    type: Function
  }
})

const xPercent = computed(() => {
  return props.position ? `${props.position}%` : '0%'
})
</script>

<style lang="scss" scoped>
.Scrubber--handleExpansion {
  cursor: col-resize;
  fill-opacity: 0;
  fill: #44f;
}

.Scrubber.isDragging .Scrubber--handleExpansion,
.Scrubber--handles:hover > .Scrubber--handleExpansion {
  fill-opacity: 1;
}

.Scrubber--handle {
  cursor: col-resize;
  fill: #555;
}

.Scrubber.isDragging .Scrubber--handle,
.Scrubber--handles:hover > .Scrubber--handle {
  fill: #44f;
}

.Scrubber--line {
  pointer-events: none;
  stroke: #555;
}

.Scrubber.isDragging > .Scrubber--line,
.Scrubber--handles:hover + .Scrubber--line {
  stroke: #44f;
}
</style>
