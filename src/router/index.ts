// 通过vue-router插件，实现模版路由的配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

let router = createRouter({
  // 路由模式为hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
