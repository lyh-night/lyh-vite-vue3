import CryptoJS from 'crypto-js'

/**
 * 分片计算文件的 SHA256 哈希值
 * @param {File} file - 要计算哈希的文件对象
 * @param {number} chunkSize - 分片大小（默认 2MB）
 * @param {Function} onProgress - 进度回调函数，参数为当前进度百分比
 * @returns {Promise<string>} - 返回 Promise，解析为文件的 SHA256 哈希值
 */
export async function calculateFileSHA256(file, chunkSize = 2 * 1024 * 1024, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const sha256 = CryptoJS.algo.SHA256.create() // 创建 SHA256 实例
    const totalChunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0

    // 读取分片并更新哈希
    const loadNextChunk = () => {
      const start = currentChunk * chunkSize
      const end = Math.min(file.size, start + chunkSize)
      const blob = file.slice(start, end)
      reader.readAsArrayBuffer(blob)
    }

    // 处理分片数据
    reader.onload = (e) => {
      if (e.target.error) {
        reject(e.target.error)
        return
      }

      // 将 ArrayBuffer 转换为 CryptoJS 的 WordArray 格式
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result)
      sha256.update(wordArray) // 更新哈希计算

      currentChunk++

      // 触发进度回调
      if (typeof onProgress === 'function') {
        const percent = Math.floor((currentChunk / totalChunks) * 100)
        onProgress(percent)
      }

      // 继续读取下一分片或完成计算
      if (currentChunk < totalChunks) {
        loadNextChunk()
      } else {
        const hash = sha256.finalize().toString(CryptoJS.enc.Hex)
        resolve(hash)
      }
    }

    // 处理错误
    reader.onerror = (err) => {
      reject(err)
    }

    // 开始读取第一个分片
    loadNextChunk()
  })
}
