// 动态路由

import { defineStore } from 'pinia'
import { constantRoutes } from '@/router/index.js'

const hasPermission = (route, roles) => {
  if (roles && route.meta && route.meta.allowID) {
    return roles.some((i) => {
      return i.id == route.meta.allowID
    })
  }
}

const filterAsyncRoute = (routes, roles) => {
  const res = []
  routes.forEach((i) => {
    if (hasPermission(i, roles)) {
      const tmp = { ...i }
      if (tmp.children) {
        tmp.children = filterAsyncRoute(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      permissionList: []
    }
  },
  actions: {
    setAsyncRoutes(routes, roles) {
      return new Promise((resolve) => {
        const allowRoutes = filterAsyncRoute(routes, roles)
        this.routes = allowRoutes.concat(constantRoutes)
        this.addRoutes = allowRoutes
        resolve(allowRoutes)
      })
    },
    getPermissionList() {
      return new Promise((resolve) => {
        this.permissionList = [{ id: 1 }]
        resolve([{ id: 1 }])
      })
    }
  }
})
