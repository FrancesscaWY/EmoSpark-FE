<template>
  <div class="consult-doctor-container">
    <div class="section-title">咨询医生线</div>
    <!-- 这里添加咨询医生的界面内容 -->
    <n-card>
      <div>这里是咨询医生界面，可以与医生进行交流沟通。</div>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NCard } from 'naive-ui';

export default defineComponent({
  name: 'ConsultDoctor',
  components: {
    NCard
  }
});
</script>

<style scoped>
.consult-doctor-container {
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>