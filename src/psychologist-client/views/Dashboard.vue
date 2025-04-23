<template>
  <n-layout has-sider style="height: 100vh; width: 100vw; margin: 0;">
    <!-- 左侧导航栏 -->
    <n-layout-sider
        :collapsed="isCollapsed"
        collapse-mode="width"
        :collapsed-width="0"
        bordered
        width="200"
        style="margin: 0; padding: 0; left: 0; box-sizing: border-box; position: relative;"
    >
      <n-menu
          :options="menuOptions"
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
        EmoSpark - 医生客户端
      </n-layout-header>

      <n-layout-content style="padding: 16px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import { MenuOutlined } from '@vicons/antd'
import { NIcon } from 'naive-ui'

const router = useRouter()
const activeKey = ref('home')

const menuOptions: MenuOption[] = [
  { label: '主页', key: 'index' },
  { label: '关联儿童', key: 'addChildren' },
  { label: '工作记录', key: 'records' },
  { label: '用户中心', key: 'home' }
]
const isCollapsed = ref(false)

const  handleMenuSelect = (key: string)=> {
  activeKey.value = key
  router.push(`/psychologist/${key}`)
}
</script>
