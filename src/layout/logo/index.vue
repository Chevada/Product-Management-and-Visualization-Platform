<template>
  <div class="logo">
    <img :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting.ts'
</script>

<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  padding-left: 10px;
  color: white;
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    margin-left: 10px;
    font-size: $base-menu-logo-font-size;
    white-space: nowrap;
  }
}
</style>
