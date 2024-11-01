<template>
  <div>
    <el-upload
      class="upload-demo"
      :auto-upload="false"
      drag
      action="string"
      :file-list="state.fileList"
      :on-change="changeFile"
    >
      <!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon> -->
      <div class="el-upload__text">将文件拖拽到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-button type="primary" @click="uploadFun">上传</el-button>
  </div>
</template>

<script setup lang="ts">
// import { getFileSHA256Hash, FileSliceUpload } from './index.js'
import { getFileHash, FileSliceUpload, computeHashWorker } from '@/utils/upload.js'
const state = reactive({
  fileList: [],
  fileData: null
})

function changeFile(file) {
  console.log(file, '更新文件')
  state.fileList.push(file)
  state.fileData = file.raw
}

function countSHA256fn(cur, total) {
  console.log('解析文件', cur, total)
  state.countProgress = cur >= total ? 100 : parseFloat(((cur * 100) / total).toFixed(2))
}

async function uploadFun() {
  if (!state.fileData) {
    console.log('请选择上传文件', import.meta.url)
    return
  }
  try {
    const hash = await computeHashWorker({ file: state.fileData }, countSHA256fn)
    // const hash = await getFileHash({ file: state.fileData }, countSHA256fn)
    console.log(hash, 'hash')
    // const res = FileSliceUpload({ file: state.fileData, hash }, uploadFile)
    // const file = state.fileData
    // const SliceSize = 5 * 1024 * 1024
    // const hash = await getFileSHA256Hash({ file, SliceSize, countSHA256fn })
    // console.log(hash, 'hash')
    // const ok = await FileSliceUpload({ file, SliceSize, fn: uploadFile, hash })
  } catch (error) {
    console.log(error, 'error')
  }
}

async function uploadFile(file) {
  console.log(file, '上传文件')
  const { chunk, file_name, hash, total_size, cur_size } = file
  try {
    const res = await simulationAxios({})
    if (res.code != 0) {
      return { type: 'error', message: res.message_cn }
    }
  } catch (error) {
    if (error.message?.includes('Network, Error')) {
      console.log('网络异常，请检查网络链接后重新上传')
    }
  }
}

function simulationAxios() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0 })
    }, 1000)
  })
}
</script>
