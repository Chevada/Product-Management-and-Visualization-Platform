<template>
  <div>
    <el-table
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :data="menuArr"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            icon="Plus"
            size="small"
            @click="addMenu(row)"
            :disabled="row.level == 4 ? true : false"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="warning"
            icon="Edit"
            size="small"
            @click="updateMenu(row)"
            :disabled="row.level == 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定要删除${row.name}吗？`"
            width="260px"
            @confirm="deleteMenu(row.id)"
          >
            <template #reference>
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件，用于添加或更新已有菜单 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="menuParams.id ? '更新菜单' : '添加菜单'"
      width="500"
    >
      <el-form label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input placeholder="请输入名称" v-model="menuParams.name" />
        </el-form-item>
        <el-form-item label="权限值">
          <el-input
            placeholder="请输入权限值"
            v-model="menuParams.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqDeleteMenu,
} from '@/api/acl/menu/index.ts'
import type {
  MenuResponseData,
  MenuList,
  MenuData,
} from '@/api/acl/role/type.ts'
import { ElMessage } from 'element-plus'

// 存储所有的权限数据
let menuArr = ref<MenuList>([])
// 控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 收集新增或者编辑菜单的数据
let menuParams = reactive<MenuData>({
  name: '',
  code: '',
  level: 0,
  pid: 0,
})

// 获取菜单数据
const getHasPermission = async () => {
  let result: MenuResponseData = await reqAllPermission()
  if (result.code == 200) {
    menuArr.value = result.data
  }
}

onMounted(() => {
  getHasPermission()
})

// 添加菜单的回调
const addMenu = (row: MenuData) => {
  Object.assign(menuParams, {
    id: 0,
    name: '',
    code: '',
    level: 0,
    pid: 0,
  })
  dialogFormVisible.value = true
  menuParams.level = (row.level as number) + 1
  menuParams.pid = row.id
}

// 编辑菜单的回调
const updateMenu = (row: MenuData) => {
  Object.assign(menuParams, row)
  dialogFormVisible.value = true
}

// 确定按钮的回调
const save = async () => {
  let result: any = await reqAddOrUpdateMenu(menuParams)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: menuParams.id ? '更新成功' : '添加成功',
    })
    getHasPermission()
    dialogFormVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: menuParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 删除某个菜单的回调
const deleteMenu = async (id: number) => {
  let result: any = await reqDeleteMenu(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPermission()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style></style>
