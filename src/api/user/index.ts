// 统一管理用户相关接口
import request from '@/utils/request.ts'
import type { loginForm, loginResponseData, userResponseData } from './type'

// 统一管理接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 暴露请求函数
// 登录接口方法
export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息接口方法
export const reqUserInfo = () =>
  request.get<any, userResponseData>(API.USERINFO_URL)

// 退出登录的结构
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
