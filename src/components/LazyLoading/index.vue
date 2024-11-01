<template>
  <div ref="container" class="lazy-loading-root">
    <slot v-if="isInit" />
    <!--组件初始化之前显示加载态loading-->
    <div key="skeleton" v-else style="height: 100%; width: 100%">
      <!-- 如果提供了骨架屏插槽，则显示它 -->
      <slot name="skeleton" v-if="$slots.skeleton" />
      <!-- 否则显示默认的加载态 -->
      <div v-else class="skeleton-item" />
    </div>
  </div>
</template>

<script setup defer>
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'LazyLoading'
})

const container = ref(null)
const isInit = ref(false)
const timer = ref()

onMounted(() => {
  // 创建一个Intersection Observer对象来观察元素是否进入视口
  const observer = new IntersectionObserver((entries) => {
    // 如果元素进入视口，设置定时器，800毫秒后设置isInit为true
    if (entries[0].isIntersecting) {
      timer.value = setTimeout(() => {
        isInit.value = true
        // 在组件卸载时取消观察
        observer.unobserve(container.value)
      }, 800)
    }
  })
  // 开始观察container元素
  observer.observe(container.value)
})

onUnmounted(() => {
  clearTimeout(timer.value)
})
</script>

<style scoped>
.lazy-loading-root {
  width: 100%;
  height: 260px;
}
/*样式二*/
.skeleton-item {
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
  overflow: hidden;
}

.skeleton-item:empty {
  background-color: #f2f2f2;
}

.skeleton-item:empty::before {
  /* 内容区域空状态时追加骨架屏样式 */
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(225, 225, 225, 0.753), transparent);
  animation: loading 1s infinite;
}

@keyframes loading {
  100% {
    transform: translateX(100%);
  }
}
</style>
