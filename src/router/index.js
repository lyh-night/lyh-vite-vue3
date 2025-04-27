import { createRouter, createWebHistory } from 'vue-router'

export const asyncRoutesList = [
  {
    path: '/echarts',
    name: 'echarts',
    component: () => import('@/views/echarts/line.vue'),
    meta: {
      allowID: 1
    }
  },
  {
    path: '/drag',
    name: 'drag',
    component: () => import('@/views/drag/index.vue'),
    meta: {
      allowID: 1
    }
  },
  {
    path: '/topology',
    name: 'topology',
    component: () => import('@/views/topology/index.vue'),
    meta: {
      allowID: 1
    }
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: () => import('@/views/qrcode/index.vue'),
    meta: {
      allowID: 1
    }
  }
]

export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/resize',
    name: 'resize',
    component: () => import('@/views/resize/index.vue')
  },
  {
    path: '/ganttChart',
    name: 'ganttChart',
    component: () => import('@/views/ganttChart/index.vue')
  },
  {
    path: '/upload/slice',
    name: 'uploadSlice',
    component: () => import('@/views/upload/slice/index.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/index.vue')
  },
  {
    path: '/codemirror',
    name: 'codemirror',
    component: () => import('@/views/codemirror/index.vue')
  },
  {
    path: '/icon',
    name: 'icon',
    component: () => import('@/views/example/icon.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/other/404.vue'),
    hidden: true
  }
]

export const redirectRoute = { path: '/:pathMatch(.*)', name: 'redirect', redirect: '/404' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
