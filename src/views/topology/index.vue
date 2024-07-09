<template>
  <div class="topology-container">
    <div id="container" />
  </div>
</template>

<script setup>
/**
 * 文档地址：https://g6-next.antv.antgroup.com/manual/core-concept
 * 当前使用 antv 版本为5.0.0，与4.0不同，需查看5.0版本文档
 */
import { Graph } from '@antv/g6'
import { onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { defaultData } from './defaultConfig.js'
let graph = null

onMounted(() => {
  const { width, height } = getLayoutWh()
  graph = new Graph({
    container: 'container', // 图的 DOM 容器 'id' || document.getElementById('container')
    width,
    height,
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'], // 交互
    node: {
      style: {
        size: 20
      }
    },
    edge: {
      style: {
        stroke: 'lightgreen'
      }
    },
    layout: {
      type: 'grid'
    },
    plugins: [
      { type: 'grid-line', follow: true },
      {
        type: 'contextmenu',
        offset: [4, 4],
        enable: (e) => {
          return e.targetType == 'node'
        },
        getItems: () => {
          return [
            { name: '展开一度关系', value: 'spread' },
            { name: '查看详情', value: 'detail' }
          ]
        },
        onClick: (v) => {
          console.log(v, '点击菜单')
        }
      },
      {
        type: 'tooltip',
        trigger: 'hover',
        getContent: (e, items) => {
          let result = `<h4>${items[0].data.description}</h4>`
          return result
        }
      },
      { type: 'CameraSetting', cameraType: 'tracking' }
    ]
  })
  // console.log(graph, '数据')
  graph.setData(defaultData)
  graph.render()
  nodeClickFun()
  window.addEventListener('resize', debounce(changeGraphSize, 100))
})

function getLayoutWh() {
  const width = (document.documentElement.clientWidth || document.body.clientWidth) - 30
  const height = (document.documentElement.clientHeight || document.body.clientHeight) - 30
  return { width, height }
}

function changeGraphSize() {
  if (!graph) return
  const { width, height } = getLayoutWh()
  graph.resize(width, height)
}

function nodeClickFun() {
  graph.on('node:click', (event) => {
    console.log(event, '点击')
  })
}

onUnmounted(() => {
  window.removeEventListener('resize', changeGraphSize)
})
</script>

<style lang="scss" scoped>
.topology-container {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  #container {
    width: 100%;
    height: 100%;
  }
}
</style>
