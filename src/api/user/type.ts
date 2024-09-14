// 登录接口需要携带的参数类型
export interface loginForm {
  username: string
  password: string
}

// 使用接口的继承
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

interface dataType {
  token?: string
  message?: string
}

// 登录接口返回的数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

interface userInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

interface user {
  checkUser: userInfo
}

// 定义服务器返回用户信息相关的数据类型
export interface userResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}

// 定义退出登录的数据类型
