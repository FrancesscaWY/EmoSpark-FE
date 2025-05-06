<script setup lang="ts">
import {ref,onMounted,watch} from 'vue'
import {useRoute} from "vue-router";
import {NAvatar,useMessage} from 'naive-ui'

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
const interactions = ref<string[]>([])
// 控制状态
const isAsking = ref(false)
const autoAsk = ref(false)
const askInterval = ref(10)
const feedbackInterval = ref(5)

let askTimer: NodeJS.Timeout|null = null
let feedbackTimer: NodeJS.Timeout|null = null

// 开始提问
const startAsking = ()=>{
  isAsking.value = true
  addMessage('👩‍⚕️ 开始提问...')
  setTimeout(()=>{
    simulateChildResponse()
  },5000)
}
// 模拟回答
const simulateChildResponse = ()=>{
  const randomEmoji = EMOJIS[Math.floor(Math.random()*EMOJIS.length)]
  addMessage(`🧒 ${randomEmoji}`)
  isAsking.value = false
}

// 添加消息
const addMessage = (msg:string)=>{
  interactions.value.push(msg)
}

// 自动提问逻辑
onMounted(()=>{
  watch(autoAsk,(val)=>{
    if(val){
      askTimer = setInterval(()=>{
        if(!isAsking.value) startAsking()
      },askInterval.value * 1000)
    }else if(askTimer){
      clearInterval(askTimer)
    }
  })
  // 系统反馈轮询
  feedbackTimer = setInterval(()=>{
    const feedback = EMOJIS[Math.floor(Math.random()*EMOJIS.length)]
    addMessage(`🤖 系统反馈：${feedback}`)
  },feedbackInterval.value*1000)
})

const endTreatment = ()=>{
  autoAsk.value = false
  askTimer && clearInterval(askTimer)
  message.success('治疗已结束')
}
</script>

<template>
  <n-layout style="padding: 20px;">
    <n-card>
      <n-text>正在治疗中......</n-text>
    </n-card>
    <n-card style="display: flex">
<!--      左侧信息-->
      <n-card style="width:60%;">
        <div style="display: flex; align-items: center">
          <n-avatar round large>{{name.charAt(0)}}</n-avatar>
          <n-text>{{name}}</n-text>
        </div>
        <div style="margin-top: 12px;">
          <p><strong>性别：</strong>{{ gender }}</p>
          <p><strong>年龄：</strong>{{ age }}</p>
          <p><strong>家属电话：</strong>{{ phone }}</p>
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
      </n-card>

<!--      右侧互动与系统设置-->
      <n-card style="margin-left: auto;width:40%">
        <n-card title="互动展示区" style="height: 200px;overflow: auto;">
          <div v-for="(msg,i) in interactions" :key="i" style="margin-bottom: 6px;">
            {{msg}}
          </div>
        </n-card>
      </n-card>

      <n-card title="系统设置" style="margin-top:12px;">
        <n-space vertical>
          <n-switch v-model:value="autoAsk">开启自动提问</n-switch>
          <n-input-number v-model:value="askInterval" :min="5" :step="1" label="自动提问频率(秒)"/>
          <n-input-number v-model:value="feedbackInterval" :min="3" :step="1" label="系统反馈频率(秒)"/>
        </n-space>
      </n-card>
    </n-card>
  </n-layout>
</template>

<style scoped>

</style>