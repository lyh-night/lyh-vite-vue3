// 计算hash

import CryptoJS from 'crypto-js'

// 监听来自主线程的消息
self.onmessage = async function (e) {
  const options = e.data
  const { file, SliceSize = 10 * 1024 * 1024 } = options
  const fileReader = new FileReader()
  // const SHA256 = CryptoJS.algo.SHA256.create()
  const hash = CryptoJS.algo.MD5.create()
  let index = 0
  let cur = index * SliceSize
  while (cur < file.size) {
    const end_size = cur + SliceSize > file.size ? file.size : cur + SliceSize
    const Bolb = file.slice(cur, end_size)
    fileReader.readAsArrayBuffer(Bolb)
    const res = await updateBlobHash(fileReader, hash)
    if (res.type == 'warning') {
      console.log(res.message, 'message')
      break
    }
    hash.update(res.message)
    index++
    cur = cur + SliceSize
    const progress = cur >= file.size ? 100 : parseFloat(((cur * 100) / file.size).toFixed(2))
    self.postMessage({ type: 'progress', value: progress })
  }
  self.postMessage({ type: 'hash', value: hash.finalize().toString() })
}

// 更新文件块hash
const updateBlobHash = (fileReader, hash) => {
  return new Promise((resolve, reject) => {
    try {
      fileReader.onload = (e) => {
        const SHA256Hash = CryptoJS.lib.WordArray.create(e.target.result)
        hash.update(SHA256Hash)
        resolve({ type: 'success', message: 'success' })
      }
      fileReader.onerror = () => reject({ type: 'warning', message: '解析文件失败' })
    } catch (error) {
      reject({ type: 'warning', message: error })
    }
  })
}
