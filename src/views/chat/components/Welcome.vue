<template>
  <div class="talk-welcome">
    <h1>{{ state.title }}</h1>
    <p>{{ state.welcome }}</p>
  </div>
</template>

<script setup>
const state = reactive({
  title: '我是 DeepSeek，很高兴见到你！',
  welcome: '我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~'
})
</script>

<style lang="scss" scoped>
.talk-welcome {
  padding: 10% 20% 25px;
  text-align: center;
  h1 {
    margin-bottom: 20px;
    font-size: 30px;
  }
  p {
    color: #8f9aad;
  }
}
</style>
