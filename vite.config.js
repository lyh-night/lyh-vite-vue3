import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"], // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // CSS 预处理器
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  }
})
