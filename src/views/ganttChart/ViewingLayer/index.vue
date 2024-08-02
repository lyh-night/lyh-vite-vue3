<template>
  <div class="ViewingLayer">
    <div v-if="buttonShow" @click="resetTimeZoomClickHandler" class="ViewingLayer--resetZoom">Reset Selection</div>
    <svg
      ref="svgRef"
      class="ViewingLayer--graph"
      @mousedown="_draggerReframe.handleMouseDown"
      @mouseleave="_draggerReframe.handleMouseLeave"
      @mousemove="_draggerReframe.handleMouseMove"
    >
      <!-- 四条坐标轴线 -->
      <GraphTicks :numTicks="props.numTicks" />
      <!-- 左边的块 -->
      <rect
        v-if="leftInactive > 0"
        :x="0"
        :y="0"
        height="100%"
        :width="`${leftInactive}%`"
        class="ViewingLayer--inactive"
      />
      <!-- 右边的块 -->
      <rect
        v-if="rightInactive > 0"
        :x="`${100 - rightInactive}%`"
        :y="0"
        height="100%"
        :width="`${rightInactive}%`"
        class="ViewingLayer--inactive"
      />
      <!-- 悬浮显示的线 -->
      <line
        v-if="cursorPosition"
        class="ViewingLayer--cursorGuide"
        :x1="cursorPosition"
        y1="0"
        :x2="cursorPosition"
        :y2="`${props.height - 2}`"
        strokeWidth="1"
      />
      <!-- 选择一块区域后左边的标志 -->
      <Scrubber
        v-if="leftInactive"
        :position="leftInactive"
        :onMouseDown="_draggerStart.handleMouseDown"
        :onMouseEnter="_draggerStart.handleMouseEnter"
        :onMouseLeave="_draggerStart.handleMouseLeave"
      />
      <!-- 选择一块区域后右边的标志 -->
      <Scrubber
        v-if="rightInactive"
        :position="100 - rightInactive"
        :onMouseDown="_draggerEnd.handleMouseDown"
        :onMouseEnter="_draggerEnd.handleMouseEnter"
        :onMouseLeave="_draggerEnd.handleMouseLeave"
      />
      <Markers
        v-if="props.viewRange.shiftStart != null"
        :from="leftInactive / 100"
        :to="props.viewRange.shiftStart"
        :isShift="true"
        :height="props.height"
      />
      <Markers
        v-if="props.viewRange.shiftEnd != null"
        :from="(100 - rightInactive) / 100"
        :to="props.viewRange.shiftEnd"
        :isShift="true"
        :height="props.height"
      />
      <Markers
        v-if="props.viewRange.reframe != null"
        :from="props.viewRange.reframe.anchor"
        :to="props.viewRange.reframe.shift"
        :isShift="false"
        :height="props.height"
      />
    </svg>
  </div>
</template>

<script setup>
import GraphTicks from '../GraphTicks/index.vue'
import Scrubber from '../Scrubber/index.vue'
import Markers from '../Markers/index.vue'
import DraggableManager, { EUpdateTypes } from '../js/DraggableManager.js'
import { computed } from 'vue'

const props = defineProps({
  viewRange: {
    type: Object,
    default: () => {}
  },
  height: {
    type: Number,
    default: 60
  },
  numTicks: {
    type: Number,
    default: 4
  }
})

const emits = defineEmits(['updateNextViewRangeTime'])

const state = reactive({
  preventCursorLine: false
})

// 悬浮后显示的线
const cursorPosition = computed(() => {
  if (props.viewRange.cursor != null && !state.preventCursorLine) {
    return `${props.viewRange.cursor * 100}%`
  } else {
    return null
  }
})

// 左边块
const leftInactive = computed(() => {
  const [viewStart, viewEnd] = props.viewRange.current
  return viewStart ? viewStart * 100 : 0
})

// 右边块
const rightInactive = computed(() => {
  const [viewStart, viewEnd] = props.viewRange.current
  return viewEnd ? 100 - viewEnd * 100 : 0
})

// 清除按钮
const buttonShow = computed(() => {
  const [viewStart, viewEnd] = props.viewRange.current
  return viewStart !== 0 || viewEnd !== 1
})

const dragTypes = {
  SHIFT_END: 'SHIFT_END',
  SHIFT_START: 'SHIFT_START',
  REFRAME: 'REFRAME'
}

const svgRef = ref(null)

const _getDraggingBounds = (tag) => {
  if (!svgRef.value) {
    throw new Error('invalid state')
  }
  const { left: clientXLeft, width } = svgRef.value.getBoundingClientRect()
  const [viewStart, viewEnd] = props.viewRange.current
  let maxValue = 1
  let minValue = 0
  if (tag === dragTypes.SHIFT_START) {
    maxValue = viewEnd
  } else if (tag === dragTypes.SHIFT_END) {
    minValue = viewStart
  }
  return { clientXLeft, maxValue, minValue, width }
}

// 鼠标移动
const _handleReframeMouseMove = ({ value }) => {
  emits('updateNextViewRangeTime', { cursor: value })
}

// 鼠标离开
const _handleReframeMouseLeave = () => {
  emits('updateNextViewRangeTime', { cursor: null })
}

// 拖动开始
const _handleReframeDragUpdate = ({ value }) => {
  const shift = value
  const { reframe } = props.viewRange
  const anchor = reframe ? reframe.anchor : shift
  const update = { reframe: { anchor, shift } }
  emits('updateNextViewRangeTime', update)
}

// 拖动结束
const _handleReframeDragEnd = ({ manager, value }) => {
  const { reframe } = props.viewRange
  const anchor = reframe ? reframe.anchor : value
  const [start, end] = value < anchor ? [value, anchor] : [anchor, value]
  manager.resetBounds()
  emits('updateNextViewRangeTime', { current: [start, end], reframe: null, shiftStart: null, shiftEnd: null })
}

const _handleScrubberEnterLeave = ({ type }) => {
  state.preventCursorLine = type === EUpdateTypes.MouseEnter
}

const _handleScrubberDragUpdate = ({ event, tag, type, value }) => {
  if (type === EUpdateTypes.DragStart) {
    event.stopPropagation()
  }
  if (tag === dragTypes.SHIFT_START) {
    emits('updateNextViewRangeTime', { shiftStart: value })
  } else if (tag === dragTypes.SHIFT_END) {
    emits('updateNextViewRangeTime', { shiftEnd: value })
  }
}

const _handleScrubberDragEnd = ({ manager, tag, value }) => {
  const [viewStart, viewEnd] = props.viewRange.current
  let update
  if (tag === dragTypes.SHIFT_START) {
    update = [value, viewEnd]
  } else if (tag === dragTypes.SHIFT_END) {
    update = [viewStart, value]
  } else {
    throw new Error('bad state')
  }
  manager.resetBounds()
  state.preventCursorLine = false
  emits('updateNextViewRangeTime', { current: [update[0], update[1]] })
}

// 重置
function resetTimeZoomClickHandler() {
  emits('updateNextViewRangeTime', { current: [0, 1], reframe: null, shiftStart: null, shiftEnd: null })
}

const _draggerReframe = new DraggableManager({
  getBounds: _getDraggingBounds,
  onDragEnd: _handleReframeDragEnd,
  onDragMove: _handleReframeDragUpdate,
  onDragStart: _handleReframeDragUpdate,
  onMouseMove: _handleReframeMouseMove,
  onMouseLeave: _handleReframeMouseLeave,
  tag: dragTypes.REFRAME
})

const _draggerStart = new DraggableManager({
  getBounds: _getDraggingBounds,
  onDragEnd: _handleScrubberDragEnd,
  onDragMove: _handleScrubberDragUpdate,
  onDragStart: _handleScrubberDragUpdate,
  onMouseEnter: _handleScrubberEnterLeave,
  onMouseLeave: _handleScrubberEnterLeave,
  tag: dragTypes.SHIFT_START
})

const _draggerEnd = new DraggableManager({
  getBounds: _getDraggingBounds,
  onDragEnd: _handleScrubberDragEnd,
  onDragMove: _handleScrubberDragUpdate,
  onDragStart: _handleScrubberDragUpdate,
  onMouseEnter: _handleScrubberEnterLeave,
  onMouseLeave: _handleScrubberEnterLeave,
  tag: dragTypes.SHIFT_END
})
</script>

<style lang="scss" scoped>
.ViewingLayer {
  cursor: vertical-text;
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.ViewingLayer--graph {
  border: 1px solid #999;
  /* need !important here to overcome something from semantic UI */
  overflow: visible !important;
  position: relative;
  transform-origin: 0 0;
  width: 100%;
  height: 60px;
}

.ViewingLayer--inactive {
  fill: rgba(214, 214, 214, 0.5);
}

.ViewingLayer--cursorGuide {
  stroke: #f44;
  stroke-width: 1;
}

.ViewingLayer--resetZoom {
  display: none;
  position: absolute;
  right: 1%;
  top: 10%;
  z-index: 1;
  width: 120px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  border-radius: 2px;
}

.ViewingLayer:hover > .ViewingLayer--resetZoom {
  display: unset;
}
</style>
