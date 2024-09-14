<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 盒子将来展示echarts图形图表 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

let people = ref('206908人')
// 获取节点
let charts = ref()
onMounted(() => {
  // 获取echarts的实例
  let mycharts = echarts.init(charts.value)
  // 设置实例的配置项
  mycharts.setOption({
    // 坐标轴组件
    // xAxis:{},
    // yAxis:{},
    // 系列，决定你展示什么样的图表
    series: {
      type: 'liquidFill',
      name: '游客数量',
      data: [0.4, 0.4, 0.4],
      radius: '90%',
      color: ['#26e386', '#05e979', '#5c997b', '#43c1b7'],
      backgroundStyle: {
        borderColor: '#557855',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 20,
      },
      label: {
        formatter: '{a}',
        fontSize: 20,
      },
    },
    // 布局组件
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 15px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
      margin-top: 15px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 15px;
      font-style: italic;
      margin-right: 10px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin-top: 30px;
    display: flex;
    padding: 15px;
    span {
      margin: 0 5px;
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url('../../images/total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 20px;
    }
  }
  .charts {
    width: 100%;
    height: 230px;
  }
}
</style>
