<script setup lang="ts">
import {ref, onMounted, onUnmounted, nextTick, computed, watch} from 'vue';
import {
  Mic as MicIcon,
  Videocam as VideocamIcon,
  Share as ShareIcon,
  RadioButtonOn as RecordIcon,
  Stop as StopIcon,
  Settings as SettingIcon,
  Close as CloseIcon,
  ArrowDown as ArrowDownIcon,
} from '@vicons/ionicons5';
import AvatarSrc from '../assets/child.png'
import {NAvatar, useMessage} from "naive-ui";
import dayjs from "dayjs";
import {useRouter,useRoute} from "vue-router";
import {useFloatingStore} from "../utils/FloatingStore.ts";
const route = useRoute()
const router = useRouter()

// 儿童基本信息
const name = ref(route.query.name as string)
const age = ref(Number(route.query.age))
const gender = ref(route.query.gender as string)
const phone =  ref(route.query.phone as string)
const type = ref( route.query.type === 'face2face'?'面对面治疗':'远程治疗')

// 响应式状态
const childVideoLarge = ref<HTMLDivElement | null>(null);
const childVideoSmall = ref<HTMLDivElement | null>(null);
const doctorVideoLarge = ref<HTMLDivElement | null>(null);
const doctorVideoSmall = ref<HTMLDivElement | null>(null);
const childVideoStream = ref<HTMLVideoElement | null>(null);
const doctorVideoStream = ref<HTMLVideoElement | null>(null);
const childVideoOn = ref(false);
const doctorVideoOn = ref(false);
const audioOn = ref(true);
const videoOn = ref(true);
const showEmotions = ref(false);
// const isSwapped = ref(false);
// const messages = ref<{ time: string; content: string }[]>([]);
const doctorQuestion = ref('');
const isRecording = ref(false);
const showSettings = ref(false);
const settings = ref({
  camera: true,
  microphone: true,
  audio: true,
  virtualBackground: false,
  watermark: false,
});
const callDuration = ref('00:00');
// const isMinimized = ref(false);

// 屏幕共享相关状态
const isScreenSharing = ref(false);
const previousStream = ref<MediaStream | null>(null); // 保存共享前的视频流
const previousDoctorVideoOn = ref(false); // 保存共享前的医生视频状态

// 使用 ref 声明 MediaStream
const localStream = ref<MediaStream | null>(null);
const remoteStream = ref<MediaStream | null>(null);
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
let callStartTime: number | null = null;
let timer: number | null = null;

// 初始化视频流
const initMedia = async () => {
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream.value = new MediaStream(); // 模拟远程流

    await nextTick(); // 等待 DOM 渲染完成

    if (doctorVideoStream.value) {
      doctorVideoStream.value.srcObject = localStream.value;
      doctorVideoOn.value = true;
    }
    if (childVideoStream.value) {
      childVideoStream.value.srcObject = remoteStream.value;
      childVideoOn.value = true;
    }

    startCallTimer();
  } catch (error) {
    console.error('Media access error:', error);
    doctorVideoOn.value = false;
    childVideoOn.value = false;
  }
};

// 切换大小屏
const defaultMaxWindows = ref(true)
const swapVideos = async () => {
  defaultMaxWindows.value = !defaultMaxWindows.value
  if(doctorVideoOn.value){
    localStream.value = await navigator.mediaDevices.getUserMedia({video:true,audio: audioOn.value})
    if(doctorVideoStream.value){
      doctorVideoStream.value.srcObject = localStream.value
    }
  }
};

// 模拟系统情绪反馈
// const simulateEmotionFeedback = () => {
//   setInterval(() => {
//     const emotion = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
//     interactions.value.push({
//       role:'system',
//       content: `🤖：${emotion}`,
//       timestamp: Date.now(),
//       isEmoji: false,
//     });
//   }, 10000); // 每10秒反馈一次
// };

// 发送医生问题
const sendQuestion = () => {
  if(doctorQuestion.value){
    interactions.value.push({
      role:'doctor',
      content:`${doctorQuestion.value}`,
      timestamp: Date.now(),
      isEmoji: false,
    });
    doctorQuestion.value = '';
  }
};

// 切换语音
const toggleAudio = () => {
  audioOn.value = !audioOn.value;
  localStream.value?.getAudioTracks().forEach(track => (track.enabled = audioOn.value));
};

// 切换视频
const toggleVideo = async () => {
  videoOn.value = !videoOn.value;
  if (videoOn.value) {
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: audioOn.value });

      await nextTick(); // 等待 DOM 渲染完成

      if (doctorVideoStream.value) {
        doctorVideoStream.value.srcObject = localStream.value;
        doctorVideoOn.value = true;
      }
    } catch (error) {
      console.error('Failed to open camera:', error);
      videoOn.value = false;
      doctorVideoOn.value = false;
    }
  } else {
    // 释放摄像头和音频轨道
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop()); // 停止所有轨道
      localStream.value = null; // 清理流对象
    }

    await nextTick();

    // 断开视频流并清理 srcObject
    if (doctorVideoStream.value) {
      doctorVideoStream.value.srcObject = null; // 断开视频流
      doctorVideoOn.value = false; // 更新状态
    }
  }
};

// 共享屏幕或停止共享
const toggleScreenShare = async () => {
  if (isScreenSharing.value) {
    // 停止共享屏幕
    try {
      // 停止屏幕共享流的轨道
      const tracks = doctorVideoStream.value?.srcObject instanceof MediaStream
          ? doctorVideoStream.value.srcObject.getTracks()
          : [];
      tracks.forEach(track => track.stop());

      // 恢复之前的状态
      await nextTick();
      if (doctorVideoStream.value) {
        doctorVideoStream.value.srcObject = previousStream.value;
        doctorVideoOn.value = previousDoctorVideoOn.value;
      }

      // 重置屏幕共享状态
      isScreenSharing.value = false;
      previousStream.value = null;
      previousDoctorVideoOn.value = false;
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  } else {
    // 开始共享屏幕
    try {
      // 保存当前状态
      previousStream.value = doctorVideoStream.value?.srcObject instanceof MediaStream
          ? doctorVideoStream.value.srcObject
          : null;
      previousDoctorVideoOn.value = doctorVideoOn.value;

      // 获取屏幕共享流
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      await nextTick();
      if (doctorVideoStream.value) {
        doctorVideoStream.value.srcObject = screenStream;
        doctorVideoOn.value = true;
        isScreenSharing.value = true;
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      // 如果共享失败，恢复状态
      if (doctorVideoStream.value) {
        doctorVideoStream.value.srcObject = previousStream.value;
        doctorVideoOn.value = previousDoctorVideoOn.value;
      }
    }
  }
};

// 开始录制
const startRecording = () => {
  if (localStream.value) {
    mediaRecorder = new MediaRecorder(localStream.value);
    mediaRecorder.ondataavailable = (event) => {
      recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.webm';
      a.click();
      recordedChunks = [];
    };
    mediaRecorder.start();
    isRecording.value = true;
  }
};

// 停止录制
const stopRecording = () => {
  mediaRecorder?.stop();
  isRecording.value = false;
};

// 通话时长计时
const startCallTimer = () => {
  callStartTime = Date.now();
  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - callStartTime!) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    callDuration.value = `${minutes}:${seconds}`;
  }, 1000);
};

const isEndTreatment = ref(false)

// 结束治疗
const confirmEnd = () => {
  isEndTreatment.value = true;
};
const EndTreatment = ()=>{
  localStream.value?.getTracks().forEach(track => track.stop());
  remoteStream.value?.getTracks().forEach(track => track.stop());
  if (timer) clearInterval(timer);
  floatingStore.setFloating(false)
  message.success('治疗已结束')
  router.push('/psychologist/index')
}


// 表情包列表（静态写死）
const EMOJIS = ['😊 快乐', '😢 悲伤', '😱 恐惧', '😡 生气', '😲 惊讶', '😖 厌恶', '😐 没有情绪']
const feedbackMinutes = ref(1)
const feedbackSeconds = ref(30)
let feedbackTimer: number | undefined;
const feedbackInterval = ref(5)
const message = useMessage()

interface ChatMessage{
  role: 'child'|'system'|'info'|'doctor'
  content: string
  timestamp:number
  isEmoji: boolean
}
interface ChildDisplayItem {
  type: 'timestamp' | 'system' |'info' | 'message'
  content: string
  role?: 'child' | 'doctor'|'info'|'system'
  isEmoji?: boolean
  timestamp?: number
}

const interactions = ref<ChatMessage[]>([])
const setFeedbackInterval = ()=>{
  feedbackInterval.value = feedbackMinutes.value * 60 + feedbackSeconds.value
  message.success(`系统反馈频率已设置为 ${feedbackMinutes.value} 分 ${feedbackSeconds.value} 秒`)
  restartFeedbackTimer()
}
const resetFeedbackInterval = ()=>{
  feedbackMinutes.value = 0
  feedbackSeconds.value = 30
  setFeedbackInterval()
}

// 系统默认自动反馈
const autoFeedBack = ()=>{
  const emo = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  interactions.value.push({
    role: 'system',
    content: `🤖: ${emo}`,
    timestamp: Date.now(),
    isEmoji: true
  })
}

const restartFeedbackTimer = ()=>{
  if (feedbackTimer !== undefined) clearInterval(feedbackTimer);
  feedbackTimer = setInterval(autoFeedBack, feedbackInterval.value * 10000);
}

// 自动定位消息底部
// 获取聊天容器内容
const chatBoxRef = ref<HTMLElement|null>(null)
const autoScroll = ref(true)
const showScrollButton = ref(false)
const BOTTOM_THRESHOLD = 20

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
// 滚动到最底部
const ScrollToBottom = ()=>{
  const box = chatBoxRef.value
  if(!box) return
  box.scrollTop = box.scrollHeight
}

// 回到底部按钮点击
const handleScrollButton = ()=>{
  ScrollToBottom()
  autoScroll.value = true
  showScrollButton.value = false
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
    result.push({
      type: msg.role === 'info' ? 'info' : 'message',
      role: msg.role,
      content: msg.content,
      isEmoji: msg.isEmoji,
      timestamp: msg.timestamp })
  })
  return result
})
// 处理表情包选择
const sendEmotion = (emoji:any) => {
  interactions.value.push({
    role: 'doctor',
    content: emoji,
    timestamp: Date.now(),
    isEmoji: false
  });
  doctorQuestion.value = ''; // 清空输入框
  showEmotions.value = false; // 关闭表情包面板
};

const selectedTab = ref<string>('interaction')
// 生命周期钩子
onMounted(() => {
  floatingStore.updateFloatingStore(name,AvatarSrc,age,gender,phone,'remote-treatment',false)
  initMedia();
  // simulateEmotionFeedback();
  // 初始化定时器
  restartFeedbackTimer()
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

});

onUnmounted(() => {
  localStream.value?.getTracks().forEach(track => track.stop());
  remoteStream.value?.getTracks().forEach(track => track.stop());
  if (timer) clearInterval(timer);
  feedbackTimer && clearInterval(feedbackTimer)
  const box = chatBoxRef.value
  if(box){
    box.removeEventListener('scroll',onScroll)
  }
});

const floatingStore = useFloatingStore()
// 浮窗功能
// 监听页面路由变化
router.afterEach((to, from) => {
  const origin = from.name as string | undefined;
  const target = to.name as string | undefined;

  console.log(`from: ${origin}, to: ${target}`); // 输出路由变化信息

  if (origin && target) {
    // 确保 origin 和 target 都不是 undefined
    if (origin === 'remote-treatment' && target !== 'remote-treatment') {
      console.log("Conditions met, showing floating window");
      floatingStore.setFloating(true)
      console.log('f:'+ floatingStore.isFloating)
    } else {
      console.debug("Conditions not met");
    }
  } else {
    console.debug("Origin or target is undefined");
  }
  console.debug("hello!"); // 这里打印的应该能够显示
});

</script>

<template>
  <n-layout style="height: 100%; overflow-y: hidden" >
    <n-card>
      <n-text>正在进行远程治疗
        <span class="blink-dot"></span>
      </n-text>
    </n-card>
    <n-card style="display: flex">
    <n-row gutter="12">
    <!-- 左侧视频区域 -->
    <n-col span="16">
      <n-space vertical class="video-section">
        <n-card class="video-large">
          <div v-if="defaultMaxWindows" ref="doctorVideoLarge">
            <video autoplay playsinline ref="doctorVideoStream"></video>
            <div v-if="!doctorVideoOn" class="avatar-placeholder">
              <n-avatar round size="large">Doctor</n-avatar>
            </div>
          </div>
          <div v-else ref="childVideoLarge">
            <video autoplay playsinline muted ref="childVideoStream"></video>
            <div class="avatar-placeholder">
              <n-avatar round size="large" :src="AvatarSrc"></n-avatar>
            </div>
          </div>
          <n-card @click="swapVideos" class="video-small">
            <div v-if="defaultMaxWindows" ref="childVideoSmall">
              <video autoplay playsinline muted ref="childVideoStream"></video>
              <div class="avatar-placeholder">
                <n-avatar round size="large" :src="AvatarSrc"></n-avatar>
              </div>
            </div>
            <div v-else ref="doctorVideoSmall" >
              <video autoplay playsinline ref="doctorVideoStream"></video>
              <div v-if="!doctorVideoOn" class="avatar-placeholder">
                <n-avatar round size="large">Doctor</n-avatar>
              </div>
            </div>
          </n-card>
        </n-card>
        <!--        <n-button class="swap-button" @click="swapVideos">切换大小屏</n-button>-->
      </n-space>

      <n-card>
      <!-- 底部控制栏 -->
        <n-space align="center">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="toggleAudio">
                <template #icon>
                  <n-icon :component="MicIcon" :color="audioOn ? 'green' : 'red'" />
                </template>
                {{ audioOn ? '关闭语音' : '打开语音' }}
              </n-button>
            </template>
            控制语音开关
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="toggleVideo">
                <template #icon>
                  <n-icon :component="VideocamIcon" :color="videoOn ? 'red' : 'green'" />
                </template>
                {{ videoOn ? '关闭视频' : '打开视频' }}
              </n-button>
            </template>
            控制视频开关
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="toggleScreenShare">
                <template #icon>
                  <n-icon :component="isScreenSharing ? StopIcon : ShareIcon" />
                </template>
                {{ isScreenSharing ? '停止共享' : '共享屏幕' }}
              </n-button>
            </template>
            {{ isScreenSharing ? '停止共享屏幕' : '共享您的屏幕' }}
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="startRecording" v-if="!isRecording">
                <template #icon>
                  <n-icon :component="RecordIcon" />
                </template>
                开始录制
              </n-button>
              <n-button @click="stopRecording" v-if="isRecording">
                <template #icon>
                  <n-icon :component="StopIcon" color="red" />
                </template>
                停止录制
              </n-button>
            </template>
            录制通话
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="showSettings = true">
                <template #icon>
                  <n-icon :component="SettingIcon" />
                </template>
                设置
              </n-button>
            </template>
            打开设置
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="confirmEnd" type="error">
                <template #icon>
                  <n-icon :component="CloseIcon" />
                </template>
                结束治疗
              </n-button>
            </template>
            结束远程治疗
          </n-tooltip>
          <n-modal
              v-model:show="isEndTreatment"
              title="结束治疗"
              preset="dialog"
              :mask-closable="false"
          >
            <p>您确定要结束治疗吗？<br/>
              结束后将自动返回主页，请可在工作记录中查看本次治疗详情</p>
            <template #action>
              <n-button @click="isEndTreatment=false">取消</n-button>
              <n-button @click="EndTreatment" style="margin-left: 12px;">确认</n-button>
            </template>
          </n-modal>
          <n-text>  通话时长: {{ callDuration }}</n-text>
        </n-space>
      </n-card>
    </n-col>

    <!-- 右侧互动消息框 -->
    <n-col span="8">
      <!--      <n-card title="互动消息框">-->
      <!--        <n-scrollbar style="max-height: 400px">-->
      <!--          <n-list>-->
      <!--            <n-list-item v-for="(msg, index) in messages" :key="index">-->
      <!--              <n-thing>-->
      <!--                <template #header>{{ msg.time }}</template>-->
      <!--                <template #description>{{ msg.content }}</template>-->
      <!--              </n-thing>-->
      <!--            </n-list-item>-->
      <!--          </n-list>-->
      <!--        </n-scrollbar>-->
      <!--        <n-space vertical style="margin-top: 10px">-->
      <!--          <n-input v-model:value="doctorQuestion" placeholder="输入问题..." />-->
      <!--          <n-button @click="sendQuestion" type="primary">发送问题</n-button>-->
      <!--        </n-space>-->
      <!--      </n-card>-->
      <n-row>
        <n-card style="padding: 0 ; height: 60px ">
          <n-space justify="center">
<!--            <n-button-->
<!--                tertiary-->
<!--              @click="()=>{selectedTab.value = 'childInfo'}"-->
<!--              :type=" selectedTab.value === 'childInfo'?'primary':'default‘">-->
<!--              儿童信息-->
<!--            </n-button>-->
<!--            <n-button-->
<!--                tertiary-->
<!--                @click="selectedTab.value = 'interaction'"-->
<!--                :type="selectedTab.value === 'interaction' ? 'primary':'default'">-->
<!--            互动区-->
<!--            </n-button>-->
          </n-space>
        </n-card>

        <n-card style="height:450px;position: relative; width: 100%; margin-left: auto;">
          <div v-show="selectedTab === 'interaction'" style="height:400px;padding:12px;overflow-y: auto" ref="chatBoxRef" @scroll.passive="onScroll" >
            <div v-for="(msg, i) in formattedInteraction" :key="i" style="margin-bottom: 6px;">
              <!-- 时间戳 -->
              <div v-if="msg.type === 'timestamp' || msg.role === 'system'" style="text-align: center; color: #999; font-size: 12px;">
              {{ msg.content }}
              </div>
<!--              <div v-else-if="msg.type === 'info'" style="text-align:center; color:#888; font-size:14px; margin:8px 0;">-->
<!--                {{ msg.content }}-->
<!--              </div>-->
<!--              &lt;!&ndash; 系统情绪反馈 &ndash;&gt;-->
<!--              <div v-else-if="msg.type === 'system'" style="text-align: center; color: #999; font-size: 12px;">-->
<!--                {{ msg.content }}-->
<!--              </div>-->

              <!-- 普通消息 -->
              <div v-else
                   :style="{ display: 'flex',
                   flexDirection: msg.role === 'doctor' ? 'row-reverse' : 'row' }">
                <!-- 头像 + 名称 -->
                <div style="display: flex; flex-direction: column; align-items: center; width: 50px;">
                  <n-avatar v-if="msg.role === 'doctor'"
                            round size="medium"
                            style="font-size: 24px; line-height: 1;"
                  >Doctor</n-avatar>

                  <!-- 儿童：显示真实头像，有 fallback -->
                  <n-avatar v-else
                            round size="medium"
                            :src="AvatarSrc|| undefined">
                    {{ name.charAt(0) }}
                  </n-avatar>

                  <span style="font-size: 12px; margin-top: 4px;">
                    {{ msg.role === 'doctor' ? '医生' : '儿童' }}</span>
                </div>

                <!-- 聊天气泡 -->
                <!-- 聊天气泡 -->
                <n-card
                    size="small"
                    :style="{
                  display: 'inline-block',
                  width: 'auto',
                  minWidth: '50%',
                  maxWidth: '90%',
                  marginLeft: msg.role === 'doctor' ? '0px' : '8px',
                  marginRight: msg.role === 'doctor' ? '8px' : '0px',
                  backgroundColor: msg.role === 'doctor' ? '#e6f7ff' : '#f4f4f5',
                  position: 'relative'}"
                >
                  <div :style="{ fontSize: '16px'}">
                    {{ msg.content }}
                  </div>
                  <!-- 显示发送时间 -->
                  <div style="position: absolute; bottom: 6px; right: 8px; font-size: 10px; color: #aaa;">
                    {{ dayjs(msg.timestamp).format('YYYY-MM-DD HH:mm') }}
                  </div>
                </n-card>
              </div>
            </div>
          </div>
          <div v-show="selectedTab === 'childInfo'" style="padding: 12px">
            <n-avatar round size="large" :src="AvatarSrc || undefined" style="font-size: 48px;">
              {{ name.charAt(0) }}
            </n-avatar>
              <div style="font-size: 18px; margin-top: 10px;">
                <strong>姓名：</strong>{{ name }}<br />
                <strong>年龄：</strong>{{ age }}<br />
                <strong>性别：</strong>{{ gender }}<br />
                <strong>家长电话：{{phone}} </strong>
              </div>
          </div>
<!--          <n-card>-->
<!--          <n-card style="width: 100%">-->
<!--          </n-card>-->
<!--          </n-card>-->
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
        <n-card>
<!--        <n-space>-->
          <n-input style="width:80%" v-model:value="doctorQuestion" @focus="showEmotions = true"   @blur="showEmotions = false" placeholder="输入内容..." />
          <n-button style="margin-left: 10px" @click="sendQuestion" type="primary">发送</n-button>
<!--        </n-space>-->
          <div
          v-if="showEmotions"
          style="position: absolute; top: -50px; left: 0; width: 100%; background: #fff; border: 1px solid #ccc; padding: 10px; display: flex; justify-content: space-around; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
          >
            <n-button @click="sendEmotion('😊 快乐')" circle>😊</n-button>
            <n-button @click="sendEmotion('😢 悲伤')" circle>😢</n-button>
            <n-button @click="sendEmotion('😱 恐惧')" circle>😱</n-button>
            <n-button @click="sendEmotion('😡 生气')" circle>😡</n-button>
            <n-button @click="sendEmotion('😲 惊讶')" circle>😲</n-button>
            <n-button @click="sendEmotion('😖 厌恶')" circle>😖</n-button>
            <n-button @click="sendEmotion('😐 没有情绪')" circle>😐</n-button>
          </div>
        </n-card>
      </n-row>
    </n-col>
    </n-row>
    </n-card>
    <!-- 设置弹窗 -->
    <n-modal v-model:show="showSettings" title="设置" preset="dialog" style="width: 600px">
      <n-form>
        <n-form-item label="设置系统反馈频率">
          <n-space align="center" style="padding: 5px">
            <span style="width: 120px;"><n-text>系统反馈频率：</n-text></span>
            <n-input-number v-model:value="feedbackMinutes" :min="0" :step="1" style="width: 80px;" /> 分
            <n-input-number v-model:value="feedbackSeconds" :min="0" :step="1" style="width: 80px;" /> 秒
            <n-button type="primary" @click="setFeedbackInterval">设置</n-button>
            <n-button @click="resetFeedbackInterval">重置</n-button>
          </n-space>
        </n-form-item>
        <n-form-item label="入会开启摄像头">
          <n-checkbox v-model:checked="settings.camera">启用</n-checkbox>
        </n-form-item>
        <n-form-item label="入会开启麦克风">
          <n-checkbox v-model:checked="settings.microphone">启用</n-checkbox>
        </n-form-item>
        <n-form-item label="使用电脑音频">
          <n-checkbox v-model:checked="settings.audio">启用</n-checkbox>
        </n-form-item>
        <n-form-item label="使用虚拟背景">
          <n-checkbox v-model:checked="settings.virtualBackground">启用</n-checkbox>
        </n-form-item>
        <n-form-item label="设置会议水印">
          <n-checkbox v-model:checked="settings.watermark">启用</n-checkbox>
        </n-form-item>
      </n-form>
    </n-modal>

<!--    &lt;!&ndash; 最小化浮窗 &ndash;&gt;-->
<!--    <n-drawer v-model:show="isMinimized" placement="right" width="200">-->
<!--      <n-card title="远程治疗">-->
<!--        <n-button @click="isMinimized = false" type="primary">恢复</n-button>-->
<!--      </n-card>-->
<!--    </n-drawer>-->
  </n-layout>
</template>


<style scoped>
.video-section {
  padding: 5px;
  position: relative;
  /*height: calc(100% - 60px); /* 留出底部控制栏的高度 */
}

.video-large {
  width: 100%;
  height: 500px;
  background: #000;
  position: relative;
}

.video-small {
  width: 25%;
  height: auto;
  background: #000;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}


video {
  width: 100%;
  height: auto;
  object-fit: contain;  /* 保持视频原始比例并适应容器 */
  padding: 0;
  max-height: 450px;
}


.avatar-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-section {
  padding: 5px;
  margin-right: 10px;
}

.control-bar {
  padding: 10px;
  border-top: 1px solid #ddd;
  height: 60px;
  margin-top: 5px
}
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