<template>
  <svg aria-hidden="true" class="svg-icon" :fill="color" :width="width" :height="height">
    <use :xlink:href="`#${prefix}-${name}`" />
  </svg>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'svg-icon',
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    color: {
      type: String,
      default: '#333'
    }
  }
})
</script>
