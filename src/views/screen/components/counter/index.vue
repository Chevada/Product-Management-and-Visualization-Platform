<template>
  <div class="box8">
    <div class="top">
      <p class="title">预约渠道数据统计</p>
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
  //一个容器可以同时展示多种类型的图形图标
  let mychart = echarts.init(charts.value)
  let option = {
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 30,
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '消费', max: 6500 },
        { name: '好感', max: 16000 },
        { name: '出行', max: 30000 },
        { name: '小吃', max: 38000 },
        { name: '爱好', max: 52000 },
        { name: '景点', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        backgroundColor: 'cyan',
        shadowColor: 'cyan',
        label: {
          fontSize: 16,
          color: 'yellowgreen',
          fontWeight: 'bold',
        },
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '购物',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '吃饭',
          },
        ],
      },
    ],
  }
  //设置配置项
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box8 {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 15px;
  .top {
    margin-left: 15px;

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
    height: 200px;
    margin-top: 20px;
  }
}
</style>
