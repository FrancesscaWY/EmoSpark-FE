<template>
  <div class="user-settings">
<!--    <div class="settings-header">-->
<!--      <h1>个人中心</h1>-->
<!--      <p class="subtitle">管理您的账户信息和偏好设置</p>-->
<!--    </div>-->

    <!-- 用户信息概览 -->
    <div class="user-overview">
      <div class="avatar-container">
        <!-- 修改头像为首字母蓝色背景 -->
        <div v-if="!userInfo.avatar" class="avatar-initial" @click="triggerAvatarUpload">
          <span>{{ getUserInitial }}</span>
        </div>
        <img v-else :src="userInfo.avatar" alt="用户头像" class="user-avatar" />
        <div class="avatar-overlay" @click="triggerAvatarUpload">
          <span class="avatar-edit-icon">
            <i class="fas fa-camera"></i>
          </span>
        </div>
        <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="handleAvatarChange" />
      </div>
      <div class="user-info-brief">
        <h2>{{ userInfo.username || '未设置用户名' }}</h2>
        <p>{{ userInfo.email || '未绑定邮箱' }}</p>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="settings-tabs">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }" class="tab-btn">
        <i :class="tab.icon"></i>
        {{ tab.name }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="tab-content">
      <!-- 个人信息 Tab -->
      <div v-show="activeTab === 'profile'" class="settings-panel">
        <h2>个人资料</h2>
        <form @submit.prevent="saveProfile" class="settings-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" v-model="userInfo.username" placeholder="请输入用户名">
          </div>

          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="userInfo.email" placeholder="请输入邮箱">
          </div>

          <div class="form-group">
            <label for="phone">手机号码</label>
            <input type="tel" id="phone" v-model="userInfo.phone" placeholder="请输入手机号">
          </div>

          <button type="submit" class="btn primary-btn">保存个人资料</button>
        </form>
      </div>

      <!-- 账号安全 Tab -->
      <div v-show="activeTab === 'security'" class="settings-panel">
        <h2>账号安全</h2>

        <div class="security-section">
          <h3>修改密码</h3>
          <form @submit.prevent="changePassword" class="settings-form">
            <div class="form-group">
              <label for="currentPassword">当前密码</label>
              <input type="password" id="currentPassword" v-model="passwordForm.currentPassword"
                placeholder="请输入当前密码">
            </div>

            <div class="form-group">
              <label for="newPassword">新密码</label>
              <input type="password" id="newPassword" v-model="passwordForm.newPassword"
                placeholder="请输入新密码">
              <div class="password-strength" :class="passwordStrengthClass">
                <div class="strength-bar"></div>
                <span>{{ passwordStrengthText }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">确认新密码</label>
              <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword"
                placeholder="请再次输入新密码">
              <p class="error-message" v-if="passwordMismatch">两次输入的密码不一致</p>
            </div>

            <button type="submit" class="btn primary-btn" :disabled="!passwordValid">
              修改密码
            </button>
          </form>
        </div>
      </div>

      <!-- 通知设置 Tab -->
      <div v-show="activeTab === 'notifications'" class="settings-panel">
        <h2>通知设置</h2>

        <div class="notification-sections">
          <div class="notification-section">
            <h3>系统通知</h3>
            <div class="toggle-option">
              <span class="toggle-label">账号安全提醒</span>
              <label class="switch">
                <input type="checkbox" v-model="notificationSettings.security">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="toggle-option">
              <span class="toggle-label">系统更新通知</span>
              <label class="switch">
                <input type="checkbox" v-model="notificationSettings.updates">
                <span class="slider round"></span>
              </label>
            </div>
          </div>

          <div class="notification-section">
            <h3>活动通知</h3>
            <div class="toggle-option">
              <span class="toggle-label">医生专家消息</span>
              <label class="switch">
                <input type="checkbox" v-model="notificationSettings.messages">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="toggle-option">
              <span class="toggle-label">儿童训练消息</span>
              <label class="switch">
                <input type="checkbox" v-model="notificationSettings.follows">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="notification-delivery">
          <h3>接收方式</h3>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="notificationDelivery.email">
              邮件通知
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="notificationDelivery.push">
              站内通知
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="notificationDelivery.sms">
              短信通知
            </label>
          </div>
        </div>

        <button @click="saveNotificationSettings" class="btn primary-btn">
          保存通知设置
        </button>
      </div>

      <!-- 隐私设置 Tab -->
      <div v-show="activeTab === 'privacy'" class="settings-panel">
        <h2>隐私设置</h2>

        <div class="privacy-section">
          <h3>谁可以给我发送消息</h3>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" v-model="privacySettings.messagePermission" value="everyone">
              <span class="radio-label">所有人</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="privacySettings.messagePermission" value="doctors">
              <span class="radio-label">仅添加的医生专家</span>
            </label>
          </div>
        </div>

        <button @click="savePrivacySettings" class="btn primary-btn">保存隐私设置</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  data() {
    return {
      activeTab: 'profile',
      tabs: [{
          id: 'profile',
          name: '个人资料',
          icon: 'fas fa-user'
        },
        {
          id: 'security',
          name: '账号安全',
          icon: 'fas fa-shield-alt'
        },
        {
          id: 'notifications',
          name: '通知设置',
          icon: 'fas fa-bell'
        },
        {
          id: 'privacy',
          name: '隐私设置',
          icon: 'fas fa-lock'
        }
      ],
      userInfo: {
        username: '',
        email: '',
        avatar: '',
        phone: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      notificationSettings: {
        security: true,
        updates: true,
        messages: true,
        follows: true
      },
      notificationDelivery: {
        email: true,
        push: true,
        sms: false
      },
      privacySettings: {
        messagePermission: 'everyone'
      }
    }
  },
  computed: {
    passwordStrengthClass() {
      if (!this.passwordForm.newPassword) return '';
      const length = this.passwordForm.newPassword.length;
      if (length < 6) return 'weak';
      if (length < 10) return 'medium';
      return 'strong';
    },
    passwordStrengthText() {
      if (!this.passwordForm.newPassword) return '';
      const strength = this.passwordStrengthClass;
      const texts = {
        weak: '弱',
        medium: '中',
        strong: '强'
      };
      return texts[strength] || '';
    },
    passwordMismatch() {
      return this.passwordForm.newPassword &&
        this.passwordForm.confirmPassword &&
        this.passwordForm.newPassword !== this.passwordForm.confirmPassword;
    },
    passwordValid() {
      return this.passwordForm.currentPassword &&
        this.passwordForm.newPassword &&
        this.passwordForm.confirmPassword &&
        !this.passwordMismatch &&
        this.passwordStrengthClass !== 'weak';
    },
    // 获取用户名的首字母，用于头像显示
    getUserInitial() {
      if (!this.userInfo.username) return '?';
      return this.userInfo.username.charAt(0).toUpperCase();
    }
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      // 从API加载用户数据
      console.log('加载用户数据');

      // 模拟API调用
      setTimeout(() => {
        this.userInfo = {
          username: '张三',
          email: 'zhangsan@example.com',
          avatar: '', // 将默认头像设为空，使用首字母头像
          phone: '138****1234'
        };
      }, 500);
    },

    triggerAvatarUpload() {
      this.$refs.avatarInput.click();
    },

    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 检查文件类型和大小
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('请上传JPG、PNG或GIF格式的图片');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        return;
      }

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userInfo.avatar = e.target.result;
        // 这里可以添加上传头像到服务器的逻辑
      };
      reader.readAsDataURL(file);
    },

    saveProfile() {
      // 保存个人资料
      console.log('保存个人资料:', this.userInfo);
      // API调用保存数据
      this.$notify({
        type: 'success',
        title: '成功',
        message: '个人资料已更新'
      });
    },

    changePassword() {
      console.log('修改密码:', this.passwordForm);
      // API调用更改密码
      this.$notify({
        type: 'success',
        title: '成功',
        message: '密码已成功修改'
      });

      // 重置表单
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },

    saveNotificationSettings() {
      console.log('保存通知设置:', {
        settings: this.notificationSettings,
        delivery: this.notificationDelivery
      });
      // API调用保存通知设置
      this.$notify({
        type: 'success',
        title: '成功',
        message: '通知设置已更新'
      });
    },

    savePrivacySettings() {
      console.log('保存隐私设置:', this.privacySettings);
      // API调用保存隐私设置
      this.$notify({
        type: 'success',
        title: '成功',
        message: '隐私设置已更新'
      });
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.user-settings {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  color: #333;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.settings-header {
  text-align: center;
  margin-bottom: 20px;
}

.settings-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.subtitle {
  color: #666;
  margin-top: 5px;
}

/* 用户信息概览区 */
.user-overview {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  position: relative;
  margin-right: 24px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* 改为圆形 */
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 首字母头像样式 */
.avatar-initial {
  width: 100px;
  height: 100px;
  border-radius: 50%; 
  background-color: #1890ff; /* 蓝色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: 600;
  color: white;
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%; /* 改为圆形 */
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-overlay:hover {
  opacity: 1;
}

.avatar-edit-icon {
  color: white;
  font-size: 24px;
}

.hidden {
  display: none;
}

.user-info-brief {
  flex: 1;
}

.user-info-brief h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 600;
}

.user-info-brief p {
  margin: 0 0 5px 0;
  color: #666;
}

/* Tab 导航 */
.settings-tabs {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 30px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.tab-btn i {
  margin-right: 8px;
  font-size: 16px;
}

.tab-btn:hover {
  color: #1890ff;
}

.tab-btn.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

/* 内容面板 */
.settings-panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease;
}

.settings-panel h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-panel h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #444;
}

/* 表单样式 */
.settings-form {
  margin-bottom: 30px;
  width: 80%; /* 设置为外边框的80% */
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
select,
textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border 0.3s, box-shadow 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.primary-btn {
  background-color: #1890ff;
  color: white;
}

.primary-btn:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
}

.primary-btn:active {
  transform: translateY(0);
}

.primary-btn:disabled {
  background-color: #bae7ff;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary-btn {
  background-color: #f0f0f0;
  color: #666;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}

/* 开关样式 */
.toggle-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toggle-label {
  font-weight: 400;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked+.slider {
  background-color: #1890ff;
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 8px;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  position: relative;
}

.strength-bar {
  height: 100%;
  border-radius: 2px;
  width: 33.3%;
  transition: width 0.3s;
}

.password-strength.weak .strength-bar {
  width: 33.3%;
  background-color: #ff4d4f;
}

.password-strength.medium .strength-bar {
  width: 66.6%;
  background-color: #faad14;
}

.password-strength.strong .strength-bar {
  width: 100%;
  background-color: #52c41a;
}

.password-strength span {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 12px;
}

.password-strength.weak span {
  color: #ff4d4f;
}

.password-strength.medium span {
  color: #faad14;
}

.password-strength.strong span {
  color: #52c41a;
}

/* 错误信息 */
.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
}

.help-text {
  color: #999;
  font-size: 14px;
  margin: 5px 0 16px;
}

/* 安全设置区域 */
.security-section {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.security-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* 通知设置区域 */
.notification-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .notification-sections {
    grid-template-columns: repeat(2, 1fr);
  }
}

.notification-section {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.notification-delivery {
  margin-top: 24px;
  margin-bottom: 24px;
}

/* 隐私设置区域 */
.privacy-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.radio-group {
  margin-top: 12px;
}

.radio-option {
  display: block;
  margin-bottom: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.radio-option input[type="radio"] {
  margin-right: 8px;
  cursor: pointer;
}

.radio-label {
  font-weight: normal;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-overview {
    flex-direction: column;
    text-align: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .settings-panel {
    padding: 20px;
  }

  .tab-btn {
    padding: 10px 15px;
    font-size: 14px;
  }
}



/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>