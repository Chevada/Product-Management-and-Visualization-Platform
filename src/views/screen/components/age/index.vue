<template>
  <div class="box2">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 获取节点
let charts = ref()

onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value)
  //设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 60,
      right: 20,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          formatter: '{d}%',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '7~14岁' },
          { value: 735, name: '15~23岁' },
          { value: 580, name: '24~30岁' },
          { value: 484, name: '31~45岁' },
          { value: 300, name: '大于46岁' },
        ],
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 15px;
  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
      margin-top: 5px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }
  .charts {
    height: 260px;
    margin-top: 20px;
  }
}
</style>
