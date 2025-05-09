<template>
  <div class="input-area">
    <n-input
        v-model:value="text"
        placeholder="输入消息…"
        @keydown.enter.prevent="onSendText"
        class="chat-input"
        clearable
    >
    <template #suffix>
    <n-popover
        trigger="click"
        placement="top-start"
        :show-arrow="false"
    >
      <template #trigger>

        <n-button size="small" circle>
          😊
        </n-button>
      </template>
      <emoji-picker @emoji-click="onEmojiClick" />
    </n-popover>
      <n-button
          size="tiny"
          circle
          class="icon-btn"
          @mousedown="startRec"
          @mouseup="stopRec"
      >
        🎤
      </n-button>
      <n-button
          size="tiny"
          circle
          class="icon-btn"
          @click="triggerFile"
      >📷</n-button>
      <n-button type="primary" size="small" @click="onSendText" class="input">
      发送
    </n-button>
    </template>
    </n-input>

    <input
        type="file"
        accept="image/*"
        ref="fileInput"
        @change="onFileChosen"
        style="display:none"
    />

  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'

const emit = defineEmits<{
  (e:'sendText', text:string):void
  (e:'sendImage', file:File):void
  (e:'sendVoice', blob:Blob):void
  (e:'sendEmoji', emoji:string):void
}>()

const text = ref('')

// 文本发送
function onSendText() {
  if (!text.value.trim()) return
  emit('sendText', text.value)
  text.value = ''
}

// 图片发送
const fileInput = ref<HTMLInputElement>()
function triggerFile() { fileInput.value?.click() }
function onFileChosen(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) emit('sendImage', f)
}
// 语音录制
let recorder: MediaRecorder, chunks: BlobPart[] = []
function startRec() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream)
    recorder.ondataavailable = ev => chunks.push(ev.data)
    recorder.start()
  })
}
function stopRec() {
  recorder.stop()
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' })
    emit('sendVoice', blob)
    chunks = []
  }
  function onEmojiClick(e: CustomEvent) {
    // e.detail.unicode 是表情字符本身
    const emoji = e.detail.unicode
    emit('sendEmoji', emoji)
    showPicker.value = false
  }
}
</script>

<style scoped>
.mas{
  width:70%;
  left:8%;
}
.input-area {

  display: flex;
  align-items: center;
  padding: 8px;
  border-top: 1px solid #ddd;
}
.input{
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  font-size: 14px;
  margin-left: 0;
}
input[type="file"] {margin-left: 40px;
  width: 20px; }

</style>