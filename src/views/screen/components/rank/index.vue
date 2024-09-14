<template>
  <div class="box6">
    <div class="top">
      <p class="title">热门景区排行</p>
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
    //x|y轴组件
    xAxis: {
      type: 'category', //图形图标在x轴均匀分布展示
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      axisLine: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    //布局组件
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
    },
    //系列:决定显示图形图标是哪一种的
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 70, 40, 50, 60],
        //柱状图的:图形上的文本标签，
        label: {
          show: true,
          //文字的位置
          position: 'insideTop',
          //文字颜色
          color: 'white',
        },
        //是否显示背景颜色
        showBackground: true,
        backgroundStyle: {
          //底部背景的颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#808385', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#c0c7cb', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        //柱条的样式
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          //柱条颜色
          color: function (data: any) {
            //给每一个柱条这是背景颜色
            let arr = [
              'red',
              'orange',
              'yellowgreen',
              'green',
              'purple',
              'hotpink',
              'skyblue',
            ]
            return arr[data.dataIndex]
          },
        },
      },
      {
        type: 'line',
        data: [10, 20, 30, 70, 40, 50, 60],
        smooth: true, //平滑曲线
      },
    ],
    tooltip: {
      backgroundColor: 'rgba(50,50,50,0.7)',
    },
  })
})
</script>

<style scoped lang="scss">
.box6 {
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
  }
  .charts {
    width: 100%;
    height: calc(100% - 65px);
  }
}
</style>
