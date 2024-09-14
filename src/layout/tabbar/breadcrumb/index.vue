<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <!-- <Fold/> -->
    <component :is="LayoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="margin: 0 4px; vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import userLayoutSettingStore from '@/store/modules/setting'
// 获取路由对象
import { useRoute } from 'vue-router'

// 定义变量控制图标的切换
let LayoutSettingStore = userLayoutSettingStore()

let $route = useRoute()

// console.log($route.matched);

const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style></style>
