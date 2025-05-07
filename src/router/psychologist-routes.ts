import type {RouteRecordRaw} from 'vue-router'
import Dashboard from "../psychologist-client/views/PsychologistDashboard.vue";
import MainPage from "../psychologist-client/views/MainPage.vue";
import AddChildren from "../psychologist-client/views/AddChild.vue"
import Records from "../psychologist-client/views/Records.vue";
import Face2FaceTreatment from "../psychologist-client/views/Face2FaceTreatmentPage.vue";
import PersonalPage from "../psychologist-client/views/Home.vue"
import RemoteTreatment from "../psychologist-client/views/RemoteTreatment.vue";
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
            {
                name: 'personal',
                path: 'personal',
                component: PersonalPage
            },

            {
                name:'face2face-treatment',
                path:'face2face-treatment',
                component: Face2FaceTreatment,
            },
            {
                name: 'remote-treatment',
                path: 'remote-treatment',
                component: RemoteTreatment
            }
        ]
    }
]

export default psychologistRoutes