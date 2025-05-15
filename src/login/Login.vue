<script setup lang="ts">
import {ref} from 'vue'
import {useMessage} from 'naive-ui'
import {register,generateRandomAccount,checkAccountExists} from "@/api/login/register";
import {useUserStore} from "@/utils/userStore";
// import {acceptHMRUpdate} from "pinia";
// import background from 'src/login/assets/background.png'
import {login} from "@/api/login/login"
import router from "../router";

const userStore = useUserStore()


const message = useMessage()
const loginForm = ref({
  username: '',
  password: '',
  userType: 'parent',
})

const userTypeOptions = ref([
  {label: '家长',value:'parent'},
  {label: '医生',value:'doctor'},
  {label: '儿童',value:'child'}
])

const registerForm = ref({
  username:'',
  gender: 'female',

  age: 6,

  userType: 'parent',
  workUnit:'',
  phone:'',
  email:'',
  password:'',
  confirmPassword:'',
});

const activeTab = ref<'login'|'register'>('login')

const handleLogin = async()=>{
  const loginData = {
    account: loginForm.value.username,
    userType: loginForm.value.userType,
    password: loginForm.value.password

  }
  console.log(`登录信息：${loginForm.value}`)
  const result = await login(loginData)

  if(result){
    console.log('用户信息：',result)
    // 保存全局用户信息
    userStore.setUser(result)

    if(loginForm.value.userType === 'doctor'){
      message.success('登录成功，跳转到医生客户端');

      await router.push('/psychologist');

    }else if (loginForm.value.userType === 'parents'){
      message.success('登录成功，跳转到家长客户端');
      await router.push('/parents')
    }else{
      message.success('登录成功，跳转到儿童客户端');
      await router.push('/children-routes')
    }
  }else{
    // 登录失败时的处理
    message.warning(`登录失败: ${result}`);
  }
  // 登录成功后进行页面跳转逻辑（可根据实际需求改为路由跳转）
  // if (loginForm.value.userType === 'doctor') {
  //   message.success('登录成功，跳转到医生客户端');
  // } else {
  //   message.success('登录成功，跳转到家长客户端');
  // }
}

const handleRegister = async ()=>{
  if(registerForm.value.password !== registerForm.value.confirmPassword){
    alert('密码和确认密码不一致')
    return;
  }
  let account = generateRandomAccount();
  let accountExists = await checkAccountExists(account);

  while(accountExists){
   account = generateRandomAccount();
   accountExists = await checkAccountExists(account);
  }

  const registerData = {
    name: registerForm.value.username,
    age: registerForm.value.age,
    gender: registerForm.value.gender,
    userType: registerForm.value.userType,
    phone: registerForm.value.phone,
    email: registerForm.value.email,
    account: account,
    password: registerForm.value.password,
    work_unit: registerForm.value.workUnit
  }

  const response = await register(registerData)
  if(response){

    message.success(`注册成功，请返回登录页面`);
    activeTab.value = 'login'
  }else{
    console.log("注册失败")
  }
}

const switchToRegister = ()=>{
  activeTab.value = 'register'
}
</script>

<template>
  <div class="app-background">
    <div class="left">
      <div class="title">
        <h1 class="zi">Hi,欢迎来到星友</h1>
        <h4 class="eng">twinkle twinkle little star </h4>
      </div>
    </div>
    <div class="right">
      <n-card :bordered="false" class="form-card" style="width: 600px">
        <n-tabs
            v-model:value="activeTab"
            type="line"
            class="tabs"
            size="large"
            :theme-overrides="{
              Tabs: {
              tabColorActiveBar: '#666666',
              tabTextColorActive: '#666666',
              tabTextColorHover: '#888888',
              tabTextColor: '#999999',
              tabFontSizeActive: '20px',
              tabFontSize: '18px'
              }
            }"
          >
          <n-tab-pane name="login" tab="登录" />
          <n-tab-pane name="register" tab="注册" />
        </n-tabs>


        <n-form v-if="activeTab === 'login'" :model="loginForm" ref="loginFormRef" label-width="80">
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
          <n-text style="color: #0000EE; cursor: pointer;" @click="switchToRegister">还没有帐号？ 点击“注册”</n-text>
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
  </div>
</template>

<style scoped>
.app-background {
  background: url('src/children-client/assets/bk.jpeg') no-repeat center center fixed;
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


/* 左侧标题区域 */
.left {
  margin-bottom: 150px;
  align-items: flex-start; /* 靠左对齐 */
  padding-left: 50px;
  color: #333;
}

.title {
  /* 可根据需求调整 */
}

.zi{
  /*-webkit-text-stroke: 1px rgba(0, 0, 17, 0.71);*/
  margin: 0;                 /* 去掉 h1 默认上下 margin */
  color: antiquewhite;
  font-size: 90px;
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.eng {
  font-family: "Comic Relief", system-ui;
  font-weight: 400;
  font-style: normal;
  font-size: 35px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  color: #eeeeee;
}


/* 右侧表单区域 */
.right {
  flex: 1;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.form-card {
  width: 400px; /* 固定宽度，适应表单宽度 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.tabs {
  margin-bottom: 20px;
}
::v-deep(.n-tabs-tab.n-tabs-tab--active) {
  color: #ffffff !important;
}
::v-deep(.n-tabs-tab.n-tabs-tab--active .n-tabs-tab__label) {
  color: #ffffff !important;
}
::v-deep(.n-tabs-rail__bar) {
  background-color: #ffffff !important;
}
::v-deep(.n-tabs .n-tabs-tab) {
  font-size: 18px;
  color: #000000;
}

::v-deep(.n-tabs .n-tabs-tab.n-tabs-tab--active) {
  font-size: 20px;
  color: #000000 !important; /* 激活时字体为深灰色 */
  border-color: #000000 !important; /* 激活下划线颜色 */
}

::v-deep(.n-tabs .n-tabs-tab:hover) {
  color: #000000 !important;
}
</style>
