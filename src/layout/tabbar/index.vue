<template>
  <div class="tabbar">
    <!-- tabbar左侧 -->
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <!-- tabbar右侧 -->
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // background-image: linear-gradient(to right,white,#409eff,white,#409eff);
  animation: tabbarkeyframes 5s infinite linear;
  background-size: 200% 100%;
  @keyframes tabbarkeyframes {
    //通过背景图片位置的变化实现动画效果
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
