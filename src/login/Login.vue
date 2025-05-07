<script setup lang="ts">
import {ref} from 'vue'
import {useMessage} from 'naive-ui'
// import background from 'src/login/assets/background.png'
const message = useMessage()
const loginForm = ref({
  username: '',
  password: '',
  userType: 'parent',
})

const userTypeOptions = ref([
  {label: '家长',value:'parent'},
  {label: '医生',value:'doctor'}
])

const registerForm = ref({
  username:'',
  gender: 'female',
  age: '',
  userType: 'parent',
  workUnit:'',
  phone:'',
  email:'',
  password:'',
  confirmPassword:'',
});

const activeTab = ref<'login'|'register'>('login')

const handleLogin = ()=>{
  message.success(`登录信息：${loginForm.value}`)
  // 登录成功后进行页面跳转逻辑（可根据实际需求改为路由跳转）
  if (loginForm.value.userType === 'doctor') {
    message.success('登录成功，跳转到医生客户端');
  } else {
    message.success('登录成功，跳转到家长客户端');
  }
}

const handleRegister = ()=>{
  if(registerForm.value.password !== registerForm.value.confirmPassword){
    alert('密码和确认密码不一致')
    return;
  }
  message.success(`注册信息: ${ registerForm.value}`);
  // 注册成功后提示并切换到登录界面
  alert('注册成功，请返回登录页面');
  activeTab.value = 'login';
}

const switchToRegister = ()=>{
  activeTab.value = 'register'
}
</script>

<template>
  <div class="app-background">
    <n-card :bordered="false" class="form-card">
      <n-tabs v-model:value="activeTab" type="line" class="tabs" size="large" >
        <n-tab-pane name="login" tab="登录" ></n-tab-pane>
        <n-tab-pane name="register" tab="注册" ></n-tab-pane>
      </n-tabs>

      <n-form v-if="activeTab === 'login'" :model="loginForm" ref="loginFormRef" labe-width="80">
        <n-form-item label="帐号">
          <n-input v-model:value="loginForm.username" placeholder="手机号/邮箱号/帐号" />
        </n-form-item>
        <n-form-item label="用户类型">
          <n-select v-model:value="loginForm.userType" :options="userTypeOptions" placeholder="选择用户类型" />
        </n-form-item>
        <n-form-item label="密码">
          <n-input type="password" v-model:value="loginForm.password" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item>
          <n-button @click="handleLogin" type="primary" block>登录</n-button>
        </n-form-item>
        <n-text style="color: #ffffff" @click="switchToRegister">还没有帐号？ 点击“注册”</n-text>
      </n-form>

      <n-form v-if="activeTab === 'register'" :model="registerForm" ref="registerFormRef" label-width="80">
        <n-form-item label="用户名">
          <n-input v-model:value="registerForm.username" placeholder="请输入用户名" />
        </n-form-item>
          <n-row gutter="20">
            <n-col :span="8">
              <n-form-item label="性别">
                <n-radio-group v-model:value="registerForm.gender">
                  <n-radio value="male">男</n-radio>
                  <n-radio value="female">女</n-radio>
                </n-radio-group>
              </n-form-item>
            </n-col>

            <n-col :span="8">
              <n-form-item label="年龄">
                <n-input-number v-model:value="registerForm.age" :min="0" placeholder="请输入年龄" />
              </n-form-item>
            </n-col>

            <n-col :span="8">
              <n-form-item label="用户类型">
                <n-select v-model:value="registerForm.userType" :options="userTypeOptions" placeholder="请选择用户类型" />
              </n-form-item>
            </n-col>
          </n-row>
        <n-form-item label="电话">
          <n-input v-model:value="registerForm.phone" placeholder="请输入电话号码" />
        </n-form-item>
        <n-form-item label="邮箱">
          <n-input v-model:value="registerForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item v-if="registerForm.userType === 'doctor'" label="工作机构">
          <n-input v-model:value="registerForm.workUnit" placeholder="请输入工作机构" />
        </n-form-item>
        <n-form-item label="设置密码">
          <n-input type="password" v-model:value="registerForm.password" placeholder="设置密码" />
        </n-form-item>
        <n-form-item label="确认密码">
          <n-input type="password" v-model:value="registerForm.confirmPassword" placeholder="确认密码" />
        </n-form-item>
        <n-form-item>
          <n-button @click="handleRegister" type="primary" block>注册</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>
.app-background {
  background: url('src/login/assets/pdx.png') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: right;
  align-items: center;
}

.form-card {
  background: rgba(255, 255, 255, 0.1); /* 玻璃质感 */
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 12px;
  width: 600px;

}

.tabs {
  margin-bottom: 20px;
}

.register-link {
  color: #1890ff;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
}
</style>