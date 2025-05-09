<template>
  <div></div>
  <n-list size="small">
    <n-list-item
        v-for="conv in conversations"
        :key="conv.id"
        :class="['list-item', { active: conv.id === activeId }]"
        clickable
    @click="handleClick(conv.id)" >
      <n-avatar :src="conv.avatar" />
      <span class="name">{{ conv.name }}</span>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { NList, NListItem, NAvatar } from 'naive-ui'
// ① 定义 props
interface Props {
  conversations: { id: number; name: string; avatar: string }[]
  activeId: number | null
}
const props = defineProps<Props>()


const emit = defineEmits<{
  (e: 'select', id: number): void
}>()


function handleClick(id: number) {
  console.log('ChatList emit select', id)
  emit('select', id)
}
</script>

<style scoped>
.name { margin-left: 8px; }
.list-item  { transition: background 0.2s, color 0.2s; cursor: pointer; }
.active {
  background: #bae0ff !important; /* 选中更深色 */
  color: #1d39c4;
}
.list-item:hover {
  background:white;    /* 轻蓝底 */
  color: #4e81ba;
}
.name{
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-size: 25px;
  font-weight: 400;
}

</style>