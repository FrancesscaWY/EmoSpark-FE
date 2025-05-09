<template>
  <div class="bg" :style="backgroundStyle">
    <button class="btn" block round @click="onClick">返回</button>
    <!-- 外层容器：左右并排 -->
    <div class="chat-container">
      <!-- 左侧聊天列表 -->
      <div class="chat-sider">
        <ChatList
            :conversations="conversations"
            :active-id="activeConversationId"
            @select="onSelectConversation"
        />
      </div>

      <!-- 右侧聊天区 -->
      <div class="chat-main">
        <!-- 消息展示区 -->
        <div class="chat-window">
          <ChatWindow
              v-if="activeConversationId !== null"
              :messages="currentMessages"
          />
        </div>
        <!-- 输入区 -->
        <div class="chat-input">
          <MessageInput
              @sendText="sendText"
              @sendImage="sendImage"
              @sendVoice="sendVoice"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch ,computed} from 'vue'
import bgUrl from '../assets/bk.jpeg'
import { NCard, NSpace, NButton, NAlert, NTabs, NTabPane, } from 'naive-ui'
import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'

// 1️⃣ 导入你拆分好的三个组件
import ChatList     from '../components/ChatList.vue'
import ChatWindow   from '../components/ChatWindow.vue'
import MessageInput from '../components/MessageInput.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// —— 模拟会话数据
interface Conversation { id: number; name: string; avatar: string }
const conversations = ref<Conversation[]>([
  { id: 1, name: '诡秘', avatar: '/avatars/doc.png' },
  { id: 2, name: '妈咪',       avatar: '/avatars/mom.png' },
  { id: 3, name: '李医生',    avatar: '/avatars/friend.png' }
])

// —— 当前选中会话 ID
const activeConversationId = ref<number|null>(null)

// —— 全部消息（按会话 id 存储）
interface Message { id:number; fromMe:boolean; type:string; content:string }
const allMessages = ref<Record<number, Message[]>>({})

// —— 计算属性：当前会话的消息列表
const currentMessages = computed(() => {
  if (activeConversationId.value === null) return []
  return allMessages.value[activeConversationId.value] || []
})
const onClick = ()=> {
  router.push('/children-routes')
}
// —— 切换会话
function onSelectConversation(id: number) {
  activeConversationId.value = id
  // TODO: 如果需要，可以在这 fetch 后端历史消息
}

// —— 发送文字
function sendText(text: string) {
  if (activeConversationId.value === null) return
  const list = allMessages.value[activeConversationId.value] ||= []
  list.push({ id: Date.now(), fromMe: true, type: 'text', content: text })
  // TODO: 同步到后端或 WebSocket
}

// —— 发送图片
function sendImage(file: File) {
  if (activeConversationId.value === null) return
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    const list = allMessages.value[activeConversationId.value] ||= []
    list.push({ id: Date.now(), fromMe: true, type: 'image', content: dataUrl })
    // TODO: 上传 file，获得真正的 URL 再替换 dataUrl
  }
  reader.readAsDataURL(file)
}

// —— 发送语音
function sendVoice(blob: Blob) {
  if (activeConversationId.value === null) return
  const url = URL.createObjectURL(blob)
  const list = allMessages.value[activeConversationId.value] ||= []
  list.push({ id: Date.now(), fromMe: true, type: 'voice', content: url })
  // TODO: 上传 blob，替换成线上 URL
}

const backgroundStyle = {
  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87,157,208,0.2) 80%), url(${bgUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}
</script>
<style  scoped>
.bg{

  position: absolute;
  top: 0;       /* 一定要加 */
  left: 0;      /* 一定要加 */
  width: 100vw;
  height: 100vh;


}
:deep(.n-layout),
:deep(.n-layout-sider),
:deep(.n-layout-content),
:deep(.n-list),
:deep(.n-list-item),
:deep(.n-card),
:deep(.n-input),
:deep(.n-button),
:deep(.n-alert),
:deep(.n-space) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  -webkit-backdrop-filter: blur(10px);
}

/* 如果你用到了 Avatar、Tabs 等组件，也可以一并做透明 */
:deep(.n-avatar),
:deep(.n-tabs),
:deep(.n-tab-pane) {
  background-color: transparent !important;
}

/* 聊天窗口、消息气泡等依旧保留自己的背景或按需自定义 */
.chat-container {
  display: flex;
  width: 70%;      /* 整体宽度 90% 居中 */
  height: 80%;     /* 整体高度 80% */
  margin: auto;    /* 水平+垂直居中 */
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 左侧：固定宽度 */
.chat-sider {
  width: 280px;
  border-right: 1px solid rgba(255,255,255,0.2);
  /* 如果列表内容超长就滚 */
  overflow-y: auto;
  z-index: 10;
}

/* 右侧：剩余空间 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 消息区：占满上部 */
.chat-window {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 输入区：固定高度 */
.chat-input {
  height: 80px;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding: 8px;

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
  color: white;
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