import { createRouter, createWebHistory } from 'vue-router'
// import childRoutes from './children-routes'
import parentRoutes from './parents-routes'
import psychologistRoutes from './psychologist-routes.ts'
import Login from '../login/Login.vue'
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component:Login},
    // ...childRoutes,
    ...parentRoutes,
    ...psychologistRoutes
]



const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
