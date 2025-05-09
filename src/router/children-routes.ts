// src/router/children-routes.ts
// src/router/children-routes.ts
import type { RouteRecordRaw } from 'vue-router'
import User from "../children-client/views/children-company.vue"
import music from "../children-client/views/children-music.vue"
import chat from "../children-client/views/children-chat.vue"
import home from "../children-client/views/children-home.vue"
const childrenRoutes: RouteRecordRaw[] = [
    {
        path: '/children-routes',               // ← 根路径就是 homepage
        name: 'ChildrenHome',
        component: () => import('../children-client/views/homepage.vue'),},
        // children:[
    {
                path: '/children-company',
                name: 'company',
                component: User
    },
    {
        path: '/children-music',
        name: 'music',
        component: music
    },
    {
        path: '/children-chat',
        name: 'chat',
        component: chat
    },
    {
        path: '/children-home',
        name: 'home',
        component: home
    },
        // ]
    // },





]

export default childrenRoutes
