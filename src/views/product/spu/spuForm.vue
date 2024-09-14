<template>
  <div>
    <el-form label-width="100px" label-position="left">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入SPU名称"
          v-model="spuParams.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select style="width: 300px" v-model="spuParams.tmId">
          <el-option
            v-for="item in allTradeMark"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请输入关于SPU的描述信息"
          v-model="spuParams.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="handlerUpload"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
            style="width: 100%; height: 100%"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select
          style="width: 300px"
          v-model="saleAttrIdAndName"
          :placeholder="
            unSelectSaleAttr.length
              ? `还有${unSelectSaleAttr.length}项未选择`
              : '已有全部属性'
          "
        >
          <el-option
            v-for="item in unSelectSaleAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button
          @click="addSaleAttr"
          :disabled="!saleAttrIdAndName"
          type="primary"
          icon="Plus"
          style="margin-left: 10px"
        >
          添加属性
        </el-button>
        <!-- table展示销售属性与属性值 -->
        <el-table style="margin: 10px 0" border :data="saleAttr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="销售属性名"
            width="120px"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <div class="flex gap-2">
                <el-tag
                  v-for="item in row.spuSaleAttrValueList"
                  :key="item.id"
                  closable
                  type="primary"
                  style="margin-right: 10px"
                  @close="row.spuSaleAttrValueList.splice($index, 1)"
                >
                  {{ item.saleAttrValueName }}
                </el-tag>
                <el-input
                  v-model="row.saleAttrValue"
                  v-if="row.flag"
                  @blur="toLook(row)"
                  placeholder="请输入属性值"
                  size="small"
                  style="width: 100px"
                ></el-input>
                <el-button
                  v-else
                  @click="toEdit(row)"
                  size="small"
                  icon="Plus"
                  type="success"
                ></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="saleAttr.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          @click="save"
          :disabled="saleAttr.length == 0"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type {
  SpuData,
  AllTrademark,
  Trademark,
  SpuHasImage,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuImage,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
} from '@/api/product/spu/type.ts'
import { ref, computed } from 'vue'

import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu/index.ts'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
// 取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

// 存储已有的spu数据
let allTradeMark = ref<Trademark[]>([])
let imgList = ref<SpuImage[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有的spu对象
let spuParams = ref<SpuData>({
  category3Id: '',
  description: '',
  spuName: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
// 控制图片预览对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储要预览的图片的地址
let dialogImageUrl = ref<string>('')

// 存储还未选择的销售属性的ID与属性名
let saleAttrIdAndName = ref<string>('')

// 定义一个方法，用来在编辑spu信息时发送请求，获取完整的spu数据，同时对外暴露，让父组件可以调用。
const initHasSpuData = async (spu: SpuData) => {
  spuParams.value = spu
  // spu为父组件传递过来的不完整的spu对象
  // 获取全部品牌的数据
  let allTrademarkResult: AllTrademark = await reqAllTrademark()
  // 获取某个品牌旗下所有商品图片的数据
  let imgResult: SpuHasImage = await reqSpuImageList(spu.id)
  // 获取某个spu的销售属性
  let spuHasSaleAttrResult: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id,
  )
  // 获取已有的全部spu属性
  let allSaleAttrResult: HasSaleAttrResponseData = await reqAllSaleAttr()

  allTradeMark.value = allTrademarkResult.data
  // 将数据映射为element-plus需要的字段类型
  // imgList.value = imgResult.data;
  imgList.value = imgResult.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = spuHasSaleAttrResult.data
  allSaleAttr.value = allSaleAttrResult.data
}

// 照片墙点击预览时触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙删除图片的钩子
const handleRemove = () => {}
// 照片上传成功之前的钩子
const handlerUpload = (rawFile: any) => {
  // 上传文件的格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '图片大小不能超过4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件的格式必须是jpg|png|gif',
    })
    return false
  }
}

// 计算出当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName //此处的逻辑要好好理解，从allSaleAttr中进行筛选：
      // 筛选条件：如果某一项的name属性，与saleAttr中的每一项saleAttrName都不相同
      // 则证明saleAttr中没有这个销售属性
    })
  })

  return unSelectArr
})

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndName.value.split(':')
  // 准备新的销售属性对象
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndName.value = ''
}

// 添加属性值按钮的回调
const toEdit = (row: SaleAttr) => {
  row.flag = true
}

// 文本框失去焦点时触发的回调
const toLook = (row: SaleAttr) => {
  // 收集到的属性id与属性值名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  if (!saleAttrValue) {
    ElMessage({
      type: 'error',
      message: '属性值不能为空!',
    })
    row.flag = false
    return
  }
  // 属性值不能重复
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return saleAttrValue == item.saleAttrValueName
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复!',
    })
    row.flag = false
    return
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 清空添加的属性值
  row.saleAttrValue = ''
  // 切换为添加按钮
  row.flag = false
}

// 保存按钮的回调
const save = async () => {
  // 整理需要发送的参数
  // 1. 照片墙的数据
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url, //针对已有的图片和新增的图片有不同的操作，新增的图片采用服务器返回的网络地址
    }
  })
  // 2. 销售属性的数据
  spuParams.value.spuSaleAttrList = saleAttr.value
  // 发送请求
  let result = await reqAddOrUpdateSpu(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
  }
  $emit('changeScene', {
    flag: 0,
    params: spuParams.value.id ? 'update' : 'add',
  })
}

// 添加新的spu的初始化方法
const initAddSpu = async (id: number) => {
  // 首先清空表单绑定的响应式数据
  Object.assign(spuParams.value, {
    category3Id: id,
    description: '',
    spuName: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  imgList.value = []
  saleAttr.value = []
  spuParams.value.id = ''
  saleAttrIdAndName.value = ''

  let allTrademarkResult: AllTrademark = await reqAllTrademark()
  // 获取已有的全部spu属性
  let allSaleAttrResult: HasSaleAttrResponseData = await reqAllSaleAttr()

  allTradeMark.value = allTrademarkResult.data
  allSaleAttr.value = allSaleAttrResult.data
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>
<script lang="ts">
export default {
  name: 'SpuForm',
}
</script>

<style></style>
