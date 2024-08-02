<template>
  <div class="contain">
    <div class="left">
      <div />
    </div>
    <div class="right" />
  </div>
</template>

<script setup>
onMounted(() => {
  console.log(import.meta.env, '环境模式')
  // LC044/WeChatMsg
})
</script>

<style lang="scss" scoped>
.contain {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  .left {
    display: flex;
    flex-direction: column;
    width: 220px;
    height: 100%;
    > div {
      width: 220px;
    }
  }
  .right {
    width: 100%;
    height: 100%;
    // box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
}
</style>
