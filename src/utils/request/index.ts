import axios from 'axios'
import { getToken, clearToken } from '@/utils/token'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 使用 Vite 的环境变量
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, status } = response
    // 根据后端返回结构调整，比如有些项目是 { code, data, message }
    if (status === 200) {
      return data
    } else {
      return Promise.reject(new Error('请求失败'))
    }
  },
  (error) => {
    // 统一处理错误（如 401 未授权、500 服务器错误等）
    if (error.response?.status === 401) {
      // 清除 token 并跳转登录页
      clearToken()
      window.location.href = '/login'
    }
    console.error('响应拦截器错误:', error)
    return Promise.reject(error)
  }
)

export default service
