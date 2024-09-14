import SvgIcon from './SvgIcon/index.vue'

// 引入element-plus提供的所有图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 将分类组件注册为全局组件
import Category from './Category/index.vue'

// 将所有的全局组件进行封装
const allGloablComponent: any = { SvgIcon, Category }

// 自定义插件，将需要使用的全局组件进行注册
export default {
  install(app: any) {
    Object.keys(allGloablComponent).forEach((key) => {
      app.component(key, allGloablComponent[key])
    })
    // 将所有的图标组件注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
