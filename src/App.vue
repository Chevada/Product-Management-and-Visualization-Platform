<template>
  <div class="box">
    <h1>hello vue3</h1>
  </div>
</template>

<script setup lang="ts">
const str = '这是一段测试'
for(let i = 1;i<10;i++){
  console.log(i)
}
</script>

<style scoped lang="scss">
.box {
  width: 600px;
  height: 400px;
  background-color: black;
  h1 {
    color: white;
  }
}
</style>
