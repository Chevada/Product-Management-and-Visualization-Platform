<template>
  <div>
    <!-- 三级分类，这是一个全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <!-- 展示查询属性的界面 -->
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="editAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定要删除${row.attrName}吗？`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 添加属性的界面 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          icon="Plus"
          type="primary"
          :disabled="!attrParams.attrName.trim()"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="80px"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-input
                v-if="row.flag"
                :ref="(vc: any) => (inputArr[$index] = vc)"
                @blur="toLook(row, $index)"
                v-model="row.valueName"
                placeholder="请输入属性值"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="attrParams.attrValueList.length == 0"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, requAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type {
  AttrResponseData,
  AttrList,
  Attr,
  AttrValue,
} from '@/api/product/attr/type.ts'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
// 存储已有的属性与属性值
let attrArr = ref<AttrList>([])
// 定义变量，控制card组件中展示内容的变化
let scene = ref<number>(0)
// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  categoryId: '',
  categoryLevel: 3, //代表的是三级分类
  attrValueList: [], //新增的属性值数组
})
// 准备一个数组，用来存储将来的组件实例el-input
let inputArr = ref<any>([])

// 监听仓库中三级分类的变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上次查询的结果
    attrArr.value = []
    getAttr()
  },
)

// 获取已有的属性和属性值
const getAttr = async () => {
  // 获取分类的id
  const { c1Id, c2Id, c3Id } = categoryStore
  if (categoryStore.c3Id) {
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code == 200) {
      attrArr.value = result.data
    }
  }
}
// 添加属性按钮的回调
const addAttr = () => {
  // 首先清空上次残留的数据
  Object.assign(attrParams, {
    attrName: '',
    categoryId: categoryStore.c3Id,
    categoryLevel: 3, //代表的是三级分类
    attrValueList: [], //新增的属性值数组
  })
  scene.value = 1
}
// 编辑属性按钮的回调
const editAttr = (row: Attr) => {
  scene.value = 1
  console.log(row)
  // 将获取到的对象赋值给attrparams对象,但是使用下面的代码，实现的是浅拷贝，在进行编辑操作的时候，同时操作的也是attrParams.attrValueList中的数据，
  // 这样会造成，即使没有通过保存按钮向服务器发送保存的请求，也会因为attrParams.attrValueList数据的改变而影响页面的结果展示
  Object.assign(attrParams, row)
  // 因此我们可以使用深拷贝，最简单的方式是使用json
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 点击取消按钮的回调
const cancel = () => {
  scene.value = 0
}
// 点击添加属性值的回调
const addAttrValue = () => {
  // 向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每个属性值编辑模式与展示模式的切换，这个字段后端是不用接受的
  })
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}
// 保存按钮的回调
const save = async () => {
  // 发送请求
  let result: any = await requAddOrUpdateAttr(attrParams)
  console.log(result)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改属性成功' : '添加属性成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改属性失败' : '添加属性失败',
    })
  }
}
// 切换为查看模式的回调：
const toLook = (row: AttrValue, $index: number) => {
  if (!row.valueName.trim()) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空!',
    })
    return
  }
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName //自定义查找规则，当有与当前输入的属性值相同的对象时，返回这个找到的对象
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复!',
    })
    return
  }
  row.flag = false
}

// 切换为编辑模式的回调：
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除属性按钮的回调
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
onBeforeUnmount(() => {
  // 路由组件销毁的时候，要把仓库当中分类相关的数据清空
  categoryStore.$reset()
})
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
