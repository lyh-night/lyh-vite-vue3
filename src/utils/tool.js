// 工具类函数

// 控制并发数
async function asyncPool(poolLimit, array, iteratorFn) {
  const result = []
  const executing = []

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    result.push(p)

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.all(result)
}

// 示例
async function uploadFile(file) {
  // 文件上传逻辑
}

async function limitedFileUpload(files) {
  return asyncPool(3, files, uploadFile)
}

// 使用`async/await`优化递归
// 异步递归函数
async function asyncRecursiveSearch(nodes) {
  for (const node of nodes) {
    await asyncProcess(node)
    if (node.children) {
      await asyncRecursiveSearch(node.children)
    }
  }
}

// 示例
async function asyncProcess(node) {
  // 对节点进行异步处理逻辑
}
