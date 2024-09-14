<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <div>
          <h3 style="font-size: 30px; font-weight: 1000">
            {{ timeMessage }}好,{{ userStore.username }}
          </h3>
          <div style="margin: 10px auto; font-size: 15px; font-style: italic">
            硅谷甄选运营平台
          </div>
        </div>
      </div>
    </el-card>
    <div class="bottom">
      <svg-icon name="welcome" width="600px" height="400px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

let userStore = useUserStore()

let timeMessage = ref<string>('')

// 首页挂载完毕后发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
  timeMessage.value = getTime()
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  .avatar {
    margin-right: 30px;
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
}

.bottom {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>
