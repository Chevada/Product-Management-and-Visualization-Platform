<template>
  <!-- 测试SVG图标使用 -->
  <!-- 图标外层容器节点，内部需要与use标签结合使用 -->
  <svg :style="{ width, height }">
    <!-- xlink：href指定用哪个图表，属性值务必#+图标名字 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 此文件为了将svg矢量图的使用封装成为组件，方便使用
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: String,
  color: {
    type: String,
    default: 'black',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style></style>
