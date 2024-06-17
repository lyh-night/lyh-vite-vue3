// 项目工具类函数

// 深拷贝  lodash 组件  深拷贝  _.cloneDeep
export function deepClone(target, hash = new WeakMap()) {
  // 额外开辟一个存储空间WeakMap来存储当前对象
  if (target === null) return target // 如果是 null 就不进行拷贝操作
  if (target instanceof Date) return new Date(target) // 处理日期
  if (target instanceof RegExp) return new RegExp(target) // 处理正则
  if (target instanceof HTMLElement) return target // 处理 DOM元素

  if (typeof target !== 'object') return target // 处理原始类型和函数 不需要深拷贝，直接返回

  // 是引用类型的话就要进行深拷贝
  if (hash.get(target)) return hash.get(target) // 当需要拷贝当前对象时，先去存储空间中找，如果有的话直接返回
  const cloneTarget = new target.constructor() // 创建一个新的克隆对象或克隆数组
  hash.set(target, cloneTarget) // 如果存储空间中没有就存进 hash 里

  Reflect.ownKeys(target).forEach((key) => {
    // 引入 Reflect.ownKeys，处理 Symbol 作为键名的情况
    cloneTarget[key] = deepClone(target[key], hash) // 递归拷贝每一层
  })
  return cloneTarget // 返回克隆的对象
}

// 网址查询获取查询字符串对象
// getParameters("https://www.google.com.hk/search?q=js+md&newwindow=1")
export const getParameters = (URL) =>
  JSON.parse(`{"${decodeURI(URL.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)

// 两日期相差天数
export const dayDiff = (date1, date2) => Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000)
