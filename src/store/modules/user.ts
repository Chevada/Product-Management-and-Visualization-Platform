// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入登录接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type {
  loginForm,
  loginResponseData,
  userResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type.ts'
// 引入路由，方便所有组件使用，我们最开始的意图是让菜单组件能够拿到路由数据，根据路由动态地生成菜单
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes.ts'
import router from '@/router/index.js'
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户展示的异步路由
// 注意，此处要使用asyncRoute的深拷贝，避免影响原始的asyncRoute数组
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

let useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: localStorage.getItem('TOKEN'), //用户的唯一标识，通过本地存储同时能够持久化pinia中的数据
      menuRoutes: constantRoute, //这里的数据是生成菜单需要的路由数组
      username: '',
      avatar: '',
      // 用于保存当前用户所能访问到的按钮
      buttons: [],
    }
  },
  actions: {
    // 用户登录的方法，async返回的是一个promise对象，其结果由这个函数的返回值决定
    async userLogin(data: loginForm) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        this.token = result.data as string
        localStorage.setItem('TOKEN', result.data as string)
        // 能保证返回一个成功的promise对象
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
      // 登录成功：200 -> token
      // 登录失败: 201 -> 错误信息
    },

    // 获取用户信息的方法
    async userInfo() {
      // console.log(123);
      // 获取用户信息存储到仓库中
      let result: userResponseData = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        // 计算当前用户需要展示的菜单数据
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        // 展示菜单需要的路由数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 由于在路由器中只注册了常量路由，在这里还需要动态注册异步路由和任意路由信息
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 用户退出登录的方法
    async userLogout() {
      let result: any = await reqLogout()
      console.log(result)
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        localStorage.removeItem('TOKEN')
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
