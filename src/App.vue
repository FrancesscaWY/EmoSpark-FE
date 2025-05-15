
<script setup lang="ts">
// import CameraButton from "./children-client/components/CameraButton.vue";
// import Welcome1 from "./psychologist-client/components/FloatingWindow.vue";
// import Welcome2 from "./parents-client/components/FloatingWindow.vue";
// import PsychologistDashboard from "./psychologist-client/views/PsychologistDashboard.vue";
</script>

<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>
