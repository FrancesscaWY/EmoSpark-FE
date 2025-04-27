<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import {
  Mic as MicIcon,
  Videocam as VideocamIcon,
  Share as ShareIcon,
  RadioButtonOn as RecordIcon,
  Stop as StopIcon,
  Settings as SettingIcon,
  Close as CloseIcon,
  Remove as MinimizeIcon,
} from '@vicons/ionicons5';
import AvatarSrc from '../assets/child.png'
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
// const isSwapped = ref(false);
const messages = ref<{ time: string; content: string }[]>([]);
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
const isMinimized = ref(false);

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
const simulateEmotionFeedback = () => {
  setInterval(() => {
    const emotions = ['开心', '难过', '生气', '平静'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    messages.value.push({
      time: new Date().toLocaleTimeString(),
      content: `系统检测到儿童情绪：${emotion}`,
    });
  }, 10000); // 每10秒反馈一次
};

// 发送医生问题
const sendQuestion = () => {
  if (doctorQuestion.value) {
    messages.value.push({
      time: new Date().toLocaleTimeString(),
      content: `医生提问：${doctorQuestion.value}`,
    });
    // 模拟儿童回答
    setTimeout(() => {
      messages.value.push({
        time: new Date().toLocaleTimeString(),
        content: `儿童回答：开心`,
      });
      // 医生通过prompt给出正确答案
      messages.value.push({
        time: new Date().toLocaleTimeString(),
        content: `医生提示：正确答案是“开心”`,
      });
    }, 2000);
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

// 结束会议
const endMeeting = () => {
  localStream.value?.getTracks().forEach(track => track.stop());
  remoteStream.value?.getTracks().forEach(track => track.stop());
  if (timer) clearInterval(timer);
  window.close(); // 模拟关闭窗口
};

// 最小化窗口
const minimizeWindow = () => {
  isMinimized.value = true;
};

// 生命周期钩子
onMounted(() => {
  initMedia();
  simulateEmotionFeedback();
});

onUnmounted(() => {
  localStream.value?.getTracks().forEach(track => track.stop());
  remoteStream.value?.getTracks().forEach(track => track.stop());
  if (timer) clearInterval(timer);
});
</script>

<template>
  <n-layout style="height: 100vh">
    <n-card>
      <n-text>正在进行
        <span class="blink-dot"></span>
      </n-text>
    </n-card>
    <n-card style="display: flex">
    <n-row gutter="12">
    <!-- 左侧视频区域 -->
    <n-col span="18">
      <n-space vertical class="video-section">
        <n-card class="video-large">
          <div v-if="defaultMaxWindows" ref="doctorVideoLarge">
            <video autoplay playsinline ref="doctorVideoStream"></video>
            <div v-if="!doctorVideoOn" class="avatar-placeholder">
              <n-avatar round size="large">医</n-avatar>
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
                <n-avatar round size="large">医</n-avatar>
              </div>
            </div>
          </n-card>
        </n-card>
        <!--        <n-button class="swap-button" @click="swapVideos">切换大小屏</n-button>-->
      </n-space>

      <!-- 底部控制栏 -->
      <n-layout-footer class="control-bar">
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
                  <n-icon :component="StopIcon" />
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
              <n-button @click="endMeeting" type="error">
                <template #icon>
                  <n-icon :component="CloseIcon" />
                </template>
                结束会议
              </n-button>
            </template>
            结束当前会议
          </n-tooltip>
          <n-text>通话时长: {{ callDuration }}</n-text>
        </n-space>
      </n-layout-footer>
    </n-col>

    <!-- 右侧互动消息框 -->
    <n-col span="6">
      <n-layout-sider bordered width="300" class="message-section">
      <n-card title="互动消息框">
        <n-scrollbar style="max-height: 400px">
          <n-list>
            <n-list-item v-for="(msg, index) in messages" :key="index">
              <n-thing>
                <template #header>{{ msg.time }}</template>
                <template #description>{{ msg.content }}</template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-scrollbar>
        <n-space vertical style="margin-top: 10px">
          <n-input v-model:value="doctorQuestion" placeholder="输入问题..." />
          <n-button @click="sendQuestion" type="primary">发送问题</n-button>
        </n-space>
      </n-card>
    </n-layout-sider>
    </n-col>
    </n-row>
    </n-card>
    <!-- 设置弹窗 -->
    <n-modal v-model:show="showSettings" title="设置" preset="dialog">
      <n-form>
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
  height: 100%;
  background: #000;
  position: relative;
}

.video-small {
  width: 30%;
  height: 30%;
  background: #000;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  padding: 10px;
  margin-right: 10px;
}

.control-bar {
  padding: 10px;
  border-top: 1px solid #ddd;
  height: 60px;
}
</style>