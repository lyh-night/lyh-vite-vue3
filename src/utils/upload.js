// 文件上传逻辑

import CryptoJS from 'crypto-js'

// 查看文件 MD5、SHA256
// certutil -hashfile 文件路径 MD5
// certutil -hashfile 文件路径 SHA256

// 更新文件块hash
export const updateBlobHash = (fileReader, SHA256) => {
  return new Promise((resolve, reject) => {
    try {
      fileReader.onload = (e) => {
        const SHA256Hash = CryptoJS.lib.WordArray.create(e.target.result)
        SHA256.update(SHA256Hash)
        resolve({ type: 'success', message: 'success' })
      }
      fileReader.onerror = () => reject({ type: 'warning', message: '解析文件失败' })
    } catch (error) {
      reject({ type: 'warning', message: error })
    }
  })
}

// 获取文件 hash
export const getFileHash = async (options = {}, callbackFun) => {
  const { file, SliceSize = 10 * 1024 * 1024 } = options
  const fileReader = new FileReader()
  // const SHA256 = CryptoJS.algo.SHA256.create()
  const SHA256 = CryptoJS.algo.MD5.create()
  let index = 0
  let cur = index * SliceSize
  while (cur < file.size) {
    const end_size = cur + SliceSize > file.size ? file.size : cur + SliceSize
    const Bolb = file.slice(cur, end_size)
    // const res = await computeHashWorker({ chunk: Bolb })
    fileReader.readAsArrayBuffer(Bolb)
    const res = await updateBlobHash(fileReader, SHA256)
    if (res.type == 'warning') {
      console.log(res.message, 'message')
      break
    }
    console.log(res, '计算hash')
    SHA256.update(res.message)
    callbackFun && callbackFun(cur, file.size)
    index++
    cur = cur + SliceSize
  }
  return SHA256.finalize().toString()
}

// 切片上传
export const FileSliceUpload = async (options, callbackFun) => {
  const { file, SliceSize = 10 * 1024 * 1024, hash } = options
  let index = 0
  let cur = index * SliceSize
  const chunk_total = Math.ceil(file.size / SliceSize)
  let isSuccess = true
  while (cur < file.size) {
    const end_size = cur + SliceSize > file.size ? file.size : cur + SliceSize
    const Bolb = file.slice(cur, end_size)
    const res = await callbackFun({
      complete: false,
      chunk: Bolb,
      hash,
      chid_id: index,
      cur_size: cur,
      end_size,
      file_name: file.name,
      total_size: file.size,
      chunk_total
    })
    if (res.code != 0) {
      console.log('error', res.message)
      isSuccess = false
      break
    }
    index++
    cur = cur + SliceSize
  }
  if (!isSuccess) {
    return isSuccess
  }
  const result = await callbackFun({
    complete: true,
    chunk: null,
    hash,
    chid_id: -1,
    cur_size: cur,
    end_size: null,
    file_name: file.name,
    total_size: file.size,
    chunk_total
  })
  return isSuccess && result.code == 0
}

// 开启新的线程计算hash
export function computeHashWorker(options, callbackFun) {
  const { file, SliceSize } = options
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./hashWorker.js', import.meta.url), { type: 'module' })
    // 向 worker 发送信息
    worker.postMessage(options)
    // 监听来自 worker 的信息
    worker.onmessage = function (e) {
      console.log(e, '主线程接收信息')
      if (e.data.type == 'progress') {
        callbackFun && callbackFun(e.data.value)
      }
      if (e.data.type == 'hash') {
        worker.terminate()
        resolve(e.data.value)
      }
    }
  })
}

// import CryptoJs from 'crypto-js'
// import encHex from 'crypto-js/enc-hex'

// // 计算hash
// const hashFile = (file) => {
//   const { size = 0 } = file

//   /**
//    * 使用指定的算法计算hash值
//    */
//   const hashFileInternal = (alog) => {
//     // 指定块的大小，这里设置为 20MB,可以根据实际情况进行配置，超过 100MB 的分片可能会卡
//     const chunkSize = 20 * 1024 * 1024
//     /**
//      * 更新文件块的hash值
//      */
//     const hashBlob = (blob, index) => {
//       // 格式化 fileList
//       formatFile(file, fileType.uploading, index / size)
//       return new Promise((resolve) => {
//         const reader = new FileReader()
//         reader.onload = ({ target }) => {
//           const wordArray = CryptoJs.lib.WordArray.create(target.result)
//           // CryptoJS update的方式，增量更新计算结果
//           alog.update(wordArray)
//           resolve()
//         }
//         reader.readAsArrayBuffer(blob)
//       })
//     }
//     let promise = Promise.resolve()
//     // 使用promise来串联hash计算的顺序。
//     // 因为FileReader是在事件中处理文件内容的，必须要通过某种机制来保证update的顺序是文件正确的顺序
//     for (let index = 0; index < size; index += chunkSize) {
//       promise = promise.then(async () => {
//         return hashBlob(file.slice(index, index + chunkSize), index)
//       })
//     }
//     // 使用promise返回最终的计算结果
//     return promise.then(() => encHex.stringify(alog.finalize()))
//   }
//   // 计算文件的sha256,MD5 计算：CryptoJs.algo.MD5.create()
//   return hashFileInternal(CryptoJs.algo.SHA256.create())
// }
