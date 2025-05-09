<template>
  <div class="homepage" :style="{ backgroundImage: `url(${bg})` }">
    <!-- 大星星 -->
    <img
        v-for="(s, i) in stars"
        :key="i"
        class="star"
        :src="starImg"
        :style="{
        top: s.top,
        left: s.left,
        width: s.size,
        transform: `rotate(${s.rotate})`
      }"
        alt="star"
    />
    <div class="left">
    <!-- 用户头像 -->
    <div class="user">
      <n-avatar :size="90" round :src="avatarImg" />
    </div>

    <!-- 按钮列表 -->
    <div class="btn-wrapper">
      <n-button class="btn" block round @click="gocompany">星陪伴</n-button>
      <n-button class="btn" block round @click="gomusic">星疗愈</n-button>
      <n-button class="btn" block round @click="gochat">星社区</n-button>
      <n-button class="btn" block round @click="onClick">星朋友</n-button>
      <n-button class="btn" block round @click="gohome">个人主页</n-button>
    </div>
    </div>
    <div class="right">
    <div class="title">
      <h1 class="zi">Hi,欢迎来到星友</h1>
    </div>
    <div> <h4 class="eng">twinkle twinkle little star </h4>
    </div>
      <div>
<!--        <router-view></router-view>-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar, NButton } from 'naive-ui'
import bg from '../assets/bk.jpeg'
import avatarImg from '../assets/img.png'
import starImg from '../assets/star.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const gocompany = ()=> {
  router.push('/children-company')
}
const gomusic = ()=> {
  router.push('/children-music')
}
const gochat = ()=> {
  router.push('/children-chat')
}
const gohome = ()=> {
  router.push('/children-home')
}
function onClick() {
  console.log('按钮被点击')
}

const stars = [
  { top: '60px',  left: '180px', size: '121px', rotate: '0deg'   },
  { top: '0px',  left: '470px', size: '140px', rotate: '15deg'  },
  { top: '200px', left: '890px', size: '135px', rotate: '-10deg' },
]
</script>
<style scoped>
.homepage {
  position: relative;
  padding-top: 1px; /* 防止 margin 折叠 */
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  display: flex;
  /* 水平分区：左侧 & 右侧 */
  flex-direction: row;
}

/* 星星 */
.star {
  position: absolute;
  pointer-events: none;
  user-select: none;
}


.user {
  position: absolute;
  top: 50px;
  left: 35px;
}


.btn-wrapper {
  position: absolute;
  top: 150px;
  left: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn {
  height: 50px;
  width:140px;
  margin-top: 20px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 22px;
  background: linear-gradient(
      0deg,
      rgba(251, 255, 137, 0.09),
      rgba(251, 255, 137, 0.09)
  ),
  #ffcc00;
  transition: background-color 0.2s, transform 0.1s;
  font-family: "ZCOOL KuaiLe", sans-serif;
}
.btn:hover {
  background-color: rgb(255, 191, 127);
}
.btn:active {
  transform: scale(0.97);
}
.left {
  width: 220px;             /* 根据需要调整宽度 */
  padding: 50px 30px;       /* 上下左右内边距 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 40px;
  color: #fff;
}
.title {
  margin: 110px 0 0 120px;
}
.zi{
  /*-webkit-text-stroke: 1px rgba(0, 0, 17, 0.71);*/
  margin: 0;                 /* 去掉 h1 默认上下 margin */
  color: antiquewhite;
  font-size: 90px;
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.eng {
  font-family: "Comic Relief", system-ui;
  font-weight: 400;
  font-style: normal;
  font-size: 35px;
  margin: 4px 0 0 180px;
}

</style>