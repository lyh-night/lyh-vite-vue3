<template>
  <div class="tow-container" ref="containerRef">
    <div class="left-column" ref="leftColumn" :style="`width: ${props.leftMinWidth}px`">
      <slot name="left" />
      <div class="splitter" ref="splitter" @mousedown="startResize">⋮</div>
    </div>
    <div class="right-column" ref="rightColumn" :style="`width: calc(100% - ${props.leftMinWidth}px - 10px)`">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'TwoColumnResize'
})

const props = defineProps({
  leftMaxWidth: {
    type: Number,
    default: 620
  },
  leftMinWidth: {
    type: Number,
    default: 320
  }
})

const leftColumn = ref(null)
const splitter = ref(null)
const rightColumn = ref(null)
const containerRef = ref(null)
const isResizing = ref(false)
const initialX = ref(0)
const initialLeftWidth = ref(0)

const startResize = (e) => {
  isResizing.value = true
  initialX.value = e.clientX
  initialLeftWidth.value = leftColumn.value?.offsetWidth || 0

  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)

  e.preventDefault()
}

const resize = (e) => {
  if (!isResizing.value) return
  splitter.value.style.background = '#818181'

  const containerRect = containerRef.value.getBoundingClientRect()
  const offsetX = e.clientX - initialX.value
  const newLeftWidth =
    initialLeftWidth.value + offsetX < props.leftMinWidth
      ? props.leftMinWidth
      : initialLeftWidth.value + offsetX > props.leftMaxWidth
        ? props.leftMaxWidth
        : initialLeftWidth.value + offsetX
  const newRightWidth = containerRect?.width ? containerRect.width - newLeftWidth : 0

  // 使用 requestAnimationFrame 来平滑调整宽度
  requestAnimationFrame(() => {
    leftColumn.value.style.width = newLeftWidth + 'px'
    rightColumn.value.style.width = newRightWidth + 'px'
  })
}

const stopResize = () => {
  isResizing.value = false
  splitter.value.style.background = '#d6d6d6'

  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style lang="scss" scoped>
/* 设置容器和左右列的样式 */
.tow-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #eef3f7;
}
.left-column {
  margin-right: 10px;
}

.left-column,
.right-column {
  position: relative;
  flex-grow: 1;
  transition: width 0.3s;
  background-color: #fff;
}

/* 设置中分线的样式 */
.splitter {
  position: absolute;
  width: 10px;
  height: 50px;
  top: 50%;
  right: -10px;
  border-radius: 5px;
  font-size: 32px;
  color: #fff;
  z-index: 999;
  background-color: #d6d6d6;
  cursor: col-resize;
  text-align: center;
  &:hover {
    color: #1e283d;
  }
}
</style>
