<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="side-menu">
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="avatar-container">
          <n-avatar round :size="80" class="user-avatar">{{ userInitials }}</n-avatar>
          <div class="online-indicator"></div>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userData.username }}</div>
          <div class="user-role">{{ getParentRole }}</div>
        </div>
      </div>
      
      <!-- 菜单项（ 侧拉啊）-->
      <n-menu
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuClick"
      />
    </div>
    
    <!-- 右侧内容区域 -->
    <div class="content-area">
      <!-- 顶部标题栏 -->
      <div class="top-bar">
        <div class="page-title">
          EmoSpark-家长客户端
        </div>
        <div class="right-actions">
          <div class="user-info-mini">
            <span class="welcome-text">欢迎您！</span>
            <span class="username-text">{{ userData.username }}</span>
            <n-avatar round :size="40" class="mini-avatar">{{ userInitials }}</n-avatar>
          </div>
		  
		  <!-- 点击跳转可以更改用户登录 -->
          <n-button type="primary" class="account-btn" @click="handleLogout">
            <template #icon><n-icon><user-outlined /></n-icon></template>
            账户管理
          </n-button>
        </div>
      </div>
      
      <!-- 内容显示区域，通过路由切换 -->
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NMenu, NAvatar, NButton, NIcon } from 'naive-ui';
import { UserOutlined } from '@vicons/antd';

export default defineComponent({ // Vue 3 的标准组件定义方式
  name: 'MainLayout',
  components: {
    NMenu,
    NAvatar,
    NButton,
    NIcon,
    UserOutlined
  },
  setup() {
    const router = useRouter();
    
    // ！！！用户信息（API获取）
    const userData = ref({
      username: 'LSY',
      //可以选择要不要显示，最后看效果
      id: '1817',
      childrenName:'sugar'
    });
    
    // 用户名首字母作为头像显示（也可以选择固定头像库中的头像）
    const userInitials = computed(() => {
      return userData.value.username.charAt(0);
    });
    
    // 计算家长角色显示
    const getParentRole = computed(() => {
      if (userData.value.childrenName) {
        return `${userData.value.childrenName}家长`;
      }
      return '未关联儿童';
    });
    
    // 菜单选项
	const menuOptions = [
	  {
		label: '儿童成长记录',
		key: 'childGrowth',
	  },
	  {
		label: '儿童互动',
		key: 'childCommunication',
	  },
	  {
		label: '儿童信息管理',
		key: 'childManagement',  
	  },
	  {
		label: '咨询医生',
		key: 'consultDoctor',
	  }
	];
		
    // 当前激活的菜单项
    const activeKey = ref('childGrowth',);
    
    // 处理菜单点击
    const handleMenuClick = (key: string) => {
      activeKey.value = key;
      router.push({ name: key });
    };
	
    
    // 处理退出登录
    const handleLogout = () => {
      // 实现账户管理功能
      router.push({ name: 'userSettings' });
    };
    
    return {
      userData,
      userInitials,
      menuOptions,
      activeKey,
      handleMenuClick,
      handleLogout,
      getParentRole
    };
  }
});
</script>


<style scoped>
.layout-container {
  display: flex; 
  height: 100vh;
  width: 100%;
}

.side-menu {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 0 0 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.user-info {
  padding: 24px 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background: linear-gradient(to bottom, #f5f9ff, #ffffff);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  position: relative;
  margin-bottom: 16px;
}

.user-avatar {
  background-color: #2080f0;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border: 3px solid #ffffff;
  box-shadow: 0 3px 8px rgba(32, 128, 240, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 12px rgba(32, 128, 240, 0.4);
}

.online-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 14px;
  height: 14px;
  background-color: #52c41a;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
}

.user-role {
  font-size: 14px;
  color: #666;
  background-color: #f0f7ff;
  padding: 4px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.top-bar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 18px;
  font-weight: bold;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f3f7fd;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-info-mini:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  background-color: #e9f1fd;
}

.welcome-text {
  color: #666;
  font-size: 10px;
}

.username-text {
  color: #333;
  font-weight: 600;
  font-size: 15px;
}

.mini-avatar {
  background-color: #2080f0;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(32, 128, 240, 0.3);
  border: 2px solid #ffffff;
}

.account-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  font-weight: 500;
  padding: 6px 16px;
  transition: all 0.2s ease;
}

.account-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>