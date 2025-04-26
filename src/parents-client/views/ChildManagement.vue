<template>
  <div class="child-management-container">
    <div class="section-title">儿童信息管理</div>
    
    <!-- 搜索和添加按钮 -->
	<!-- 这里是因为家长可能有多个孩子，也有可能是类似福利院这种性质的机构注册了家长端，所以有多个孩子，可以删掉 -->
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
	<!-- 如果没有添加儿童信息显示的样式 -->
    <div class="children-cards-container">
      <div v-if="filteredChildren.length === 0" class="no-children">
        暂无儿童信息，请添加
      </div>
	  
     <!-- 儿童卡片展示信息 -->
	 
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="child in filteredChildren" :key="child.id">
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
              <!-- 三个儿童信息的交换按钮 详细信息、编辑、删除信息 -->
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
        </n-grid-item>
      </n-grid>
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
          <n-input v-model:value="formData.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </n-form-item>
		<!-- 生日不是必选哦 -->
        <n-form-item label="生日" path="birthday">
          <n-date-picker v-model:value="formData.birthday" type="date" clearable />
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-radio-group v-model:value="formData.gender" name="gender">
            <n-space>
				<!-- 头像和男女有关 -->
              <n-radio :value="1">男</n-radio>
              <n-radio :value="0">女</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
		<!-- 家长可以备注孩子的信息，可以改个说法！！！ -->
        <n-form-item label="备注" path="note">
          <n-input v-model:value="formData.note" type="textarea" placeholder="请输入备注信息" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="cancelAddChild">取消</n-button>
          <n-button type="primary" @click="handleAddChild">确认</n-button>
        </n-space>
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
          <n-input v-model:value="editFormData.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="editFormData.nickname" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="生日" path="birthday">
          <n-date-picker v-model:value="editFormData.birthday" type="date" clearable />
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-radio-group v-model:value="editFormData.gender" name="editGender">
            <n-space>
              <n-radio :value="1">男</n-radio>
              <n-radio :value="0">女</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="备注" path="note">
          <n-input v-model:value="editFormData.note" type="textarea" placeholder="请输入备注信息" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditChildModal = false">取消</n-button>
          <n-button type="primary" @click="handleUpdateChild">确认</n-button>
        </n-space>
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
          <div class="details-name">{{ currentChild.name }}</div>
        </div>
        
        <n-descriptions bordered>
          <n-descriptions-item label="姓名">
            {{ currentChild.name }}
          </n-descriptions-item>
          <n-descriptions-item label="昵称">
            {{ currentChild.nickname }}
          </n-descriptions-item>
          <n-descriptions-item label="性别">
            {{ currentChild.gender === 1 ? '男' : '女' }}
          </n-descriptions-item>
          <n-descriptions-item label="年龄">
            {{ calculateAge(currentChild.birthday) || '未设置' }}
          </n-descriptions-item>
          <n-descriptions-item label="生日">
            {{ formatDate(currentChild.birthday) || '未设置' }}
          </n-descriptions-item>
          <n-descriptions-item label="注册日期">
            {{ formatDate(currentChild.registerDate) }}
          </n-descriptions-item>
          <n-descriptions-item label="Emospark用龄">
            {{ calculateUsageTime(currentChild.registerDate) }}
          </n-descriptions-item>
          <n-descriptions-item label="情绪识别最高正确率">
            {{ currentChild.emotionRecognitionRate || '0' }}%
          </n-descriptions-item>
          <n-descriptions-item label="备注" :span="3">
            {{ currentChild.note || '无' }}
          </n-descriptions-item>
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
	<!-- 弹出提醒 -->
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
  NCard
} from 'naive-ui';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SmileOutlined
} from '@vicons/antd';

// 定义儿童信息接口以解决类型问题 儿童信息的类型定义
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
    
    // 头像可以换！！！
    const boyAvatar = '/src/parents-client/assets/boy.jpg'; // 男生头像
    const girlAvatar = '/src/parents-client/assets/girl.jpg'; // 女孩头像
    
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
      }
    };
    
    // 添加儿童表单数据 - 确保性别有默认值
    const formData = reactive({
      name: '',
      nickname: '',
      birthday: null as Date | null,
      gender: 1, // 确保默认值为1（男）
      avatar: boyAvatar,
      note: ''
    });
    
    // 编辑儿童表单数据
    const editFormData = reactive<ChildInfo>({
      id: '',
      name: '',
      nickname: '',
      birthday: null,
      gender: 1, // 确保默认值为1（男）
      avatar: boyAvatar,
      note: '',
      registerDate: new Date(),
      emotionRecognitionRate: 0
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
        emotionRecognitionRate: 85
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
        emotionRecognitionRate: 78
      }
    ]);
    
    // 初始化
    onMounted(() => {
      // 可以在这里从LocalStorage或API加载数据！！！
      const storedChildren = localStorage.getItem('childrenData');
      if (storedChildren) {
        try {
          // 由于日期对象在JSON中会被序列化，需要手动转换回Date对象
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
	// 可以通过昵称或者孩子的真名(姓名)来查询
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
    
    // 处理添加儿童 - 确保正确处理表单提交
    const handleAddChild = () => {
      if (!addFormRef.value) {
        console.error('Form reference is not available');
        return;
      }
      
      // 获取表单实例并进行验证
      (addFormRef.value as any).validate((errors: any) => {
        if (!errors) {
          // 表单验证通过，创建新儿童信息
          const newChild: ChildInfo = {
            id: String(Date.now()), // 使用时间戳作为临时ID
            name: formData.name,
            nickname: formData.nickname,
            gender: formData.gender,
            birthday: formData.birthday,
            registerDate: new Date(),
            avatar: formData.gender === 1 ? boyAvatar : girlAvatar,
            note: formData.note,
            emotionRecognitionRate: 0
          };
          
          // 添加到数据列表
          childrenData.value.push(newChild);
          saveChildrenData(); // 保存到LocalStorage
          
          // 重置表单和关闭模态框
          resetFormData();
          showAddChildModal.value = false;
          
          // 可以添加成功提示
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
          // 表单验证通过，更新儿童信息
          const index = childrenData.value.findIndex(child => child.id === editFormData.id);
          if (index !== -1) {
            // 根据性别设置头像
            const updatedChild: ChildInfo = {
              ...editFormData,
              avatar: editFormData.gender === 1 ? boyAvatar : girlAvatar
            };
            childrenData.value[index] = updatedChild;
            saveChildrenData(); // 保存到LocalStorage
          }
          showEditChildModal.value = false;
          
          // 可以添加成功提示
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
      formData.gender = 1; // 确保重置为默认值1（男）
      formData.avatar = boyAvatar;
      formData.note = '';
    };
    
    // 计算年龄 - 处理可能没有生日的情况
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
    
    // 计算使用时间 注册时间为起始
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
    
    // 格式化日期 - 处理可能为空的情况
    const formatDate = (date: Date | null) => {
      if (!date) return '';
      
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

.child-card {
  height: 100%;
  transition: transform 0.3s;
}

.child-card:hover {
  transform: translateY(-5px);
}

.child-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
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
</style>