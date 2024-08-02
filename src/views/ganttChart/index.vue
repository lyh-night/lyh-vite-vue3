<template>
  <div class="ganttChart">
    <TickLabels :numTicks="state.TIMELINE_TICK_INTERVAL" :startTime="0" :endTime="duration" />
    <div class="ub-relative">
      <CanvasSpanGraph ref="CanvasSpanGraphRef" :valueWidth="duration" :items="state.items" />
      <ViewingLayer
        :viewRange="state.viewRange"
        :numTicks="state.TIMELINE_TICK_INTERVAL"
        :height="state.DEFAULT_HEIGHT"
        @updateNextViewRangeTime="updateNextViewRangeTime"
      />
    </div>
    <div class="TraceTimelineViewer">
      <TimelineHeaderRow
        :width="state.defaultWidth"
        :numTicks="state.TIMELINE_TICK_INTERVAL"
        :startTime="selectTimeSlot.startTime"
        :endTime="selectTimeSlot.endTime"
      />
      <div class="VirtualizedTraceView">
        <VirtualizedTraceView :data="state.mockData" :viewRange="state.viewRange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import TickLabels from './TickLabels/index.vue'
import CanvasSpanGraph from './CanvasSpanGraph/index.vue'
import ViewingLayer from './ViewingLayer/index.vue'
import TimelineHeaderRow from './TimelineHeaderRow/index.vue'
import VirtualizedTraceView from './VirtualizedTraceView/index.vue'
import { transformTraceData } from './js/business.js'

import traceData from './traceData.json'

const state = reactive({
  startTime: 0,
  endTime: 100,
  defaultWidth: 30,
  DEFAULT_HEIGHT: 60,
  TIMELINE_TICK_INTERVAL: 4,
  viewRange: {
    current: [0, 1],
    cursor: 0,
    reframe: null,
    shiftEnd: null,
    shiftStart: null
  },
  items: [],
  mockData: []
})

const CanvasSpanGraphRef = ref(null)

onMounted(() => {
  const handleData = transformTraceData(traceData.data[0])
  state.mockData = handleData.tree
  state.items = handleData.spans
  state.startTime = handleData.startTime
  state.endTime = handleData.endTime
})

const duration = computed(() => {
  return state.endTime - state.startTime
})

const selectTimeSlot = computed(() => {
  const [start, end] = state.viewRange.current
  const duration = state.endTime - state.startTime
  return {
    startTime: duration * start,
    endTime: duration * end
  }
})

function updateNextViewRangeTime(val) {
  state.viewRange = {
    ...state.viewRange,
    ...val
  }
}
</script>

<style lang="scss" scoped>
.ganttChart {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .ub-relative {
    position: relative;
    background: #fafafa;
    margin-bottom: 10px;
    height: 60px;
    width: 100%;
  }
  .VirtualizedTraceView {
    border-left: 1px solid #d3d3d3;
    border-right: 1px solid #d3d3d3;
    border-bottom: 1px solid #d3d3d3;
  }
}
</style>
