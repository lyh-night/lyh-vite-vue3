<template>
  <LazyLoading> 首页 </LazyLoading>
  <div />
  <button @click="updateToken">点击</button>
</template>

<script setup>
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
onMounted(() => {
  console.log(systemStore.token, 'token')
  console.log(import.meta.env, '环境模式')
})

function updateToken() {
  systemStore.setState([{ attr: 'token', val: '456' }])
  console.log(systemStore.token, 'token')
}
</script>

<style lang="scss" scoped></style>
