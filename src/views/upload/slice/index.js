// 切片文件 上传

import CryptoJS from 'crypto-js'

// 支持分片计算 | 分片上传 | 分片计算后在上传
const FileFormatData = async (options = {}, fn) => {
  const { fileReader, SHA256, Bolb, file_name, child_id, hash, total_size, cur_size, end_size } = options
  const loadScripr = () => {
    return new Promise((resolve) => {
      try {
        fileReader.onload = async (e) => {
          if (SHA256) {
            const SHA256Hash = CryptoJS.lib.WordArray.create(e.target.result)
            SHA256.update(SHA256Hash)
          }
          let res = null
          if (fn) {
            const file = { complete: false, chunk: Bolb, child_id, file_name, total_size, cur_size, end_size }
            if (hash) {
              file.hash = hash
            }
            res = await fn(file)
          }
          resolve(res)
        }
      } catch (error) {
        return { type: 'warning', message: error }
      }
    })
  }
  return loadScripr()
}

// 分片文件处理
const FileSliceTodo = async (options) => {
  const { fileReader, SHA256, file, SliceSize, fn, hash, countSHA256fn, index = 0 } = options
  let ok = true
  try {
    const file_name = file.name
    let cur = index * SliceSize
    let child_id = index
    while (cur < file.size) {
      const end_size = cur + SliceSize > file.size ? file.size : cur + SliceSize
      const Bolb = file.slice(cur, end_size)
      fileReader.readAsArrayBuffer(Bolb)
      const options = {
        fileReader,
        SHA256,
        Bolb,
        file_name,
        child_id,
        hash,
        total_size: file.size,
        cur_size: cur,
        end_size
      }
      const res = await FileFormatData(options, fn)
      countSHA256fn && countSHA256fn(cur, file.size)
      cur += SliceSize
      child_id++
      if (res && res.tag == 'fail') {
        console.log('error', res.message, res.type)
        ok = false
        break
      }
      if (fn) {
        const params = {
          complete: false,
          chunk: null,
          child_id: -1,
          file_name,
          hash,
          total_size: file.size,
          cur_size: cur
        }
        const res = await fn(params)
        if (res && res.tag == 'fail') {
          console.log('error', res.message, res.type)
          ok = false
        }
      }
    }
  } catch (error) {
    ok = false
  }
  return ok
}

// 切分计算文件hash 并返回hash
const getFileSHA256Hash = async (options) => {
  const fileReader = new FileReader()
  const SHA256 = CryptoJS.algo.SHA256.create()
  const appendOptions = Object.assign(options, { fileReader, SHA256 })
  const ok = await FileSliceTodo(appendOptions)
  if (ok) {
    return SHA256.finalize().toString()
  }
  return ok
}

// 切片文件不加密上传 fn: 函数上传API
const FileSliceUpload = async (options) => {
  const fileReader = new FileReader()
  const appendOptions = Object.assign(options, { fileReader })
  const ok = await FileSliceTodo(appendOptions)
  return ok
}

// 读取文件内容
const getTextFileSign = async (file) => {
  return new Promise((resolve) => {
    const fileReader = new fileReader()
    fileReader.onload = function (e) {
      resolve(e.target.result)
    }
    fileReader.readAsText(file)
  })
}

export { FileFormatData, FileSliceTodo, getFileSHA256Hash, FileSliceUpload, getTextFileSign }
