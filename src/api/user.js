import request from '@/utils/request'
import store from '@/store'
import router from '@/router'

/**
 * 携带身份信息到登录接口，以确认是否允许登入
 * @param data 身份信息(手机号、密码)
 */
export function login (data) {
  return request({
    url: '/front/user/login',
    method: 'POST',
    data: `phone=${data.phone}&password=${data.password}` // 表单数据的urlencoded格式
  })
}

/**
 *
 * 携带着象征着身份的令牌(access_token)，去获取对应的用户信息
 * @return {object} 头像、用户名等
 */
export function getUserInfo () {
  return request({
    url: '/front/user/getInfo',
    method: 'GET'
  })
}

/**
 * 清除后台中保存的令牌
 * 令牌在后端也是占用资源的，既然退出了那么也应该将其清除
 */

export function logout () {
  return request({
    url: '/front/user/logout',
    method: 'POST'
  })
}

/**
 * 更新token
 * 携带refresh_token获取到新access_token，之后若成功则将其存储到本地和全局状态中，失败则跳转至/login让用户重新登录
 * 调用该接口会刷新token或跳转至登录页
 */
// 是否在进行刷新Token操作(标识位)
let isRefresh = false
let promiseRt = null

export function refreshToken () {
  if (isRefresh) {
    // 用好兄弟的答案
    return promiseRt
  }
  isRefresh = true
  promiseRt = request({
    url: '/front/user/refresh_token',
    method: 'POST',
    params: {
      // 根据 refresh_token 获取新的 access_token...
      refreshtoken: store.state.tokenInfo.refresh_token
    }
  })
    .then(res => {
      /**
       * 时刻保证Promise状态的"正确表述"
       * 成功那么Promise成功，失败Promise失败(return Promise.reject() || throw new Error())
       * 后续可能根据刷新的成功或失败作进一步处理
       */
      // 成功获取新token
      if (res.data.success) {
        // 保存新的token
        store.commit('saveTokenInfo', res.data.content)
      } else {
        // 跳转至login前，要清空一下token信息
        store.commit('emptyTokenInfo')
        // 失败携带当前路由对象的完整路径，跳转到 /login
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.fullPath }
        })
        throw new Error('刷新token失败！')
      }
    })
    .finally(() => {
      // 刷新Token结束
      isRefresh = false
    })
  return promiseRt
}

// 分页查询所有用户
export function queryUsers (data = {}) {
  return request({
    url: '/boss/user/getUserPages',
    method: 'POST',
    data
  })
}

// 启用用户
export function enableUser (userId) {
  return request({
    url: '/boss/user/enableUser',
    method: 'GET',
    params: {
      userId
    }
  })
}

// 禁用用户
export function forbidUser (userId) {
  return request({
    url: '/boss/user/forbidUser',
    method: 'POST',
    data: { userId }
  })
}

// 获取用户拥有的角色信息(所有角色，用户拥有的标记为true)
export function getUserRoles (userId) {
  return request({
    url: '/boss/role/getRolesWithUserPermission',
    method: 'GET',
    params: { userId }
  })
}

// 给指定用户分配角色信息
export function allocateUserRoles (data) {
  return request({
    url: '/boss/role/allocateUserRoles',
    method: 'POST',
    data
  })
}
