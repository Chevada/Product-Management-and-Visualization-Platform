<template>
  <div class="login_container">
    <el-row>
      <!-- xs表示，当屏幕宽度小于一定值（768）时，左边的布局就不显示 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_button"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Login">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
// 引入用户相关仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

// 定义变量控制按钮加载效果
let loading = ref(false)

// 获取路由器，这是编程式路由导航
let $router = useRouter()

let $route = useRoute()

let userStore = useUserStore()

// 获取组件实例对象
let loginForms = ref()

let loginForm = reactive({
  username: 'admin',
  password: '111111',
})
// 登录按钮的回调函数
async function login() {
  // console.log(loginForms.value);
  // 保证所有的表单校验通过之后再发请求,下面方法返回的是一个成功或者失败的promise对象
  await loginForms.value.validate()
  loading.value = true
  // 点击登录按钮以后干什么？
  // 通知pinia仓库发送登录请求
  // 请求成功：跳转到首页
  // 请求失败：弹出登录失败信息
  try {
    await userStore.userLogin(loginForm)
    // 判断登录时路径当中是否有query参数
    let redirect: any = $route.query.redirect

    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
    loading.value = false
  }
}

// 自定义表单校验规则
const validateUsernanme = (rule: any, value: any, callback: any) => {
  // rule:校验规则对象
  // value：表单元素内容
  // 如果符合条件，callback放行，如果不符合，注入错误提示信息
  if (/^[A-Za-z\d]{5,10}/.test(value)) {
    callback()
  } else {
    callback(new Error('用户名必须为5到10位'))
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  // rule:校验规则对象
  // value：表单元素内容
  // 如果符合条件，callback放行，如果不符合，注入错误提示信息
  if (/^[A-Za-z\d!@#$%^&*]{6,15}$/.test(value)) {
    callback()
  } else {
    callback(new Error('密码长度必须为6到15位'))
  }
}

// 定义表单校验需要的配置规则对象
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' }, //触发规则为blur，即失去焦点
    // { min: 4, max: 10, message: '用户名必须为4到10位', trigger: 'change' },
    { trigger: 'change', validator: validateUsernanme },
  ],
  password: [
    // { min: 6, max: 15, message: '密码长度必须为6到15位', trigger: 'change' },
    { trigger: 'change', validator: validatePassword },
  ],
}
</script>

<style lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 70%;
    top: 30vh; //视口的30%
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
    .login_button {
      width: 100%;
    }
  }
}
</style>
