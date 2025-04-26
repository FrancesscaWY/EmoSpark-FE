<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="Logo" class="logo" v-if="logoExists">
        <h1 v-else>EmoSpark</h1>
      </div>
      
      <h2 class="login-title">家长端登录</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="loginForm.username" 
            placeholder="请输入用户名" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="loginForm.password" 
              placeholder="请输入密码" 
              required
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </div>
        
        <div class="remember-forgot">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="forgotPassword">忘记密码?</a>
        </div>
        
        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>
      
      <div class="register-link">
        还没有账号? <a href="#" @click.prevent="goToRegister">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      showPassword: false,
      isLoading: false,
      errorMessage: '',
      logoExists: false
    }
  },
  mounted() {
    // 在组件加载时检查是否记住了用户名
    const savedUsername = localStorage.getItem('rememberedUsername')
    if (savedUsername) {
      this.loginForm.username = savedUsername
      this.loginForm.rememberMe = true
    }
    
    // 检查logo是否存在
    this.checkLogoExists()
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ''
      this.isLoading = true
      
      try {
        // 这里添加你的登录逻辑，调用API等
        // 以下是模拟的登录过程
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟登录验证
        if (this.loginForm.username && this.loginForm.password) {
          // 如果勾选了"记住我"，则保存用户名到本地存储
          if (this.loginForm.rememberMe) {
            localStorage.setItem('rememberedUsername', this.loginForm.username)
          } else {
            localStorage.removeItem('rememberedUsername')
          }
          
          // 保存登录状态和用户信息
          // 实际项目中应该将token等信息保存到vuex或pinia状态管理中
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('userInfo', JSON.stringify({
            username: this.loginForm.username,
            // 其他用户信息...
          }))
          
          // 登录成功后跳转到首页或仪表盘
          this.$router.push('/dashboard')
        } else {
          this.errorMessage = '请输入用户名和密码'
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.errorMessage = '登录失败，请检查用户名和密码'
      } finally {
        this.isLoading = false
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    forgotPassword() {
      // 实现忘记密码功能
      // 可能会跳转到重置密码页面或显示找回密码的弹窗
      alert('忘记密码功能将在后续版本中实现')
    },
    goToRegister() {
      // 跳转到注册页面
      this.$router.push('/register')
    },
    async checkLogoExists() {
      try {
        // 检查logo文件是否存在
        // 实际项目中可能需要根据实际路径调整
        const logoPath = '../assets/logo.png'
        
        // 尝试加载图片以检查是否存在
        const img = new Image()
        img.onload = () => {
          this.logoExists = true
        }
        img.onerror = () => {
          this.logoExists = false
        }
        img.src = logoPath
      } catch (error) {
        this.logoExists = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f9fc;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  padding: 40px 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.logo {
  max-height: 60px;
  max-width: 200px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
}

.forgot-password {
  color: #4a90e2;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  color: #e53935;
  font-size: 14px;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #3a80d2;
}

.login-button:disabled {
  background-color: #a0c1e8;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>