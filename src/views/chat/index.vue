<template>
  <div class="chat-container">
    <ChatHistory />
    <div class="chat-window">
      <Welcome v-if="state.contentList.length === 0" />
      <ChatContent v-else ref="ChatContentRef" :loading="state.loading" :contentList="state.contentList" />
      <ChatInput :loading="state.loading" @createDialogue="createDialogue" @stopChat="stopChat" />
    </div>
  </div>
</template>

<script setup>
import ChatHistory from './components/ChatHistory.vue'
import Welcome from './components/Welcome.vue'
import ChatInput from './components/ChatInput.vue'
import ChatContent from './components/ChatContent/index.vue'

import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getSafeHtml, highmd } from './js/markdownInstance.js'
import 'highlight.js/styles/github.css'
import axios from '@/api/http.js'

const state = reactive({
  loading: false,
  inputMessage: '',
  contentList: [],
  eventSourceChat: null,
  outputInterval: null,
  startTime: null,
  endTime: null,
  chatController: null
})

onMounted(() => {
  getHistoryList()
})

const ChatContentRef = ref(null)

async function createDialogue(message) {
  state.contentList.push({ type: 'send', message: message })
  state.contentList.push({ type: 'receive', status: 'loading', message: '' })

  nextTick(() => {
    ChatContentRef.value.scrollChatStart()
  })

  let buffer = ''
  let displayBuffer = ''

  state.chatController = new AbortController()

  state.loading = true
  await fetchEventSource('http://localhost:3000/api/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt: message }),
    headers: {
      'Content-Type': 'application/json'
      // Authorization: 'Bearer your-token'
    },
    signal: state.chatController.signal,

    onopen(res) {
      if (res.ok && res.headers.get('content-type') === 'text/event-stream') {
        console.log('✔️ 连接成功')
      } else {
        updateChatEndContent({ key: 'status', vlaue: 'error' })
        throw new Error('❌ 连接失败')
      }
    },

    onmessage(event) {
      console.log('📥 收到消息:', event.data)
      if (event.data == '[DONE]') {
        updateChatEndContent({ key: 'status', vlaue: 'finish' })
        state.loading = false
        return
      }
      updateChatEndContent({ key: 'status', vlaue: 'main' })
      const content = JSON.parse(event.data)
      if (content) {
        buffer += content
        // 思考内容 记录思考时间
        if (content.includes('<think>') || content.includes('</think>')) {
          if (content.includes('<think>')) {
            state.startTime = Math.floor(new Date().getTime() / 1000)
            // buffer = buffer.replaceAll('<think>', `<div class="think-time">思考中......</div><section id="think_content_${index}">`)
          }
          if (content.includes('</think>')) {
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
              updateChatEndContent({ key: 'message', value: getSafeHtml(displayBuffer) })
            } else {
              clearInterval(state.outputInterval)
              state.outputInterval = null
            }
          }, 20)
        }
      }
    },

    onclose() {
      console.log('🔌 连接关闭')
      updateChatEndContent({ key: 'status', vlaue: 'close' })
      state.loading = false
    },

    onerror(err) {
      console.error('🔥 连接出错:', err)
      state.loading = false
      updateChatEndContent({ key: 'status', vlaue: 'error' })
      throw err
    }
  })
}

function updateChatEndContent(obj) {
  state.contentList[state.contentList.length - 1][obj.key] = obj.value
}

function stopChat() {
  // 取消对话
  state.chatController && state.chatController.abort()
  state.loading = false
}

function getHistoryList() {
  axios.post('http://localhost:3000/api/history').then((res) => {
    console.log(res, '数据')
    if (res.code == 0) {
      const chat_messages = res.data.biz_data.chat_messages
      state.contentList = chat_messages.map((item) => {
        if (item.role == 'USER') {
          return {
            type: 'send',
            message: item.content
          }
        } else {
          return {
            type: 'receive',
            status: 'finish',
            thinking_elapsed_secs: item.thinking_elapsed_secs,
            thinking_content: highmd(item.thinking_content),
            // thinking_content: item.thinking_content ? getSafeHtml(item.thinking_content) : '',
            message: getSafeHtml(item.content)
          }
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  .chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .chat-content {
      flex: 1;
    }
  }
}
</style>
