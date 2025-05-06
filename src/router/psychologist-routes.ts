import type {RouteRecordRaw} from 'vue-router'
import Dashboard from "../psychologist-client/views/Dashboard.vue";
import MainPage from "../psychologist-client/views/MainPage.vue";
import AddChildren from "../psychologist-client/views/AddChild.vue"
import Records from "../psychologist-client/views/Records.vue";
import TreatmentPage from "../psychologist-client/views/TreatmentPage.vue";
const psychologistRoutes: RouteRecordRaw [] = [
    {
        path:'/psychologist',
        name:'psychologist',
        component:Dashboard,
        children:[
            {path:'',redirect:'/psychologist/index'},
            {
                path:'index',
                name:'index',
                component: MainPage,
                children:[
                    {
                        name:'treatment',
                        path:'treatment',
                        component: TreatmentPage,
                    }
                ]
            },
            {
                path:'addChildren',
                name:'addChildren',
                component: AddChildren
            },
            {
                path:'records',
                name:'records',
                component: Records
            },
        ]
    }
]

export default psychologistRoutes