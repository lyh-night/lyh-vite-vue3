<template>
  <div ref="scrollRef" class="chat-content">
    <div ref="contentRef" class="talk-content">
      <div v-for="(item, i) in props.contentList" :key="i">
        <!-- 问题 -->
        <div v-if="item.type == 'send'" class="talk-content-send-item">
          <div>{{ item.message }}</div>
        </div>
        <!-- 回答 -->
        <div v-if="item.type == 'receive'" class="talk-content-answer-item">
          <SvgIcon name="deepseek" width="30px" height="30px" />
          <div class="answer-body">
            <!-- 加载中 -->
            <div v-if="item.status == 'loading'">loading</div>
            <!-- 回答具体内容 -->
            <div v-html="item.message" class="markdown-body" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'github-markdown-css/github-markdown.css'
import { useScroll } from '../js/useScroll.js'
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
@use '../style/markdown-body.scss';
@use '../style/custom-code-block.scss';

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
    .talk-content-send-item {
      display: flex;
      justify-content: flex-end;
      animation: fadeIn 0.5s ease forwards;
      font-size: 14px;
      margin-bottom: 10px;
      > div {
        max-width: 60%;
        border-radius: 15px;
        background-color: #f2f2f2;
        line-height: 20px;
        padding: 5px 10px;
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .talk-content-answer-item {
      display: flex;
      .answer-body {
        width: calc(100% - 30px);
        margin-bottom: 10px;
      }
    }
  }
}
</style>
