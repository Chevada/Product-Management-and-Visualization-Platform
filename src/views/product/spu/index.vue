<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="editSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定要删除${row.spuName}吗？`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 4, 5, 6, 7]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <SpuForm
        v-show="scene == 1"
        ref="spu"
        @changeScene="changeScene"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- 对话框，展示已有的sku数据 -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="sku名字" prop="skuName"></el-table-column>
          <el-table-column label="sku价格" prop="price"></el-table-column>
          <el-table-column label="sku重量" prop="weight"></el-table-column>
          <el-table-column label="sku图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" alt="" style="height: 80px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type.ts'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()

// 用于控制展示页面的变量
let scene = ref<number>(0)
// 分页器默认页码
let pageNo = ref<number>(1)
// 分页器默认页面大小
let pageSize = ref<number>(3)
// 存储获取到的spu数据
let records = ref<Records>([])
// 存储已有spu的总个数
let total = ref<number>(0)
// 获取子组件spuform实例对象
let spu = ref()
// 获取子组件skuform实例对象
let sku = ref()
// 存储全部的sku数据
let skuArr = ref<SkuData[]>([])
// 控制对话框的显示与隐藏
let show = ref<boolean>(false)

// 监听仓库中三级分类的变化
watch(
  () => categoryStore.c3Id,
  () => {
    if (categoryStore.c3Id) {
      getHasSpu()
    }
  },
)

// 发送请求，获取已有spu的数据
const getHasSpu = async (page = 1) => {
  pageNo.value = page
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  records.value = result.data.records
  total.value = result.data.total
}

const changeSize = () => {
  getHasSpu()
}

const addSpu = () => {
  spu.value.initAddSpu(categoryStore.c3Id)
  scene.value = 1
}

const editSpu = (row: SpuData) => {
  scene.value = 1
  // console.log(spu.value)
  // 调用子组件实例方法，去发送请求
  spu.value.initHasSpuData(row)
}

const addSku = (row: SpuData) => {
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
  scene.value = 2
}

// 子组件spuForm绑定的自定义事件changeScene，目前是让子组件通知父组件切换场景值为0
const changeScene = (obj: any) => {
  scene.value = obj.flag
  // 再次获取全部的spu
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else if (obj.params == 'add') {
    getHasSpu()
  }
}

// 查看某spu下所有商品sku的回调
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  console.log(result)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true //展示对话框
  }
}

// 删除spu按钮的回调
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })

    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁前，清空仓库中关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style></style>
