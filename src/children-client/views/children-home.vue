<template>
  <div class="bg" :style="backgroundStyle" >
    <button class="btn" block round @click="onClick">返回</button>
    <div class="top">
      <n-card class="profile-card" title="用户信息" :bordered="false">
        <template #header-extra>
          <n-button size="small" @click="showEdit = true">编辑资料</n-button>
        </template>
        <div class="user-info">
          <n-avatar :size="90" round :src="user.avatar" />
          <div class="info-fields">
            <p>姓名：{{ user.name }}</p>
            <p>性别：{{ user.gender }}</p>
            <p>签名：{{ user.signature }}</p>
          </div>
        </div>
      </n-card>
    </div>
    <div class="content">

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import avatarImg from '../assets/img.png'
import { useRouter } from 'vue-router'
import {
  NCard,
  NButton,
  NDialog,
  NForm,
  NFormItem,
  NInput,
  NRadio,
  NRadioGroup,
  NAvatar,
  NUpload,
  NIcon,
  NSpace
} from 'naive-ui'
import { UploadOutlined } from '@vicons/antd'

// 路由返回
const router = useRouter()
const goBack = () => router.back()

// 用户数据模型
const user = reactive({
  avatar: avatarImg,
  name: '火山灰',
  gender: '女',
  signature: '再吃一颗苹果🍎'
})

// 弹窗与表单控制
const showEdit = ref(false)
const formRef = ref()
const form = reactive({ ...user })
const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  gender: { required: true, message: '请选择性别', trigger: 'change' }
}

// 头像上传相关
let fileList = ref<any[]>([])
const onClick = ()=> {
  router.push('/children-routes')
}
const handleBeforeUpload = (file: File) =>
    new Promise<string>(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    }).then(img => {
      form.avatar = img
      fileList.value = [{ url: img }]
      return false
    })

// 保存表单
const submitEdit = () => {
  formRef.value
      .validate()
      .then(() => {
        Object.assign(user, form)
        showEdit.value = false
      })
}

// 背景样式
const bg='src/parents-client/assets/bk.jpeg'
const backgroundStyle = {
  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87, 157, 208, 0.2) 80%), url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}
</script>
<style scoped>
.bg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}
p{
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-size: 20px;
}
.top {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.profile-card {
  width: 60%;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  border: none;
  border-radius: 20px;
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-fields p {
  margin: 8px 0;
}

.content {
  margin-top: 20px;
  width: 60%;
  margin-left: 20%;
  height: 50%;
  background: rgba(217, 217, 217, 0.14);
  border-radius: 30px;
}
.btn {
  width: 10%;
  height: 6%;
  position: absolute;
  top:4%;
  left:2%;
  font-size: 30px;
  font-weight: 500;
  border-radius: 22px;
  background: linear-gradient(
      0deg,
      rgba(251, 255, 137, 0.09),
      rgba(251, 255, 137, 0.09)
  ),
  #ffcc00;
  transition: background-color 0.2s, transform 0.1s;
  color: navajowhite;
  font-family: "ZCOOL KuaiLe", sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.btn:hover {
  background-color: rgb(255, 191, 127);
}
.btn:active {
  transform: scale(0.97);
}
</style>