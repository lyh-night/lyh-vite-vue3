export const defaultData = {
  nodes: [
    { id: '0', label: 'node-0', data: { label: 'node-0', description: 'This is node-0.' } },
    { id: '1', label: 'node-0', data: { label: 'node-1', description: 'This is node-1.' } },
    { id: '2', label: 'node-0', data: { label: 'node-2', description: 'This is node-2.' } },
    { id: '3', label: 'node-0', data: { label: 'node-3', description: 'This is node-3.' } },
    { id: '4', label: 'node-0', data: { label: 'node-4', description: 'This is node-4.' } },
    { id: '5', label: 'node-0', data: { label: 'node-5', description: 'This is node-5.' } }
  ],
  edges: [
    { source: '0', target: '1', data: { description: 'This is edge from node 0 to node 1.' } },
    { source: '0', target: '2', data: { description: 'This is edge from node 0 to node 2.' } },
    { source: '0', target: '3', data: { description: 'This is edge from node 0 to node 3.' } },
    { source: '0', target: '4', data: { description: 'This is edge from node 0 to node 4.' } },
    { source: '0', target: '5', data: { description: 'This is edge from node 0 to node 5.' } }
  ]
}

export const deafultNodeConfig = {
  style: {
    labelText: (data) => data.label,
    labelPlacement: 'bottom',
    labelMaxWidth: 200,
    size: 26,
    fill: '#EFF4FF',
    lineWidth: 1,
    stroke: '#5F95FF'
  },
  state: {
    hover: {
      fill: 'lightsteelblue'
    }
  }
}

export const defaultEdgeConfig = {
  style: {
    stroke: 'lightgreen'
  }
}

export const defaultLayoutConfig = {
  type: 'dendrogram',
  direction: 'TB', // H / V / LR / RL / TB / BT
  nodeSep: 40,
  rankSep: 100
}
