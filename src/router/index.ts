import { createRouter, createWebHistory } from 'vue-router'
// import childRoutes from './children-routes'
 import parentRoutes from './parents-routes'
//import psychologistRoutes from './psychologist-routes.ts'

const routes = [
    { path: '/', redirect: '/parents' },
    // { path: '/login', component: () => import('@/views/Login.vue') },
    // ...childRoutes,
     ...parentRoutes,
    //...psychologistRoutes
]



const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
