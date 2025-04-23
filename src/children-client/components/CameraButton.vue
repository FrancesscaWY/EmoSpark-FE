<template>
  <n-card title="摄像头控制" class="w-full max-w-xl mx-auto mt-8">
    <n-space vertical size="large">
      <n-button type="primary" @click="toggleCamera" secondary>
        {{ isCameraOn ? '关闭摄像头' : '打开摄像头' }}
      </n-button>

      <div v-show="isCameraOn" class="video-container">
        <video ref="videoElem" autoplay playsinline class="video-frame" />
      </div>

      <n-alert v-if="error" type="error" :title="error" />
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { NCard, NSpace, NButton, NAlert } from 'naive-ui'

const videoElem = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const isCameraOn = ref(false)
const error = ref('')

watch(isCameraOn, async (val) => {
  error.value = ''
  if (val) {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoElem.value) {
        videoElem.value.srcObject = stream.value
      }
    } catch (err) {
      console.error('无法打开摄像头：', err)
      error.value = '摄像头权限被拒绝或不可用'
      isCameraOn.value = false
    }
  } else {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    if (videoElem.value) {
      videoElem.value.srcObject = null
    }
  }
})

const toggleCamera = () => {
  isCameraOn.value = !isCameraOn.value
}
</script>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
}

.video-frame {
  width: 100%;
  max-width: 600px;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  object-fit: cover;
}
</style>
