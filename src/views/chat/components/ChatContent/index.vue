<template>
  <div ref="scrollRef" class="chat-content">
    <div ref="contentRef" class="talk-content">
      <div v-for="(item, i) in props.contentList" :key="i">
        <!-- 问题 -->
        <avatar v-if="item.type == 'send'" :data="item" />
        <!-- 回答 -->
        <div v-if="item.type == 'receive'" class="answer-body">
          <!-- 加载中 -->
          <ChatLoading v-if="item.status == 'loading'" />
          <!-- 思考中 -->
          <Think v-if="item.thinking_content" :data="item" />
          <!-- 回答具体内容 -->
          <div v-html="item.message" class="markdown-body" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChatLoading from './ChatLoading.vue'
import Avatar from './Avatar.vue'
import Think from './Think.vue'

import 'github-markdown-css/github-markdown.css'
import { useScroll } from '../../js/useScroll.js'
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  contentList: {
    type: Array,
    default: () => []
  }
})

const { scrollRef, scrollToBottom } = useScroll()

onMounted(() => {
  scrollToBottom()
})

onUpdated(() => {
  scrollToBottom()
})

const contentRef = ref(null)

function scrollChatStart() {}

defineExpose({ scrollChatStart })
</script>

<style lang="scss">
@use '../../style/markdown-body.scss';
@use '../../style/custom-code-block.scss';

.chat-content {
  overflow: auto;
  width: 100%;
  .talk-content {
    width: calc(100% - 40px);
    max-width: 960px;
    min-width: 360px;
    padding: 20px;
    box-sizing: border-box;
    margin: auto;
    .answer-body {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
