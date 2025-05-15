import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'

// 路由与通知
const route = useRoute()
const message = useMessage()

// 儿童基本信息
const name = ref(route.query.name as string)
const age = ref(Number(route.query.age))
const gender = ref(route.query.gender as string)
const phone = ref(route.query.phone as string)

// 表情包列表
const EMOJIS = ['😊 快乐', '😢 悲伤', '😱 恐惧', '😡 生气', '😲 驚訝', '😖 厌恶', '😐 没有情绪']

// 聊天记录与状态
const interactions = ref<ChatMessage[]>([])
const isAsking = ref(false)
const autoAsk = ref(false)
const childHasAnswered = ref(false)

// 时间设置（系统反馈 / 自动提问）
const feedbackMinutes = ref(1)
const feedbackSeconds = ref(0)
const feedbackInterval = ref(60)
const askMinutes = ref(2)
const askSeconds = ref(0)
const askInterval = ref(120)

// 头像
const systemAvatar = 'https://i.imgur.com/SystemIcon.png'
const childAvatar = 'https://i.imgur.com/ChildIcon.png'

// 定时器
let askTimer: ReturnType<typeof setTimeout> | null = null
// let feedbackTimer: NodeJS.Timeout | null = null

// 类型定义
interface ChatMessage {
    role: 'child' | 'system'
    content: string
    timestamp: number
    isEmoji: boolean
}

interface ChildDisplayItem {
    type: 'timestamp' | 'message'
    content: string
    role?: 'child' | 'system'
    isEmoji?: boolean
    timestamp?: number
}

// 设置系统反馈间隔
const setFeedbackInterval = () => {
    feedbackInterval.value = feedbackMinutes.value * 60 + feedbackSeconds.value
}

const resetFeedbackInterval = () => {
    feedbackMinutes.value = 1
    feedbackSeconds.value = 0
    setFeedbackInterval()
}

// 设置提问间隔
const setAskInterval = () => {
    askInterval.value = askMinutes.value * 60 + askSeconds.value
}

const resetAskInterval = () => {
    askMinutes.value = 2
    askSeconds.value = 0
    setAskInterval()
}

// 添加消息
const addMessage = (msg: string) => {
    interactions.value.push({
        role: 'system',
        content: msg,
        timestamp: Date.now(),
        isEmoji: false
    })
}

// 添加儿童回答
const addChildMessage = (emoji: string) => {
    interactions.value.push({
        role: 'child',
        content: emoji,
        timestamp: Date.now(),
        isEmoji: true
    })
    childHasAnswered.value = true
}

// 添加系统反馈
const addSystemResponse = (emoji: string, isEmoji = false) => {
    interactions.value.push({
        role: 'system',
        content: emoji,
        timestamp: Date.now(),
        isEmoji
    })
    childHasAnswered.value = false
}

// 生成格式化聊天列表
const formattedInteraction = computed(() => {
    const result: ChildDisplayItem[] = []
    let lastTimestamp = 0
    interactions.value.forEach((msg) => {
        if (msg.timestamp - lastTimestamp >= 300000 || result.length === 0) {
            result.push({
                type: 'timestamp',
                content: dayjs(msg.timestamp).format('YYYY-MM-DD HH:mm')
            })
            lastTimestamp = msg.timestamp
        }
        result.push({
            type: 'message',
            role: msg.role,
            content: msg.content,
            isEmoji: msg.isEmoji,
            timestamp: msg.timestamp
        })
    })
    return result
})

// 开始提问
const startAsking = () => {
    isAsking.value = true
    addMessage('👩‍⚕️ 开始提问...')

    setTimeout(() => {
        simulateChildResponse()
    }, 3000)
}

// 模拟儿童回答与系统反馈
const simulateChildResponse = () => {
    const childEmotion = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    addChildMessage(`🧒 ${childEmotion}`)
    isAsking.value = false

    setTimeout(() => {
        const systemEmotion = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
        addSystemResponse('做的不错！👏')
        setTimeout(() => {
            addSystemResponse(systemEmotion, true)
        }, 1000)
    }, 3000)
}

// 自动提问逻辑
onMounted(() => {
    watch(autoAsk, (val) => {
        if (val) {
            askTimer = setInterval(() => {
                if (!isAsking.value) startAsking()
            }, askInterval.value * 1000)
        } else if (askTimer) {
            clearInterval(askTimer)
        }
    })
})

// 结束治疗
const endTreatment = () => {
    autoAsk.value = false
    askTimer && clearInterval(askTimer)
    message.success('治疗已结束')
}

export {
    name,
    age,
    gender,
    phone,
    EMOJIS,
    isAsking,
    autoAsk,
    feedbackMinutes,
    feedbackSeconds,
    askMinutes,
    askSeconds,
    setFeedbackInterval,
    resetFeedbackInterval,
    setAskInterval,
    resetAskInterval,
    interactions,
    formattedInteraction,
    startAsking,
    endTreatment,
    childAvatar,
    systemAvatar
}
