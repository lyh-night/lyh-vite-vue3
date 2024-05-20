<template>
  <div>
    <el-button>Default</el-button>
    <svg-icon name="ceshi" width="30px" height="30px" />
  </div>
</template>

<script setup>
onMounted(() => {
  console.log(import.meta.env, '环境模式')
  // LC044/WeChatMsg
})
</script>

<style scoped></style>
