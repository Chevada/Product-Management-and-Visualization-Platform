// 小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'

let userLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单应该是折叠或者收起状态
      refresh: false, //用于控制是否刷新
    }
  },
})

export default userLayoutSettingStore
