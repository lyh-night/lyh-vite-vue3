<template>
  <div class="TimelineHeaderRow">
    <div :style="`width: ${props.width}%`">
      <h3 class="TimelineHeaderRow--title">Service &amp; Operation</h3>
    </div>
    <div :style="`width: ${100 - props.width}%`">
      <TickLabels :numTicks="props.numTicks" :startTime="props.startTime" :endTime="props.endTime" />
    </div>
  </div>
</template>

<script setup>
import TickLabels from '../TickLabels/index.vue'
const props = defineProps({
  width: {
    type: Number,
    default: 30
  },
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
</script>

<style lang="scss" scoped>
.TimelineHeaderRow {
  background: #ececec;
  border-bottom: 1px solid #ccc;
  height: 38px;
  line-height: 38px;
  width: 100%;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
}

.TimelineHeaderRow--title {
  flex: 1;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
