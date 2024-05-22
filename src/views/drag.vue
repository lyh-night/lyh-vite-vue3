<template>
  <el-table id="dragTable" :data="state.tableData" row-key="id" style="width: 360px">
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="id" label="id" />
    <el-table-column>
      <template #default>
        <el-icon><icon-ep-sort /></el-icon>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
// sortablejs文档：https://sortablejs.com/options
import Sortable from 'sortablejs'
const state = reactive({
  tableData: [
    { name: '111', id: 1 },
    { name: '222', id: 2 },
    { name: '333', id: 3 }
  ]
})

function setSort() {
  const el = document.querySelector('#dragTable table tbody')
  new Sortable(el, {
    sort: true,
    handle: '.el-icon',
    animation: 150,
    onStart: (e) => {
      e.item.style.backgroundColor = '#cce8ff'
    },
    onEnd: (e) => {
      if (e.newIndex == e.oldIndex) {
        return
      }
      const targetRow = state.tableData.splice(e.oldIndex, 1)[0]
      state.tableData.splice(e.newIndex, 0, targetRow)
      e.item.style.backgroundColor = ''
      console.log(e, state.tableData)
    }
  })
}

onMounted(() => {
  setSort()
})
</script>

<style lang="scss" scoped>
.el-icon {
  cursor: move;
}
</style>
