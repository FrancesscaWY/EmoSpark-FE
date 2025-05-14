<template>
  <div class="consult-doctor-container">
    <div class="header-section">
      <div class="section-title">咨询医生专家</div>
      
      <!-- 儿童选择 -->
      <div class="child-selector">
        <n-select
          v-model:value="selectedChild"
          :options="childrenOptions"
          placeholder="请选择儿童"
          @update:value="handleChildChange"
        />
      </div>
    </div>
    
    <div class="main-content">
      <!-- 左侧：专家选择区域 -->
      <div class="doctor-selection-area">
        <div class="search-section">
          <n-input-group>
            <n-input v-model:value="searchQuery" placeholder="搜索医生专家..." clearable />
            <n-button type="primary" @click="handleSearch">
              <template #icon>
                <n-icon><search-outlined /></n-icon>
              </template>
              搜索
            </n-button>
          </n-input-group>
        </div>
        
        <div class="doctor-list">
          <n-scrollbar style="max-height: 600px">
            <n-list hoverable clickable>
              <n-list-item v-for="doctor in filteredDoctors" :key="doctor.id" @click="selectDoctor(doctor)">
                <n-thing :title="doctor.name" :description="doctor.specialty">
                  <template #avatar>
                    <n-avatar round :style="{ backgroundColor: '#2080f0', color: 'white' }">
                      {{ getSurname(doctor.name) }}
                    </n-avatar>
                  </template>
                  <template #description>
                    <div class="doctor-description">
                      <span class="specialty-tag">{{ doctor.specialty }}</span>
                      <span class="hospital">{{ doctor.hospital }}</span>
                    </div>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-scrollbar>
        </div>
      </div>
      
      <!-- 右侧：聊天窗口区域 -->
      <div class="chat-window">
        <div class="chat-header">
          <div class="consultation-info">
            <div class="doctor-info" v-if="currentDoctor">
              <n-avatar round size="small" :style="{ backgroundColor: '#2080f0', color: 'white' }">
                {{ getSurname(currentDoctor.name) }}
              </n-avatar>
              <div class="doctor-name">{{ currentDoctor.name }}</div>
            </div>
            <div class="child-info" v-if="currentChild">
              <span class="consultation-for">咨询对象: {{ currentChild.nickname }}</span>
            </div>
            <div class="doctor-placeholder" v-if="!currentDoctor">
              请选择医生专家开始咨询
            </div>
          </div>
        </div>
        
        <div class="chat-messages" ref="messageContainer">
          <div v-if="!currentDoctor" class="no-doctor-selected">
            <n-empty description="请从左侧选择医生专家进行咨询">
              <template #icon>
                <n-icon size="48"><message-outlined /></n-icon>
              </template>
            </n-empty>
          </div>
          
          <div v-else class="messages-container">
            <div 
              v-for="(message, index) in messages" 
              :key="index" 
              :class="['message', message.fromDoctor ? 'message-doctor' : 'message-parent']"
            >
              <div class="message-avatar">
                <n-avatar round size="small" v-if="message.fromDoctor" :style="{ backgroundColor: '#2080f0', color: 'white' }">
                  {{ currentDoctor ? getSurname(currentDoctor.name) : '' }}
                </n-avatar>
                <n-avatar round size="small" v-else :src="userAvatar">
                  <template #icon>
                    <n-icon><user-outlined /></n-icon>
                  </template>
                </n-avatar>
              </div>
              <div class="message-content">
                <div class="message-sender">{{ message.fromDoctor ? currentDoctor.name : '我' }}</div>
                
                <!-- 普通文本消息 -->
                <div v-if="message.type === 'text'" class="message-bubble text-message">
                  {{ message.content }}
                </div>
                
                <!-- 语音消息 -->
                <div v-else-if="message.type === 'voice'" class="message-bubble voice-message" @click="playVoice(message)">
                  <n-icon><sound-outlined /></n-icon>
                  <div class="voice-duration">{{ message.duration }}″</div>
                </div>
                
                <!-- 图片消息 -->
                <div v-else-if="message.type === 'image'" class="message-bubble image-message">
                  <img :src="message.content" alt="图片消息" @click="previewImage(message.content)" />
                </div>
                
                <!-- 文件消息 -->
                <div v-else-if="message.type === 'file'" class="message-bubble file-message">
                  <div class="file-info" @click="downloadFile(message)">
                    <n-icon><file-outlined /></n-icon>
                    <div class="file-name">{{ message.fileName }}</div>
                    <div class="file-size">{{ formatFileSize(message.fileSize) }}</div>
                  </div>
                </div>
                
                <div class="message-time">{{ formatTime(message.time) }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-input-area" v-if="currentDoctor">
          <div class="input-toolbar">
            <n-tooltip placement="top">
              <template #trigger>
                <n-button quaternary circle @click="toggleVoiceInput">
                  <template #icon><n-icon><audio-outlined /></n-icon></template>
                </n-button>
              </template>
              语音
            </n-tooltip>
            
            <n-tooltip placement="top">
              <template #trigger>
                <n-button quaternary circle @click="triggerImageUpload">
                  <template #icon><n-icon><picture-outlined /></n-icon></template>
                </n-button>
              </template>
              图片
            </n-tooltip>
            
            <n-tooltip placement="top">
              <template #trigger>
                <n-button quaternary circle @click="triggerFileUpload">
                  <template #icon><n-icon><file-add-outlined /></n-icon></template>
                </n-button>
              </template>
              文件
            </n-tooltip>
            
            <n-tooltip placement="top">
              <template #trigger>
                <n-button quaternary circle @click="openEmojiPicker">
                  <template #icon><n-icon><smile-outlined /></n-icon></template>
                </n-button>
              </template>
              表情
            </n-tooltip>
          </div>
          
          <div class="input-box">
            <!-- 语音输入模式 -->
          
          <div v-if="isVoiceInputMode" class="voice-input-mode">
            <div class="voice-input-controls">
              <n-button class="voice-record-button" :type="isRecording ? 'error' : 'default'" @mousedown="startRecording" @mouseup="stopRecording">
                {{ isRecording ? '松开结束' : '按住说话' }}
              </n-button>
              <n-button class="voice-back-button" @click="toggleVoiceInput">
                返回文本输入
              </n-button>
            </div>
          </div>
            
            <!-- 文本输入模式 -->
            <div v-else class="text-input-mode">
              <n-input 
                v-model:value="messageText" 
                type="textarea" 
                placeholder="请输入消息..." 
                :autosize="{ minRows: 1, maxRows: 3 }"
                @keydown.enter.prevent="sendTextMessage"
              />
              
              <n-button type="primary" @click="sendTextMessage" :disabled="!messageText.trim()">
                发送
              </n-button>
            </div>
          </div>
          
          <!-- 隐藏的文件上传输入 -->
          <input type="file" ref="imageInput" style="display: none" accept="image/*" @change="handleImageUpload" />
          <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
        </div>
      </div>
    </div>
    
    <!-- 图片预览 -->
    <n-modal v-model:show="showImagePreview" preset="card" style="width: auto; max-width: 80%">
      <img :src="previewImageUrl" style="width: 100%" />
    </n-modal>
    
    <!-- 表情选择器 -->
    <n-modal v-model:show="showEmojiPicker" preset="card" title="选择表情" style="width: 320px">
      <div class="emoji-picker">
        <div class="emoji-list">
          <span 
            v-for="emoji in emojis" 
            :key="emoji" 
            class="emoji-item" 
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import {
  NInput,
  NInputGroup,
  NButton,
  NIcon,
  NAvatar,
  NList,
  NListItem,
  NThing,
  NTag,
  NScrollbar,
  NEmpty,
  NModal,
  NTooltip,
  NSelect
} from 'naive-ui';
import {
  SearchOutlined,
  UserOutlined,
  MessageOutlined,
  AudioOutlined,  // Changed from SoundOutlined to AudioOutlined for microphone
  PictureOutlined,
  FileOutlined,
  FileAddOutlined,
  SmileOutlined
} from '@vicons/antd';

// 定义医生类型
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
}

// 定义消息类型
// 修改消息类型接口定义
interface Message {
  id: string;
  type: 'text' | 'voice' | 'image' | 'file';
  content: string;
  fromDoctor: boolean;
  time: Date;
  duration?: number; // 语音时长（秒）
  fileName?: string; // 文件名
  fileSize?: number; // 文件大小（字节）
  childId?: string;  // 关联的儿童ID
  doctorId?: string; // 添加关联的医生ID
}

// 定义儿童类型
interface Child {
  id: string;
  nickname: string;
  age: string;
  time: string;
}

export default defineComponent({
  name: 'ConsultDoctor',
  components: {
    NInput,
    NInputGroup,
    NButton,
    NIcon,
    NAvatar,
    NList,
    NListItem,
    NThing,
    NTag,
    NScrollbar,
    NEmpty,
    NModal,
    NTooltip,
    NSelect,
    SearchOutlined,
    UserOutlined,
    MessageOutlined,
    AudioOutlined,  // Changed from SoundOutlined to AudioOutlined
    PictureOutlined,
    FileOutlined,
    FileAddOutlined,
    SmileOutlined
  },
  setup() {
    // 用户头像
    const userAvatar = '/src/parents-client/assets/parent-avatar.jpg';
    
    // 搜索
    const searchQuery = ref('');
    
    // 消息输入
    const messageText = ref('');
    const messageContainer = ref<HTMLElement | null>(null);
    
    // 当前选择的医生
    const currentDoctor = ref<Doctor | null>(null);
    
    // 儿童列表选项
    const childrenOptions = ref([
      { label: 'BEVERLY', value: '1' },
      { label: 'EVA', value: '2' }
    ]);
    
    // 当前选中的儿童ID
    const selectedChild = ref('1');
    
    // 当前儿童详细信息
    const currentChild = reactive<Child>({
      id: '1',
      nickname: 'BEVERLY',
      age: '7岁',
      time: '一年'
    });
    
    // 模拟医生数据
    const doctors = ref<Doctor[]>([
      {
        id: '1',
        name: '李医生',
        specialty: '儿童心理',
        hospital: '北京儿童医院'
      },
      {
        id: '2',
        name: '王医生',
        specialty: '发育行为',
        hospital: '上海儿童医疗中心'
      },
      {
        id: '3',
        name: '张医生',
        specialty: '自闭症康复',
        hospital: '广州妇女儿童医疗中心'
      }
    ]);
    
    // 获取医生姓氏
    const getSurname = (name: string) => {
      return name.charAt(0);
    };
    
    // 过滤后的医生列表
    const filteredDoctors = computed(() => {
      if (!searchQuery.value) return doctors.value;
      
      return doctors.value.filter(doctor => 
        doctor.name.includes(searchQuery.value) || 
        doctor.specialty.includes(searchQuery.value) ||
        doctor.hospital.includes(searchQuery.value)
      );
    });
    
    // 当前儿童的消息列表
    const messages = ref<Message[]>([]);
    
    // 所有消息的映射 (按儿童ID分组)
  const allMessages = ref<Record<string, Record<string, Message[]>>>({
    '1': {}, // 儿童ID: { 医生ID: 消息数组 }
    '2': {}
  });
    
    // 语音输入模式
    const isVoiceInputMode = ref(false);
    const isRecording = ref(false);
    const recordingStartTime = ref<number | null>(null);
    const recordingDuration = ref(0);
    
    // 图片和文件上传引用
    const imageInput = ref<HTMLInputElement | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);
    
    // 图片预览
    const showImagePreview = ref(false);
    const previewImageUrl = ref('');
    
    // 表情选择器
    const showEmojiPicker = ref(false);
    const emojis = ['😊', '😂', '😍', '👍', '🎉', '❤️', '👏', '🤔', '😢', '😎', '🙏', '👋', '🤗', '🌹', '🌞', '🌟', '🍀', '🎵', '🎶', '📚'];
    
    // 处理搜索
    const handleSearch = () => {
      // 搜索逻辑已在计算属性中处理
    };
    
    // 选择医生
  const selectDoctor = (doctor: Doctor) => {
    currentDoctor.value = doctor;
    
    // 加载当前儿童与此医生的聊天记录
    loadChildDoctorMessages();
    
    // 检查是否有当前医生的欢迎消息
    const doctorWelcomeExists = messages.value.some(m => 
      m.fromDoctor && 
      m.content.includes(`我是${doctor.name}`)
    );
    
    if (!doctorWelcomeExists) {
      addMessage({
        id: `msg-${Date.now()}`,
        type: 'text',
        content: `您好，我是${doctor.name}，专注于${doctor.specialty}领域，请问有什么关于${currentChild.nickname}的情况需要咨询？`,
        fromDoctor: true,
        time: new Date(),
        childId: currentChild.id,
        doctorId: doctor.id // 添加医生ID
      });
    }
  };
    
    // 加载当前儿童与当前医生的聊天记录
   const loadChildDoctorMessages = () => {
     const childId = selectedChild.value;
     const doctorId = currentDoctor.value?.id;
     
     if (!doctorId) return;
     
     // 确保存储结构存在
     if (!allMessages.value[childId]) {
       allMessages.value[childId] = {};
     }
     
     if (!allMessages.value[childId][doctorId]) {
       allMessages.value[childId][doctorId] = [];
     }
     
     // 加载对应的消息
     messages.value = allMessages.value[childId][doctorId];
   };

    
    // 切换选中的儿童
    const handleChildChange = (childId: string) => {
      // 更新当前儿童详细信息
      fetchChildDetails(childId);
      
      // 如果已经选择了医生，加载对应的聊天记录
      if (currentDoctor.value) {
        loadChildDoctorMessages();
      }
    };
    
    // 获取儿童详细信息
    const fetchChildDetails = async (childId: string) => {
      try {
        // 实际应用中应调用API
        // const response = await axios.get(`/api/parents/${childId}`);
        // currentChild = response.data;
        
        // 模拟数据
        if (childId === '1') {
          Object.assign(currentChild, {
            id: '1',
            nickname: 'BEVERLY',
            age: '7岁',
            time: '1个月'
          });
        } else if (childId === '2') {
          Object.assign(currentChild, {
            id: '2',
            nickname: 'EVA',
            age: '9岁',
            time: '2年'
          });
        }
      } catch (error) {
        console.error('获取儿童信息失败', error);
      }
    };
    
    // 添加消息到列表
    const addMessage = (message: Message) => {
      const childId = message.childId || selectedChild.value;
      const doctorId = currentDoctor.value?.id || '';
      
      // 确保存储结构存在
      if (!allMessages.value[childId]) {
        allMessages.value[childId] = {};
      }
      
      if (!allMessages.value[childId][doctorId]) {
        allMessages.value[childId][doctorId] = [];
      }
      
      // 添加消息到当前显示的列表
      messages.value.push(message);
      
      // 添加到对应医生和儿童的消息列表中
      allMessages.value[childId][doctorId].push(message);
      
      // 滚动到底部
      nextTick(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      });
    };
    
    // 发送文本消息
    const sendTextMessage = () => {
  if (!messageText.value.trim() || !currentDoctor.value) return;
  
  addMessage({
    id: `msg-${Date.now()}`,
    type: 'text',
    content: messageText.value,
    fromDoctor: false,
    time: new Date(),
    childId: selectedChild.value,
    doctorId: currentDoctor.value.id // 添加医生ID
  });
  
  // 清空输入框
  messageText.value = '';
  
  // 模拟医生回复
  setTimeout(() => {
    if (currentDoctor.value) {
      addMessage({
        id: `msg-${Date.now()}`,
        type: 'text',
        content: `收到您关于${currentChild.nickname}的咨询，我会尽快回复。`,
        fromDoctor: true,
        time: new Date(),
        childId: selectedChild.value,
        doctorId: currentDoctor.value.id // 添加医生ID
      });
    }
  }, 1000);
};
    
    // 切换语音输入模式
    const toggleVoiceInput = () => {
      isVoiceInputMode.value = !isVoiceInputMode.value;
    };
    
    // 开始录音
    const startRecording = () => {
      isRecording.value = true;
      recordingStartTime.value = Date.now();
      console.log('开始录音...');
      // 这里应该调用实际的录音API
    };
    
    // 结束录音
    const stopRecording = () => {
      isRecording.value = false;
      
      if (recordingStartTime.value && currentDoctor.value) {
        // 计算录音持续时间（秒）
        const duration = Math.round((Date.now() - recordingStartTime.value) / 1000);
        recordingDuration.value = duration || 1; // 最少1秒
        
        // 模拟发送语音消息
        addMessage({
          id: `msg-${Date.now()}`,
          type: 'voice',
          content: 'voice-record.mp3',
          fromDoctor: false,
          time: new Date(),
          duration: recordingDuration.value,
          childId: selectedChild.value,
          doctorId: currentDoctor.value.id // 添加医生ID
        });
        
        recordingStartTime.value = null;
      }
      
      console.log('录音结束，持续时间：', recordingDuration.value, '秒');
    };
    
    // 播放语音
    const playVoice = (message: Message) => {
      console.log(`播放语音: ${message.content}, 持续时间: ${message.duration}秒`);
      // 这里应该调用实际的音频播放API
    };
    
    // 触发图片上传
    const triggerImageUpload = () => {
      if (imageInput.value) {
        imageInput.value.click();
      }
    };
    
    // 处理图片上传
    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        // 在实际应用中，这里应该上传图片到服务器，获取URL
        // 这里使用本地预览
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          
          addMessage({
            id: `msg-${Date.now()}`,
            type: 'image',
            content: imageUrl,
            fromDoctor: false,
            time: new Date(),
            childId: selectedChild.value
          });
        };
        reader.readAsDataURL(file);
        
        // 重置输入，允许再次选择同一文件
        target.value = '';
      }
    };
    
    // 预览图片
    const previewImage = (url: string) => {
      previewImageUrl.value = url;
      showImagePreview.value = true;
    };
    
    // 触发文件上传
    const triggerFileUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    
    // 处理文件上传
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        // 在实际应用中，这里应该上传文件到服务器
        addMessage({
          id: `msg-${Date.now()}`,
          type: 'file',
          content: 'file-url',
          fromDoctor: false,
          time: new Date(),
          fileName: file.name,
          fileSize: file.size,
          childId: selectedChild.value
        });
        
        // 重置输入，允许再次选择同一文件
        target.value = '';
      }
    };
    
    // 下载文件
    const downloadFile = (message: Message) => {
      console.log(`下载文件: ${message.fileName}, 大小: ${message.fileSize}`);
      // 这里应该调用实际的文件下载API
    };
    
    // 打开表情选择器
    const openEmojiPicker = () => {
      showEmojiPicker.value = true;
    };
    
    // 插入表情
    const insertEmoji = (emoji: string) => {
      messageText.value += emoji;
      showEmojiPicker.value = false;
    };
    
    // 格式化时间
    const formatTime = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
    
    // 格式化文件大小
    const formatFileSize = (bytes: number | undefined) => {
      if (!bytes) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // 监听搜索输入变化
    watch(searchQuery, () => {
      handleSearch();
    });
    
    // 页面加载时的初始化
   onMounted(() => {
     // 从本地存储加载聊天记录
     const storedMessages = localStorage.getItem('doctorMessages');
     if (storedMessages) {
       try {
         const parsedMessages = JSON.parse(storedMessages);
         // 初始化双层嵌套结构
         const messagesByChildDoctor: Record<string, Record<string, Message[]>> = {
           '1': {},
           '2': {}
         };
         
         parsedMessages.forEach((msg: any) => {
           const childId = msg.childId || '1'; // 默认为第一个儿童
           const doctorId = msg.doctorId || '1'; // 添加 doctorId 到消息结构中
           
           // 确保嵌套结构存在
           if (!messagesByChildDoctor[childId]) {
             messagesByChildDoctor[childId] = {};
           }
           
           if (!messagesByChildDoctor[childId][doctorId]) {
             messagesByChildDoctor[childId][doctorId] = [];
           }
           
           // 添加消息到适当的位置
           messagesByChildDoctor[childId][doctorId].push({
             ...msg,
             time: new Date(msg.time)
           });
         });
         
         // 更新所有消息映射
         allMessages.value = messagesByChildDoctor;
         
         // 只有当已经选择了医生时才初始化消息
         if (currentDoctor.value) {
           const doctorId = currentDoctor.value.id;
           if (allMessages.value[selectedChild.value] && 
               allMessages.value[selectedChild.value][doctorId]) {
             messages.value = allMessages.value[selectedChild.value][doctorId];
           } else {
             messages.value = [];
           }
         } else {
           messages.value = [];
         }
       } catch (error) {
         console.error('Failed to parse stored messages:', error);
       }
     }
     
     // 初始化当前儿童信息
     fetchChildDetails(selectedChild.value);
   });
    
    // 当消息列表变化时保存到本地存储
  // 更新保存到本地存储的监听器
  watch(allMessages, () => {
    try {
      // 将所有医生和儿童的消息合并为一个数组
      const allMessagesArray: Message[] = [];
      
      // 遍历两层嵌套结构
      Object.keys(allMessages.value).forEach(childId => {
        Object.keys(allMessages.value[childId]).forEach(doctorId => {
          const messages = allMessages.value[childId][doctorId];
          // 确保每条消息都有正确的childId和doctorId
          messages.forEach(msg => {
            allMessagesArray.push({
              ...msg,
              childId: childId,
              doctorId: doctorId
            });
          });
        });
      });
      
      localStorage.setItem('doctorMessages', JSON.stringify(allMessagesArray));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, { deep: true });
    
    return {
      searchQuery,
      messageText,
      currentDoctor,
      doctors,
      filteredDoctors,
      messages,
      isVoiceInputMode,
      isRecording,
      userAvatar,
      messageContainer,
      imageInput,
      fileInput,
      showImagePreview,
      previewImageUrl,
      showEmojiPicker,
      emojis,
      childrenOptions,
      selectedChild,
      currentChild,
      getSurname,
      handleSearch,
      selectDoctor,
      sendTextMessage,
      toggleVoiceInput,
      startRecording,
      stopRecording,
      playVoice,
      triggerImageUpload,
      handleImageUpload,
      previewImage,
      triggerFileUpload,
      handleFileUpload,
      downloadFile,
      openEmojiPicker,
      insertEmoji,
      formatTime,
      formatFileSize,
      handleChildChange
    };
  }
});
</script>

<style scoped>
.consult-doctor-container {
  width: 100%;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}


.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.child-selector {
  width: 200px;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
  height: calc(100% - 60px);
}

/* 左侧：医生选择区域样式 */
.doctor-selection-area {
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-section {
  margin-bottom: 12px;
}

.doctor-list {
  flex: 1;
  overflow: hidden;
}

.doctor-description {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.specialty-tag {
  margin-right: 8px;
  color: #2080f0;
  font-weight: 500;
}

.hospital {
  color: #666;
  font-size: 13px;
}

/* 右侧：聊天窗口区域样式 */
/* 右侧：聊天窗口区域样式 - 续 */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.consultation-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.doctor-name {
  font-weight: 500;
  color: #333;
}

.child-info {
  font-size: 13px;
  color: #666;
}

.doctor-placeholder {
  color: #999;
  text-align: center;
  width: 100%;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.no-doctor-selected {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 80%;
}

.message-doctor {
  align-self: flex-start;
}

.message-parent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-sender {
  font-size: 12px;
  color: #666;
}

.message-bubble {
  padding: 10px 12px;
  border-radius: 8px;
  max-width: 100%;
  word-break: break-word;
}

.message-doctor .message-bubble {
  background-color: #f0f2f5;
}

.message-parent .message-bubble {
  background-color: #e3f2fd;
}

.text-message {
  line-height: 1.5;
}

.voice-message {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  min-width: 80px;
}

.image-message {
  padding: 4px;
}

.image-message img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
}

.file-message {
  background-color: #f5f5f5;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.file-name {
  font-weight: 500;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.message-time {
  font-size: 12px;
  color: #999;
  align-self: flex-end;
}

.chat-input-area {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  background-color: white;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input-box {
  display: flex;
  gap: 8px;
}

.voice-input-mode {
  width: 100%;
  display: flex;
  justify-content: center;
}

.voice-input-controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.voice-record-button {
  width: 80%;
  height: 40px;
  border-radius: 20px;
}
.voice-back-button {
  width: 40%;
  height: 30px;
  border-radius: 15px;
}

.text-input-mode {
  display: flex;
  width: 100%;
  gap: 8px;
}

.text-input-mode .n-input {
  flex: 1;
}

.emoji-picker {
  padding: 12px;
}

.emoji-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.emoji-item {
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

/* 媒体查询适配较小屏幕 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .doctor-selection-area {
    width: 100%;
    height: 200px;
  }
  
  .message {
    max-width: 90%;
  }
}
</style>