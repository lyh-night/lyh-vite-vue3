import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import fs from 'fs'

import { execSync } from 'node:child_process'
import dayjs from 'dayjs'
// const dayjs = require('dayjs')

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// SVG
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const curTime = dayjs().format('YYYY/MM/DD hh:mm:ss')

console.log(curTime, '编译时间')

// 打包时写入 git 信息
if (process.env.NODE_ENV == 'production') {
  try {
    const resolve = (dir) => {
      return path.join(__dirname, dir)
    }
    const commitId = execSync('git rev-parse HEAD', { encoding: 'utf8' })
    const branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' })
    const wirteInfo = `分支：${branch}\ncommit-id：${commitId}\n时间：${curTime}`
    console.log(wirteInfo, 'git信息')
    fs.writeFile(resolve('public/.versionLog'), wirteInfo, function (error) {
      if (error) {
        throw new Error(`\n commitID写入失败：${error}`)
      }
    })
  } catch (error) {
    console.log(error, '写入 git 信息失败')
  }
}
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    proxy: {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'], // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      resolvers: [ElementPlusResolver()],
      // 解决自动导入后 eslint 报错
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  // 打包相关配置
  build: {
    minify: 'esbuild'
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
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
