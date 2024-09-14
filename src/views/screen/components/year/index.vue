<template>
  <div class="box7">
    <div class="top">
      <p class="title">年度游客量对比</p>
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
  mycharts.setOption({
    xAxis: {
      type: 'category',
      show: true,
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: 20,
      top: 20,
      right: 0,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [
        33, 88, 21, 9, 88, 234, 113, 31, 474, 3, 88, 33, 21, 188, 32, 313, 123,
        5, 357, 7,
      ],
      //标记图形设置
      symbol: 'circle',
      symbolSize: 16,
      //图文标签
      label: {
        show: true,
        position: 'top',
        color: '#43d5a2',
      },
      //散点图标记的颜色
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [
            {
              offset: 0,
              color: '#e52f0e', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#f5e136', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  })
})
</script>

<style scoped lang="scss">
.box7 {
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
    width: 100%;
    height: 260px;
  }
}
</style>
