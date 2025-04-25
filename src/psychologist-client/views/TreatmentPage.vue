<script setup lang="ts">
import {onMounted, ref, watch, computed, onUnmounted, nextTick} from 'vue'
import {useRoute} from "vue-router";
import {NAvatar, useMessage} from 'naive-ui'
import dayjs from 'dayjs'
import { ArrowDown as ArrowDownIcon } from '@vicons/ionicons5'

const route = useRoute()
const message = useMessage()

// 儿童基本信息
const name = ref(route.query.name as string)
const age = ref(Number(route.query.age))
const gender = ref(route.query.gender as string)
const phone =  ref(route.query.phone as string)
// 表情包列表（静态写死）
const EMOJIS = ['😊 快乐', '😢 悲伤', '😱 恐惧', '😡 生气', '😲 惊讶', '😖 厌恶', '😐 没有情绪']
// 当前互动记录
const interactions = ref<ChatMessage[]>([])
// const systemAvatar = 'https://i.imgur.com/SystemIcon.png'
const childAvatar = 'https://i.imgur.com/ChildIcon.png'
// 控制状态
const isAsking = ref(false)
const autoAsk = ref(false)
const feedbackMinutes = ref(0)
const feedbackSeconds = ref(5)
const feedbackInterval = ref(5)
const askMinutes = ref(2)
const askSeconds = ref(0)
const askInterval = ref(120)
// const childHasAnswered = ref(false)

interface ChatMessage{
  role: 'child'|'system'|'info'
  content: string
  timestamp:number
  isEmoji: boolean
}

interface ChildDisplayItem {
  type: 'timestamp' | 'message' |'info'
  content: string
  role?: 'child' | 'system'|'info'
  isEmoji?: boolean
  timestamp?: number
}

let askTimer: number | undefined;
let feedbackTimer: number | undefined;
const setFeedbackInterval = ()=>{
  feedbackInterval.value = feedbackMinutes.value * 60 + feedbackSeconds.value
  message.success(`系统反馈频率已设置为 ${feedbackMinutes.value} 分 ${feedbackSeconds.value} 秒`)
  restartFeedbackTimer()
}
const restartFeedbackTimer = ()=>{
  if (feedbackTimer !== undefined) clearInterval(feedbackTimer);
  feedbackTimer = setInterval(autoFeedBack, feedbackInterval.value * 1000);
}
const resetFeedbackInterval = ()=>{
  feedbackMinutes.value = 1
  feedbackSeconds.value = 0
  setFeedbackInterval()
}
const setAskInterval = ()=>{
  askInterval.value = askMinutes.value*60 + askSeconds.value
  message.success(`提问频率已设置为 ${askMinutes.value} 分 ${askSeconds.value} 秒`)
  restartAskTimer()
}
const resetAskInterval = ()=>{
  askMinutes.value = 2
  askSeconds.value = 0
  setAskInterval()
}
const restartAskTimer = ()=>{
  if (askTimer !== undefined) clearInterval(askTimer);
  if (autoAsk.value) {
    askTimer = setInterval(startAsking, askInterval.value * 1000);
  }
}

// 系统默认自动反馈
const autoFeedBack = ()=>{
  const emo = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  interactions.value.push({
    role: 'system',
    content: `${emo}`,
    timestamp: Date.now(),
    isEmoji: true
  })
}
// 添加儿童回答
// const addChildMessage = (emoji:string)=>{
//   interactions.value.push({
//     role:'child',
//     content:emoji,
//     timestamp:Date.now(),
//     isEmoji: true
//   })
//   childHasAnswered.value = true
// }
//
// // 只有 childHasAnswered 为 true 时，系统才可回应
// const addSystemResponse = (emoji:string,isEmoji=false)=>{
//   if(!childHasAnswered.value) return
//   interactions.value.push({
//     role:'system',
//     content: emoji,
//     timestamp:Date.now(),
//     isEmoji
//   })
//   childHasAnswered.value = false
// }

// 提问-回答-反馈
const startAsking = ()=> {
  clearInterval(feedbackTimer)
  clearInterval(askTimer)
  isAsking.value = true
  interactions.value.push({
    role: 'info',
    content: '👩‍⚕️ 开始提问...',
    timestamp: Date.now(),
    isEmoji: false
  })
  const waitTimer = setTimeout(() => {
    if (isAsking.value) interactions.value.push({
      role: 'info',
      content: '儿童正在回答中，请稍等',
      timestamp: Date.now(),
      isEmoji: false
    })
  }, 30000)

  setTimeout(() => {
    clearTimeout(waitTimer)
    const childE = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    interactions.value.push({ role: 'child', content: childE, timestamp: Date.now(), isEmoji: true })
    isAsking.value = false
    setTimeout(() => {
      interactions.value.push({role: 'system', content: '做得不错！👏', timestamp: Date.now(), isEmoji: false})
      setTimeout(()=>{
        // interactions.value.push({
        //   role: 'system',
        //   content: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        //   timestamp: Date.now(),
        //   isEmoji: true
        // })
        // 点击提问后，恢复原自动反馈
        restartFeedbackTimer()
        if (autoAsk.value) restartAskTimer()
      },1000)
    }, 1000)
  },3000)
}

// // 模拟回答-反馈
// const simulateChildResponse = ()=>{
//   const randomEmoji = EMOJIS[Math.floor(Math.random()*EMOJIS.length)]
//   addChildMessage(`${randomEmoji}`)
//   isAsking.value = false
//
//   setTimeout(()=>{
//     const systemRecognized = EMOJIS[Math.floor(Math.random()*EMOJIS.length)]
//     addSystemResponse('做的不错！👏')
//     setTimeout(()=>{
//       addSystemResponse(systemRecognized,true)
//       childHasAnswered.value = false
//     },1000)
//   },3000)
// }

// 自动提问逻辑
onMounted(()=>{
  // 初始化定时器
  restartFeedbackTimer()
  restartAskTimer()
  // //
  // watch(autoAsk,(val)=>{
  //   if(val){
  //     askTimer = setInterval(()=>{
  //       if(!isAsking.value) startAsking()
  //     },askInterval.value * 1000)
  //   }else if(askTimer){
  //     clearInterval(askTimer)
  //     askTimer = null
  //   }
  // })

  // 启动系统周期性自动反馈
  // feedbackTimer = setInterval(()=>{
  //   autoFeedBack()
  // },feedbackInterval.value*1000)
  // 消息变化时自动滚动
  watch(formattedInteraction, async()=>{
    if (!autoScroll.value) return
    await nextTick()
    ScrollToBottom()
  })

  // // 绑定scroll事件
  nextTick(()=>{
    const box = chatBoxRef.value
    if(box){
      box.addEventListener('scroll',onScroll,{passive:true})
    }
  })
})

onUnmounted(()=>{
  askTimer && clearInterval(askTimer)
  feedbackTimer && clearInterval(feedbackTimer)
  const box = chatBoxRef.value
  if(box){
    box.removeEventListener('scroll',onScroll)
  }
})

// 结束治疗
const endTreatment = ()=>{
  autoAsk.value = false
  askTimer && clearInterval(askTimer)
  feedbackTimer && clearInterval(feedbackTimer)
  message.success('治疗已结束')
}
// 格式化时间信息
const formattedInteraction = computed<ChildDisplayItem[]>(()=>{
  const result: ChildDisplayItem[] = []
  let lastTimestamp = 0
  interactions.value.forEach((msg)=>{
    if(msg.timestamp - lastTimestamp >= 5*60*1000 || result.length === 0 ){
      result.push({
        type: 'timestamp',
        content: dayjs(msg.timestamp).format('YYYY-MM-DD HH:mm')
      })
      lastTimestamp = msg.timestamp
    }
  result.push({ type: msg.role === 'info' ? 'info' : 'message', role: msg.role === 'info' ? undefined : msg.role, content: msg.content, isEmoji: msg.isEmoji, timestamp: msg.timestamp })
  })
  return result
})

// 自动定位消息底部
// 获取聊天容器内容
const chatBoxRef = ref<HTMLElement|null>(null)
const autoScroll = ref(true)
const showScrollButton = ref(false)
const BOTTOM_THRESHOLD = 20

// 滚动到最底部
const ScrollToBottom = ()=>{
  const box = chatBoxRef.value
  if(!box) return
  box.scrollTop = box.scrollHeight
}

// 监听滚动事件
const onScroll = ()=>{
  const box = chatBoxRef.value!
  const distanceToBottom = box.scrollHeight - (box.scrollTop + box.clientHeight)
  if(distanceToBottom > BOTTOM_THRESHOLD){
    // 滚离底部
    autoScroll.value = false
    showScrollButton.value = true
  }else{
    // 滚到底部
    showScrollButton.value = false
    autoScroll.value = true
  }
}
// 回到底部按钮点击
const handleScrollButton = ()=>{
  ScrollToBottom()
  autoScroll.value = true
  showScrollButton.value = false
}

</script>

<template>
  <n-layout style="padding: 20px;overflow-y: hidden" >
    <n-card>
      <n-text>正在治疗中
        <span class="blink-dot"></span>
      </n-text>
    </n-card>
    <n-card style="display: flex">
<!--      左侧信息-->
      <n-row gutter="12">
        <n-col :span="14">
          <n-card style="">
<!--            <n-row>-->
            <div style="width:50%; display: flex; align-items: center">
              <n-avatar round large>{{name.charAt(0)}}</n-avatar>
              <div style="text-align: center;">
                <n-text strong style="font-size: 16px ;padding: 6px" >{{name}}</n-text>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <p><strong>性别：</strong>{{ gender }}&nbsp;&nbsp;&nbsp;&nbsp;<strong>年龄：</strong>{{ age }}</p>
              <p><strong>家属电话：</strong>{{ phone }}</p>
              <p>
                <strong>系统反馈频率：</strong>{{feedbackMinutes}}分{{feedbackSeconds}}秒&nbsp;&nbsp;&nbsp;&nbsp;
                <strong>提问反馈频率：</strong>提问频率：{{ autoAsk ? (askMinutes + '分' + askSeconds + '秒') : '未开启' }}
              </p>
            </div>
            <div style="margin-top:24px;">
              <n-button
                  type="primary"
                  @click="startAsking"
                  :disabled="isAsking||autoAsk"
              >{{isAsking? '等待儿童回答...':'开始提问'}}</n-button>
              <n-button
                  type="error"
                  style="margin-left: 12px"
                  @click="endTreatment"
              >结束治疗</n-button>
            </div>
<!--            </n-row>-->
          </n-card>
          <n-card style="flex: 1">
            <template #header>系统设置</template>
            <n-space vertical size="large">
            </n-space>
            <n-card>
            <n-space align="center" style="padding: 5px">
              <span style="width: 120px;"><n-text>系统反馈频率：</n-text></span>
              <n-input-number v-model:value="feedbackMinutes" :min="0" :step="1" style="width: 80px;" /> 分
              <n-input-number v-model:value="feedbackSeconds" :min="0" :step="1" style="width: 80px;" /> 秒
              <n-button type="primary" @click="setFeedbackInterval">设置</n-button>
              <n-button @click="resetFeedbackInterval">重置</n-button>
            </n-space>
            </n-card>
            <n-card>
            <n-space align="center" style="padding: 5px">
              <span style="width: 120px;"><n-text>开启自动提问：</n-text></span>
              <n-switch v-model:value="autoAsk" @update:value="restartAskTimer" />
            </n-space>
            <n-space align="center" style="padding: 5px">
              <span :style="{width:'120px',color:autoAsk?'#000':'#aaa'}"><n-text>自动提问频率： </n-text></span>
              <n-input-number v-model:value="askMinutes" :min="0" :step="1" style="width: 80px;" :disabled="!autoAsk"/>分
              <n-input-number v-model:value="askSeconds" :min="0" :step="1" style="width: 80px;" :disabled="!autoAsk"/>秒
              <n-button type="primary" @click="setAskInterval" :disabled="!autoAsk">设置</n-button>
              <n-button @click="resetAskInterval" :disabled="!autoAsk">重置</n-button>
            </n-space>
            </n-card>
          </n-card>
        </n-col>
        <n-col span="10">
<!--      右侧互动与系统设置-->
          <n-row>
            <n-card title="互动展示区" style="padding: 5px"></n-card>
            <n-card style="height:458px;position: relative; width: 100%; margin-left: auto;">
              <div style="height:400px;padding:12px;overflow-y: auto" ref="chatBoxRef" @scroll.passive="onScroll" >
                <div v-for="(msg, i) in formattedInteraction" :key="i" style="margin-bottom: 6px;">
                  <!-- 时间戳 -->
                  <div v-if="msg.type === 'timestamp'"
                       style="text-align: center; color: #999; font-size: 12px;">
                    {{ msg.content }}
                  </div>
                  <div v-else-if="msg.type === 'info'" style="text-align:center; color:#888; font-size:14px; margin:8px 0;">
                    {{ msg.content }}
                  </div>
                  <!-- 普通消息 -->
                  <div v-else
                       :style="{ display: 'flex',
                   flexDirection: msg.role === 'system' ? 'row-reverse' : 'row' }">
                    <!-- 头像 + 名称 -->
                    <div style="display: flex; flex-direction: column; align-items: center; width: 50px;">
                      <n-avatar v-if="msg.role === 'system'"
                                round size="medium"
                                style="font-size: 24px; line-height: 1;"
                      >🤖</n-avatar>

                      <!-- 儿童：显示真实头像，有 fallback -->
                      <n-avatar v-else
                                round size="medium"
                                :src="childAvatar|| undefined">
                        {{ name.charAt(0) }}
                      </n-avatar>

                      <span style="font-size: 12px; margin-top: 4px;">
                    {{ msg.role === 'system' ? '系统' : '儿童' }}</span>
                    </div>

                    <!-- 聊天气泡 -->
                    <n-card
                        size="small"
                        :style="{
                  display: 'inline-block',
                  width: 'auto',
                  minWidth: '30%',
                  maxWidth: '50%',
                  marginLeft: msg.role === 'system' ? '0px' : '8px',
                  marginRight: msg.role === 'system' ? '8px' : '0px',
                  backgroundColor: msg.role === 'system' ? '#e6f7ff' : '#f4f4f5'
                }"
                    >
                      <div :style="{ fontSize: '16px'}">
                        {{ msg.content }}
                      </div>
                    </n-card>
                  </div>
                </div>
              </div>
              <n-button
                  v-if="showScrollButton"
                  tertiary
                  circle
                  size="medium"
                  type="default"
                  style="
      position: absolute;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      z-index: 10;
    "
                  @click="handleScrollButton"
                  title="回到底部"
              >
                <n-icon>
                  <ArrowDownIcon />
                </n-icon>
              </n-button>
            </n-card>
          </n-row>
        </n-col>
      </n-row>
    </n-card>
  </n-layout>
</template>

<style scoped>
.blink-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 4px;
  background-color: #52c41a; /* 绿点 */
  border-radius: 50%;
  animation: blink 1s infinite ease-in-out;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>