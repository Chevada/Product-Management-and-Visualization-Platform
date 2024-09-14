<template>
  <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          @change="handlerC1"
          :disabled="scene == 1"
        >
          <el-option
            v-for="item in categoryStore.c1Arr"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          @change="handlerC2"
          :disabled="scene == 1"
        >
          <el-option
            v-for="item in categoryStore.c2Arr"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene == 1">
          <el-option
            v-for="item in categoryStore.c3Arr"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reqC1 } from '@/api/product/attr/index.ts'
import { onMounted, ref } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()
// 接收父组件传递过来的场景值
defineProps(['scene'])

onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类
const getC1 = async () => {
  categoryStore.storeGetC1()
}

// 一级分类变化时的回调
const handlerC1 = () => {
  // 将二级和三级数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  // 通知仓库去获取二级分类
  categoryStore.storeGetC2()
}

// 二级分类变化时的回调
const handlerC2 = () => {
  // 清除三级分类选择的数据
  categoryStore.c3Id = ''
  // 通知仓库去获取二级分类
  categoryStore.storeGetC3()
}
</script>
<script lang="ts">
export default {
  name: 'Category',
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
