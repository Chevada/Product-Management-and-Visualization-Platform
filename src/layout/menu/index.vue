<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <el-menu-item
      v-if="!item.children && !item.meta.hidden"
      :index="item.path"
      @click="goRoute"
    >
      <el-icon>
        <!-- 使用component动态加载不同的标签组件 -->
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有且只有一个子路由 -->
    <el-menu-item
      v-if="
        item.children &&
        item.children.length == 1 &&
        !item.children[0].meta.hidden
      "
      :index="item.children[0].path"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有多个子路由，需要折叠下拉 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 遍历方式可以实现二级的下拉菜单，不过我们在这里可以使用递归组件，无论之后又几级路由，都可以进行展示 -->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 获取路由器对象
let $router = useRouter()

// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])

// 点击菜单的回调
const goRoute = (vc) => {
  console.log(vc.index)
  $router.push(vc.index)
}
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style></style>
