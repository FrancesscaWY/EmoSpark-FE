<template>
  <n-card class="w-full max-w-2xl mx-auto mt-12 shadow-lg">
    <n-space vertical size="large" align="center">
      <n-avatar
          round
          size="80"
          src="https://cdn-icons-png.flaticon.com/512/4205/4205661.png"
          alt="Psychologist Avatar"
      />

      <n-thing
          title="🧠 Welcome, Esteemed Psychologist!"
          description="Your expertise helps light the way 🌟"
      >
        <template #default>
          <n-p>
            Thank you for joining our mission to support children with autism through emotional awareness and social engagement.
            <br />
            Your role is crucial in guiding understanding, empathy, and meaningful progress.
          </n-p>
        </template>
      </n-thing>

      <n-button type="info" round size="large" strong secondary>
        Enter Therapist Dashboard 🩺
      </n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NAvatar,
  NThing,
  NButton,
  NP
} from 'naive-ui'
</script>

<style scoped>
</style>
