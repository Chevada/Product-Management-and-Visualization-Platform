<template>
  <div>
    <el-card>
      <!-- 表格组件 -->
      <el-table border style="margin: 10px 0" :data="skuArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="名称"
          show-overflow-tooltip
          width="180px"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="描述"
          show-overflow-tooltip
          width="180px"
          prop="skuDesc"
        ></el-table-column>
        <el-table-column label="图片" width="180px">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="" style="height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          width="180px"
          prop="weight"
        ></el-table-column>
        <el-table-column
          label="价格"
          width="180px"
          prop="price"
        ></el-table-column>
        <el-table-column label="操作" width="250px" fixed="right">
          <template #="{ row, $index }">
            <el-button
              size="small"
              :type="row.isSale ? 'info' : 'success'"
              :icon="row.isSale ? 'Bottom' : 'Top'"
              @click="updateSale(row)"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="Edit"
              @click="updateSku"
            ></el-button>
            <el-button
              size="small"
              type="info"
              icon="InfoFilled"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              title="确定要删除这一项吗？"
              @confirm="deleteSku(row)"
              width="200px"
            >
              <template #reference>
                <el-button size="small" type="danger" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器组件 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 12, 14, 16]"
        :background="true"
        layout=" prev, pager, next, jumper ,-> ,sizes,total"
        :total="total"
        @current-change="getHasSku"
        @size-change="handleSizeChange"
      />
      <!-- current-change的回调，会自动把当前页码注入给回调函数  -->
      <!-- size-change会将当前的页面大小注入给回调 -->

      <!-- 抽屉组件，用于展示商品的详情 -->
      <el-drawer v-model="drawer" direction="rtl">
        <template #header>
          <h4>商品详情</h4>
        </template>
        <template #default>
          <el-row style="margin: 10px 0">
            <el-col :span="6">名称</el-col>
            <el-col :span="18">{{ skuInfo.skuName }}</el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">描述</el-col>
            <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{ skuInfo.price }}</el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag
                v-for="item in skuInfo.skuAttrValueList"
                :key="item"
                style="margin: 5px 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag
                v-for="item in skuInfo.skuSaleAttrValueList"
                :key="item.id"
                style="margin: 5px 5px"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">商品图片</el-col>
            <el-col :span="18">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item
                  v-for="item in skuInfo.skuImageList"
                  :key="item.id"
                >
                  <!-- <h3 text="2xl" justify="center">{{ item }}</h3> -->
                  <img
                    :src="item.imgUrl"
                    alt=""
                    style="width: 100%; height: 100%"
                  />
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSaleSku,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku'
import type {
  SkuData,
  SkuResponseData,
  SkuInfoData,
} from '@/api/product/sku/type.ts'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 存储sku详情信息
let skuInfo = ref<SkuData>({})

const getHasSku = async (page = 1) => {
  pageNo.value = page
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

onMounted(() => {
  getHasSku()
})

// 切换页面大小的回调
const handleSizeChange = () => {
  // 由于分页器v-mode已经绑定了页面大小，这里我们便不需要接受回调注入的页面大小，pageSize已经发生了改变，直接发请求就可以
  getHasSku()
}

// 商品的上架与下架回调
const updateSale = async (row: SkuData) => {
  if (row.isSale) {
    // 当前商品为上架状态，需要发送下架请求
    let cancelResult: any = await reqCancelSaleSku(row.id as number)
    if (cancelResult.code == 200) {
      ElMessage({
        type: 'success',
        message: '下架成功',
      })
      getHasSku(pageNo.value)
    } else {
      ElMessage({
        type: 'error',
        message: '下架失败',
      })
    }
  } else {
    // 发送上架请求
    let saleResult: any = await reqSaleSku(row.id as number)
    if (saleResult.code == 200) {
      ElMessage({
        type: 'success',
        message: '上架成功',
      })
      getHasSku(pageNo.value)
    } else {
      ElMessage({
        type: 'error',
        message: '上架失败',
      })
    }
  }
}

// 编辑sku的回调
const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '当前模块正在努力研发中...',
  })
}

// 查看商品详情 按钮的回调
const findSku = async (row: SkuData) => {
  drawer.value = true
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    skuInfo.value = result.data
  }
}

// 删除sku的回调
const deleteSku = async (row: SkuData) => {
  let result: any = await reqRemoveSku(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    pageNo.value = skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    getHasSku(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '系统数据不允许删除',
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
