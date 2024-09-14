<template>
  <el-form label-width="100px" label-position="left">
    <el-form-item label="SKU名称">
      <el-input
        placeholder="请输入SKU名称"
        v-model="skuParams.skuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="请输入价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="请输入重量(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="请输入SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="60px" label-position="left">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
          style="margin-top: 10px"
        >
          <el-select
            v-model="item.checkedAttrId"
            style="width: 200px"
            placeholder="请选择平台属性值"
          >
            <el-option
              :value="attr.id"
              v-for="attr in item.attrValueList"
              :key="attr.id"
              :label="attr.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="60px">
        <el-form-item
          v-for="item in saleAttr"
          :key="item.id"
          :label="item.saleAttrName"
          style="margin-top: 10px"
        >
          <el-select
            v-model="item.checkedSaleAttrId"
            style="width: 200px"
            placeholder="请选择销售属性值"
          >
            <el-option
              :value="attrValue.id"
              v-for="attrValue in item.spuSaleAttrValueList"
              :key="attrValue.id"
              :label="attrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="warning" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { SpuData, SkuData, Attr, SaleAttr } from '@/api/product/spu/type'
import { reqAttr } from '@/api/product/attr/index.ts'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu/index.ts'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])

let table = ref()

// 定义变量保存服务器返回的数据
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleAttr = ref<any>([])
// 照片墙数据
let imgArr = ref<any>([])

// 收集参数，用于发送添加sku的请求
let skuParams = reactive<SkuData>({
  category3Id: '',
  price: '',
  spuId: '',
  tmId: '',
  weight: '',
  skuDesc: '',
  skuName: '',
  skuAttrValueList: [],
  skuDefaultImg: '',
  skuSaleAttrValueList: [],
})

// 取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

// 添加sku的初始化方法，对外暴露，让父组件可以调用
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  row: SpuData,
) => {
  // 收集数据
  skuParams.category3Id = row.category3Id
  skuParams.spuId = row.id as number
  skuParams.tmId = row.tmId

  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, row.category3Id)
  // console.log(result)
  // 获取对应的销售属性
  let attrResult: any = await reqSpuHasSaleAttr(row.id as number)
  // console.log(attrResult)
  // 获取照片墙数据
  let imgResult: any = await reqSpuImageList(row.id as number)
  attrArr.value = result.data
  saleAttr.value = attrResult.data
  imgArr.value = imgResult.data
}

// 设置默认图片的方法的回调
const handler = (row: any) => {
  skuParams.skuDefaultImg = row.imgUrl
  table.value.clearSelection()
  table.value.toggleRowSelection(row, true)
}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 平台属性，练习使用reduce方法
  let attrArrs = attrArr.value.reduce((prev: any, next: any) => {
    if (next.checkedAttrId) {
      prev.push({
        attrId: next.id,
        valueId: next.checkedAttrId,
      })
    }
    return prev
  }, [])
  skuParams.skuAttrValueList = attrArrs
  // 销售属性，练习使用map方法
  let saleAttrArrs = saleAttr.value.map((item: any) => {
    return {
      saleAttrId: item.id,
      saleAttrValueId: item.checkedSaleAttrId,
    }
  })
  skuParams.skuSaleAttrValueList = saleAttrArrs

  // 发送添加sku的请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    // 添加成功，切换场景
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}

defineExpose({ initSkuData })
</script>
<script lang="ts">
export default {
  name: 'SkuForm',
}
</script>
<style></style>
