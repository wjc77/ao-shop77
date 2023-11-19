// axios基础的封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
//这里不使用useRouter实现路由跳转 是因为vue3中不能在setup外使用useRouter
import router from '@/router'
const httpInstance = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 5000
})

// 拦截器

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  // 1. 从pinia获取token数据
  const userStore = useUserStore()
  // 2. 按照后端的要求拼接token数据
  const token = userStore.userInfo.token
  if (token) {
    // Authorization 请求标头用于提供服务器验证用户代理身份的凭据，允许访问受保护的资源
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
  const userStore = useUserStore()
  // 统一错误提示
  ElMessage({
    type: 'warning',
    message: e.response.data.message
  })

  // 业务背景
  // Token的有效性可以保持一定时间，如果用户一段时间不做任何操作，Token就会失效，再去请求一些接口就会报401错误
  // 解决方案：在axios响应拦截器做统一处理
  // 在状态码401(表示未授权或身份验证失败)token失效处理
  // 1.清除本地用户数据
  // 2.跳转到登录页
  if(e.response.status === 401){
    userStore.clearUserInfo()
    router.push('/login')
  }
  return Promise.reject(e)
})


export default httpInstance