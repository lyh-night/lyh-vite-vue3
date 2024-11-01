<template>
  <LazyLoading> 首页 </LazyLoading>
  <div />
</template>

<script setup>
onMounted(() => {
  console.log(import.meta.env, '环境模式')
})
</script>

<style lang="scss" scoped></style>
