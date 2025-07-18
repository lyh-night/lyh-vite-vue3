import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import fs from 'fs'

import { execSync } from 'node:child_process'
import dayjs from 'dayjs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// setup语法糖name增强，使vue3语法糖支持name属性
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// SVG
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const buildTime = dayjs().format('YYYY/MM/DD HH:mm:ss')

console.log(buildTime, '编译时间')

let versionInfo = {}
// 打包时写入 git 信息
if (process.env.NODE_ENV == 'production') {
  try {
    const resolve = (dir) => {
      return path.join(__dirname, dir)
    }
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' })
    const branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' })
    const wirteInfo = `分支：${branch}\ncommit-id：${commit}\n时间：${buildTime}`
    versionInfo = { buildTime, commit, branch }
    fs.writeFile(resolve('public/.versionLog'), wirteInfo, function (error) {
      if (error) {
        throw new Error(`\n commit写入失败：${error}`)
      }
    })
  } catch (error) {
    console.log(error, '写入 git 信息失败')
  }
}
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(versionInfo)
  },
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
    }),
    vueSetupExtend()
  ],
  // 打包相关配置
  build: {
    minify: 'terser',
    // minify: 'esbuild',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'], // 只删除 console.log
        drop_debugger: true // 删除 debugger
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/entry-[hash].js',
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes('vendor')) {
            return 'libs/[name]-[hash].js'
          }
          return 'js/chunk-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || ''
          const ext = name.split('.').pop()?.toLowerCase()
          if (!ext) return 'assets/[name]-[hash][extname]'
          if (['css'].includes(ext)) return 'css/chunk-[hash][extname]'
          if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return 'images/[name]-[hash][extname]'
          if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) return 'fonts/[name]-[hash][extname]'
          if (['mp4', 'webm', 'ogg'].includes(ext)) return 'videos/[name]-[hash][extname]'
          return 'assets/[name]-[hash][extname]'
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue-router')) return 'vendor-vue-router'
            if (id.includes('@antv')) return 'vendor-antv'
            if (id.includes('element-plus')) return 'vendor-element'
            if (id.includes('echarts')) return 'vendor-echarts'
            if (id.includes('codemirror')) return 'vendor-codemirror'
            if (id.includes('axios')) return 'vendor-axios'
            if (id.includes('markdown-it')) return 'vendor-markdown-it'
            if (id.includes('@vue-office')) return 'vendor-office'
            if (id.includes('sortablejs')) return 'vendor-sortablejs'
            if (id.includes('highlight.js')) return 'vendor-highlight'
            return 'vendor-other'
          }
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  // CSS 预处理器
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        javascriptEnabled: true,
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  }
})
