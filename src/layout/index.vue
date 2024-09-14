<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: LayoutSettingStore.fold }">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scroll-bar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayoutSettingStore.fold"
          :collapse-transition="false"
          background-color="#001529"
          text-color="white"
          active-text-color="yellowgreen"
          :default-active="$route.path"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{ fold: LayoutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 右侧内容的展示组件
import Main from './main/index.vue'
// 获取路由对象，用于默认激活当前浏览的菜单，因为我们对每个菜单项绑定的index都是其对应的路由地址
// 因此我们获取路由地址之后，就可以找到对应的菜单项并激活
import { useRoute } from 'vue-router'
// 顶部导航区
import Tabbar from './tabbar/index.vue'
import userLayoutSettingStore from '@/store/modules/setting'

let userStore = useUserStore()

let $route = useRoute()

let LayoutSettingStore = userLayoutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  // background-color: gray;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    color: white;
    transition: all 0.3s;
    .scroll-bar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-mnin-width;
    }
  }
  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    // background-color: hotpink;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-mnin-width);
      left: $base-menu-mnin-width;
    }
  }
  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    // background-color: skyblue;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-mnin-width);
      left: $base-menu-mnin-width;
    }
  }
}
</style>
