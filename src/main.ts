import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from './router'
import '@lottiefiles/lottie-player'
import 'emoji-picker-element'

createApp(App).use(naive).use(router).mount('#app')
// createApp(App).mount('#app')
