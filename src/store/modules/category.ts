import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index.ts'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 存储一级分类的所有数据
      c1Arr: [],
      // 存储所选一级分类的id
      c1Id: '',
      // 存储二级分类的所有数据
      c2Arr: [],
      //  存储所选二级分类的id
      c2Id: '',
      // 存储三级分类的所有数据
      c3Arr: [],
      //  存储所选三级分类的id
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类的方法
    async storeGetC1() {
      let result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
        return 'ok'
      } else {
        return Promise.reject(new Error('获取一级分类失败'))
      }
    },

    // 获取二级分类的方法
    async storeGetC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id as number)
      if (result.code == 200) {
        this.c2Arr = result.data
        return 'ok'
      } else {
        return Promise.reject(new Error('获取二级分类失败'))
      }
    },

    // 获取三级分类的方法
    async storeGetC3() {
      let result: CategoryResponseData = await reqC3(this.c2Id as number)
      if (result.code == 200) {
        this.c3Arr = result.data
        return 'ok'
      } else {
        return Promise.reject(new Error('获取二级分类失败'))
      }
    },
  },
  getters: {},
})

export default useCategoryStore
