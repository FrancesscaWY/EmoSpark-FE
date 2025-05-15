<script setup lang="ts">
import {ref} from 'vue';
import { NInput, NButton, NTable } from 'naive-ui';

// 数据字段
const records = ref([
  { time: '2025-05-06 10:00', name: '小星', gender: '男', age: 5, accuracy: 90, duration: 60, report: '报告1' },
  { time: '2025-05-05 09:30', name: '甜甜', gender: '女', age: 6, accuracy: 85, duration: 45, report: '报告2' },
  { time: '2025-05-04 14:15', name: '乐乐', gender: '男', age: 7, accuracy: 92, duration: 70, report: '报告3' },
  { time: '2025-05-03 13:45', name: '欢欢', gender: '女', age: 4, accuracy: 87, duration: 55, report: '报告4' },
  { time: '2025-05-02 08:30', name: '菲菲', gender: '男', age: 5, accuracy: 91, duration: 65, report: '报告5' },
  { time: '2025-05-01 11:00', name: '欣欣', gender: '女', age: 6, accuracy: 80, duration: 50, report: '报告6' },
  { time: '2025-04-30 16:20', name: '婷婷', gender: '男', age: 7, accuracy: 88, duration: 60, report: '报告7' },
  { time: '2025-04-29 15:00', name: '哆哆', gender: '女', age: 6, accuracy: 90, duration: 60, report: '报告8' },
  { time: '2025-04-28 14:00', name: '嘟嘟', gender: '男', age: 5, accuracy: 93, duration: 75, report: '报告9' },
  { time: '2025-04-27 13:30', name: '糖糖', gender: '女', age: 4, accuracy: 89, duration: 55, report: '报告10' },
  { time: '2025-04-26 12:00', name: '喵喵', gender: '男', age: 5, accuracy: 84, duration: 50, report: '报告11' },
  { time: '2025-04-25 10:15', name: '萌萌', gender: '女', age: 6, accuracy: 86, duration: 60, report: '报告12' },
  { time: '2025-04-24 09:00', name: '丽丽', gender: '男', age: 7, accuracy: 92, duration: 65, report: '报告13' },
  { time: '2025-04-23 17:00', name: '贝贝', gender: '女', age: 6, accuracy: 78, duration: 45, report: '报告14' },
  { time: '2025-04-22 13:15', name: '彤彤', gender: '男', age: 5, accuracy: 91, duration: 70, report: '报告15' },
  { time: '2025-04-21 10:45', name: '萍萍', gender: '女', age: 4, accuracy: 90, duration: 50, report: '报告16' },
  { time: '2025-04-20 14:30', name: '超超', gender: '男', age: 7, accuracy: 85, duration: 60, report: '报告17' },
  { time: '2025-04-19 13:00', name: '小雪', gender: '女', age: 5, accuracy: 82, duration: 45, report: '报告18' },
  { time: '2025-04-18 15:30', name: '悠悠', gender: '男', age: 6, accuracy: 88, duration: 50, report: '报告19' },
  { time: '2025-04-17 11:15', name: '小星', gender: '女', age: 5, accuracy: 90, duration: 55, report: '报告20' },
]);

// 搜索框的关键字
const searchQuery = ref('');

// 过滤后的记录
const filteredRecords = ref(records.value);

// 表格列配置
// const columns = [
//   { title: '时间', key: 'time' },
//   { title: '姓名', key: 'name' },
//   { title: '性别', key: 'gender' },
//   { title: '年龄', key: 'age' },
//   { title: '情绪辨别准确率', key: 'accuracy' },
//   { title: '治疗时长', key: 'duration' },
//   { title: '治疗报告', key: 'report' },
// ];

// 行键
// const rowKey = (row: any) => row.time;

// 搜索函数
const search = () => {
  const query = searchQuery.value.toLowerCase();
  filteredRecords.value = records.value.filter(record => {
    return (
        record.name.toLowerCase().includes(query) ||
        record.gender.toLowerCase().includes(query) ||
        record.accuracy.toString().includes(query) ||
        record.duration.toString().includes(query) ||
        record.report.toLowerCase().includes(query)
    );
  }).sort((a,b)=> new Date(b.time).getTime() - new Date(a.time).getTime());
};

// 高亮显示关键字的行
// const isHighlighted = (row: any) => {
//   const query = searchQuery.value.toLowerCase();
//   if (!query) return false;
//
//   return (
//       row.name.toLowerCase().includes(query) ||
//       row.gender.toLowerCase().includes(query) ||
//       row.accuracy.toString().includes(query) ||
//       row.duration.toString().includes(query) ||
//       row.report.toLowerCase().includes(query)
//   );
// };

// 查看报告
const viewReport = (row: any) => {
  console.log('查看报告:', row.report);
  // 实现查看报告的逻辑
};

// 导出报告
const exportReport = (row: any) => {
  console.log('导出报告:', row.report);
  // 实现导出报告的逻辑
};
</script>

<template>
    <!-- 搜索框和按钮 -->
    <n-card justify="start" style="margin-bottom: 20px; width: 90vw" >
      <n-input v-model:value="searchQuery" placeholder="请输入关键字" clearable style="width: 80%; margin-right: 20px"/>
      <n-button type="primary" @click="search">搜索</n-button>
    </n-card>

  <div v-if="filteredRecords.length === 0 && searchQuery !== '' " style="text-align: center; color: #aaa" >
    暂无相关工作记录~
  </div>
    <!-- 表格 -->
    <n-card style="overflow-y: auto; height: 75vh" >
    <n-table striped  v-if="filteredRecords.length > 0" style="overflow-y: auto; height: 75vh" >
      <thead>
      <tr>
        <th class="title">时间</th>
        <th class="title">姓名</th>
        <th class="title">性别</th>
        <th class="title">年龄</th>
        <th class="title">情绪识别准确率</th>
        <th class="title">治疗时长</th>
        <th class="title">治疗报告</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(record,index) in filteredRecords" :key="index">
        <td>{{record.time}}</td>
        <td>{{record.name}}</td>
        <td>{{record.gender}}</td>
        <td>{{record.age}}</td>
        <td>{{record.accuracy}}%</td>
        <td>{{record.duration}}分钟</td>
        <td>
          <n-space>
            <n-button @click="viewReport(record.report)">查看</n-button>
            <n-button @click="exportReport(record.report)">导出</n-button>
          </n-space>
        </td>
      </tr>
      </tbody>
    </n-table>
    </n-card>
</template>



<style scoped>
.title{
  position: sticky; top: 0; background: #fff; z-index: 1;
}
n-table {
  max-height: 400px;
  overflow-y: auto;
}

/* 固定表头 */
th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
</style>
