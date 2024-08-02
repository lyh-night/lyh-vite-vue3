// 处理成节点所需数据

import colorGenerator from './color.js'

export function transformTraceData(data) {
  let { traceID, processes, spans } = data
  if (!traceID) {
    return null
  }
  let tree = []
  const spanMap = {}
  let traceEndTime = 0
  let traceStartTime = Number.MAX_SAFE_INTEGER
  spans &&
    spans.forEach((item, index) => {
      const { startTime, duration, processID } = item
      if (startTime < traceStartTime) {
        traceStartTime = startTime
      }
      if (startTime + duration > traceEndTime) {
        traceEndTime = startTime + duration
      }
      item.endTime = startTime + duration
      item.process = processes[processID] ? processes[processID] : {}
      item.serviceName = processes[processID] ? processes[processID].serviceName : ''
      item.parentID = item.references && item.references.length ? item.references[0].spanID : ''
      item.children = []
      spanMap[item.spanID] = index // 用于处理树型结构
      item.name = item.operationName
      item.expend = true // 是否展开节点
      item.detail = false // 是否显示详情
      item.fillColor = colorGenerator.getColorByKey(processID) // 填充的颜色
      item.fillBackgroundColor = `rgba(${colorGenerator.getRgbColorByKey(processID).concat(0.6).join()})` // 填充背景色
    })

  // 将列表转化为 tree
  spans &&
    spans.forEach((item) => {
      item.valueWidth = item.duration // 内容宽度
      item.valueOffset = item.endTime - item.duration - traceStartTime // 内容起始位置
      item.viewStart = (item.startTime - traceStartTime) / (traceEndTime - traceStartTime)
      item.viewEnd = (item.endTime - traceStartTime) / (traceEndTime - traceStartTime)
      if (item.parentID) {
        spans[spanMap[item.parentID]].children.push(item)
      } else {
        tree.push(item)
      }
    })
  return {
    duration: traceEndTime - traceStartTime,
    startTime: traceStartTime,
    endTime: traceEndTime,
    tree,
    spans,
    processes,
    traceID
  }
}
