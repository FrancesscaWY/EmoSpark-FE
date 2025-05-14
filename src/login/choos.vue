<template>
  <div class="bg" :style="backgroundStyle" >
    <div class="main">
      <n-button
          class="glass-button square-button"
          strong
          secondary
          @click="selectRole('children')"
      >
        <div class="flex flex-col items-center justify-center h-full">
          <img src="/vite.svg" alt="儿童" class="w-16 h-16 mb-2" />
          <span class="text-base font-semibold">我是儿童</span>
        </div>
      </n-button>

      <n-button
          class="glass-button square-button"
          strong
          secondary
          @click="selectRole('parent')"
      >
        <div class="flex flex-col items-center justify-center h-full">
          <img src="/vite.svg" alt="家长" class="w-16 h-16 mb-2" />
          <span class="text-base font-semibold">我是家长</span>
        </div>
      </n-button>

      <n-button
          class="glass-button square-button"
          strong
          secondary
          @click="selectRole('doctor')"
      >
        <div class="flex flex-col items-center justify-center h-full">
          <img src="/vite.svg" alt="医生" class="w-16 h-16 mb-2" />
          <span class="text-base font-semibold">我是医生</span>
        </div>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'

import { useRouter } from 'vue-router'

const bg='src/parents-client/assets/bk.jpeg'
const backgroundStyle = {
  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87, 157, 208, 0.2) 80%), url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}
const router = useRouter()

function selectRole(role: string) {
  if (role === 'children') router.push('/children-login')
  else if (role === 'parent') router.push('/login')
  else if (role === 'doctor') router.push('/login')
}
</script>

<style scoped>
.glass-button {
  margin: 300px  auto;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}
.main{
  display: flex;
  flex-direction: row;
}
.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.square-button {
  width: 10rem; /* 160px */
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>