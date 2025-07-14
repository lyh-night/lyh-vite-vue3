<template>
  <div class="chat-sidebar" :style="{ 'flex-basis': sidebarWidth }">
    <div class="header">
      <div v-if="!state.isCollapsed" class="chat-add">
        <span>新建对话</span>
      </div>
      <i class="fold-btn iconfont icon-menu" @click="changeCollapsed" />
    </div>
    <div v-if="!state.isCollapsed" class="history-list">
      <div v-for="(list, key) in state.historyObj" :key="key">
        <template v-if="list.length > 0">
          <div class="title">{{ state.historyKeyObj[key] }}</div>
          <div>
            <div
              v-for="(item, index) in list"
              :key="`${key}_${index}`"
              :class="['history-item', state.activeId == item.id ? 'active' : '']"
              @click="selectChat(item)"
            >
              <p>{{ item.name }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const state = reactive({
  activeId: '',
  isCollapsed: true,
  historyKeyObj: {
    today: '今天',
    yesterday: '昨天',
    beforeYesterday: '其它时间'
  },
  historyObj: {}
})

const sidebarWidth = computed(() => {
  return state.isCollapsed ? '60px' : '250px'
})

function changeCollapsed() {
  state.isCollapsed = !state.isCollapsed
}

onMounted(() => {
  getHsitoryList()
})

function getHsitoryList() {
  const historyList = [
    { id: 1, name: '111', time: 1744968724000 },
    { id: 2, name: '222', time: 1744968724000 },
    { id: 3, name: '333', time: 1744968724000 },
    { id: 4, name: '444', time: 1744968724000 },
    { id: 5, name: '555', time: 1744968724000 }
  ]
  const cur_time = new Date().getTime()

  const classifyDate = (data, cur_time) => {
    const classifyData = {
      today: [],
      yesterday: [],
      beforeYesterday: []
    }
    data.forEach((item) => {
      const updated_time = new Date(item.time).getTime()
      if (cur_time - updated_time > 2 * 24 * 60 * 60 * 1000) {
        classifyData.beforeYesterday.push(item)
      } else if (cur_time - updated_time > 1 * 24 * 60 * 60 * 1000) {
        classifyData.yesterday.push(item)
      } else {
        classifyData.today.push(item)
      }
    })
    return classifyData
  }
  state.historyObj = classifyDate(historyList, cur_time)
  // console.log(state.historyObj, '数据')
}

function selectChat(row) {
  state.activeId = row.id
}
</script>

<style lang="scss" scoped>
.chat-sidebar {
  padding: 10px;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background-color: #f9fbff;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .chat-add {
      width: 134px;
      height: 46px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #4d6bfe;
      background-color: #dbeafe;
      border-radius: 10px;
      &:hover {
        background-color: #c6dcf8;
      }
    }
    .fold-btn {
      font-size: 30px;
      cursor: pointer;
    }
  }
  .history-list {
    height: calc(100% - 46px);
    overflow-y: auto;
    .title {
      font-weight: 600;
      font-size: 16px;
      color: #000;
      line-height: 20px;
      padding: 10px;
      box-sizing: border-box;
    }
    .history-item {
      padding: 10px 0px 10px 20px;
      box-sizing: border-box;
      cursor: pointer;
      border-radius: 4px;
      &:hover {
        background-color: #eff6ff;
      }
      &.active {
        background-color: #dbeafe;
      }
    }
  }
}
</style>
