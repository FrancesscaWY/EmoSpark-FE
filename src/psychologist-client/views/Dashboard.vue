
<script setup lang="ts">
import { h,ref } from 'vue'
import { useRouter } from 'vue-router'
import {type MenuOption, NButton, NAvatar,NMessageProvider} from 'naive-ui'
import { MenuOutlined } from '@vicons/antd'
import { NIcon } from 'naive-ui'
import {HomeOutlined,UsergroupAddOutlined,FileTextOutlined, UserOutlined} from "@vicons/antd";

const router = useRouter()
const activeKey = ref('home')

const menuOptions: MenuOption[] = [
  { label: '主页', key: 'index' ,
    icon:()=> h(NIcon,null,{default:()=> h(HomeOutlined)})},
  { label: '关联儿童', key: 'addChildren',
    icon:()=> h(NIcon,null,{default:()=> h(UsergroupAddOutlined)})},
  { label: '工作记录', key: 'records',
    icon:()=> h(NIcon,null,{default:()=> h(FileTextOutlined)})},
  { label: '用户中心', key: 'home',
    icon:()=> h(NIcon, null,{default:()=> h(UserOutlined)})}
]
const isCollapsed = ref(false)
const userName = ref<string>('张医生')
const  handleMenuSelect = (key: string)=> {
  activeKey.value = key
  router.push(`/psychologist/${key}`)
}

</script>

<template>
  <n-layout has-sider style="height: 100vh; width: 100vw; margin: 0;">
    <!-- 左侧导航栏 -->
    <n-layout-sider
        :collapsed="isCollapsed"
        collapse-mode="width"
        :collapsed-width=49
        bordered
        width="150"
        style="margin: 0; padding: 0; left: 0; box-sizing: border-box; position: relative;"
    >
      <n-layout
          style="padding: 14px 0 3px 0;display: flex;justify-content: center;box-sizing: border-box"
      >
        <n-space
            :vertical="isCollapsed"
            align="center"
        >
        <n-avatar
            round
            :size="isCollapsed? 'small':'large'"
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=doctor"/>
<!--          <n-space-->
<!--              align="center"-->
<!--          />-->
          <n-text v-if="!isCollapsed" strong style="font-size: 16px">
            {{userName}}
          </n-text>
        </n-space>
      </n-layout>
      <n-menu
          :options="menuOptions"
          :collapsed="isCollapsed"
          :default-value="activeKey"
          @update:value="handleMenuSelect"
          style="margin: 0; padding: 0;"
      />
    </n-layout-sider>

    <!-- 主体内容 -->
    <n-layout style="margin: 0;">

      <n-layout-header bordered style="padding: 16px; font-size: 18px; font-weight: bold; display: flex; align-items: center;">
        <n-button text @click="isCollapsed = !isCollapsed" style="margin-right: 16px;">
          <template #icon>
            <n-icon>
              <MenuOutlined />
            </n-icon>
          </template>
        </n-button>
        <n-text>EmoSpark - 医生客户端</n-text>
      </n-layout-header>
      <n-button
          type="default"
          style="position: absolute; top: 16px; right: 24px; z-index: 10;"
      >
        退出登录
      </n-button>

      <n-layout-content style="padding: 16px;">
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

