<template>
  <n-card class="w-full max-w-2xl mx-auto mt-12 shadow-lg">
    <n-space vertical size="large" align="center">
      <n-avatar
          round
          size="80"
          src="https://cdn-icons-png.flaticon.com/512/2922/2922656.png"
          alt="Welcome Avatar"
      />

      <n-thing
          title="👋 Welcome, Dear Parents!"
          description="We’re so glad to have you here 🧡"
      >
        <template #default>
          <n-p>
            “EmoSpark” is here to support your child’s emotional journey.
            Together, we’ll help them recognize feelings and build brighter connections with the world.
          </n-p>
        </template>
      </n-thing>

      <n-button type="primary" strong secondary round size="large">
        Get Started 🚀
      </n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NAvatar, NThing, NButton, NP } from 'naive-ui'
</script>

<style scoped>
</style>
