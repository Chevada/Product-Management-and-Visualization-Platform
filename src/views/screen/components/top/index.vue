<template>
  <div class="top">
    <div class="left">
      <span class="leftbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rightbtn">统计报告</span>
      <span class="time">当前时间: {{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

let $router = useRouter()
let time = ref(moment().format('YYYY年MM月DD日:hh:mm:ss'))
let timer = ref(0)

// 首页按钮的回调
const goHome = () => {
  $router.push('/home')
}

onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日:hh:mm:ss')
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<script lang="ts">
export default {
  name: 'Top',
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1.5;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;

    .leftbtn {
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      float: right;
      line-height: 40px;
      text-align: center;
      color: #29fcff;
      font-size: 20px;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      line-height: 74px;
      text-align: center;
      color: #29fcff;
      font-size: 30px;
    }
  }
  .right {
    flex: 1.5;
    background: url('../../images/dataScreen-header-right-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rightbtn {
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-r.png') no-repeat;
      background-size: 100% 100%;
      float: left;
      line-height: 40px;
      text-align: center;
      color: #29fcff;
      font-size: 20px;
    }
    .time {
      color: #29fcff;
      margin-right: 30px;
      font-size: 20px;
    }
  }
}
</style>
