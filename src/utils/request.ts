// 消息提示组件
import { ElMessage } from 'element-plus'

// 进行axios的二次封装：使用请求与响应拦截器
import axios from 'axios'

// 引入用户相关的仓库，将token封装在请求拦截器中
import useUserStore from '@/store/modules/user'

// 第一步，利用axios的create方法，创建axios实例（这样方便去进行一些配置：基础路径、超时时间）
// 这里的request就是一个axios对象，不过进行了一些配置
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径会带上/api
  timeout: 5000,
})

// 第二步，request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // 可以在这里配置请求头
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  // 返回配置对象
  return config
})

// 第三步：配置响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功的回调
    // 简化数据
    return response.data
  },
  (error) => {
    // 失败的回调，处理http网络错误
    let message = ''
    let status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '无权限访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '你的网络开小差了'
        break
    }
    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    // 返回一个失败的Promise对象去终止Promise链
    return Promise.reject(error)
  },
)

// 将配置好的对象对外暴露
export default request
