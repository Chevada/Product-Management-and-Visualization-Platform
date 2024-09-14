<template>
  <div>
    <el-button
      size="small"
      icon="Refresh"
      circle
      @click="updataRefresh"
    ></el-button>
    <el-button
      size="small"
      icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>

    <el-popover
      placement="bottom"
      title="主题设置"
      :width="200"
      trigger="click"
      hide-after="2000"
    >
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker
            @change="setColor"
            v-model="color"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            @change="setDark"
            v-model="dark"
            active-icon="Moon"
            inactive-icon="Sunny"
            inline-prompt
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button size="small" icon="Setting" circle></el-button>
      </template>
    </el-popover>
    <img
      :src="userStore.avatar"
      style="width: 24px; height: 24px; margin: 0 12px; border-radius: 50%"
    />
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import userLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
// 引入路由器
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

let $router = useRouter()
let $route = useRoute()

let userStore = useUserStore()

let layoutSettingStore = userLayoutSettingStore()
// 收集开关暗黑模式的数据
let dark = ref<boolean>(false)

const updataRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

const fullScreen = () => {
  console.log(document.fullscreenElement) //用于指示当前是否为全屏状态
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen() //利用此dom操作实现全屏
  } else {
    document.exitFullscreen()
  }
}

const logout = async () => {
  // 1. 需要向服务器发请求，调用退出登录的接口，告诉服务器，本次登录用到的身份信息就无效了，下次重新返回新的
  // 2. 清空仓库中用户相关的数据：token、名字、头像等
  // 3. 跳转到登录页面
  // confirm('确定要退出吗？')
  await userStore.userLogout()
  $router.replace({ path: '/login', query: { redirect: $route.path } })
}

// 切换暗黑模式的回调
const setDark = () => {
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}

// 切换主题颜色的回调
const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}

// 取色器组件相关配置
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style></style>
