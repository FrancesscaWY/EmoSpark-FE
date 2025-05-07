import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()
createApp(App).use(naive).use(router).use(pinia).mount('#app')
// createApp(App).mount('#app')
