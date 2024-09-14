<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="" />
    <el-button type="primary" @click="goHome">回到首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const $router = useRouter()

const goHome = () => {
  $router.push('/home')
}
</script>

<style lang="scss" scoped>
.box {
  width: 100vw;
  height: 100vh;
  background-color: #b8cce1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  img {
    width: 1014px;
    height: 556px;
  }
}
</style>
