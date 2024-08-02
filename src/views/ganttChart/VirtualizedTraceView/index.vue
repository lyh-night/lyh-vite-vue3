<template>
  <div>
    <div v-for="(item, index) in data" :key="index">
      <div class="VirtualizedTraceView--row" @click.stop="openDetail(item)">
        <div class="left" :style="`width: ${width}%`">
          <div class="level">
            <span v-for="i in getLevelIndentNum(item, level)" :key="`indent-block-${i}-${level}`" class="level-block" />
          </div>
          <div class="main">
            <div class="title">
              <span v-if="item.children && item.children.length" class="icon-expend" @click.stop="changeExpend(item)">
                >
              </span>
              <p :style="`border-left: 4px solid ${item.fillColor}`">
                <span class="serviceName">{{ item.serviceName }}</span>
                <span class="name">{{ item.name }}</span>
              </p>
            </div>
            <div
              v-if="item.detail"
              class="back-box"
              :style="`border-left: 4px solid ${item.fillColor}; background-color: ${item.fillBackgroundColor};margin-left: ${item.children && item.children.length ? '20px' : '0px'}`"
            />
          </div>
        </div>
        <div class="right" :style="`width: ${100 - width}%`">
          <div class="trend-box">
            <TimelineRowCell :data="item" :viewRange="viewRange" />
          </div>
          <div v-if="item.detail" class="detail-box">
            <SpanDetailRow />
          </div>
        </div>
      </div>
      <template v-if="item.children && item.children.length && item.expend">
        <tree :data="item.children" :level="level + 1" :width="width" :viewRange="viewRange" />
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import colorGenerator from '../js/color.js'
import TimelineRowCell from '../TimelineRowCell/index.vue'
import SpanDetailRow from '../SpanDetailRow/index.vue'
export default defineComponent({
  components: { TimelineRowCell, SpanDetailRow },
  name: 'tree',
  props: {
    width: {
      type: Number,
      default: 30
    },
    data: {
      type: Array,
      defalt: () => []
    },
    level: {
      type: Number,
      default: 1
    },
    viewRange: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    function changeExpend(item) {
      item.expend = !item.expend
    }
    function openDetail(item) {
      item.detail = !item.detail
    }
    function getLevelIndentNum(item, level) {
      return item.children && item.children ? level - 1 : level
    }
    return {
      changeExpend,
      openDetail,
      getLevelIndentNum
    }
  }
})
</script>

<style lang="scss" scoped>
.VirtualizedTraceView--row {
  user-select: none;
  display: flex;
  width: 100%;
  line-height: 28px;
  vertical-align: middle;
  font-size: 12px;
}
.left {
  display: flex;
  background-color: #f8f8f8;
  overflow: hidden;
  .level {
    height: 100%;
    display: flex;
    .level-block {
      width: 20px;
      height: 100%;
      border-right: 1px solid #d3d3d3;
    }
  }
  .main {
    flex: 1 1 auto;
    overflow: hidden;
    .title {
      display: flex;
      background-color: #f8f8f8;
      .icon-expend {
        width: 20px;
        height: 28px;
        text-align: center;
        cursor: pointer;
      }
      p {
        flex: 1 1 auto;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .serviceName {
          color: #000;
          display: inline-block;
          margin: 0px 10px;
        }
        .name {
          color: #8f8fb0;
        }
      }
    }
    .back-box {
      height: calc(100% - 28px);
    }
  }
}
.right {
  border-left: 1px solid #d3d3d3;
  .trend-box {
    cursor: pointer;
    height: 28px;
  }
  .detail-box {
    background-color: #f5f5f5;
    padding: 10px 20px;
    box-sizing: border-box;
  }
}
.title:hover {
  background: linear-gradient(90deg, #fafafa, #f8f8f8 75%, #eee);
  .name {
    color: #000;
  }
}
.trend-box:hover {
  background-color: #eee;
}
</style>
