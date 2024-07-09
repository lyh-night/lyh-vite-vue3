import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue')
    },
    {
      path: '/drag',
      name: 'drag',
      component: () => import('@/views/drag/index.vue')
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: () => import('@/views/echarts/line.vue')
    },
    {
      path: '/topology',
      name: 'topology',
      component: () => import('@/views/topology/index.vue')
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      redirect: '/404'
    }
  ]
})

export default router
