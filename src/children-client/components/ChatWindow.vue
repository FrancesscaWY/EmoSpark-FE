<template>
  <div class="chat-window">
    <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['msg', msg.fromMe ? 'me' : 'them']"
    >
      <template v-if="msg.type==='text'">
        <div class="bubble">{{ msg.content }}</div>
      </template>
      <template v-else-if="msg.type==='image'">
        <img :src="msg.content" class="img-msg" />
      </template>
      <template v-else>
        <audio :src="msg.content" controls />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
type Message = { id:number; fromMe:boolean; type:string; content:string }
defineProps<{ messages: Message[] }>()
</script>

<style scoped>
.chat-window {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.msg { display: flex; margin-bottom: 12px; }
.msg.them {
  justify-content: flex-start;
}

/* 我自己的消息靠右 */
.msg.me {
  justify-content: flex-end;
}
.bubble {
  max-width: 60%;
  padding: 8px 12px;
  position: relative;
  word-break: break-word;
  color:white;
}
/* 我发出的消息 */
.msg.me .bubble {

  background: #4e81ba;
  color: white;
  border-radius: 12px 12px 0 12px;
}

/* 我方气泡的“尾巴” */
.msg.me .bubble::after {
  content: '';
  position: absolute;
  right: -6px; /* 向右伸出 */
  top: 10px;
  border-width: 6px 0 6px 6px;
  border-style: solid;
  border-color: transparent transparent transparent #4e81ba;
}

/* 对方发出的消息 */
.msg.them .bubble {
  background: #f1f0f0;
  color: #333;
  border-radius: 12px 12px 12px 0;
}

/* 对方气泡的“尾巴” */
.msg.them .bubble::before {
  content: '';
  position: absolute;
  left: -6px; /* 向左伸出 */
  top: 10px;
  border-width: 6px 6px 6px 0;
  border-style: solid;
  border-color: transparent #f1f0f0 transparent transparent;
}
.img-msg { max-width:200px; border-radius:8px; }
</style>