<template>
  <input type="file" @change="changeHandle" />
  <vue-office-excel :src="state.excel" style="height: 100vh" @rendered="renderedHandler" @error="errorHandler" />
</template>

<script setup>
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'

function renderedHandler() {
  console.log('渲染完成')
}
function errorHandler() {
  console.log('渲染失败')
}

const state = reactive({
  excel: null
})

function changeHandle(event) {
  console.log(event, 'event')
  let file = event.target.files[0]
  let fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  fileReader.onload = () => {
    console.log(fileReader.result, '文件数据')
    state.excel = fileReader.result
  }
}
</script>

<style lang="scss" scoped></style>
