// 路由拦截器

import router from '@/router/index.js'
import { asyncRoutesList, redirectRoute } from '@/router/index.js'
import { usePermissionStore } from '@/stores/permission.js'

let routeFlag = false
// 导航守卫
router.beforeEach(async (to, from, next) => {
  if (to.path == '/login') {
    removeAsyncRoute()
    next()
  }
  if (routeFlag) {
    return next()
  }
  // 权限控制
  routeFlag = true
  await asyncRoutes()
  next({
    ...to, // 重新进入
    replace: true // 不保存本次进入页面的路由历史记录
  })
})

async function asyncRoutes() {
  const permission = usePermissionStore()
  const permissionList = await permission.getPermissionList()
  const asyncRouteList = await permission.setAsyncRoutes(asyncRoutesList, permissionList)
  addAsyncRouter(asyncRouteList)
}

// 将动态路由添加到路由表系统中
function addAsyncRouter(asyncRouteList) {
  asyncRouteList.forEach((item) => {
    router.addRoute(item) // 添加动态路由
  })
  router.addRoute(redirectRoute)
}

// 移除动态路由
function removeAsyncRoute() {
  const permission = usePermissionStore()
  permission.addRoutes.forEach((item) => {
    router.removeRoute(item.name)
  })
  router.removeRoute(redirectRoute.name)
}
export default router
