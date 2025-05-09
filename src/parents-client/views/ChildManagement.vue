<template>
  <div class="child-management-container">
    <div class="section-title">儿童信息管理</div>
    
    <!-- 搜索和添加按钮 -->
    <div class="action-bar">
      <n-input-group>
        <n-input v-model:value="searchQuery" placeholder="搜索儿童姓名..." clearable />
        <n-button type="primary" @click="handleSearch">
          <template #icon>
            <n-icon><search-outlined /></n-icon>
          </template>
          搜索
        </n-button>
      </n-input-group>
      
      <n-button type="primary" @click="showAddChildModal = true">
        <template #icon>
          <n-icon><plus-outlined /></n-icon>
        </template>
        添加儿童
      </n-button>
    </div>
    
    <!-- 儿童信息卡片展示区 -->
    <div class="children-cards-container">
      <div v-if="filteredChildren.length === 0" class="no-children">
        暂无儿童信息，请添加
      </div>
     
      <!-- 使用固定布局而非居中布局 -->
      <div class="cards-grid">
        <div 
          v-for="child in filteredChildren" 
          :key="child.id" 
          class="card-grid-item"
        >
          <n-card hoverable class="child-card">
            <div class="child-card-content">
              <div class="child-avatar-section">
                <n-avatar round size="large" :src="child.avatar">
                  <template #icon>
                    <n-icon><smile-outlined /></n-icon>
                  </template>
                </n-avatar>
                <div class="child-names">
                  <div class="child-name">{{ child.name }}</div>
                  <div class="child-nickname">{{ child.nickname }}</div>
                </div>
              </div>
              
              <div class="child-info-section">
                <div class="info-item">
                  <div class="info-label">年龄：</div>
                  <div class="info-value">{{ calculateAge(child.birthday) || '未设置' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">性别：</div>
                  <div class="info-value">{{ child.gender === 1 ? '男' : '女' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">用龄：</div>
                  <div class="info-value">{{ calculateUsageTime(child.registerDate) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">情绪识别最好成绩：</div>
                  <div class="info-value">{{ child.emotionRecognitionRate || '0' }}%</div>
                </div>
              </div>
              
              <div class="child-actions">
                <n-button quaternary circle size="small" @click="handleViewDetails(child)">
                  <template #icon><n-icon><eye-outlined /></n-icon></template>
                </n-button>
                <n-button quaternary circle size="small" @click="handleEdit(child)">
                  <template #icon><n-icon><edit-outlined /></n-icon></template>
                </n-button>
                <n-button quaternary circle size="small" type="error" @click="handleDelete(child)">
                  <template #icon><n-icon><delete-outlined /></n-icon></template>
                </n-button>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>
    
    <!-- 添加儿童的弹出框 -->
    <n-modal
      v-model:show="showAddChildModal"
      preset="card"
      title="添加儿童信息"
      style="width: 500px"
    >
      <n-form
        ref="addFormRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入儿童姓名" />
        </n-form-item>
        
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="formData.nickname" placeholder="请输入儿童昵称" />
        </n-form-item>
        
        <n-form-item label="性别" path="gender">
          <n-radio-group v-model:value="formData.gender" @update:value="handleGenderChange">
            <n-space>
              <n-radio :value="1">男孩</n-radio>
              <n-radio :value="0">女孩</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="出生日期" path="birthday">
          <n-date-picker v-model:value="formData.birthday" type="date" clearable />
        </n-form-item>
        
        <n-form-item label="账号" path="username">
          <n-input v-model:value="formData.username" placeholder="请设置儿童账号" />
        </n-form-item>
        
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请设置儿童账号密码"
            show-password-on="click"
          />
        </n-form-item>
        
        <n-form-item label="备注" path="note">
          <n-input
            v-model:value="formData.note"
            type="textarea"
            placeholder="请输入备注信息（可选）"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="cancelAddChild">取消</n-button>
          <n-button type="primary" @click="handleAddChild">确认添加</n-button>
        </div>
      </template>
    </n-modal>
    
    <!-- 编辑儿童对话框 -->
    <n-modal
      v-model:show="showEditChildModal"
      preset="card"
      title="编辑儿童信息"
      style="width: 500px"
    >
      <n-form
        ref="editFormRef"
        :model="editFormData"
        :rules="rules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="editFormData.name" placeholder="请输入儿童姓名" />
        </n-form-item>
        
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="editFormData.nickname" placeholder="请输入儿童昵称" />
        </n-form-item>
        
        <n-form-item label="性别" path="gender">
          <n-radio-group v-model:value="editFormData.gender" @update:value="handleEditGenderChange">
            <n-space>
              <n-radio :value="1">男孩</n-radio>
              <n-radio :value="0">女孩</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        
        <n-form-item label="出生日期" path="birthday">
          <n-date-picker v-model:value="editFormData.birthday" type="date" clearable />
        </n-form-item>
        
        <n-form-item label="账号" path="username">
          <n-input v-model:value="editFormData.username" placeholder="请设置儿童账号" />
        </n-form-item>
        
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="editFormData.password"
            type="password"
            placeholder="请设置儿童账号密码"
            show-password-on="click"
          />
        </n-form-item>
        
        <n-form-item label="备注" path="note">
          <n-input
            v-model:value="editFormData.note"
            type="textarea"
            placeholder="请输入备注信息（可选）"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="showEditChildModal = false">取消</n-button>
          <n-button type="primary" @click="handleUpdateChild">保存修改</n-button>
        </div>
      </template>
    </n-modal>
    
    <!-- 查看详情对话框 -->
    <n-modal
      v-model:show="showDetailsModal"
      preset="card"
      title="儿童详细信息"
      style="width: 600px"
    >
      <div v-if="currentChild" class="child-details-modal">
        <div class="details-header">
          <n-avatar round size="large" :src="currentChild.avatar">
            <template #icon>
              <n-icon><smile-outlined /></n-icon>
            </template>
          </n-avatar>
          <div>
            <div class="details-name">{{ currentChild.name }} ({{ currentChild.nickname }})</div>
            <div style="color: #666;">{{ currentChild.gender === 1 ? '男' : '女'}} · {{ calculateAge(currentChild.birthday) }}</div>
          </div>
        </div>
        
        <n-divider />
        
        <n-descriptions bordered>
          <n-descriptions-item label="姓名">{{ currentChild.name }}</n-descriptions-item>
          <n-descriptions-item label="昵称">{{ currentChild.nickname }}</n-descriptions-item>
          <n-descriptions-item label="性别">{{ currentChild.gender === 1 ? '男' : '女' }}</n-descriptions-item>
          <n-descriptions-item label="出生日期">{{ formatDate(currentChild.birthday) }}</n-descriptions-item>
          <n-descriptions-item label="注册日期">{{ formatDate(currentChild.registerDate) }}</n-descriptions-item>
          <n-descriptions-item label="使用时长">{{ calculateUsageTime(currentChild.registerDate) }}</n-descriptions-item>
          <n-descriptions-item label="账号名">{{ currentChild.username || '未设置' }}</n-descriptions-item>
          <n-descriptions-item label="情绪识别最好成绩">{{ currentChild.emotionRecognitionRate || '0' }}%</n-descriptions-item>
          <n-descriptions-item label="备注" :span="3">{{ currentChild.note || '无' }}</n-descriptions-item>
        </n-descriptions>
        
        <div class="details-actions">
          <n-button @click="showDetailsModal = false">关闭</n-button>
          <n-button type="primary" @click="navigateToGrowthRecord(currentChild.id)">
            查看成长记录
          </n-button>
        </div>
      </div>
    </n-modal>
    
    <!-- 删除确认对话框 -->
    <n-modal
      v-model:show="showDeleteConfirm"
      preset="dialog"
      title="确认删除"
      positive-text="确认"
      negative-text="取消"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #default>
        确定要删除儿童"{{ deleteChildName }}"的信息吗？此操作不可撤销。
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  NInput,
  NInputGroup,
  NButton,
  NIcon,
  NModal,
  NForm,
  NFormItem,
  NDatePicker,
  NRadio,
  NRadioGroup,
  NSpace,
  NAvatar,
  NDescriptions,
  NDescriptionsItem,
  NGrid,
  NGridItem,
  NCard,
  NDivider
} from 'naive-ui';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SmileOutlined
} from '@vicons/antd';

// 定义儿童信息接口
interface ChildInfo {
  id: string;
  name: string;
  nickname: string;
  gender: number;
  birthday: Date | null;
  registerDate: Date;
  avatar: string;
  note: string;
  emotionRecognitionRate: number;
  username?: string;
  password?: string;
}

export default defineComponent({
  name: 'ChildManagement',
  components: {
    NInput,
    NInputGroup,
    NButton,
    NIcon,
    NModal,
    NForm,
    NFormItem,
    NDatePicker,
    NRadio,
    NRadioGroup,
    NSpace,
    NAvatar,
    NDescriptions,
    NDescriptionsItem,
    NGrid,
    NGridItem,
    NCard,
    NDivider,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SmileOutlined
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const showAddChildModal = ref(false);
    const showEditChildModal = ref(false);
    const showDetailsModal = ref(false);
    const showDeleteConfirm = ref(false);
    const deleteChildId = ref('');
    const deleteChildName = ref('');
    const currentChild = ref<ChildInfo | null>(null);
    const addFormRef = ref(null);
    const editFormRef = ref(null);
    
    // 响应式栅格配置
    const responsive = {
      xs: { cols: 1 },  // <640px 手机，每行显示1个
      s: { cols: 2 },   // >=640px 平板，每行显示2个
      m: { cols: 3 },   // >=1024px 小屏幕，每行显示3个
      l: { cols: 4 },   // >=1280px 大屏幕，每行显示4个
      xl: { cols: 5 },  // >=1536px 特大屏幕，每行显示5个
      xxl: { cols: 6 } // >=1920px 超大屏幕，每行显示6个
    }
    
    // 头像设置
    const boyAvatar = '/src/parents-client/assets/boy.jpg';
    const girlAvatar = '/src/parents-client/assets/girl.jpg';
    
    // 表单验证规则
    const rules = {
      name: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入姓名'
      },
      nickname: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入昵称'
      },
      gender: {
        required: true,
        type: 'number',
        trigger: ['change'],
        message: '请选择性别'
      },
      username: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请设置账号'
      },
      password: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请设置密码'
      }
    };
    
    // 添加儿童表单数据
    const formData = reactive({
      name: '',
      nickname: '',
      birthday: null as Date | null,
      gender: 1,
      avatar: boyAvatar,
      note: '',
      username: '',
      password: ''
    });
    
    // 编辑儿童表单数据
    const editFormData = reactive<ChildInfo>({
      id: '',
      name: '',
      nickname: '',
      birthday: null,
      gender: 1,
      avatar: boyAvatar,
      note: '',
      registerDate: new Date(),
      emotionRecognitionRate: 0,
      username: '',
      password: ''
    });
    
    // 处理性别选择变化 - 设置对应头像
    const handleGenderChange = (value: number) => {
      formData.avatar = value === 1 ? boyAvatar : girlAvatar;
    };
    
    // 处理编辑时性别选择变化 - 设置对应头像
    const handleEditGenderChange = (value: number) => {
      editFormData.avatar = value === 1 ? boyAvatar : girlAvatar;
    };
    
    // 模拟的儿童数据
    const childrenData = ref<ChildInfo[]>([
      {
        id: '1',
        name: '王曼',
        nickname: 'BEVERLY',
        gender: 0,
        birthday: new Date('2018-03-15'),
        registerDate: new Date('2024-03-25'),
        avatar: girlAvatar,
        note: '对情绪的把控不到位，但是对人的表情感兴趣',
        emotionRecognitionRate: 85,
        username: 'beverly2018',
        password: '123456'
      },
      {
        id: '2',
        name: '郑慧卿',
        nickname: 'EVA',
        gender: 0,
        birthday: new Date('2016-05-20'),
        registerDate: new Date('2023-04-12'),
        avatar: girlAvatar,
        note: '对声音声调很敏感',
        emotionRecognitionRate: 78,
        username: 'eva2016',
        password: '123456'
      }
    ]);
    
    // 初始化
    onMounted(() => {
      // 从LocalStorage加载数据
      const storedChildren = localStorage.getItem('childrenData');
      if (storedChildren) {
        try {
          const parsedData = JSON.parse(storedChildren);
          childrenData.value = parsedData.map((child: any) => ({
            ...child,
            birthday: child.birthday ? new Date(child.birthday) : null,
            registerDate: new Date(child.registerDate)
          }));
        } catch (error) {
          console.error('Failed to parse stored children data:', error);
        }
      }
    });
    
    // 保存儿童数据到LocalStorage
    const saveChildrenData = () => {
      try {
        localStorage.setItem('childrenData', JSON.stringify(childrenData.value));
      } catch (error) {
        console.error('Failed to save children data:', error);
      }
    };
    
    // 过滤后的儿童数据
    const filteredChildren = computed(() => {
      if (!searchQuery.value) return childrenData.value;
      
      return childrenData.value.filter(child => 
        child.name.includes(searchQuery.value) || 
        child.nickname.includes(searchQuery.value)
      );
    });
    
    // 处理搜索
    const handleSearch = () => {
      // 搜索逻辑已在计算属性中处理
    };
    
    // 处理查看详情
    const handleViewDetails = (child: ChildInfo) => {
      currentChild.value = { ...child };
      showDetailsModal.value = true;
    };
    
    // 处理编辑
    const handleEdit = (child: ChildInfo) => {
      // 深拷贝确保不会直接修改原始数据
      editFormData.id = child.id;
      editFormData.name = child.name;
      editFormData.nickname = child.nickname;
      editFormData.gender = child.gender;
      editFormData.birthday = child.birthday;
      editFormData.registerDate = child.registerDate;
      editFormData.avatar = child.avatar;
      editFormData.note = child.note;
      editFormData.emotionRecognitionRate = child.emotionRecognitionRate;
      editFormData.username = child.username || '';
      editFormData.password = child.password || '';
      
      showEditChildModal.value = true;
    };
    
    // 处理删除
    const handleDelete = (child: ChildInfo) => {
      deleteChildId.value = child.id;
      deleteChildName.value = child.name;
      showDeleteConfirm.value = true;
    };
    
    // 确认删除
    const confirmDelete = () => {
      const index = childrenData.value.findIndex(child => child.id === deleteChildId.value);
      if (index !== -1) {
        childrenData.value.splice(index, 1);
        saveChildrenData(); // 保存更改到LocalStorage
      }
      showDeleteConfirm.value = false;
    };
    
    // 取消删除
    const cancelDelete = () => {
      showDeleteConfirm.value = false;
    };
    
    // 处理添加儿童
    const handleAddChild = () => {
      if (!addFormRef.value) {
        console.error('Form reference is not available');
        return;
      }
      
      (addFormRef.value as any).validate((errors: any) => {
        if (!errors) {
          // 表单验证通过，创建新儿童信息
          const newChild: ChildInfo = {
            id: String(Date.now()),
            name: formData.name,
            nickname: formData.nickname,
            gender: formData.gender,
            birthday: formData.birthday,
            registerDate: new Date(),
            avatar: formData.gender === 1 ? boyAvatar : girlAvatar,
            note: formData.note,
            emotionRecognitionRate: 0,
            username: formData.username,
            password: formData.password
          };
          
          childrenData.value.push(newChild);
          saveChildrenData();
          
          resetFormData();
          showAddChildModal.value = false;
          
          console.log('儿童信息添加成功');
        } else {
          console.error('Form validation failed:', errors);
        }
      });
    };
    
    // 取消添加儿童
    const cancelAddChild = () => {
      resetFormData();
      showAddChildModal.value = false;
    };
    
    // 处理更新儿童信息
    const handleUpdateChild = () => {
      if (!editFormRef.value) {
        console.error('Edit form reference is not available');
        return;
      }
      
      (editFormRef.value as any).validate((errors: any) => {
        if (!errors) {
          const index = childrenData.value.findIndex(child => child.id === editFormData.id);
          if (index !== -1) {
            const updatedChild: ChildInfo = {
              ...editFormData,
              avatar: editFormData.gender === 1 ? boyAvatar : girlAvatar
            };
            childrenData.value[index] = updatedChild;
            saveChildrenData();
          }
          showEditChildModal.value = false;
          
          console.log('儿童信息更新成功');
        } else {
          console.error('Form validation failed:', errors);
        }
      });
    };
    
    // 重置表单数据
    const resetFormData = () => {
      formData.name = '';
      formData.nickname = '';
      formData.birthday = null;
      formData.gender = 1;
      formData.avatar = boyAvatar;
      formData.note = '';
      formData.username = '';
      formData.password = '';
    };
    
    // 计算年龄
    const calculateAge = (birthday: Date | null) => {
      if (!birthday) return '';
      
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return `${age}岁`;
    };
    
    // 计算使用时间
    const calculateUsageTime = (registerDate: Date) => {
      if (!registerDate) return '';
      
      const startDate = new Date(registerDate);
      const today = new Date();
      const yearDiff = today.getFullYear() - startDate.getFullYear();
      const monthDiff = today.getMonth() - startDate.getMonth();
      
      if (yearDiff > 0) {
        return yearDiff === 1 ? '1年' : `${yearDiff}年`;
      } else if (monthDiff > 0) {
        return `${monthDiff}个月`;
      } else {
        const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return `${dayDiff}天`;
      }
    };
    
    // 格式化日期
    const formatDate = (date: Date | null) => {
      if (!date) return '未设置';
      
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };
    
    // 导航到成长记录页面
    const navigateToGrowthRecord = (childId: string) => {
      router.push({ path: '/parents/child-growth', query: { id: childId } });
    };
    
    return {
      searchQuery,
      showAddChildModal,
      showEditChildModal,
      showDetailsModal,
      showDeleteConfirm,
      formData,
      editFormData,
      filteredChildren,
      deleteChildName,
      currentChild,
      addFormRef,
      editFormRef,
      rules,
      responsive,
      handleSearch,
      handleViewDetails,
      handleEdit,
      handleDelete,
      confirmDelete,
      cancelDelete,
      handleAddChild,
      cancelAddChild,
      handleUpdateChild,
      handleGenderChange,
      handleEditGenderChange,
      calculateAge,
      calculateUsageTime,
      formatDate,
      navigateToGrowthRecord
    };
  }
});
</script>

<style scoped>
.child-management-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
  box-sizing: border-box;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px;
}

.action-bar .n-input-group {
  width: 300px;
}

.children-cards-container {
  margin-top: 20px;
}

.no-children {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 新增网格布局 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.card-grid-item {
  width: 100%;
}

.child-card {
  height: 100%;
  width: 100%;
  transition: transform 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.child-card:hover {
  transform: translateY(-5px);
}

.child-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 220px;
}

.child-avatar-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.child-names {
  display: flex;
  flex-direction: column;
}

.child-name {
  font-size: 18px;
  font-weight: bold;
}

.child-nickname {
  font-size: 14px;
  color: #666;
}

.child-info-section {
  flex: 1;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  margin-bottom: 5px;
}

.info-label {
  width: 160px;
  color: #666;
}

.info-value {
  flex: 1;
  font-weight: 500;
}

.child-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.child-details-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.details-name {
  font-size: 18px;
  font-weight: bold;
}

.details-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
  }
   
  .action-bar .n-input-group {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .child-avatar-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .child-names {
    align-items: center;
  }
  
  .info-item {
    flex-direction: column;
    margin-bottom: 10px;
  }
  
  .info-label {
    width: 100%;
    margin-bottom: 2px;
  }
}

.child-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 按钮悬停效果 */
.child-actions button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 详情页面样式 */
.child-details-modal .n-descriptions {
  margin-top: 15px;
}

/* 表单样式美化 */
.n-form-item {
  margin-bottom: 20px;
}

/* 添加动画效果 */
.card-grid-item {
  transition: all 0.3s ease;
}

/* 确保子项高度一致 */
.child-card-content {
  min-height: 200px;
}

/* 头像样式调整 */
.child-avatar-section .n-avatar {
  border: 2px solid #f0f0f0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* 改进删除按钮样式 */
button.n-button--error-quaternary:hover {
  background-color: rgba(255, 77, 79, 0.1) !important;
}

/* 模态框内部间距 */
.n-modal .n-card-header {
  padding-bottom: 16px;
}

.n-modal .n-card__content {
  padding-top: 0;
}

/* 表格间隔交替色 */
.n-descriptions tbody tr:nth-child(even) {
  background-color: #fafafa;
}
</style>