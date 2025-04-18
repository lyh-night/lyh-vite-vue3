<template>
  <div class="talk-container">
    <div v-if="state.contentList == 0" class="talk-welcome">
      <h1>你好我是xxxx</h1>
      <p>我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>
    </div>
    <div v-else>交流内容</div>
    <div class="talk-send">
      <textarea
        v-model="state.inputMessage"
        :rows="2"
        placeholder="请输入内容开始对话（shift+Enter换行）"
        @keyup.enter="sendMessage"
      />
      <div class="talk-btn">
        <el-icon class="send-icon"><icon-ep-Top /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
const state = reactive({
  inputMessage: '',
  contentList: []
})

function sendMessage() {}
</script>

<style lang="scss" scoped>
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
      font-size: 30px;
      .send-icon {
        cursor: pointer;
      }
    }
  }
}
</style>
