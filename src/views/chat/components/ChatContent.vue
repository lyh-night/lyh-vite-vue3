<template>
  <div class="chat-content">
    <div ref="logContainer" class="talk-content">
      <div v-for="(item, i) in props.contentList" :key="i" class="chat-assistant">
        <div v-if="item.type == 'send'" class="send">
          <div>{{ item.message }}</div>
        </div>
        <div v-if="item.type == 'answer'" class="answer">
          <SvgIcon name="deepseek" width="30px" height="30px" />
          <div v-html="item.message" :class="['markdown-body', props.loading ? 'markdown-body-generate' : '']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'github-markdown-css/github-markdown.css'
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

const logContainer = ref(null)

onMounted(() => {
  console.log(logContainer.value.scrollTop, 'ref')
  console.log(logContainer.value.scrollHeight, 'ref')
})
</script>

<style lang="scss">
@use '../style/markdown-body.scss';
.chat-content {
  overflow: auto;
  width: 100%;
}
.talk-content {
  width: calc(100% - 40px);
  max-width: 960px;
  min-width: 360px;
  padding: 20px;
  box-sizing: border-box;
  margin: auto;
  .send {
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
  .answer {
    display: flex;
    .markdown-body {
      width: calc(100% - 30px);
    }
  }
}
</style>
