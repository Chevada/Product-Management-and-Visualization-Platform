<template>
  <div>
    <el-card style="height: 75px">
      <el-form :inline="true" class="form">
        <el-form-item label="角色名称:">
          <el-input
            placeholder="角色名称或关键字"
            v-model="keywords"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0">
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <!-- 表格展示用户的信息 -->
      <el-table border style="margin: 10px 0" :data="allRole">
        <el-table-column
          label="#"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="id"
          align="center"
          prop="id"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              icon="User"
              size="small"
              @click="assignPermissions(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除${row.roleName}吗？`"
              width="260px"
              @confirm="deleteRole(row.id)"
            >
              <template #reference>
                <el-button type="primary" icon="Delete" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 4, 5, 6, 7]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="hasAllRole"
        @size-change="handler"
      />
    </el-card>

    <!-- 添加与更新已有职位的对话框 -->
    <el-dialog
      v-model="dialogTableVisible"
      :title="roleParams.id ? '更新职位' : '添加职位'"
      width="800"
    >
      <el-form
        style="margin-top: 20px"
        :model="roleParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="职位名称" prop="roleName">
          <el-input
            placeholder="请输入职位名称"
            v-model="roleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 抽屉组件，用于给用户分配各个菜单和按钮的访问权限 -->
    <el-drawer v-model="drawer" :direction="direction">
      <template #header>
        <h4>权限分配</h4>
      </template>
      <template #default>
        <el-tree
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="tree"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRole,
  reqAddOrUpdateRole,
  reqAllPermissionList,
  reqAssignPermission,
  reqRemoveRole,
} from '@/api/acl/role/index.ts'
import type {
  RoleListResponseData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type.ts'
import type { AllRole, RoleData } from '@/api/acl/user/type.ts'
import userLayoutSettingStore from '@/store/modules/setting.ts'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 收集用于搜索的关键字
let keywords = ref<string>('')
// 存储所有角色信息的数据
let allRole = ref<AllRole>([])

let layoutSettingStore = userLayoutSettingStore()

// 控制对话框的显示与隐藏
let dialogTableVisible = ref<boolean>(false)
// 用于收集新增或修改职位的数据
let roleParams = reactive<RoleData>({
  roleName: '',
})

let formRef = ref()
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 收集职位权限的数据
let menuArr = ref<MenuList>([])
// 准备数组，收集所有被勾选的四级id
let selectArr = ref<number[]>([])

let tree = ref<any>()

const hasAllRole = async (page = 1) => {
  pageNo.value = page
  let result: RoleListResponseData = await reqAllRole(
    pageNo.value,
    pageSize.value,
    keywords.value,
  )
  console.log(result)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

onMounted(() => {
  hasAllRole()
})

// 页面大小变化的回调
const handler = () => {
  hasAllRole()
}

// 搜索按钮的回调
const search = () => {
  hasAllRole()
  keywords.value = ''
}

// 重置按钮的回调
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 添加角色按钮的回调
const addRole = () => {
  Object.assign(roleParams, {
    id: 0,
    roleName: '',
  })
  // 清除表单验证的结果，不过页面刚加载时，没有表单元素，此处要使用nextTick
  nextTick(() => {
    formRef.value.clearValidate()
  })
  dialogTableVisible.value = true
}

// 更新角色按钮的回调
const updateRole = (row: RoleData) => {
  Object.assign(roleParams, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
  dialogTableVisible.value = true
}

// roleName校验规则
const validateRolename = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名长度至少为2位'))
  }
}

// 职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRolename }],
}

// 确定按钮的回调
const save = async () => {
  // 对表单进行校验，返回promise对象
  await formRef.value.validate()
  // 添加职位或者更新职位
  let result: any = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    dialogTableVisible.value = false
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功',
    })
    hasAllRole(roleParams.id ? pageNo.value : 1)
  } else {
    dialogTableVisible.value = false
    ElMessage({
      type: 'error',
      message: roleParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 删选权限数组中，所有被选中的四级权限id
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })

  return initArr
}

// 分配权限按钮的回调
const assignPermissions = async (row: RoleData) => {
  drawer.value = true
  Object.assign(roleParams, row)
  // 根据职位获取权限信息
  let result: MenuResponseData = await reqAllPermissionList(row.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const confirm = async () => {
  let roleId = roleParams.id
  let arr1 = tree.value.getCheckedKeys()
  let arr2 = tree.value.getHalfCheckedKeys()
  let permissionId = arr1.concat(arr2)
  let result: any = await reqAssignPermission(roleId as number, permissionId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '权限分配成功',
    })
    drawer.value = false
    // 页面刷新
    window.location.reload()
  } else {
    ElMessage({
      type: 'success',
      message: '权限分配失败',
    })
  }
}

// 删除角色的回调
const deleteRole = async (roleId: number) => {
  let result: any = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除职位成功',
    })
    hasAllRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除职位失败',
    })
  }
}

// 树形控件的配置
const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
}
</style>
