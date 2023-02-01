import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 本地有令牌信息的话就先用上，不用担心是否有效，后台会有验证
    tokenInfo: JSON.parse(localStorage.getItem('tokenInfo')) || null
  },
  getters: {},
  mutations: {
    /**
     * 接口内部将更新全局状态 tokenInfo 的值为传入的令牌信息
     * @param payload
     */
    saveTokenInfo (state, payload) {
      state.tokenInfo = JSON.parse(payload)
      window.localStorage.setItem('tokenInfo', payload)
      // 当前令牌的过期时间: 当前时间 + expires_in(秒)
      window.localStorage.setItem('expiresTime', dayjs().second(JSON.parse(payload).expires_in).unix())
    },
    /**
     * 该接口将清空用户的令牌信息
     */
    emptyTokenInfo (state) {
      state.tokenInfo = null
      window.localStorage.removeItem('tokenInfo')
      window.localStorage.removeItem('expiresTime')
    }
  },
  actions: {},
  modules: {}
})
