<template>
  <div :id="id" :style="{ width: width, height: height }" />
</template>

<script>
import { defineComponent, nextTick, onMounted } from 'vue'
import echarts from '@/utils/echarts.js'
import { debounce } from 'lodash-es'
export default defineComponent({
  name: 'EchartLine',
  props: {
    id: {
      type: String,
      default: () => `echart-line${Math.random()}`
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '240px'
    }
  },
  setup(props) {
    const { id } = toRefs(props)
    let myChart = reactive({})

    onMounted(() => {
      window.addEventListener('resize', debounce(resizeHandler, 100))
      nextTick(() => {
        init()
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler)
      myChart && myChart.dispose()
    })

    function resizeHandler() {
      myChart && myChart.resize()
    }

    function init() {
      myChart = echarts.init(document.getElementById(id.value))
      const options = {
        title: {
          text: 'Temperature Change in the Coming Week'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: 'Highest',
            type: 'line',
            data: [10, 11, 13, 11, 12, 12, 9],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          },
          {
            name: 'Lowest',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
            },
            markLine: {
              data: [
                { type: 'average', name: 'Avg' },
                [
                  {
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                  },
                  {
                    symbol: 'circle',
                    label: {
                      position: 'start',
                      formatter: 'Max'
                    },
                    type: 'max',
                    name: '最高点'
                  }
                ]
              ]
            }
          }
        ]
      }
      myChart.setOption(options)
    }
  }
})
</script>
