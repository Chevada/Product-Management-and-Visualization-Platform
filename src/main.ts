// import './assets/main.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置elementplus的国际化，引入中文
// 有个坑，ts不知道引入的语言包的类型，打包会报错，在这里直接忽略
//@ts-ignore
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from '@/App.vue'
// 引入模版的全局样式
import '@/styles/index.scss'
// svg插件需要的配置代码
import 'virtual:svg-icons-register'

// 使用自定义插件，其中包含全局对象的引入
import globalComponents from '@/components/index.ts'

// 引入路由
import router from './router'

// 引入pinia仓库
import pinia from '@/store'
// 引入路由鉴权文件
import './permisstion'
// 使用element-plus的暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

// 引入自定义指令
import { hasButton } from '@/directive/has'

const app = createApp(App)
// 完整引入，安装插件
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(globalComponents)

// 注册模版路由
app.use(router)

// 安装仓库
app.use(pinia)

// 引入自定义指令
hasButton(app)

app.mount('#app')
