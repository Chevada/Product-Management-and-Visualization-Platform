<template>
  <div class="box5">
    <div class="top">
      <p class="title">未来7天游客量趋势图</p>
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
  mycharts.setOption({
    // title:{
    //   text:'游客访问量趋势图'
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
    },
    grid: {
      left: 40,
      right: 20,
      top: 10,
      bottom: 50,
    },
    // 系列
    series: {
      type: 'line',
      data: [120, 880, 99, 1261, 321, 890, 1200],
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#c5dd1b', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#76d8d9', // 100% 处的颜色
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
.box5 {
  width: calc(100% - 40px);
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 20px;
  margin-right: 20px;
  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 5px;
    }
  }
  .charts {
    margin-top: 15px;
    margin-bottom: 10px;
    width: 100%;
    height: calc(100% - 30px);
  }
}
</style>
