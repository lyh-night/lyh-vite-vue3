// 从git上找了一个项目 在此基础上另外修改封装
/**
 * sse.js - A flexible EventSource polyfill/replacement.
 * https://github.com/mpetazzoni/sse.js
 */

/**
 * @type SSE
 * @param {string} url
 * @param {SSEOptions} options
 * @return {SSE}
 */
var SSE = function (url, options) {
  if (!(this instanceof SSE)) {
    return new SSE(url, options)
  }

  /** @type {string} */
  this.url = url

  options = options || {}
  this.headers = options.headers || {}
  this.payload = options.payload !== undefined ? options.payload : ''
  this.method = options.method || (this.payload && 'POST') || 'GET'
  this.withCredentials = !!options.withCredentials
  this.debug = !!options.debug

  /** @type {string} */
  this.FIELD_SEPARATOR = ':'

  /** @type { {[key: string]: [EventListener]} } */
  this.listeners = {}

  /** @type {XMLHttpRequest} */
  this.xhr = null
  /** @type {number} */
  this.readyState = SSE.INITIALIZING
  /** @type {number} */
  this.progress = 0
  /** @type {string} */
  this.chunk = ''
  /** @type {string} */
  this.lastEventId = ''

  this.addEventListener = function (type, listener) {
    if (this.listeners[type] === undefined) {
      this.listeners[type] = []
    }

    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener)
    }
  }

  this.removeEventListener = function (type, listener) {
    if (this.listeners[type] === undefined) {
      return
    }

    const filtered = []
    this.listeners[type].forEach(function (element) {
      if (element !== listener) {
        filtered.push(element)
      }
    })
    if (filtered.length === 0) {
      delete this.listeners[type]
    } else {
      this.listeners[type] = filtered
    }
  }

  this.dispatchEvent = function (e) {
    if (!e) {
      return true
    }

    if (this.debug) {
      console.debug(e)
    }

    e.source = this

    const onHandler = 'on' + e.type
    if (this.hasOwnProperty(onHandler)) {
      this[onHandler].call(this, e)
      if (e.defaultPrevented) {
        return false
      }
    }

    if (this.listeners[e.type]) {
      return this.listeners[e.type].every(function (callback) {
        callback(e)
        return !e.defaultPrevented
      })
    }

    return true
  }

  this._markClosed = function () {
    this.xhr = null
    this.progress = 0
    this.chunk = ''
    this._setReadyState(SSE.CLOSED)
  }

  this._setReadyState = function (state) {
    const event = new CustomEvent('readystatechange')
    event.readyState = state
    this.readyState = state
    this.dispatchEvent(event)
  }

  this._onStreamFailure = function (e) {
    const event = new CustomEvent('error')
    event.responseCode = e.currentTarget.status
    event.data = e.currentTarget.response
    this.dispatchEvent(event)
    this._markClosed()
  }

  this._onStreamAbort = function () {
    this.dispatchEvent(new CustomEvent('abort'))
    this._markClosed()
  }

  this._onStreamProgress = function (e) {
    if (!this.xhr) {
      return
    }

    if (this.xhr.status < 200 || this.xhr.status >= 300) {
      this._onStreamFailure(e)
      return
    }

    const data = this.xhr.responseText.substring(this.progress)
    this.progress += data.length

    const parts = (this.chunk + data).split(/(\r\n\r\n|\r\r|\n\n)/g)

    /*
     * We assume that the last chunk can be incomplete because of buffering or other network effects,
     * so we always save the last part to merge it with the next incoming packet
     */
    const lastPart = parts.pop()
    parts.forEach(
      function (part) {
        if (part.trim().length > 0) {
          this.dispatchEvent(this._parseEventChunk(part))
        }
      }.bind(this)
    )
    this.chunk = lastPart
  }

  this._onStreamLoaded = function (e) {
    this._onStreamProgress(e)

    // Parse the last chunk.
    this.dispatchEvent(this._parseEventChunk(this.chunk))
    this.chunk = ''

    this._markClosed()

    // 手动触发 close 事件
    if (typeof this.onclose === 'function') {
      this.onclose(e)
    }
  }

  /**
   * Parse a received SSE event chunk into a constructed event object.
   * Reference: https://html.spec.whatwg.org/multipage/server-sent-events.html#dispatchMessage
   */
  this._parseEventChunk = function (chunk) {
    if (!chunk || chunk.length === 0) {
      return null
    }

    if (this.debug) {
      console.debug(chunk)
    }

    const e = { id: null, retry: null, data: null, event: null }
    chunk.split(/\n|\r\n|\r/).forEach(
      function (line) {
        const index = line.indexOf(this.FIELD_SEPARATOR)
        let field, value
        if (index > 0) {
          // only first whitespace should be trimmed
          const skip = line[index + 1] === ' ' ? 2 : 1
          field = line.substring(0, index)
          value = line.substring(index + skip)
        } else if (index < 0) {
          // Interpret the entire line as the field name, and use the empty string as the field value
          field = line
          value = ''
        } else {
          // A colon is the first character. This is a comment; ignore it.
          return
        }

        if (!(field in e)) {
          return
        }

        // consecutive 'data' is concatenated with newlines
        if (field === 'data' && e[field] !== null) {
          e['data'] += '\n' + value
        } else {
          e[field] = value
        }
      }.bind(this)
    )

    if (e.id !== null) {
      this.lastEventId = e.id
    }

    // if (e.event) {
      const event = new CustomEvent(e.event || 'message')
      event.id = e.id
      event.data = e.data || ''
      event.lastEventId = this.lastEventId
      return event
    // } else {
    //   // 考虑一种情况，单纯后端报错；
    //   // 要与正常对话结束返回的JSON区分，且要与alert类型（报错类型）后的返回区分
    //   try {
    //     const { data } = JSON.parse(chunk)
    //     if (data && data.status.code) {
    //       // 后端报错
    //       const errorEvent = new CustomEvent('alert')
    //       errorEvent.id = e.id
    //       errorEvent.data = JSON.stringify(data.status)
    //       errorEvent.lastEventId = this.lastEventId
    //       return errorEvent
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  }

  this._onReadyStateChange = function () {
    if (!this.xhr) {
      return
    }

    if (this.xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      const headers = {}
      const headerPairs = this.xhr.getAllResponseHeaders().trim().split('\r\n')
      for (const headerPair of headerPairs) {
        const [key, ...valueParts] = headerPair.split(':')
        const value = valueParts.join(':').trim()
        // Ensure the header value is always an array
        headers[key.trim().toLowerCase()] = headers[key.trim().toLowerCase()] || []
        headers[key.trim().toLowerCase()].push(value)
      }

      const event = new CustomEvent('open')
      event.responseCode = this.xhr.status
      event.headers = headers
      this.dispatchEvent(event)
      this._setReadyState(SSE.OPEN)
    }
  }

  //这里绑定方法，确保 `removeEventListener` 能正确移除事件
  this._onStreamProgress = this._onStreamProgress.bind(this)
  this._onStreamLoaded = this._onStreamLoaded.bind(this)
  this._onReadyStateChange = this._onReadyStateChange.bind(this)
  this._onStreamFailure = this._onStreamFailure.bind(this)
  this._onStreamAbort = this._onStreamAbort.bind(this)
  /**
   * starts the streaming
   * @type Stream
   * @return {void}
   */
  this.stream = function () {
    if (this.xhr) {
      // Already connected.
      return
    }

    this._setReadyState(SSE.CONNECTING)

    this.xhr = new XMLHttpRequest()
    this.xhr.addEventListener('progress', this._onStreamProgress)
    this.xhr.addEventListener('load', this._onStreamLoaded)
    this.xhr.addEventListener('readystatechange', this._onReadyStateChange)
    this.xhr.addEventListener('error', this._onStreamFailure)
    this.xhr.addEventListener('abort', this._onStreamAbort)
    this.xhr.open(this.method, this.url)
    for (let header in this.headers) {
      this.xhr.setRequestHeader(header, this.headers[header])
    }
    if (this.lastEventId.length > 0) {
      this.xhr.setRequestHeader('Last-Event-ID', this.lastEventId)
    }
    this.xhr.withCredentials = this.withCredentials
    this.xhr.send(this.payload)
  }

  /**
   * closes the stream
   * @type Close
   * @return {void}
   */
  this.close = function () {
    if (this.readyState === SSE.CLOSED) {
      return
    }
    // 移除事件监听器
    this.xhr.removeEventListener('progress', this._onStreamProgress)
    this.xhr.removeEventListener('load', this._onStreamLoaded)
    this.xhr.removeEventListener('readystatechange', this._onReadyStateChange)
    this.xhr.removeEventListener('error', this._onStreamFailure)
    this.xhr.removeEventListener('abort', this._onStreamAbort)

    // 终止请求
    try {
      this.xhr.abort()
    } catch (e) {
      console.warn('XHR abort error:', e)
    }
    this.xhr = null
    // 标记关闭状态
    this._markClosed()
  }
  // 补充
  this.destroy = function () {
    this.close()
    this.listeners = {} // 彻底销毁事件监听器
    this._onStreamProgress = null
    this._onStreamLoaded = null
    this._onReadyStateChange = null
    this._onStreamFailure = null
    this._onStreamAbort = null
  }
  if (options.start === undefined || options.start) {
    this.stream()
  }
}
/** @type {number} */
SSE.INITIALIZING = -1
/** @type {number} */
SSE.CONNECTING = 0
/** @type {number} */
SSE.OPEN = 1
/** @type {number} */
SSE.CLOSED = 2

// Export our SSE module for npm.js
if (typeof exports !== 'undefined') {
  exports.SSE = SSE
}

// Export as an ECMAScript module
export { SSE }
