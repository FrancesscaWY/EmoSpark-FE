<template>
  <div class="child-growth-container">
    <div class="section-title">儿童互动</div>
    
    <!-- 下拉列表选择儿童 -->
    <div class="child-selector">
      <n-select
        v-model:value="selectedChild"
        :options="childrenOptions"
        placeholder="请选择儿童"
        @update:value="handleChildSelect"
      />
    </div>

    <!-- 儿童信息 -->
    <div class="child-info-card" v-if="selectedChild">
      <div class="child-info-panel">
        <!-- 显示这个头像图片；没有值的话，显示头像+孩子名字的首字母 -->
        <div class="child-avatar">
          <img v-if="selectedChildInfo.avatar" :src="selectedChildInfo.avatar" alt="头像" />
          <n-avatar v-else round size="large">{{ selectedChildInfo.name?.charAt(0) || '?' }}</n-avatar>
        </div>
        <div class="child-details">
          <div class="info-item">
            <span class="label">姓名:</span>
            <span class="value">{{ selectedChildInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">年龄:</span>
            <span class="value">{{ selectedChildInfo.age }}岁</span>
          </div>
          <div class="info-item">
            <span class="label">EmoSpark用龄:</span>
            <!-- 注册日 -->
            <span class="value">{{ selectedChildInfo.treatmentDuration }}</span>
          </div>
        </div>
      </div>

      <div class="interaction-content">
        <div class="control-buttons">
          <n-button
            type="primary"
            :disabled="isTrainingActive"
            @click="startTraining"
            class="control-button"
          >
            <template #icon><n-icon><play-circle-outlined /></n-icon></template>
            <span class="button-text">开始互动</span>
          </n-button>
          
          <n-button
            type="info"
            :disabled="!isTrainingActive"
            @click="sendQuestionToChild"
            class="control-button"
          >
            <template #icon><n-icon><question-circle-outlined /></n-icon></template>
            <span class="button-text">发送提问</span>
          </n-button>
          
          <n-button
            type="error"
            :disabled="!isTrainingActive"
            @click="endTraining"
            class="control-button"
          >
            <template #icon><n-icon><stop-outlined /></n-icon></template>
            <span class="button-text">结束互动</span>
          </n-button>
        </div>

        <div class="content-grid">
          <!-- 互动记录 -->
          <div class="chat-container">
            <div class="chat-header">
              <h3>互动记录</h3>
              <n-button text @click="clearChatHistory" size="small">
                清空记录
              </n-button>
            </div>

            <div class="chat-messages" ref="chatMessagesRef">
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                class="message-container"
                :class="{ 'message-right': message.sender === 'parent', 'message-left': message.sender !== 'parent' }"
              >
                <!---气泡布局 -->
                <div class="message-bubble" :class="`bubble-${message.sender}`">
                  <!-- 头像部分 -->
                  <div class="bubble-avatar">
                    <n-avatar 
                      round 
                      size="small" 
                      :style="{ backgroundColor: getSenderColor(message.sender) }"
                    >
                      {{ getSenderInitial(message.sender, selectedChildInfo.name) }}
                    </n-avatar>
                  </div>
                  
                  <!-- 消息内容部分 -->
                  <div class="bubble-content">
                    <!-- 发送者姓名和时间并排 -->
                    <div class="bubble-header">
                      <div class="sender-name">{{ getSenderName(message.sender, selectedChildInfo.name) }}</div>
                      <div class="message-time">{{ message.time }}</div>
                    </div>
                    
                    <!-- 消息内容 -->
                    <div class="message-text">
                      <div v-if="message.type === 'result'" class="result-message">
                        <!-- 正确绿色icon，错误红色icon，content内容可以改 -->
                        {{ message.content }}
                        <n-icon :color="message.isCorrect ? '#18A058' : '#F44336'" size="16">
                          <check-outlined v-if="message.isCorrect" />
                          <close-outlined v-else />
                        </n-icon>
                      </div>
                      <div v-else>
                        {{ message.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <n-input
                v-model:value="messageInput"
                type="text"
                placeholder="输入备注内容..."
                @keyup.enter="sendMessage"
              />
              <n-button type="primary" @click="sendMessage" :disabled="!isTrainingActive">
                备注
              </n-button>
            </div>
          </div>

          <!-- 互动统计 -->
          <div class="training-stats">
            <div class="stats-header">
              <h3>互动统计</h3>
              <n-button text @click="resetStats" size="small">
                清零统计
              </n-button>
            </div>
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-label">正确率</div>
                <!-- 不同正确率的显示颜色 -->
                <n-progress
                  type="circle"
                  :percentage="correctRate"
                  :color="correctRate > 70 ? '#18A058' : '#F0A020'"
                  :height="80"
                />
              </div>
              <div class="stat-item">
                <div class="stat-label">互动时间</div>
                <!-- 调用时钟来计时 -->
                <div class="stat-value">{{ formatTime(trainingTime) }}</div>
              </div>
            </div>
            <div class="stats-details">
              <div class="stats-row">
                <span>提问次数:</span>
                <span>{{ questionCount }}</span>
              </div>
              <div class="stats-row">
                <span>回答次数:</span>
                <span>{{ completedCount }}</span>
              </div>
              <div class="stats-row">
                <span>正确回答:</span>
                <span>{{ correctCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有孩子的时候显示空白页面，点击管理儿童信息跳转到对应页面 -->
    <div class="no-child-selected" v-else>
      <n-empty description="请先选择一个孩子开始互动">
        <template #extra>
          <n-button type="primary" @click="goToChildInfo">
            管理儿童信息
          </n-button>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
// 路由设置
import { useRouter } from 'vue-router';
import { 
  NSelect, 
  NButton, 
  NAvatar, 
  NIcon, 
  NProgress, 
  NInput, 
  NEmpty 
} from 'naive-ui';
// 图标接入
import { 
  StopOutlined, 
  CheckOutlined, 
  CloseOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined
} from '@vicons/antd';

// 孩子信息的一个接口！！
interface ChildInfo {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  treatmentDuration: string;
}

interface ChatMessage {
  content: string;
  sender: 'child' | 'parent' | 'system';
  time: string;
  type: 'text' | 'result';
  isCorrect?: boolean;
}

export default defineComponent({
  name: 'ChildInteraction',
  components: {
    NSelect,
    NButton,
    NAvatar,
    NIcon,
    NProgress,
    NInput,
    NEmpty,
    StopOutlined,
    CheckOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    QuestionCircleOutlined
  },
  setup() {
    const router = useRouter();
    const selectedChild = ref<string | null>(null);
    const isTrainingActive = ref(false);
    const messageInput = ref('');
    const chatMessagesRef = ref<HTMLDivElement | null>(null);
    
    // 7种情绪对应标签
    const emotionLabels = {
      'happy': '快乐',
      'sad': '悲伤',
      'angry': '生气',
      'surprised': '惊讶',
      'fear': '恐惧',
      'disgust': '厌恶',
      'neutral': '没有情绪'
    };

    // 儿童数据
    const children = reactive<ChildInfo[]>([
      { id: '1', name: 'BEVERLY', age: 7, treatmentDuration: '1年' },
      { id: '2', name: 'EVA', age: 9, treatmentDuration: '6个月' },
    ]);

    const childrenOptions = computed(() => {
      return children.map(child => ({
        label: child.name,
        value: child.id
      }));
    });
    // 动态寻找孩子信息
    const selectedChildInfo = computed(() => {
      return children.find(child => child.id === selectedChild.value) || {} as ChildInfo;
    });

    const chatMessages = ref<ChatMessage[]>([]);
    
    // 互动相关状态 - 统计信息
    const correctCount = ref(0);
    const completedCount = ref(0);
    const questionCount = ref(0);
    const trainingTime = ref(0);
    const trainingTimer = ref<number | null>(null);
    
    const correctRate = computed(() => {
      if (completedCount.value === 0) return 0;
      return Math.round((correctCount.value / completedCount.value) * 100);
    });
    const getSenderName = (sender: string, childName: string) => {
      if (sender === 'system') return 'EmoSpark';
      if (sender === 'child') return childName || '儿童';
      return '家长';
    };
    // 获取发送者对应的颜色
    const getSenderColor = (sender: string) => {
      const colors = {
        system: '#1976D2',  // EmoSpark蓝色
        child: '#4CAF50',   // 儿童绿色
        parent: '#9C27B0'   // 家长紫色
      };
      return colors[sender as keyof typeof colors] || '#888888';
    };

    // 获取发送者头像首字母
    const getSenderInitial = (sender: string, childName: string) => {
      if (sender === 'system') return 'E';  // EmoSpark
      if (sender === 'child') return childName?.charAt(0) || 'C';
      return 'P';  // Parent
    };

    // 获取气泡样式类
    const getBubbleClass = (sender: string) => {
      return `bubble-${sender}`;
    };

    // 选择孩子时的处理
    const handleChildSelect = (childId: string) => {
      selectedChild.value = childId;
      if (isTrainingActive.value) {
        endTraining();
      }
      chatMessages.value = [];
      resetTrainingStats();
      
      // 加载已有的互动记录
      loadTrainingHistory(childId);
      
      // 保存默认选择的儿童ID到本地存储
      localStorage.setItem('defaultChildId', childId);
    };

    // 加载互动历史记录
    const loadTrainingHistory = (childId: string) => {
      // 在实际应用中，这里应该从API获取数据
      const now = new Date();
      const historyTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setTimeout(() => {
        addSystemMessage(`加载 ${selectedChildInfo.value.name} 的互动历史记录`);
      }, 500);
    };
    // 跳转到孩子信息的页面
    const goToChildInfo = () => {
      router.push({ name: 'childManagement' });
    };

    // 开始互动
    const startTraining = () => {
      isTrainingActive.value = true;
      addSystemMessage('开始情绪识别互动 - 已连接儿童端');
      startTrainingTimer();
    };

    // 结束互动
    const endTraining = () => {
      isTrainingActive.value = false;
      stopTrainingTimer();
      addSystemMessage(`结束互动，本次正确率: ${correctRate.value}%`);
      
      // 保存互动结果
      saveTrainingResults();
    };

    // 清零统计
    const resetStats = () => {
      // 先记录当前值用于消息
      const prevCorrectRate = correctRate.value;
      const prevQuestionCount = questionCount.value;
      const prevCompletedCount = completedCount.value;
      
      // 重置统计数据
      resetTrainingStats();
      
      // 添加系统消息
      addSystemMessage(`统计已清零 - 上次统计: 正确率 ${prevCorrectRate}%, 题目数 ${prevCompletedCount}/${prevQuestionCount}`);
    };

    // 发送情绪提问
    const sendQuestionToChild = () => {
      if (!isTrainingActive.value) return;
      
      questionCount.value++;
      const now = new Date();
      const messageTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      chatMessages.value.push({
        content: "已向儿童发送情绪识别提问",
        sender: 'parent',
        time: messageTime,
        type: 'text'
      });
      
      scrollChatToBottom();
      
      // 模拟儿童回答
      simulateChildResponse();
    };

    // 模拟儿童回答情绪提问
    const simulateChildResponse = () => {
      // 这里模拟儿童回答，实际应用中应该是等待儿童端的响应
      setTimeout(() => {
        const emotionKeys = Object.keys(emotionLabels);
        const selectedEmotion = emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
        const correctEmotion = Math.random() > 0.3 ? selectedEmotion : emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
        const isCorrect = selectedEmotion === correctEmotion;
        
        completedCount.value++;
        if (isCorrect) {
          correctCount.value++;
        }
        
        // 先添加儿童的选择消息
        const now = new Date();
        chatMessages.value.push({
          content: `儿童选择了情绪: ${getEmotionLabel(selectedEmotion)}`,
          sender: 'child',
          time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
          type: 'text'
        });
        
        scrollChatToBottom();
        
        // 然后添加系统结果消息
        setTimeout(() => {
          addResultMessage(selectedEmotion, correctEmotion, isCorrect);
        }, 500);
      }, 2000);
    };

    // 保存互动结果
    const saveTrainingResults = () => {
      // 在实际应用中，这里应该调用API保存数据
      console.log('保存互动结果:', {
        childId: selectedChild.value,
        correctRate: correctRate.value,
        trainingTime: trainingTime.value,
        completedExercises: completedCount.value,
        questionCount: questionCount.value
      });
      
      // 添加系统消息提示保存成功
      setTimeout(() => {
        addSystemMessage('互动结果已保存');
      }, 1000);
    };

    // 计时器相关函数
    const startTrainingTimer = () => {
      trainingTimer.value = window.setInterval(() => {
        trainingTime.value++;
      }, 1000);
    };

    const stopTrainingTimer = () => {
      if (trainingTimer.value !== null) {
        clearInterval(trainingTimer.value);
        trainingTimer.value = null;
      }
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 重置互动统计
    const resetTrainingStats = () => {
      correctCount.value = 0;
      completedCount.value = 0;
      questionCount.value = 0;
      trainingTime.value = 0;
    };

    // 发送消息
    const sendMessage = () => {
      if (!messageInput.value.trim() || !isTrainingActive.value) return;
      
      const now = new Date();
      const messageTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      chatMessages.value.push({
        content: messageInput.value,
        sender: 'parent',
        time: messageTime,
        type: 'text'
      });
      
      messageInput.value = '';
      scrollChatToBottom();
      
      // 根据消息内容可能触发儿童回应
      setTimeout(() => {
        // 随机决定是否有儿童回应
        if (Math.random() < 0.4) {
          const responses = ['谢谢爸爸/妈妈！', '我会继续加油的！', '我喜欢这个游戏！', '我感觉自己进步了！'];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const replyTime = new Date();
          chatMessages.value.push({
            content: randomResponse,
            sender: 'child',
            time: `${replyTime.getHours()}:${String(replyTime.getMinutes()).padStart(2, '0')}`,
            type: 'text'
          });
          
          scrollChatToBottom();
        }
      }, 1500);
    };

    // 添加系统消息
    const addSystemMessage = (message: string) => {
      const now = new Date();
      chatMessages.value.push({
        content: message,
        sender: 'system',
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        type: 'text'
      });
      
      scrollChatToBottom();
    };

    // 添加结果消息
    const addResultMessage = (selected: string, correct: string, isCorrect: boolean) => {
      const now = new Date();
      let content = isCorrect 
        ? `选择了正确的情绪: ${getEmotionLabel(selected)}` 
        : `选择了 ${getEmotionLabel(selected)}, 正确答案是: ${getEmotionLabel(correct)}`;
      
      chatMessages.value.push({
        content,
        sender: 'system',
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        type: 'result',
        isCorrect
      });
      
      scrollChatToBottom();
    };

    // 清空聊天记录并重置互动时长
    const clearChatHistory = () => {
      chatMessages.value = [];
      
      if (isTrainingActive.value) {
        addSystemMessage('互动记录已清空');
      }
    };

    // 滚动聊天区域到底部
    const scrollChatToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
        }
      });
    };

    // 获取情绪标签
    const getEmotionLabel = (value: string) => {
      return emotionLabels[value as keyof typeof emotionLabels] || value;
    };

    // 组件挂载
    onMounted(() => {
      // 检查是否有默认选择的儿童
      const defaultChildId = localStorage.getItem('defaultChildId');
      if (defaultChildId) {
        selectedChild.value = defaultChildId;
        loadTrainingHistory(defaultChildId);
      }
    });

    // 组件卸载前清理
    onBeforeUnmount(() => {
      if (isTrainingActive.value) {
        endTraining();
      }
    });

    return {
      selectedChild,
      childrenOptions,
      selectedChildInfo,
      isTrainingActive,
      messageInput,
      chatMessages,
      chatMessagesRef,
      correctRate,
      completedCount,
      questionCount,
      trainingTime,
      correctCount,
      
      handleChildSelect,
      goToChildInfo,
      startTraining,
      endTraining,
      sendQuestionToChild,
      sendMessage,
      clearChatHistory,
      formatTime,
      resetStats,
      
      // 新增的方法
      getSenderColor,
      getSenderInitial,
      getBubbleClass,
      getSenderName
    };
  }
});
</script>

<style scoped>
.child-growth-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.child-selector {
  margin-bottom: 20px;
  width: 200px;
  max-width: 100%;
}

.child-info-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.child-info-panel {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.child-avatar {
  margin-right: 20px;
  margin-bottom: 10px;
}

.child-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.child-details {
  flex: 1;
  min-width: 200px;
}

.info-item {
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
}

.label {
  font-weight: bold;
  width: 160px;
  min-width: 80px;
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.control-button {
  flex: 1;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  display: inline-block;
  margin-left: 5px;
}

.bubble-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

/* 内容布局为网格 */
.content-grid {
  display: grid;
  grid-template-columns: 60% 38%;
  gap: 20px;
  min-height: 400px;
}

/* 互动记录在左侧 */
.message-container {
  margin-bottom: 16px;
  display: flex;
  width: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sender-name {
  font-weight: bold;
  font-size: 13px;
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 10px;
  height: 380px;
}

/* 新的消息样式 */
.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.message-avatar {
  margin-bottom: 4px;
}

.message-bubble {
  display: flex;
  max-width: 85%;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  position: relative;
}

/* 不同发送者的气泡样式 */
.bubble-system {
  background-color: #E3F2FD;
  border: 1px solid #BBDEFB;
}

.bubble-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  display: flex;
  flex-direction: column;
}

.bubble-child {
  background-color: #E8F5E9;
  border: 1px solid #C8E6C9;
}

.bubble-parent {
  background-color: #F3E5F5;
  border: 1px solid #E1BEE7;
}

.bubble-avatar {
  margin-right: 10px; 
  align-self: flex-start;
  padding-top: 2px;
}

.message-text {
  word-break: break-word;
  font-size: 14px;
}

/* 结果消息 */
.result-message {
  display: flex;
  align-items: center;
  gap: 5px;
}

.message-right {
  justify-content: flex-end;
}

.message-left {
  justify-content: flex-start;
}

.message-time {
  font-size: 11px;
  color: #888888;
  margin: 0;
}

.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  height: 40px;
}

/* 互动统计在右侧 */
.training-stats {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  height: 480px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-label {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976D2;
}

.stats-details {
  margin-top: 20px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.no-child-selected {
  padding: 30px;
  text-align: center;
}

/* 媒体查询：响应式布局 */

/* 大屏幕 - 默认布局 */

/* 中等屏幕 - 992px以下 */
@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .training-stats {
    height: auto;
    min-height: auto;
    padding-bottom: 20px;
  }
  
  .stats-container {
    justify-content: space-between;
  }
}

/* 平板屏幕 - 768px以下 */
@media (max-width: 768px) {
  .child-growth-container {
    padding: 0 10px;
  }
  
  .child-info-panel {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .child-avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .child-details {
    width: 100%;
  }
  
  .info-item {
    justify-content: center;
  }
  
  .label {
    width: auto;
    margin-right: 10px;
  }
  
  .chat-messages {
    height: 320px;
  }
  
  .control-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .control-button {
    min-width: 120px;
  }
}

/* 手机屏幕 - 576px以下 */
@media (max-width: 576px) {
  .section-title {
    font-size: 18px;
    text-align: center;
  }
  
  .child-selector {
    width: 100%;
  }
  
  .child-info-card {
    padding: 15px 10px;
  }
  
  .control-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .control-button {
    width: 100%;
  }
  
  .chat-messages {
    height: 280px;
    padding: 8px;
  }
  
  .message-bubble {
    max-width: 95%;
    padding: 6px 10px;
  }
  
  .bubble-avatar {
    margin-right: 6px;
  }
  
  .sender-name {
    font-size: 12px;
  }
  
  .message-text {
    font-size: 13px;
  }
  
  .chat-input {
    flex-direction: column;
    height: auto;
    gap: 5px;
  }
  
  .chat-input .n-button {
    width: 100%;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 25px;
  }
  
  .stat-item {
    width: 100%;
  }
}

/* 超小屏幕 - 400px以下 */
@media (max-width: 400px) {
  .child-info-panel {
    padding: 10px 5px;
  }
  
  .chat-messages {
    height: 250px;
  }
  
  .message-bubble {
    max-width: 98%;
    padding: 5px 8px;
  }
  
  .message-text {
    font-size: 12px;
  }
  
  .bubble-avatar {
    display: none; /* 在极小屏幕上隐藏头像以节省空间 */
  }
}
</style>