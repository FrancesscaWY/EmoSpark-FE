<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFloatingStore } from '../utils/FloatingStore.ts'

const router = useRouter()
const floatingStore = useFloatingStore()

const isDragging = ref(false)  // 用于标识是否正在拖动
const offset = ref({ x: 0, y: 0 }) // 用于记录鼠标拖动的偏移量
const floatingWindow = ref<HTMLElement | null>(null)  // 用于引用浮窗元素

const onDragStart = (event: MouseEvent) => {
  if (floatingWindow.value) {
    isDragging.value = true
    offset.value = {
      x: event.clientX - floatingWindow.value.offsetLeft,
      y: event.clientY - floatingWindow.value.offsetTop,
    }
    // 禁止跳转
    event.preventDefault()
    // 监听鼠标移动和松开事件
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)
  }
}

const onDragMove = (event: MouseEvent) => {
  if (isDragging.value && floatingWindow.value) {
    floatingWindow.value.style.left = `${event.clientX - offset.value.x}px`
    floatingWindow.value.style.top = `${event.clientY - offset.value.y}px`
  }
}

const onDragEnd = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

const restoreTreatmentPage = () => {
  // 只有当没有拖动时才执行跳转
  if (!isDragging.value) {
    floatingStore.setFloating(false)
    // 路由回到治疗页面
    router.push({
      name: 'face2face-treatment',
      query: {
        name: floatingStore.name,
        age: floatingStore.age,
        gender: floatingStore.gender,
        phone: floatingStore.phone,
        type: floatingStore.type,
      }
    })
  }
}

</script>

<template>
  <n-layout>
  <div
      ref="floatingWindow"
      class="floating-window"
      @mousedown="onDragStart"
      :style="{ position: 'fixed', zIndex: 1000 }"
  >
    <n-row>
<!--      <n-card style="width: auto;height: auto; color: transparent" >-->
        <n-avatar :src="floatingStore.avatar" alt="头像" large  ></n-avatar>
<!--      </n-card>-->
<!--    <n-text style="font-size:10px" >治疗中-{{ floatingStore.name}}</n-text>-->
    <n-button style="font-size: 10px" @click="restoreTreatmentPage">返回治疗页面</n-button>
    </n-row>
  </div>
  </n-layout>
</template>
<style scoped>
.floating-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 9999;
  user-select: none; /* Prevent text selection during drag */
}
.floating-window img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
</style>
