<template>
  <div class="chat-container">
    <ChatHistory />
    <div class="chat-window">
      <Welcome v-if="state.contentList.length === 0" />
      <ChatContent v-else :loading="state.loading" :contentList="state.contentList" />
      <ChatInput @createDialogue="createDialogue" />
    </div>
  </div>
</template>

<script setup>
import ChatHistory from './components/ChatHistory.vue'
import Welcome from './components/Welcome.vue'
import ChatInput from './components/ChatInput.vue'
import ChatContent from './components/ChatContent.vue'

import { fetchEventSource } from '@microsoft/fetch-event-source'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

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
  bindCopyEvent()
})

function bindCopyEvent() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rawCode = decodeURIComponent(btn.getAttribute('data-code'))
      navigator.clipboard.writeText(rawCode).then(() => {
        btn.innerText = '已复制'
        setTimeout(() => (btn.innerText = '复制'), 1500)
      })
    })
  })
}
function createMarkdownInstance() {
  state.marketIt = new MarkdownIt({
    html: false,
    linkify: true,
    highlight: function (str, lang) {
      let codeHtml = ''
      if (lang && hljs.getLanguage(lang)) {
        try {
          codeHtml = hljs.highlight(str, { language: lang }).value
        } catch (__) {}
      } else {
        codeHtml = state.marketIt.utils.escapeHtml(str)
      }
      return `
      <div class="code-block-wrapper" style="position: relative;">
        <button class="copy-btn" data-code="${encodeURIComponent(str)}" style="position: absolute; top: 6px; right: 6px; z-index: 10;">复制</button>
      </div>
       <pre><code class="hljs language-${lang}">${codeHtml}</code></pre>
    `
    }
  })
}

async function createDialogue(message) {
  state.contentList.push({ type: 'send', message: message })
  state.contentList.push({ type: 'answer', message: '<div class="think-time">思考中......</div>' })

  state.inputMessage = ''
  let buffer = ''
  let displayBuffer = ''

  const controller = new AbortController()
  await fetchEventSource('http://localhost:3000/api/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt: message }),
    headers: {
      'Content-Type': 'application/json'
      // Authorization: 'Bearer your-token'
    },
    signal: controller.signal,

    onopen(res) {
      if (res.ok && res.headers.get('content-type') === 'text/event-stream') {
        console.log('✔️ 连接成功')
      } else {
        throw new Error('❌ 连接失败')
      }
    },

    onmessage(event) {
      console.log('📥 收到消息:', event.data)
      if (event.data == '[DONE]') {
        state.loading = false
        return
      }
      const content = JSON.parse(event.data)
      if (content) {
        let message = content
        buffer += message
        // 思考内容 记录思考时间
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
    },

    onclose() {
      console.log('🔌 连接关闭')
    },

    onerror(err) {
      console.error('🔥 连接出错:', err)
      throw err
    }
  })

  // 后续如果需要取消
  // controller.abort()
}
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
