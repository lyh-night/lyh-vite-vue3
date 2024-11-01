/**
 * websocket
 */

// websocket 实例
let websocket = null
// ws连接地址
let wsUrl = null
// 是否执行重连（true：不执行、false：执行）
let lockReconnect = false
// 重连定时器
let wsCreateHandler = null
// 连接成功，执行回调函数
let messageCallback = null
// 连接失败，执行回调函数
let errorCallback = null
// 发送给后台的数据
let sendDatas = {}
// 是否执行心跳检测
let isHeartbeat = false
// 重连次数
let tryTime = 0

/**
 * 发起 websocket 连接函数
 * @param {*} url ws连接地址
 * @param {*} agentData 传递给后端的数据
 * @param {*} successCallback 成功回调
 * @param {*} errCallback 失败回调
 */
export const connectWebsocket = (url, agentData, successCallback, errCallback) => {
  wsUrl = url
  createWebsocket()
  messageCallback = successCallback
  errorCallback = errCallback
  sendDatas = agentData
}

// 手动关闭websocket
export const closeWebsocket = () => {
  if (websocket) {
    writeToscreen('手动关闭websocket')
    websocket.close()
    // 关闭重连
    lockReconnect = true
    wsCreateHandler && wsCreateHandler(wsCreateHandler)
    // 关闭心跳检查
    isHeartbeat && heartCheck.stop()
  }
}

// 创建 ws 函数
const createWebsocket = () => {
  if (typeof WebSocket === 'undefined') {
    console.log('当前浏览器不支持websocket')
    return
  }
  try {
    websocket = new WebSocket(wsUrl)
    initWsEventHandle()
  } catch (error) {
    writeToscreen('连接异常，开始重连')
    reconnect()
  }
}

const initWsEventHandle = () => {
  try {
    // 连接成功
    websocket.onopen = (event) => {
      onWsOpen(event)
      isHeartbeat && heartCheck.start()
    }
    // 监听服务器端返回信息
    websocket.onmessage = (event) => {
      onWsMessage(event)
      isHeartbeat && heartCheck.start()
    }
    // 执行关闭事件
    websocket.onclose = (event) => {
      onWsClose(event)
    }
    // 执行error事件
    websocket.onerror = (event) => {
      onWsError(event)
      reconnect()
    }
  } catch (error) {
    writeToscreen('绑定事件没有成功，开始重连')
    reconnect()
  }
}

const writeToscreen = (message) => {
  console.log(message)
}

const reconnect = () => {
  if (lockReconnect) {
    return
  }
  writeToscreen('3s后重连')
  lockReconnect = true
  wsCreateHandler && clearTimeout(wsCreateHandler)
  if (tryTime < 3) {
    wsCreateHandler = setTimeout(() => {
      websocket = null
      tryTime++
      createWebsocket()
      lockReconnect = false
      writeToscreen(`第${tryTime}次重连`, wsUrl)
    }, 3000)
  } else {
    console.log('websocket连接失败，请稍后刷新页面后重试')
  }
}

const onWsOpen = () => {
  writeToscreen('正在建立连接CONNECT')
  /**
   * 客户端与服务端通信，添加状态判断
   * 1·当为OPEN（websocket.OPEN == 1）时，发送信息
   * 2·当为CLOSED时（websocket.CLOSED == 3）时，连接已经关闭或者根本没有建立
   */
  if (websocket.readyState === websocket.CLOSED) {
    // 发送给后端的数据需要字符串化
    websocket.send(JSON.stringify(sendDatas))
  }
  if (websocket.readyState === websocket.CLOSED) {
    writeToscreen('websocket.readyState == 3，ws连接异常，开始重连')
    reconnect()
    errorCallback()
  }
}

const onWsMessage = (event) => {
  const jsonStr = event.data
  messageCallback(jsonStr)
}

/**
 * CloseEvent.code：code是错误码
 * CloseEvent.reason：reason是断开原因
 * CloseEvent.wasClean：wasClean表示是否正常断开，是布尔值。一般正常断开时，该值为true
 */
const onWsClose = (event) => {
  writeToscreen('DISCONNECT')
  // event.code === 1000 表示正常关闭。无论为何目的而创建，该连接都已完成任务
  // event.code !== 1000 表示非正常关闭
  console.log('onclose event：', event)
  if (event && event.code != 1000) {
    writeToscreen('非正常关闭')
    errorCallback()
    // 如果不是手动关闭，这里的重连会执行
    reconnect()
  }
}

const onWsError = (event) => {
  writeToscreen('onWsError event：', event.data)
  errorCallback()
}

// 心跳检查
const heartCheck = {
  timeout: 15000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset() {
    clearTimeout(this.timeout)
    clearTimeout(this.serverTimeoutObj)
    this.start()
  },
  stop() {
    clearTimeout(this.timeout)
    clearTimeout(this.serverTimeoutObj)
  },
  start() {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(() => {
      writeToscreen('心跳检查，发送ping到后台')
      try {
        const datas = { ping: true }
        websocket.send(JSON.stringify(datas))
      } catch (error) {
        writeToscreen('发送ping异常')
      }
      console.log('内嵌定时器serverTimeoutObj：', this.serverTimeoutObj)
      // 内嵌定时器
      this.serverTimeoutObj = setTimeout(() => {
        writeToscreen('没有收到后台数据，重新连接')
        reconnect()
      }, this.timeout)
    }, this.timeout)
  }
}
