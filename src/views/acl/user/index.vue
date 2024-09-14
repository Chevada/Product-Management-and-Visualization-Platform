<template>
  <div>
    <el-card style="height: 75px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input
            placeholder="请输入要搜索的用户名"
            v-model="keywords"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!keywords.trim()"
            @click="search"
          >
            搜索
          </el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button
        type="danger"
        :disabled="!deleteUserArr.length"
        @click="deleteBatchUser"
      >
        批量删除
      </el-button>
      <!-- 表格展示用户的信息 -->
      <el-table
        border
        style="margin: 10px 0"
        :data="userArr"
        @selection-change="selectionChange"
      >
        <el-table-column
          label=""
          type="selection"
          align="center"
        ></el-table-column>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
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
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除${row.username}吗？`"
              width="260px"
              @confirm="deleteUser(row.id)"
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
        @current-change="getHasUser"
        @size-change="handler"
      />
    </el-card>

    <!-- 抽屉结构，完成添加和更新用户信息操作 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 抽屉结构，用于给已有用户分配角色 -->
    <el-drawer v-model="drawer2" :direction="direction">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input :value="userParams.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group v-model="currentRole">
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :label="role"
                @change="handleCheckedRoleChange"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer2 = false">取消</el-button>
          <el-button type="primary" @click="confirmAssign">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqRemoveBatchUser,
} from '@/api/acl/user/index.ts'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type.ts'
import { ElMessage } from 'element-plus'
import userLayoutSettingStore from '@/store/modules/setting.ts'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
// 存储用户信息
let userArr = ref<Records>([])
let total = ref<number>(0)
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉的显示与隐藏
let drawer2 = ref<boolean>(false)
// 收集用户信息的结构
let userParams = reactive<User>({
  username: '',
  password: '',
  name: '',
})
// 获取表单实例对象
let formRef = ref()
// 收据全部角色(职位)
let allRole = ref<AllRole>([])
// 收集已有用户已有角色
let currentRole = ref<AllRole>([])
// 用于批量删除用户的数组
let deleteUserArr = ref<Records>([])
// 定义变量收集用户输入的搜索关键字
let keywords = ref<string>('')

let layoutSettingStore = userLayoutSettingStore()

// elment 复选框相关.value
const checkAll = ref(false)
const isIndeterminate = ref(true)
const handleCheckAllChange = (val: boolean) => {
  currentRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedRoleChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

// 获取用户信息的方法
const getHasUser = async (page = 1) => {
  pageNo.value = page
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keywords.value,
  )
  if (result.code == 200) {
    userArr.value = result.data.records
    total.value = result.data.total
  }
}

// 页面大小变化的回调
const handler = () => {
  getHasUser()
}

onMounted(() => {
  getHasUser()
})

// 添加用户的回调
const addUser = () => {
  Object.assign(userParams, {
    id: 0,
    username: '',
    password: '',
    name: '',
  })
  // 清除表单验证的结果，不过页面刚加载时，没有表单元素，此处要使用nextTick
  nextTick(() => {
    formRef.value.clearValidate()
  })
  drawer.value = true
}

// 修改用户信息的回调
const updateUser = (user: User) => {
  nextTick(() => {
    formRef.value.clearValidate()
  })
  drawer.value = true
  Object.assign(userParams, user)
}

// 确定按钮的回调
const save = async () => {
  // 对表单进行校验，返回promise对象
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功',
    })
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器刷新页面，因为有可能用户改了自己的用户名
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 取消按钮的回调
const cancel = () => {
  drawer.value = false
}

// username的校验
const validateUsername = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名长度至少为5位'))
  }
}
// name的校验
const validateName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('昵称长度至少为5位'))
  }
}
// password
const validatePassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('密码长度至少为6位'))
  }
}

// 表单校验的规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(row.id as number)
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    currentRole.value = result.data.assignRoles
    drawer2.value = true
  }
}

// 确定分配按钮的回调
const confirmAssign = async () => {
  // 收集数据
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: currentRole.value.map((item) => item.id as number),
  }
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配职位成功',
    })
    drawer2.value = false
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配职位失败',
    })
  }
}

// 根据用户id删除用户信息的回调
const deleteUser = async (id: number) => {
  let result: any = await reqRemoveUser(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 表格选择框发生变化时会触发的事件
const selectionChange = (val: any) => {
  deleteUserArr.value = val
}

// 批量删除按钮的回调
const deleteBatchUser = async () => {
  // 整理数据
  let idList = deleteUserArr.value.map((item) => item.id as number)
  let result: any = await reqRemoveBatchUser(idList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(
      deleteUserArr.value.length < userArr.value.length
        ? pageNo.value
        : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 搜索按钮的回调
const search = () => {
  getHasUser()
  keywords.value = ''
}

// 重置按钮的回调
const reset = () => [(layoutSettingStore.refresh = !layoutSettingStore.refresh)]
</script>
<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
}
</style>
