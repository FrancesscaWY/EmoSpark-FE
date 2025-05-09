<template>
  <div class="bg" :style="backgroundStyle">
    <button class="btn" block round @click="onClick">返回</button>
    <n-tabs v-model:value="activeTab" type="line" justify-content="space-evenly" class="tabs">
      <n-tab-pane name="songs" tab="🎵 听儿歌">
        <n-space vertical size="large">
          <n-card
              class="glass-card"
              v-for="item in songs"
              :key="item.id"
              hoverable
              @click="play(item)"
          >
            <template #header>
              <span class="song-title">{{ item.title }}</span>
            </template>
            <template #cover>
              <img :src="item.thumbnail" style="width: 100%; height: 150px; object-fit: cover;" />
            </template>
          </n-card>
        </n-space>
      </n-tab-pane>

      <n-tab-pane name="animations" tab="🎬 看动画">
        <n-space vertical size="large">
          <n-card
              class="glass-card"
              v-for="item in animations"
              :key="item.id"
              :title="item.title"
              hoverable
              @click="play(item)"
          >
            <template #cover>
              <img :src="item.thumbnail" style="width: 100%; height: 150px; object-fit: cover;" />
            </template>
          </n-card>
        </n-space>
      </n-tab-pane>

      <n-tab-pane name="stories" tab="📖 听故事">
        <n-space vertical size="large">
          <n-card
              class="glass-card"
              v-for="item in stories"
              :key="item.id"
              :title="item.title"
              hoverable
              @click="play(item)"
          >
            <template #cover>
              <img :src="item.thumbnail" style="width: 100%; height: 150px; object-fit: cover;" />
            </template>
          </n-card>
        </n-space>
      </n-tab-pane>
    </n-tabs>

    <!-- 全局播放器 -->
    <div class="global-player" v-if="current">
      <audio
          v-if="current.type === 'audio'"
          :src="current.src"
          controls
          autoplay
          style="width: 100%; margin-top: 20px"
      />
      <video
          v-if="current.type === 'video'"
          :src="current.src"
          controls
          autoplay
          style="width: 100%; margin-top: 20px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { NCard, NSpace, NButton, NAlert, NTabs, NTabPane } from 'naive-ui'
const router = useRouter()

interface MediaItem {
  id: number
  title: string
  thumbnail: string
  src: string
  type: 'audio' | 'video'
}

const activeTab = ref<'songs' | 'animations' | 'stories'>('songs')
const onClick = ()=> {
  router.push('/children-routes')
}
const songs = ref<MediaItem[]>([
  {
    id: 1,
    title: 'Healing Song 1',
    thumbnail: 'https://via.placeholder.com/300x150?text=Song+1',
    src: 'https://mymusic-1350807164.cos.ap-guangzhou.myqcloud.com/healing1.mp3',
    type: 'audio'
  },
  {
    id: 2,
    title: '春天的心跳',
    thumbnail: 'src/children-client/assets/bbbk.jpeg',
    src: 'https://mymusic-1350807164.cos.ap-guangzhou.myqcloud.com/2.mp3',
    type: 'audio'
  }

])

const animations = ref<MediaItem[]>([
  {
    id: 3,
    title: 'Relaxing Animation',
    thumbnail: 'https://via.placeholder.com/300x150?text=Animation',
    src: 'https://your-video-link.mp4',
    type: 'video'
  }
])

const stories = ref<MediaItem[]>([
  {
    id: 4,
    title: 'Bedtime Story',
    thumbnail: 'https://via.placeholder.com/300x150?text=Story',
    src: 'https://your-story-audio.mp3',
    type: 'audio'
  }
])

const current = ref<MediaItem | null>(null)

function play(item: MediaItem) {
  current.value = item
}

const bg = 'src/children-client/assets/bk.jpeg'
const backgroundStyle = {
  backgroundImage: `linear-gradient(180deg, #4E81BA 0%, rgba(87, 157, 208, 0.2) 80%), url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}
</script>

<style scoped>
.bg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}
.glass-card {
  /* 宽度设置居中 */
  width: 80%;
  margin: 0 auto 16px;


  /* 保留玻璃磨砂效果 */
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.global-player {
  width:80%;
  position: fixed;
  bottom: 0;
  left: 10%;
  background: transparent;
  padding: 10px;
  z-index: 1000;
}

.tabs {
  width: 70%;
  margin: 0 auto;
  background-color: transparent;
  border-radius: 8px;
  padding: 10px;
}
.song-title{
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-size: 20px;
}
.btn {
  width: 10%;
  height: 6%;
  position: absolute;
  top:4%;
  left:2%;
  font-size: 30px;
  font-weight: 500;
  border-radius: 22px;
  background: linear-gradient(
      0deg,
      rgba(251, 255, 137, 0.09),
      rgba(251, 255, 137, 0.09)
  ),
  #ffcc00;
  transition: background-color 0.2s, transform 0.1s;
  color: navajowhite;
  font-family: "ZCOOL KuaiLe", sans-serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.btn:hover {
  background-color: rgb(255, 191, 127);
}
.btn:active {
  transform: scale(0.97);
}
</style>