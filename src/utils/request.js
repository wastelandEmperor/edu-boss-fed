// 支持项目数据的服务器换了，我们不得挨个改？
import axios from 'axios'
import store from '@/store'
import { refreshToken } from '@/api/user'

const request = axios.create({
  baseURL: 'http://39.97.218.60/'
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // ESlint对于不能确定的调用表达式可能会报错
  // 能确定state存在，但不能确定tokenInfo，因此对他.access_token可能异常
  // login 发起的请求时 tokenInfo是 null -> null.access_token 异常从而 reject 本次axios Promise
  // 因此需要用到条件式属性访问
  config.headers.Authorization = store.state.tokenInfo?.access_token
  return config
})

// 添加响应拦截器
request.interceptors.response.use(
  // 拿到响应结果后再走的拦截器逻辑，也就是响应失败了，还是会报红(401)
  res => {
    // status === 2xx
    // 请求能成功响应
    return res
  },
  error => {
    // status !== 2xx
    // 响应为失败状态
    if (error.response.status === 401) {
      // 若是token导致的请求失败，那么将重新"判定"一遍
      // 发请求 --> 响应结果(401) --> 重新获取token --> 再发起请求
      // 发请求 <--------------------------------- 解决为重发请求
      return refreshToken().then(res => request(error.config))
    } else {
      // 若不是token相关的错误，就不处理了
      return Promise.reject(error)
    }
  }
)
export default request
