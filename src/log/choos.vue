<template>
  <div class="bg" :style="backgroundStyle">
    <div class="main">
      <div class="left">
        <template v-if="!selectedRole">
          <h2 class="title">Hi~请选择你的登陆身份：</h2>
          <n-button :style="{ width: '250px', height: '80px', padding: '0' }" class="glass-button"
                    strong secondary @click="selectRole('children')">
            <div class="flex flex-col items-center justify-center h-full">
              <BabyIcon class="w-16 h-16 mb-2" />
              <span class="text-base">我是孩子</span>
            </div>
          </n-button>

          <n-button :style="{ width: '250px', height: '80px', padding: '0' }" class="glass-button"
                    strong secondary @click="selectRole('parent')">
            <div class="flex flex-col items-center justify-center h-full">
              <UsersIcon class="w-16 h-16 mb-2" />
              <span class="text-base">我是家长</span>
            </div>
          </n-button>

          <n-button :style="{ width: '250px', height: '80px', padding: '0' }" class="glass-button"
                    strong secondary @click="selectRole('doctor')">
            <div class="flex flex-col items-center justify-center h-full">
              <StethoscopeIcon class="w-16 h-16 mb-2" />
              <span class="text-base">我是医生</span>
            </div>
          </n-button>
        </template>

        <template v-else>
          <h2 class="title">欢迎，{{ roleDisplayName }}，请登录</h2>
          <n-input v-model:value="username" placeholder="请输入账号" />
          <n-input v-model:value="password" placeholder="请输入密码" type="password" />
          <n-button type="primary" @click="login" style="margin-top: 1rem;">登录</n-button>
          <n-button text @click="selectedRole = ''" style="margin-top: 0.5rem;">返回身份选择</n-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { BabyIcon, UsersIcon, StethoscopeIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const selectedRole = ref('')

const roleDisplayName = computed(() => {
  if (selectedRole.value === 'children') return '孩子'
  if (selectedRole.value === 'parent') return '家长'
  if (selectedRole.value === 'doctor') return '医生'
  return ''
})

const username = ref('')
const password = ref('')

function selectRole(role: string) {
  selectedRole.value = role
}

function login() {
  console.log(`Logging in as ${selectedRole.value}:`, username.value, password.value)
  // 登录后跳转
  router.push(`/${selectedRole.value}-home`)
}

const bg='src/children-client/assets/bk.jpeg'
const backgroundStyle = {
  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87, 157, 208, 0.2) 80%), url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}
const router = useRouter()


</script>

<style scoped>
.glass-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.left{
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 20rem;
}
.title{
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
}
.main{
  display: flex;
  justify-content: flex-end;  /* 右对齐 */
  align-items: center;
  height: 100vh;
  padding-right: 5rem;
}
.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.text-base{
  font-size: 20px;
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
}
.square-button {
  width: 10rem; /* 160px */
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg{
  position: absolute;
  width: 100vw;
  height:100vh;
}
</style>