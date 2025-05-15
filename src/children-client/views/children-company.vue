<template>
  <div :style="backgroundStyle" >
    <button class="btn" blockround @click="onClick">返回</button>
    <div class="main">
      <n-card title="开启摄像头" class="camera">
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
      <n-card class="emo">
     <h2 class="zi">Ta现在是：</h2>
        <n-text style="font-size: 18px" >当前主导情绪：{{ maxEmotionEmoji }} {{ maxEmotionName }} （占比：{{ maxEmotionValue.toFixed(2) }}%）</n-text>
        <div ref="chartRef" style="width: 100%; height: 300px;"></div>
      </n-card>
    </div>
  </div>
</template>
<!--<script setup lang="ts">-->

<!--import { ref, watch, onMounted, onBeforeUnmount } from 'vue'-->
<!--import { NCard, NSpace, NButton, NAlert } from 'naive-ui'-->
<!--import { useRouter } from 'vue-router'-->

<!--const router = useRouter()-->
<!--const videoElem = ref<HTMLVideoElement | null>(null)-->
<!--const stream = ref<MediaStream | null>(null)-->
<!--const isCameraOn = ref(false)-->
<!--const error = ref('')-->
<!--const currentEmotion = ref('')-->
<!--let mediaRecorder: MediaRecorder | null = null-->
<!--let audioChunks: Blob[] = []-->
<!--let captureInterval: number | null = null;-->
<!--watch(isCameraOn, async (val) => {-->
<!--  error.value = ''-->
<!--  if (val) {-->
<!--    try {-->
<!--      stream.value = await navigator.mediaDevices.getUserMedia({-->
<!--        video: true,-->
<!--        audio: {-->
<!--          echoCancellation: true,-->
<!--          noiseSuppression: true,-->
<!--          sampleRate: 48000-->
<!--        }-->
<!--      })-->
<!--      if (videoElem.value) {-->
<!--        videoElem.value.srcObject = stream.value-->
<!--      }-->
<!--      startSpeechRecognition()-->
<!--      captureInterval = window.setInterval(async () => {-->
<!--        if (videoElem.value) {-->
<!--          const canvas = captureImageFromVideo(videoElem.value)-->
<!--          const imageDataUrl = canvas.toDataURL('image/jpeg')-->
<!--          const emotion = await analyzeEmotion({ imageDataUrl })-->
<!--          currentEmotion.value = emotion-->
<!--        }-->
<!--      },3000)-->

<!--    } catch (err) {-->
<!--      console.error('无法打开摄像头：', err)-->
<!--      error.value = '摄像头权限被拒绝或不可用'-->
<!--      isCameraOn.value = false-->
<!--    }-->
<!--  } else {-->
<!--    if (stream.value) {-->
<!--      stream.value.getTracks().forEach(track => track.stop())-->
<!--      stream.value = null-->
<!--    }-->
<!--    if (videoElem.value) {-->
<!--      videoElem.value.srcObject = null-->
<!--    }-->
<!--    if (captureInterval !== null) {-->
<!--      clearInterval(captureInterval)-->
<!--      captureInterval = null-->
<!--    }-->

<!--    recognition.stop()-->
<!--  }-->
<!--})-->

<!--const startAudioRecording = (stream: MediaStream) => {-->
<!--  mediaRecorder = new MediaRecorder(stream)-->
<!--  audioChunks = []-->

<!--  mediaRecorder.ondataavailable = event => {-->
<!--    if (event.data.size > 0) {-->
<!--      audioChunks.push(event.data)-->
<!--    }-->
<!--  }-->

<!--  mediaRecorder.start()-->
<!--}-->

<!--const stopAudioRecording = (): Promise<Blob> => {-->
<!--  return new Promise(resolve => {-->
<!--    if (mediaRecorder) {-->
<!--      mediaRecorder.onstop = () => {-->
<!--        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })-->
<!--        resolve(audioBlob)-->
<!--      }-->
<!--      mediaRecorder.stop()-->
<!--    } else {-->
<!--      resolve(new Blob())-->
<!--    }-->
<!--  })-->
<!--}-->
<!--const packageAudioAndText = async (audioBlob: Blob, transcript: string): Promise<Blob> => {-->
<!--  const textEncoder = new TextEncoder()-->
<!--  const textData = textEncoder.encode(transcript)-->

<!--  const combined = new Blob([-->
<!--    new Uint8Array([textData.length >> 8, textData.length & 0xff]), // 2字节长度头-->
<!--    textData,-->
<!--    audioBlob-->
<!--  ], { type: 'application/octet-stream' })-->

<!--  return combined-->
<!--}-->

<!--const toggleCamera = () => {-->
<!--  isCameraOn.value = !isCameraOn.value-->
<!--}-->
<!--const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()-->
<!--recognition.continuous = true-->
<!--recognition.lang = 'zh-CN'-->

<!--recognition.onresult = (event: SpeechRecognitionEvent) => {-->
<!--  const transcript = event.results[event.results.length - 1][0].transcript-->
<!--  console.log('语音转文本：', transcript)-->
<!--  //currentEmotion.value = transcript-->
<!--  analyzeEmotion({ transcript }).then(emotion => {-->
<!--    currentEmotion.value = emotion-->
<!--  })-->
<!--}-->

<!--const captureImageFromVideo = (video: HTMLVideoElement): HTMLCanvasElement => {-->
<!--  const canvas = document.createElement('canvas')-->
<!--  canvas.width = video.videoWidth-->
<!--  canvas.height = video.videoHeight-->
<!--  const ctx = canvas.getContext('2d')-->
<!--  if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)-->
<!--  return canvas-->
<!--}-->
<!--const analyzeEmotion = async ({-->
<!--                                imageDataUrl,-->
<!--                                transcript-->
<!--                              }: {-->
<!--  imageDataUrl?: string-->
<!--  transcript?: string-->
<!--}) => {-->
<!--  // 示例：实际替换为后端API调用-->
<!--  const response = await fetch('/api/emotion-analyze', {-->
<!--    method: 'POST',-->
<!--    body: JSON.stringify({ image: imageDataUrl, text: transcript }),-->
<!--    headers: { 'Content-Type': 'application/json' }-->
<!--  })-->

<!--  const result = await response.json()-->
<!--  return result.emotion || '未知'-->
<!--}-->

<!--const startSpeechRecognition = () => {-->
<!--  try {-->
<!--    recognition.start()-->
<!--  } catch (e) {-->
<!--    console.warn('语音识别启动失败', e)-->
<!--  }-->
<!--}-->
<!--const bg='src/parents-client/assets/bk.jpeg'-->
<!--const backgroundStyle = {-->
<!--  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87, 157, 208, 0.2) 80%), url(${bg})`,-->
<!--  backgroundSize: 'cover',-->
<!--  backgroundPosition: 'center',-->
<!--  backgroundRepeat: 'no-repeat'-->
<!--}-->
<!--const onClick = ()=> {-->
<!--  router.push('/children-routes')-->
<!--}-->
<!--</script>-->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount} from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
const router = useRouter()
// 情绪对应表情
const emotionMap: Record<string, string> = {
  angry: '😠',
  disgust: '🤢',
  fear: '😱',
  happy: '😄',
  neutral: '😐',
  sad: '😢',
  surprise: '😲'
}

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const maxEmotionName = ref('')
const maxEmotionValue = ref(0)
const maxEmotionEmoji = ref('')

const videoElem = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const isCameraOn = ref(false)
const error = ref('')

let captureInterval: number | null = null

// 初始化echarts实例和图表配置
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
  }
  // 初始化空数据
  updateChart({})
}

// 根据情绪数据更新图表和顶部最大情绪显示
const updateChart = (data: Record<string, number>) => {
  if (!data || Object.keys(data).length === 0) {
    // 清空图表
    chartInstance?.clear()
    maxEmotionName.value = ''
    maxEmotionValue.value = 0
    maxEmotionEmoji.value = ''
    return
  }

  // 找最大情绪
  const maxEntry = Object.entries(data).reduce((prev, curr) =>
      curr[1] > prev[1] ? curr : prev
  )
  maxEmotionName.value = maxEntry[0]
  maxEmotionValue.value = maxEntry[1]
  maxEmotionEmoji.value = emotionMap[maxEntry[0]] || ''

  // 转换数据格式给echarts
  const categories = Object.keys(data).map(key => emotionMap[key] || key)
  const values = Object.values(data).map(v => parseFloat(v.toFixed(2)))

  const option = {
    xAxis: {
      type: 'category',
      data: categories,
      axisTick: { alignWithLabel: true },
      axisLabel: { fontSize: 24 }
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [{
      data: values,
      type: 'bar',
      itemStyle: {
        color: '#5470C6'
      },
      barWidth: '40%'
    }],
    animationDurationUpdate: 500
  }

  chartInstance?.setOption(option)
}

// 抓取当前视频帧图像
const captureImageFromVideo = (video: HTMLVideoElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas
}

// 发送图片到后端识别情绪（返回整套情绪概率）
const analyzeEmotion = async ({ imageDataUrl }: { imageDataUrl: string }) => {
  try {
    const blob = await fetch(imageDataUrl).then(res => res.blob())
    const formData = new FormData()
    formData.append('file', blob, 'frame.jpg')

    const response = await fetch('http://localhost:5001/spark/api/child/emotion-analyze', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    // 期望 result 结构类似：
    // { angry: 0.68, disgust: 0.000004, fear: 9.3, happy: 0.4, neutral: 87.4, sad: 2.1, surprise: 0.01 }
    return result
  } catch (e) {
    console.error('情绪分析失败：', e)
    return {}
  }
}

// 摄像头开关监听
watch(isCameraOn, async (val) => {
  error.value = ''
  if (val) {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      if (videoElem.value) {
        videoElem.value.srcObject = stream.value
      }

      // 每3秒抓图识别
      captureInterval = window.setInterval(async () => {
        if (videoElem.value) {
          const canvas = captureImageFromVideo(videoElem.value)
          const imageDataUrl = canvas.toDataURL('image/jpeg')
          const emotionData = await analyzeEmotion({ imageDataUrl })
          if (emotionData && Object.keys(emotionData).length > 0) {
            updateChart(emotionData)
          }
        }
      }, 3000)

    } catch (err: any) {
      console.error('无法打开摄像头：', err)
      error.value = '摄像头权限被拒绝或设备错误'
      isCameraOn.value = false
    }
  } else {
    stopCamera()
  }
})

// 停止摄像头和清理
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  if (videoElem.value) {
    videoElem.value.srcObject = null
  }
  if (captureInterval !== null) {
    clearInterval(captureInterval)
    captureInterval = null
  }
  updateChart({}) // 清空图表
  error.value = ''
}

const toggleCamera = () => {
  isCameraOn.value = !isCameraOn.value
}

// 页面挂载时初始化图表
onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  stopCamera()
})
const onClick = ()=> {
  router.push('/children-routes')
}

// 背景样式
const bg = 'src/children-client/assets/bk.jpeg'
const backgroundStyle = {
  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87, 157, 208, 0.2) 80%), url('${bg}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  padding: '20px',
  boxSizing: 'border-box'
}
</script>


<style scoped>

.main{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%;
  height: 80%;
  display: flex;
  flex-direction: row;
  transform: translate(-50%, -50%);
  background: rgba(217, 217, 217, 0.14);
  border-radius: 30px;


}
.video-container {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.video-frame {
  width: 100%;
  max-width: 480px;
  height: 300px;
  border-radius: 12px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
:deep(.n-card) {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

:deep(.n-card__header) {
  color: #fff;
}

:deep(.n-button) {
  font-weight: bold;
}
.camera{
  width:35%;
  position: absolute;
  top: 15%;
  left: 70%;
  transform: translate(-20%, -20%);
  font-size: 40px;
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.emo{
  width:50%;
  height:70%;
  position: absolute;
  top: 20%;
  left: 10%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
    color: navajowhite;
    font-family: "ZCOOL KuaiLe", sans-serif;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  .btn:hover {
    background-color: rgb(255, 191, 127);
  }
  .btn:active {
    transform: scale(0.97);
  }
  .zi{
    color: antiquewhite;
    font-size: 30px;
    font-family: "ZCOOL KuaiLe", sans-serif;
    font-weight: 400;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

</style>