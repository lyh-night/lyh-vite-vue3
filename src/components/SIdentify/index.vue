<template>
  <div class="s-canvas"><canvas id="s-canvas" :width="contentWidth" :height="contentHeight" /></div>
</template>

<script>
import { defineComponent, onMounted, toRefs } from 'vue'
export default defineComponent({
  name: 'SIdentify',
  props: {
    identifyCode: {
      type: String,
      default: '1234'
    },
    fontSizeMin: {
      type: Number,
      default: 25
    },
    fontSizeMax: {
      type: Number,
      default: 30
    },
    backgroundColorMin: {
      type: Number,
      default: 255
    },
    backgroundColorMax: {
      type: Number,
      default: 255
    },
    colorMin: {
      type: Number,
      default: 0
    },
    colorMax: {
      type: Number,
      default: 160
    },
    lineColorMin: {
      type: Number,
      default: 100
    },
    lineColorMax: {
      type: Number,
      default: 255
    },
    dotColorMin: {
      type: Number,
      default: 0
    },
    dotColorMax: {
      type: Number,
      default: 255
    },
    contentWidth: {
      type: Number,
      default: 112
    },
    contentHeight: {
      type: Number,
      default: 31
    }
  },
  setup(props) {
    const {
      identifyCode,
      fontSizeMin,
      fontSizeMax,
      backgroundColorMin,
      backgroundColorMax,
      colorMin,
      colorMax,
      lineColorMin,
      lineColorMax,
      contentWidth,
      contentHeight
    } = toRefs(props)

    // 生成一个随机数
    function randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }

    // 生成一个随机的颜色
    function randomColor(min, max) {
      let r = randomNum(min, max)
      let g = randomNum(min, max)
      let b = randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    function drawLine(ctx) {
      // 绘制干扰线
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = randomColor(lineColorMin.value, lineColorMax.value)
        ctx.beginPath()
        ctx.moveTo(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value))
        ctx.lineTo(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value))
        ctx.stroke()
      }
    }

    function drawDot(ctx) {
      // 绘制干扰点
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    function drawText(ctx, txt, i) {
      ctx.fillStyle = randomColor(colorMin.value, colorMax.value)
      ctx.font = randomNum(fontSizeMin.value, fontSizeMax.value) + 'px SimHei'
      let x = (i + 1) * (contentWidth.value / (identifyCode.value.length + 1))
      let y = randomNum(fontSizeMax.value, contentHeight.value - 5)
      var deg = randomNum(-45, 45) // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(txt, 0, 0) // 恢复坐标原点和旋转角度
      ctx.rotate((-deg * Math.PI) / 180)
      ctx.translate(-x, -y)
    }

    function drawPic() {
      let canvas = document.getElementById('s-canvas')
      let ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom' // 绘制背景
      ctx.fillStyle = randomColor(backgroundColorMin.value, backgroundColorMax.value)
      ctx.fillRect(0, 0, contentWidth.value, contentHeight.value) // 绘制文字
      for (let i = 0; i < identifyCode.value.length; i++) {
        drawText(ctx, identifyCode.value[i], i)
      }
      drawLine(ctx)
      drawDot(ctx)
    }

    watch(identifyCode, drawPic)

    onMounted(() => {
      drawPic()
    })
    return {
      randomNum,
      randomColor,
      drawPic,
      drawText,
      drawLine,
      drawDot
    }
  }
})
</script>

<style lang="scss" scoped>
.s-canvas {
  height: 38px;
}
.s-canvas canvas {
  margin-top: 1px;
  margin-left: 8px;
}
</style>
