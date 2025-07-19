import instance from '../http.js'

export default {
  getChatDetail(params) {
    return instance.post('/api/history', params)
  }
}
