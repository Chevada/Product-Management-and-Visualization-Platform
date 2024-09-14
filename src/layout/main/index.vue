<template>
  <!-- <router-view></router-view> -->
  <!-- 下面同样是路由组件的出口，不过可以设置过渡效果 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import userLayoutSettingStore from '@/store/modules/setting'
import { ref, watch, nextTick } from 'vue'
let layoutSettingStore = userLayoutSettingStore()

// 控制当前组件是否重建销毁
let flag = ref(true)

// 监听仓库中refresh数据是否发生变化，如果发生变化，就刷新页面
watch(
  () => layoutSettingStore.refresh,
  () => {
    flag.value = false
    // flag.value = true;
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
  scale: 0;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
  scale: 1;
}
</style>
