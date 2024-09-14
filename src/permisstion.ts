// 路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
import setting from './setting'
// 引入进度条的样式
import 'nprogress/nprogress.css'
// 在非组件中需要先引入大仓库
import pinia from './store'
// 获取用户相关小仓库
import useUserStore from './store/modules/user'
nprogress.configure({ showSpinner: false })
let userStore = useUserStore(pinia)

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title}-${to.meta.title}`
  // console.log(to);
  // console.log(from);
  nprogress.start()
  // 获取token，判断是否登录
  let token = userStore.token
  let username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 有用户信息才能访问其他路由，没有用户信息需要发请求获取
      if (username) {
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.userInfo()
          // 这里是添加异步路由后，刷新页面会出现空白的关键所在，有可能获取到了信息，但是异步路由还没有加载完毕，出现空白的效果。
          next({ ...to })
        } catch (error) {
          // token过期，获取不到用户信息了，需要重新登录
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})

// 用户未登录，可以访问login，其余六个路由不能访问(指向login)
// 用户登录成功，不可以访问login，访问login时，指向首页
