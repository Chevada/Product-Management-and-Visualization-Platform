<template>
  <div>
    <el-card>
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button
        type="primary"
        icon="Plus"
        @click="addTrademark"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>
      <!-- 表格组件，用于展示已有品牌的数据 -->
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <!-- el-table-column默认使用div展示里面的数据，可以使用插槽进行自定义 -->
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <pre style="color: blue">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌图标">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" alt="还没有图片哦" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定要删除${row.tmName}吗？`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
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
      <!-- 分页器组件 
         v-model:current-page：当前页码
         v-model:page-size：每页展示数据的行数
         :page-sizes：设置下拉菜单的数据
         layout：设置分分页器子组件的布局
      -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 4, 5, 6]"
        :background="true"
        layout="prev, pager, next, jumper,->,total, sizes"
        :total="total"
      />
    </el-card>
    <!-- 对话框组件，在添加品牌与修改已有品牌的业务时候使用的结构 -->
    <!--  -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form
        style="width: 60%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌图标" prop="logoUrl">
          <!--action：图片上传的路径，需要加上api，请求代理服务器  -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark/index.ts'
import type {
  Records,
  TradeMarkResponseDate,
  Trademark,
} from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
// 每页展示数据行数
let limit = ref<number>(5)
// 存储服务器返回的数据
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 控制对话框的显示
let dialogFormVisible = ref<boolean>(false)
// 定义变量收集新增品牌的数据
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})
const formRef = ref()

// 获取已有品牌的方法，封装为函数
const getHasTrademark = async () => {
  let result: TradeMarkResponseDate = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 组件挂载完毕,发一次请求
onMounted(() => {
  getHasTrademark()
})

const sizeChange = () => {
  pageNo.value = 1
  getHasTrademark()
}

const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空目前表单收集的数据
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 清除表单校验结果
  // 为了解决当页面刚呈现，还没有form的示例对象，调用方法会报错，有两种解决方案：
  // 方案一：使用ts的问号语法：
  // formRef.value?.clearValidate();
  // 方案二：使用nextTick钩子：
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

const updateTrademark = (row: Trademark) => {
  dialogFormVisible.value = true
  trademarkParams.id = row.id
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

// 对话框按钮
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 在发请求之前，对整个表单进行校验
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams ? '修改品牌成功' : '添加品牌成功',
    })
    getHasTrademark()
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams ? '修改品牌失败' : '添加品牌失败',
    })
  }
}

// 图片上传之前触发的钩子，可以做一些操作，像约束图片类型，控制图片大小等。
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
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

// 图片上传成功触发的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response为服务器返回的数据
  trademarkParams.logoUrl = response.data
  // 图片上传成功后，清除校验提示信息
  formRef.value.clearValidate()
}

// 品牌名的自定义校验方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数应大于2'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [
    // 这里的图片校验不能自动触发，需要使用表单对象，调用对应的方法手动触发
    { required: true, validator: validatorLogoUrl },
  ],
}

// 删除按钮确定的回调
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    pageNo.value =
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    getHasTrademark()
    return true
  } else {
    ElMessage({
      type: 'error',
      message: '删除成功',
    })
    return false
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
