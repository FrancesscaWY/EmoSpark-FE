<template>
  <div class="user-settings">
    <h1>用户设置</h1>
    <!-- 这里添加你的用户设置表单和组件 -->
    <div class="settings-container">
      <div class="setting-section">
        <h2>个人信息</h2>
        <form @submit.prevent="savePersonalInfo">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" v-model="userInfo.username">
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="userInfo.email">
          </div>
          <button type="submit" class="save-btn">保存</button>
        </form>
      </div>
      
      <div class="setting-section">
        <h2>偏好设置</h2>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="preferences.notifications">
            启用通知
          </label>
        </div>
        <div class="form-group">
          <label>主题</label>
          <select v-model="preferences.theme">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="system">跟随系统</option>
          </select>
        </div>
        <button @click="savePreferences" class="save-btn">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  data() {
    return {
      userInfo: {
        username: '',
        email: ''
      },
      preferences: {
        notifications: true,
        theme: 'system'
      }
    }
  },
  mounted() {
    // 这里可以添加加载用户数据的逻辑
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      // 从API或本地存储加载用户数据
      console.log('加载用户数据');
      
      // 模拟API调用
      setTimeout(() => {
        this.userInfo = {
          username: '测试用户',
          email: 'test@example.com'
        };
      }, 500);
    },
    savePersonalInfo() {
      // 保存个人信息的逻辑
      console.log('保存个人信息:', this.userInfo);
      // 这里添加API调用保存数据
    },
    savePreferences() {
      // 保存偏好设置的逻辑
      console.log('保存偏好设置:', this.preferences);
      // 这里添加API调用保存数据
    }
  }
}
</script>

<style scoped>
.user-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.settings-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .settings-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #555;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input[type="checkbox"] {
  margin-right: 8px;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #45a049;
}
</style>