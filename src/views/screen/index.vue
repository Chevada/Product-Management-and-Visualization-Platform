<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Top from './components/top/index.vue'
// 引入左侧的三个子组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
// 引入中间的两个组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
// 引入右侧三个子组件
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'

// 使用scale缩放实现数据大屏比例适配的问题：
// 1. 首先，将缩放中心设置为screen的左上角，然后将screen的左上角移动到屏幕中间(因为默认状态下，缩放原点是元素的中心位置，不是我们要的效果。)
// 2. 计算视口相对于screen的缩放比例，然后选择较小的那个，对screen进行缩放
// 3. 将screen重新移动回原来位置

let screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

// 计算缩放比例
function getScale(w = 1920, h = 1080) {
  const ws = window.innerWidth / w
  const hs = window.innerHeight / h
  return ws < hs ? ws : hs
}

// 监听视口发生变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url('./images/bg.png') no-repeat;
  background-size: cover;
  .screen {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .left {
        flex: 1; //相当于：flex:1 1 0 ，则可简写为： flex:1。flex 是复合属性，复合了： flex-grow 、 flex-shrink 、 flex-basis 三个属性
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.25;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        .rank {
          flex: 1.25;
        }
        .year {
          flex: 1;
        }
        .counter {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
