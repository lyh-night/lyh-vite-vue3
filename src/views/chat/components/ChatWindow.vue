<template>
  <div class="talk-container">
    <div v-if="state.contentList == 0" class="talk-welcome">
      <h1>我是 DeepSeek，很高兴见到你！</h1>
      <p>我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>
    </div>
    <div v-else class="talk-box">
      <div ref="logContainer" class="talk-content">
        <div v-for="(item, i) in state.contentList" :key="i" class="chat-assistant">
          <div v-if="item.type == 'send'" class="send">
            <div>{{ item.message }}</div>
          </div>
          <div v-if="item.type == 'answer'" class="answer">
            <SvgIcon name="deepseek" width="32px" height="32px" />
            <div v-html="item.message" :class="['markdown-body', state.loading ? 'markdown-body-generate' : '']" />
          </div>
        </div>
      </div>
    </div>
    <div class="talk-send">
      <textarea
        v-model="state.inputMessage"
        :rows="2"
        placeholder="请输入内容开始对话（shift+Enter换行）"
        @keydown.enter="handleEnter"
      />
      <div class="talk-btn">
        <i class="send-icon iconfont icon-direction-up" @click="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { SSE } from '../sse.js'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const state = reactive({
  loading: false,
  inputMessage: '',
  contentList: [],
  eventSourceChat: null,
  outputInterval: null,
  marketIt: {},
  startTime: null,
  endTime: null
})

onMounted(() => {
  createMarkdownInstance()
})

function createMarkdownInstance() {
  state.marketIt = new MarkdownIt({
    html: false,
    linkify: true,
    highlight(code, language) {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language })
      }
      return ''
    }
  })
}

function handleEnter(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

function handleSubmit() {
  if (
    !state.inputMessage ||
    state.inputMessage.trim() === '' ||
    state.inputMessage.split(/\r\n/).every((line) => line.trim === '')
  ) {
    return
  }
  state.eventSourceChat && state.eventSourceChat.close()
  state.contentList.push({ type: 'send', message: state.inputMessage })
  state.contentList.push({ type: 'answer', message: '<div class="think-time">思考中......</div>' })
  scrollToBottom()
  createSseRequest()
}

const logContainer = ref(null)
function scrollToBottom() {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

function createSseRequest() {
  state.eventSourceChat = new SSE('http://localhost:3000/api/chat', {
    method: 'post',
    headers: {
      'Content-Type': 'text/event-stream',
      Authorization: ''
    },
    payload: JSON.stringify({ message: state.inputMessage })
  })
  state.inputMessage = ''
  let buffer = ''
  let displayBuffer = ''
  state.eventSourceChat.onerror = async () => {
    state.eventSourceChat.close()
  }
  state.eventSourceChat.onabort = async () => {
    state.eventSourceChat.close()
  }
  state.eventSourceChat.onmessage = async (event) => {
    // console.log(event)
    if (event.data == '[DONE]') {
      return
    }
    const content = JSON.parse(event.data)
    if (content) {
      let message = content
      buffer += message
      // 思考内容
      // 记录思考时间
      if (message.includes('<think>') || message.includes('</think>')) {
        if (message.includes('<think>')) {
          state.startTime = Math.floor(new Date().getTime() / 1000)
          // buffer = buffer.replaceAll('<think>', `<div class="think-time">思考中......</div><section id="think_content_${index}">`)
        }
        if (message.includes('</think>')) {
          state.endTime = Math.floor(new Date().getTime() / 1000)
          // message = '</section>'
          // buffer = buffer.replaceAll('<div class="think-time">思考中......</div>', ``)
        }
      } else {
        if (state.outputInterval) return
        state.outputInterval = setInterval(() => {
          if (displayBuffer.length < buffer.length) {
            const addChars = buffer.slice(displayBuffer.length, Math.min(displayBuffer.length + 3, buffer.length))
            displayBuffer = displayBuffer + addChars
            state.contentList[state.contentList.length - 1].message = state.marketIt.render(displayBuffer)
          } else {
            clearInterval(state.outputInterval)
            state.outputInterval = null
          }
        }, 20)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use './markdown-body.scss';

.talk-container {
  height: 100%;
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
  .talk-send {
    padding: 5px 10px;
    border-radius: 10px;
    margin: 0px 20%;
    background-color: #f1f2f7;
    textarea {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 0px;
      resize: none;
      overflow: auto;
      background-color: #f1f2f7;
      line-height: 1.5;
      max-height: 200px;
      font-family: inherit;
      &:focus {
        outline: none;
      }
      &:disabled {
        cursor: not-allowed;
      }
    }
    .talk-btn {
      display: flex;
      justify-content: flex-end;
      .send-icon {
        cursor: pointer;
        font-size: 26px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background-color: #d6dee8;
        border-radius: 50%;
        color: #fafafa;
      }
    }
  }
  .talk-box {
    height: calc(100% - 140px);
    .talk-content {
      padding: 0px 20%;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100%;
      .send {
        display: flex;
        justify-content: flex-end;
        height: 30px;
        line-height: 30px;
        animation: fadeIn 0.5s ease forwards;
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
        div {
          width: calc(100% - 30px);
        }
      }
    }
  }
}
</style>
