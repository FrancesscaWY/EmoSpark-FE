import {type RouteRecordRaw} from 'vue-router'
import MainLayout from '../parents-client/views/MainLayout.vue'
import ChildGrowth from '../parents-client/views/ChildGrowth.vue'
import ChildManagement from '../parents-client/views/ChildManagement.vue'
import ChildCommunication from '../parents-client/views/ChildCommunication.vue'
import ConsultDoctor from '../parents-client/views/MainLayout.vue'
import UserSettings from '../parents-client/views/MainLayout.vue'

const router: RouteRecordRaw [] = [
  {
    path: '/parents',  
    component: MainLayout,//外部框架（里面嵌入路由指定的页面）
    name: 'parents',
    children: [
      {
        path: '',
        redirect: '/parents/child-growth'  // 初始页面
      },
	  
	  //儿童成长记录
      {
        path: 'child-growth',
        name: 'childGrowth',
        component: ChildGrowth
      },
	  // 儿童互动(情绪测试页面)
      {
        path: 'child-communication',
        name: 'childCommunication',
        component: ChildCommunication
      },
	  // 儿童信息管理(查看/绑定儿童信息)
      {
        path: 'child-management',
        name: 'childManagement',  
        component: ChildManagement
      },
	  // 家长和医生沟通界面(聊天框)
      {
        path: 'consult-doctor',
        name: 'consultDoctor',
        component: ConsultDoctor
      },
	  // 用户设置界面(家长端)
      {
        path: 'user-settings',  // 将用户设置移到父路由内
        name: 'userSettings',
        component: UserSettings
      }
    ]
  }
]

export default router