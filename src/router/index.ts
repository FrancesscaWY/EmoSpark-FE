import { createRouter, createWebHistory } from 'vue-router'
import childRoutes from './children-routes'
// import parentRoutes from './parents-routes'
// import psychologistRoutes from './psychologist-routes'

// 引入 choos.vue 页面
const ChoosePage = () => import('../log/choos.vue')

const routes = [
    { path: '/', redirect: '/children-routes' },
    // 默认跳转到身份选择页
   // { path: '/', redirect: '/choos' },

    // 身份选择页
   // { path: '/choos', name: 'Choose', component: ChoosePage },

    // 其他子路由
    ...childRoutes,
    // ...parentRoutes,
    // ...psychologistRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router