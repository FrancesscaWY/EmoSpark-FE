<template>
  <div class="child-growth-container">
    <div class="section-title">儿童成长记录</div>
    
    <!-- 选择儿童 --><!-- 几个孩子下拉后就有几个选项 -->
    <div class="child-selector">
      <n-select
        v-model:value="selectedChild"
        :options="childrenOptions"
        placeholder="请选择儿童"
        @update:value="handleChildChange"
      />
    </div>
    <!-- 信息展示卡片 -->
    <div class="child-info-card">
      <div class="child-basic-info">
		  
		  <!-- 头像，儿童注册的时候再头像库种选择 -->
        <div class="child-avatar">
          <n-avatar round size="large">
            <template #icon>
              <n-icon>
                <smile-icon />
              </n-icon>
            </template>
          </n-avatar>
        </div>
        <div class="child-details">
          <div class="info-row">
            <span class="label">姓名：</span>
            <span class="value">{{ currentChild.nickname || '未设置' }}</span>
          </div>
          <div class="info-row">
            <span class="label">年龄：</span>
            <span class="value">{{ currentChild.age || '未设置' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Emospark用龄：</span>		<!-- Emospark用龄时常可以根据注册时间来确定 -->
            <span class="value">{{ currentChild.time || '未设置' }}</span> 
          </div>
        </div>
      </div>
      
      <div class="records-container">
        <!-- 治疗记录 -->
        <div class="record-section">
          <div class="record-title">医生治疗记录</div>
          <div class="table-scroll-container">
            <n-data-table
              size="small"
              :columns="treatmentColumns"
              :data="treatmentRecords"
              :bordered="false"
              :single-line="false"
              :max-height="180"
            />
          </div>
        </div>
        
        <!-- 情绪识别记录 -->
        <div class="record-section">
          <div class="record-title">用户使用记录</div>
          <div class="table-scroll-container">
            <n-data-table
              size="small"
              :columns="emotionColumns"
              :data="emotionRecords"
              :bordered="false"
              :single-line="false"
              :max-height="180"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//childernid需要定义（现在每次使用时都在重新）	

import { defineComponent, ref, reactive, onMounted,h } from 'vue';//用来创建按钮组件
import { NSelect, NAvatar, NIcon, NDataTable, NButton } from 'naive-ui';
import { SmileOutlined as SmileIcon } from '@vicons/antd';


export default defineComponent({
  name: 'ChildGrowth',
  components: {
    NSelect,
    NAvatar,
    NIcon,
    NDataTable,
    SmileIcon
  },
  setup() {
    // 儿童列表选项
    const childrenOptions = ref([
      { label: 'BEVERLY', value: '1' },
      { label: 'EVA', value: '2' }
    ]);
    
    // 当前选中的儿童ID
    const selectedChild = ref('1');
    
    // 当前儿童详细信息
    const currentChild = reactive({
      id: '1',
      nickname: 'BEVERLY',
      age: '7岁',
      time: '一年'
    });
    
    // 治疗记录表格列定义
    const treatmentColumns = [
      {
        title: '日期',
        key: 'date'
      },
      {
        title: '时长',
        key: 'duration'
      },
      {
        title: '医生',
        key: 'doctor'
      },
      {
        title: '医生评价',
        key: 'evaluation'
      },
      {
        title: '报告',
        key: 'report',
        render(row: { id: any; }) {
          return h(
            NButton,
            {
              size: 'small',
              onClick: () => viewReport(row.id)
            },
            { default: () => '查看' }
          );
        }
      }
    ];
    
    // 添加更多治疗记录数据用于演示滚动
	//医生信息id、名字根据医生端的注册信息来确定
	//治疗时间就是医生和儿童互动时常统计
	//更多信息处可以增加儿童选择情绪的选项、正确率等等
    const treatmentRecords = ref([
      {
        id: '101',
        date: '2025-04-15',
        duration: '45分钟',
        doctor: '李医生',
        evaluation: '良好'
      },
      {
        id: '102',
        date: '2025-04-08',
        duration: '30分钟',
        doctor: '王医生',
        evaluation: '进步明显'
      },
      {
        id: '103',
        date: '2025-04-01',
        duration: '40分钟',
        doctor: '李医生',
        evaluation: '情绪稳定'
      },
      {
        id: '104',
        date: '2025-03-25',
        duration: '35分钟',
        doctor: '张医生',
        evaluation: '注意力有所提升'
      },
      {
        id: '105',
        date: '2025-03-18',
        duration: '45分钟',
        doctor: '王医生',
        evaluation: '需继续训练'
      }
    ]);
    
    // 情绪识别记录表格列定义
	//儿童自己训练则不存在正确率的问题，后续需要改进！！！
    const emotionColumns = [
      {
        title: '日期',
        key: 'date'
      },
      {
        title: '时长',
        key: 'duration'
      },
      {
        title: '正确率',
        key: 'accuracy'
      },
      {
        title: '详情',
        key: 'details',
        render(row: { id: any; }) {
          return h(
            NButton,
            {
              size: 'small',
              onClick: () => viewEmotionDetails(row.id)
            },
            { default: () => '查看' }
          );
        }
      }
    ];
    
    // 添加更多情绪识别记录数据用于演示滚动
    const emotionRecords = ref([
      {
        id: '201',
        date: '2025-04-20',
        duration: '15分钟',
        accuracy: '75%'
      },
      {
        id: '202',
        date: '2025-04-14',
        duration: '20分钟',
        accuracy: '70%'
      },
      {
        id: '203',
        date: '2025-04-07',
        duration: '18分钟',
        accuracy: '72%'
      },
      {
        id: '204',
        date: '2025-03-30',
        duration: '25分钟',
        accuracy: '68%'
      },
      {
        id: '205',
        date: '2025-03-23',
        duration: '15分钟',
        accuracy: '65%'
      }
    ]);
    
    // 切换选中的儿童
    const handleChildChange = (childId: any) => {
      // 实际应用中应从API获取儿童详细信息
      fetchChildDetails(childId);
      fetchTreatmentRecords(childId);
      fetchEmotionRecords(childId);
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
    
    // 获取治疗记录
    const fetchTreatmentRecords = async (childId: string) => {
      try {
        // 实际应用中应调用API
        // const response = await axios.get(`/api/treatments?childId=${childId}`);
        // treatmentRecords.value = response.data;
        
        // 模拟数据
        if (childId === '1') {
          treatmentRecords.value = [
            {
              id: '101',
              date: '2025-04-15',
              duration: '45分钟',
              doctor: '李医生',
              evaluation: '良好'
            },
            {
              id: '102',
              date: '2025-04-08',
              duration: '30分钟',
              doctor: '王医生',
              evaluation: '进步明显'
            },
            {
              id: '103',
              date: '2025-04-01',
              duration: '40分钟',
              doctor: '李医生',
              evaluation: '情绪稳定'
            },
            {
              id: '104',
              date: '2025-03-25',
              duration: '35分钟',
              doctor: '张医生',
              evaluation: '注意力有所提升'
            },
            {
              id: '105',
              date: '2025-03-18',
              duration: '45分钟',
              doctor: '王医生',
              evaluation: '需继续训练'
            }
          ];
        } else if (childId === '2') {
          treatmentRecords.value = [
            {
              id: '103',
              date: '2025-04-18',
              duration: '40分钟',
              doctor: '张医生',
              evaluation: '需要继续观察'
            },
            {
              id: '106',
              date: '2025-04-11',
              duration: '35分钟',
              doctor: '李医生',
              evaluation: '交流能力有提升'
            },
            {
              id: '107',
              date: '2025-04-04',
              duration: '30分钟',
              doctor: '王医生',
              evaluation: '情绪识别正确率上升'
            }
          ];
        }
      } catch (error) {
        console.error('获取治疗记录失败', error);
      }
    };
    
    // 获取情绪识别记录
    const fetchEmotionRecords = async (childId: string) => {
      try {
        // 实际应用中应调用API
        // const response = await axios.get(`/api/emotions?childId=${childId}`);
        // emotionRecords.value = response.data;
        
        // 模拟数据
        if (childId === '1') {
          emotionRecords.value = [
            {
              id: '201',
              date: '2025-04-20',
              duration: '15分钟',
              accuracy: '75%'
            },
            {
              id: '202',
              date: '2025-04-14',
              duration: '20分钟',
              accuracy: '70%'
            },
            {
              id: '203',
              date: '2025-04-07',
              duration: '18分钟',
              accuracy: '72%'
            },
            {
              id: '204',
              date: '2025-03-30',
              duration: '25分钟',
              accuracy: '68%'
            },
            {
              id: '205',
              date: '2025-03-23',
              duration: '15分钟',
              accuracy: '65%'
            }
          ];
        } else if (childId === '2') {
          emotionRecords.value = [
            {
              id: '203',
              date: '2025-04-19',
              duration: '25分钟',
              accuracy: '65%'
            },
            {
              id: '206',
              date: '2025-04-12',
              duration: '20分钟',
              accuracy: '68%'
            },
            {
              id: '207',
              date: '2025-04-05',
              duration: '22分钟',
              accuracy: '70%'
            }
          ];
        }
      } catch (error) {
        console.error('获取情绪识别记录失败', error);
      }
    };
    
    // 查看治疗报告
    const viewReport = (reportId: any) => {
      console.log('查看治疗报告', reportId);
      // 实现查看报告的逻辑，可以打开一个对话框或导航到新页面
    };
    
    // 查看情绪识别详情
    const viewEmotionDetails = (recordId: any) => {
      console.log('查看情绪识别详情', recordId);
      // 实现查看情绪识别详情的逻辑
    };
    
    // 组件挂载时加载数据
    onMounted(() => {
      fetchChildDetails(selectedChild.value);
      fetchTreatmentRecords(selectedChild.value);
      fetchEmotionRecords(selectedChild.value);
    });
    
    return {
      childrenOptions,
      selectedChild,
      currentChild,
      treatmentColumns,
      treatmentRecords,
      emotionColumns,
      emotionRecords,
      handleChildChange,
      viewReport,
      viewEmotionDetails
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
.child-basic-info {
  display: flex;
  margin-bottom: 30px;
}

.child-avatar {
  margin-right: 30px;
}

.child-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-row {
  margin-bottom: 8px;
}

.label {
  color: #666;
  margin-right: 5px;
}

.records-container {
  display: flex;
  flex-direction: column;
  gap:  px;
}

.record-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  height: 300px; /* 固定高度 */
}

.record-title {
  font-weight: bold;
  margin-bottom: 15px;
  border-left: 4px solid #18a058;
  padding-left: 10px;
}

.table-scroll-container {
  height: 250px; /* 设置一个固定高度，剩余空间用于滚动 */
}

/* 自定义滚动条样式 */
.table-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>