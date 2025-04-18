<template>
  <div class="chat-container">
    <ChatHistory />
    <div class="chat-window"><ChatWindow /></div>
  </div>
</template>

<script setup>
import ChatHistory from './components/ChatHistory.vue'
import ChatWindow from './components/ChatWindow.vue'
</script>

<style lang="scss" scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  .chat-window {
    flex: 1;
  }
}
</style>
