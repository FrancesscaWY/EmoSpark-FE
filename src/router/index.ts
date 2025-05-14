import { createRouter, createWebHistory } from 'vue-router'
// <<<<<<< parents
// import childRoutes from './parents-routes'
// import parentRoutes from './parents-routes'
// import psychologistRoutes from './psychologist-routes'

// // 引入 choos.vue 页面
// const ChoosePage = () => import('../log/choos.vue')

// const routes = [
//     { path: '/', redirect: '/parents-routes' },
//     // 默认跳转到身份选择页
//    // { path: '/', redirect: '/choos' },

//     // 身份选择页
//    // { path: '/choos', name: 'Choose', component: ChoosePage },

//     // 其他子路由
//     ...childRoutes,
//     // ...parentRoutes,
//     // ...psychologistRoutes
// =======
import childRoutes from './children-routes'
import parentRoutes from './parents-routes'
import psychologistRoutes from './psychologist-routes'
import Chose from '../login/choos.vue'
import Login from '../login/Login.vue'
import User from "../children-client/views/children-company.vue";
import music from "../children-client/views/children-music.vue";
import chat from "../children-client/views/children-chat.vue";
import home from "../children-client/views/children-home.vue";
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/chose', component:Chose},
    {path: '/login', component: Login},
    ...childRoutes,
    ...parentRoutes,
    ...psychologistRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router