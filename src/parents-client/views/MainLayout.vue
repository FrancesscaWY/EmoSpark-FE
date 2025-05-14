<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div :class="['side-menu', { collapsed: isCollapsed }]">
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

      <!-- 菜单项 -->
      <n-menu :options="menuOptions" :value="activeKey" @update:value="handleMenuClick" :collapsed="isCollapsed" :collapsed-width="80" />
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-area">
      <!-- 顶部标题栏 -->
      <div class="top-bar">
        <div class="title-section">
          <n-button 
            text 
            @click="toggleMenu" 
            class="menu-toggle-btn"
            :class="{ active: !isCollapsed }"
          >
            <template #icon>
              <n-icon size="20">
                <menu-outlined />
              </n-icon>
            </template>
          </n-button>
          <div class="page-title">
            EmoSpark-家长客户端
          </div>
        </div>
        
        <div class="right-actions">
          <template v-if="!isMiniWelcome">
            <n-button type="primary" class="account-btn" @click="handleLogout">
              <template #icon><n-icon><user-outlined /></n-icon></template>
              退出登录
            </n-button>
          </template>
        </div>
      </div>

      <!-- 内容显示区域，通过路由切换 -->
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
    
    <!-- 遮罩层，用于小屏幕下点击关闭菜单 -->
    <div v-if="!isCollapsed && isMobile" class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, h, type ComponentOptionsMixin, type ComponentProvideOptions, type DefineComponent, type PublicProps } from 'vue';
import { useRouter } from 'vue-router';
import { NMenu, NAvatar, NButton, NIcon } from 'naive-ui';
import { 
  UserOutlined, 
  MenuOutlined,
  HistoryOutlined,
  MessageOutlined,
  ProfileOutlined,
  MedicineBoxOutlined,
  SettingOutlined // 新添加的图标
} from '@vicons/antd';

export default defineComponent({
  name: 'MainLayout',
  components: {
    NMenu,
    NAvatar,
    NButton,
    NIcon,
    UserOutlined,
    MenuOutlined,
    HistoryOutlined,
    MessageOutlined,
    ProfileOutlined,
    MedicineBoxOutlined,
    SettingOutlined // 新添加的图标
  },
  setup() {
    const router = useRouter();
    const isCollapsed = ref(false); // 左侧菜单是否收起
    const isMiniWelcome = ref(false); // 是否缩小欢迎区域
    const isMobile = ref(false); // 是否为移动设备视图

    // 检查屏幕尺寸并相应调整UI
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        isCollapsed.value = true;
        isMiniWelcome.value = true;
        isMobile.value = true;
      } else if (width <= 1024) {
        isCollapsed.value = true;
        isMiniWelcome.value = false;
        isMobile.value = false;
      } else {
        isCollapsed.value = false;
        isMiniWelcome.value = false;
        isMobile.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('resize', checkScreenSize);
      checkScreenSize(); // 初次加载时检查一次
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkScreenSize);
    });

    // 切换菜单
    const toggleMenu = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    // 关闭菜单（用于移动端点击遮罩层时）
    const closeMenu = () => {
      isCollapsed.value = true;
    };

    // 用户信息（API获取）
    const userData = ref({
      username: 'LSY',
      id: '1817',
      childrenName: 'sugar'
    });

    // 用户名首字母作为头像显示
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

    // 渲染图标的辅助函数
    function renderIcon(icon: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }

    // 菜单选项，不再使用不同的背景色
    const menuOptions = ref([
      {
        label: '儿童成长记录',
        key: 'childGrowth',
        icon: renderIcon(HistoryOutlined)
      },
      {
        label: '儿童互动',
        key: 'childCommunication',
        icon: renderIcon(MessageOutlined)
      },
      {
        label: '儿童信息管理',
        key: 'childManagement',
        icon: renderIcon(ProfileOutlined)
      },
      {
        label: '咨询医生',
        key: 'consultDoctor',
        icon: renderIcon(MedicineBoxOutlined)
      },{
        label: '用户中心',
        key: 'userSettings',
        icon: renderIcon(SettingOutlined)
      }
    ]);

    // 当前激活的菜单项
    const activeKey = ref('childGrowth');

    // 处理菜单点击
    const handleMenuClick = (key: string) => {
      activeKey.value = key;
      router.push({ name: key });
      // 在移动设备上点击菜单项后关闭菜单
      if (isMobile.value) {
        isCollapsed.value = true;
      }
    };

    // 处理退出登录
    const handleLogout = () => {
      router.push({ path:'/login' });
    };

    return {
      isCollapsed,
      isMiniWelcome,
      isMobile,
      userData,
      userInitials,
      menuOptions,
      activeKey,
      handleMenuClick,
      handleLogout,
      getParentRole,
      toggleMenu,
      closeMenu
    };
  }
});
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;
}

/* 左侧菜单样式 */
.side-menu {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 0 0 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  z-index: 100;
}

:deep(.n-menu-item) {
  margin: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.n-menu-item:hover) {
  background-color: #f0f7ff;
}

:deep(.n-menu-item-content-header) {
  font-weight: 500;
}

:deep(.n-menu-item-content__icon-placeholder) {
  margin-right: 4px;
}

:deep(.n-menu-item--selected) {
  background-color: #e6f4ff !important;
}

.side-menu.collapsed {
  width: 80px;
  padding: 0;
}

/* 在移动设备上的特殊样式 */
@media (max-width: 768px) {
  .side-menu {
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    transform: translateX(0);
  }
  
  .side-menu.collapsed {
    transform: translateX(-100%);
  }
}

/* 收起时隐藏用户信息 */
.side-menu.collapsed .user-info {
  display: none;
}

/* 用户信息样式 */
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
  background-color: #2080f0; /* 保持蓝色背景 */
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

/* 右侧内容区域 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  transition: margin-left 0.3s ease;
}

/* 顶部标题栏 */
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

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.menu-toggle-btn:hover {
  background-color: #f0f7ff;
}

.menu-toggle-btn.active {
  background-color: #e6f4ff;
  color: #2080f0;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
}

/* 右侧操作区 */
.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 遮罩层，用于移动端关闭菜单 */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-bar {
    height: 56px;
    padding: 0 16px;
  }

  .right-actions {
    gap: 8px;
  }

  .page-title {
    font-size: 16px;
  }

  .main-content {
    padding: 12px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .content-area {
    margin-left: 80px;
  }
}
</style>