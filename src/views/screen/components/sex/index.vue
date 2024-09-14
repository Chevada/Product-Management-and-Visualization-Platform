<template>
  <div class="box1">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="woman">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
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
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: '20%',
      top: 0,
      right: '20%',
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box1 {
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

  .sex {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 30px;

    .man {
      width: 111px;
      height: 115px;
      background: url('../../images/man-bg.png') no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .woman {
      width: 111px;
      height: 115px;
      background: url('../../images/woman-bg.png') no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-around;
    color: white;
  }

  .charts {
    width: 100%;
    height: 90px;
  }
}
</style>
