<template>
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
</template>

<script setup>
const emits = defineEmits(['createDialogue'])

const state = reactive({
  inputMessage: ''
})

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
  emits('createDialogue', state.inputMessage)
  state.inputMessage = ''
}
</script>

<style lang="scss" scoped>
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
      text-align: center;
      background-color: #d6dee8;
      border-radius: 50%;
      color: #fafafa;
    }
  }
}
</style>
