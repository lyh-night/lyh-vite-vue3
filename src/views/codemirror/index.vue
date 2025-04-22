<template>
  <div class="editor">
    <Codemirror
      v-model="state.code"
      placeholder=""
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :style="{ width: '100%', height: '100%' }"
      :extensions="[oneDark, javascript()]"
      @change="handleChange"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup>
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'

const state = reactive({
  code: null
})

function handleChange(value) {}
function handleBlur(event) {}
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
