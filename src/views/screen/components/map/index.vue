<template>
  <div ref="charts">我是地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import chinaJson from './china.json'

// 获取节点
let charts = ref()

// 注册中国地图
echarts.registerMap('china', chinaJson as any)
onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    // 地图组件
    geo: {
      map: 'china',
      // zoom:1.1,
      top: 100,
      bottom: 0,
      right: 100,
      left: 100,
      // roam:true,
      label: {
        show: true,
        color: 'white',
        fontSize: 14,
      },
      // 每一个多边形的样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#55e9b5', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#008b5a', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      emphasis: {
        label: {
          fontSize: 20,
        },
      },
    },
    series: {
      type: 'lines',
      data: [
        {
          coords: [
            [116.405285, 39.904989], // 起点,北京
            [121.472644, 31.231706], //终点，上海
          ],
          // 统一的样式设置
          lineStyle: {
            color: '#eef348',
            width: 2,
            curveness: 0.2,
          },
        },
        {
          coords: [
            [116.405285, 39.904989], // 起点,北京
            [91.132212, 29.660361], //终点，西藏
          ],
          // 统一的样式设置
          lineStyle: {
            color: '#eef348',
            width: 2,
            curveness: 0.2,
          },
        },
      ],
      effect: {
        show: true,
        symbol: 'arrow',
        color: 'red',
        symbolSize: 10,
      },
    },
  })
})
</script>

<style scoped lang="scss"></style>
