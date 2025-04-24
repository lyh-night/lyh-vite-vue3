<template>
  <button @click="updateToken">点击</button>
  <i class="iconfont icon-add-circle"></i>
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
