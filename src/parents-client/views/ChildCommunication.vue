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
			  <!-- 这里可以根据注册时间定义 -->
            <span class="label">Emospark用龄:</span>
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
		  <!-- 点击后开始计时 -->
            <template #icon><n-icon><play-circle-outlined /></n-icon></template>
            开始互动
          </n-button>
          <n-button
            type="error"
            :disabled="!isTrainingActive"
            @click="endTraining"
            class="control-button"
          >
            	  <!-- 点击后结束计时 --><template #icon><n-icon><stop-outlined /></n-icon></template>
            结束互动
          </n-button>
        </div>

        <div class="content-grid">
          <!-- 训练互动模块 -->
          <div class="video-container">
            <div v-if="isTrainingActive" class="video-status">
              <n-icon size="48" color="#18A058"><check-circle-outlined /></n-icon>
              <p>儿童正在进行情绪互动，您可以通过聊天功能进行鼓励和指导</p>
            </div>
            <div v-else class="video-placeholder">
              <n-icon size="48"><smile-outlined /></n-icon>
              <p>点击"开始互动"启动情绪互动</p>
            </div>
          </div>

          <!-- 互动统计 -->
          <div class="training-stats">
            <h3>互动统计</h3>
            <div class="stats-container">
              <div class="stat-item">
				  <!-- 正确率由大模型判断！！！ -->
                <div class="stat-label">正确率</div>
                <n-progress
                  type="circle"
                  :percentage="correctRate"
                  :color="correctRate > 70 ? '#18A058' : '#F0A020'"
                  :height="80"
                />
              </div>
              <div class="stat-item">
                <div class="stat-label">互动时间</div>
                <div class="stat-value">{{ formatTime(trainingTime) }}</div>
              </div>
            </div>
          </div>

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
                :class="['message', message.sender === 'parent' ? 'message-sent' : 'message-received']"
              >
                <div class="message-content">
                  <div v-if="message.type === 'result'" class="result-message">
                    {{ message.content }}
                    <n-icon :color="message.isCorrect ? '#18A058' : '#F44336'" size="16">
                      <check-outlined v-if="message.isCorrect" />
                      <close-outlined v-else />
                    </n-icon>
                  </div>
                  <div v-else class="text-message">
                    {{ message.content }}
                  </div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
            </div>
<!-- 这里是家长可以通过打字鼓励孩子，也可以通过聊天框记录当时想法或者其他的记录，可以删除 -->
            <div class="chat-input">
              <n-input
                v-model:value="messageInput"
                type="text"
                placeholder="输入鼓励的话..."
                @keyup.enter="sendMessage"
              />
              <n-button type="primary" @click="sendMessage" :disabled="!isTrainingActive">
                发送
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>

<!-- 没有孩子的时候显示空白页面，如下 -->
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
import { defineComponent, ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
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
import { 
  StopOutlined, 
  CheckOutlined, 
  CloseOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  SmileOutlined
} from '@vicons/antd';

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
  name: 'ParentEmotionTraining',
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
    SmileOutlined
  },
  setup() {
    const router = useRouter();
    const selectedChild = ref<string | null>(null);
    const isTrainingActive = ref(false);
    const messageInput = ref('');
    const chatMessagesRef = ref<HTMLDivElement | null>(null);
    
    // 7种情绪对应标签？？？
    const emotionLabels = {
      'happy': '快乐',
      'sad': '悲伤',
      'angry': '恐惧',
      'surprised': '生气',
      'fear': '惊讶',
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

    const selectedChildInfo = computed(() => {
      return children.find(child => child.id === selectedChild.value) || {} as ChildInfo;
    });

    const chatMessages = ref<ChatMessage[]>([]);
    
    // 互动相关状态 - 统计信息
    const correctCount = ref(0);
    const completedCount = ref(0);
    const trainingTime = ref(0);
    const trainingTimer = ref<number | null>(null);
    
    const correctRate = computed(() => {
      if (completedCount.value === 0) return 0;
      return Math.round((correctCount.value / completedCount.value) * 100);
    });

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
      // ！！！在实际应用中，这里应该从API获取数据
      const now = new Date();
      const historyTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setTimeout(() => {
        addSystemMessage(`加载 ${selectedChildInfo.value.name} 的互动历史记录`);
      }, 500);
    };

    const goToChildInfo = () => {
      router.push({ name: 'childManagement' });
    };

    // 开始互动
    const startTraining = () => {
      isTrainingActive.value = true;
      addSystemMessage('开始情绪识别互动');
      startTrainingTimer();
      
      // 模拟接收儿童客户端的互动结果
      simulateChildTraining();
    };

    // 结束互动
    const endTraining = () => {
      isTrainingActive.value = false;
      stopTrainingTimer();
      addSystemMessage(`结束互动，本次正确率: ${correctRate.value}%`);
      
      // 停止模拟
      stopSimulation();
      
      // 保存互动结果
      saveTrainingResults();
    };

    // 保存互动结果
    const saveTrainingResults = () => {
      // 在实际应用中，这里应该调用API保存数据
      console.log('保存互动结果:', {
        childId: selectedChild.value,
        correctRate: correctRate.value,
        trainingTime: trainingTime.value,
        completedExercises: completedCount.value
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
	// 重置聊天框中的内容和时间记录
    const resetTrainingStats = () => {
      correctCount.value = 0;
      completedCount.value = 0;
      trainingTime.value = 0;
    };

    // 模拟变量!!!!
    let simulationTimer: number | null = null;
    
    // 模拟儿童客户端互动过程
    const simulateChildTraining = () => {
      // 每隔一段时间模拟收到一次互动结果
      simulationTimer = window.setInterval(() => {
        if (completedCount.value >= 10) {
          addSystemMessage(`互动完成！总正确率: ${correctRate.value}%`);
          setTimeout(() => endTraining(), 1000);
          return;
        }
        
        // 模拟一次结果
        const emotionKeys = Object.keys(emotionLabels);
        const selectedEmotion = emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
        const correctEmotion = Math.random() > 0.3 ? selectedEmotion : emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
        const isCorrect = selectedEmotion === correctEmotion;
        
        completedCount.value++;
        if (isCorrect) {
          correctCount.value++;
        }
        
        // 添加结果消息
        addResultMessage(selectedEmotion, correctEmotion, isCorrect);
        
      }, 10000); // 每10秒一次结果！！！随便设置的
    };
    
    // 停止模拟
    const stopSimulation = () => {
      if (simulationTimer !== null) {
        clearInterval(simulationTimer);
        simulationTimer = null;
      }
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
      
      const sentMessage = messageInput.value;
      messageInput.value = '';
      scrollChatToBottom();
      
      // 根据消息内容智能判断回应
      const message = sentMessage.toLowerCase();
      let responseDelay = 1500;
      
      // 如果消息包含鼓励词汇，增加儿童积极回应的概率
      const encouragingWords = ['加油', '很棒', '做得好', '真不错', '继续', '很好'];
      const hasEncouragingWords = encouragingWords.some(word => message.includes(word));
      
      // 模拟孩子回应，ps 可以删，感觉用处不大，可留可无！！！
	  
      if (hasEncouragingWords || Math.random() < 0.4) {
        setTimeout(() => {
          const positiveResponses = ['谢谢爸爸/妈妈！', '我会继续加油的！', '我喜欢这个游戏！', '我做得对吗？', '我感觉自己进步了！'];
          const neutralResponses = ['这个好难啊...', '我不太确定...', '我需要你的帮助', '这是什么表情呢？'];
          
          let responses = hasEncouragingWords ? positiveResponses : [...positiveResponses, ...neutralResponses];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const replyTime = new Date();
          chatMessages.value.push({
            content: randomResponse,
            sender: 'child',
            time: `${replyTime.getHours()}:${String(replyTime.getMinutes()).padStart(2, '0')}`,
            type: 'text'
          });
          
          scrollChatToBottom();
        }, responseDelay);
      }
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
      trainingTime.value = 0;  // 重置互动时长
      
      if (isTrainingActive.value) {
        addSystemMessage('互动记录已清空，互动时长重置');
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

    // 监听选择的儿童变化
    watch(selectedChild, (newVal) => {
      if (newVal) {
        console.log(`选择了儿童: ${newVal}`);
      }
    });

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
      trainingTime,
      
      handleChildSelect,
      goToChildInfo,
      startTraining,
      endTraining,
      sendMessage,
      clearChatHistory,
      formatTime
    };
  }
});
</script>

<style scoped>
.child-growth-container {
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.child-selector {
  margin-bottom: 20px;
  width: 200px;
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
}

.child-avatar {
  margin-right: 20px;
}

.child-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.child-details {
  flex: 1;
}

.info-item {
  margin-bottom: 5px;
  display: flex;
}

.label {
  font-weight: bold;
  width: 160px; 
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

/* 重新设计内容布局为网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto 1fr;
  gap: 20px;
}

/* 视频容器占据整行 */
.video-container {
  grid-column: 1 / 3;
  height: 170px;
  background-color: #e0e0e0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.video-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  background-color: #f0f8ff;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 互动统计在左侧 */
.training-stats {
  grid-column: 1;
  grid-row: 2;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  height: 400px;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  margin-bottom: 5px;
  font-weight: bold;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

/* 聊天容器在右侧 */
.chat-container {
  grid-column: 2;
  grid-row: 2;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 400px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  max-width: 80%;
}

.message-sent {
  margin-left: auto;
}

.message-received {
  margin-right: auto;
}

.message-content {
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
}

.message-sent .message-content {
  background-color: #d0f0ff;
}

.message-received .message-content {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.message-time {
  font-size: 12px;
  color: #888888;
  text-align: right;
  margin-top: 3px;
}

.result-message {
  display: flex;
  align-items: center;
  gap: 5px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.no-child-selected {
  padding: 40px;
  text-align: center;
}
</style>