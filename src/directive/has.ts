// 在非组件中使用小仓库需要引入大仓库
import pinia from '@/store'
import useUserStore from '@/store/modules/user'

let userStore = useUserStore(pinia)

// 我们在main文件中导入这个函数，就可以传入app的实例对象了
export const hasButton = (app: any) => {
  // 使用全局自定义指令，来实现对按钮权限的控制
  app.directive('has', {
    // 使用这个全局自定义指令的DOM或者组件在挂载完毕时会执行
    mounted(el: any, option: any) {
      // el：使用这个全局自定义指令的dom元素或者组件
      // option：传入的参数
      if (!userStore.buttons.includes(option.value)) {
        // 如果返回的用户信息（将buttons数组保存在仓库中）不包含某些按钮的权限，
        // 则从DOM树上删除此按钮
        el.parentNode.removeChild(el)
      }
    },
  })
}
