<script setup lang="ts">
import { ref } from "vue";
import { useMessage } from 'naive-ui';

const message = useMessage();

const form = ref({
  name: '',
  id: '',
  gender: '',
  familyPhone: '',
});

const genderOptions = ref([
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
]);

// 表格字段配置
const columns = [
  { title: '姓名', key: 'name' },
  { title: '性别', key: 'gender' },
  { title: '年龄', key: 'age' },
  { title: '家属电话', key: 'familyPhone' },
  { title: '关联时间', key: 'relationTime' },
];

// 关联记录数据，使用 ref 使其响应式
const records = ref([
  { name: '张三', gender: '男', age: 30, familyPhone: '13812345678', relationTime: '2025-05-06 10:00' },
  { name: '李四', gender: '女', age: 28, familyPhone: '13998765432', relationTime: '2025-05-05 09:30' },
  { name: '王五', gender: '男', age: 35, familyPhone: '13654321098', relationTime: '2025-05-04 14:15' },
]);

const rowKey = (row: any) => row.id; // 假设记录有唯一的 id

const submitForm = () => {
  console.log('Form submitted:', form.value);
  message.success(`成功关联儿童` + form.value.name);
  form.value.id = '';
  form.value.name = '';
  form.value.gender = '';
  form.value.familyPhone = '';
};
</script>

<template style="overflow-y: hidden">

  <n-layout style="padding: 24px; display: flex;">
    <n-row gutter="12" style="width: 100vw">
      <n-col span="10">
        <n-card title="关联儿童" style="display: flex; align-items: center">
          <n-form style="width: 35vw;">
            <n-form-item label="儿童姓名">
              <n-input v-model:value="form.name" placeholder="请输入儿童姓名"/>
            </n-form-item>
            <n-form-item label="性别">
              <n-select v-model:value="form.gender" :options="genderOptions" placeholder="请选择性别" />
            </n-form-item>
            <n-form-item label="年龄">
              <n-input v-model:value="form.name" placeholder="请输入儿童年龄"/>
            </n-form-item>
            <n-form-item label="帐号">
              <n-input v-model:value="form.id" placeholder="请输入儿童帐号"/>
            </n-form-item>
            <n-form-item label="家属电话">
              <n-input v-model:value="form.familyPhone" placeholder="请输入家属电话" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="submitForm">添加关联</n-button>
            </n-form-item>
          </n-form>
        </n-card>
      </n-col>

      <n-col span="12">
        <n-card title="关联记录" style="overflow-y:auto; width: 100%; height: 595px">
          <n-table striped>
            <thead>
            <tr>
              <th>姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>家属电话</th>
              <th>关联时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(record,index) in records" :key="index">
              <td>{{record.name}}</td>
              <td>{{record.gender}}</td>
              <td>{{record.age}}</td>
              <td>{{record.familyPhone}}</td>
              <td>{{record.relationTime}}</td>
            </tr>
            </tbody>
          </n-table>
        </n-card>
      </n-col>
    </n-row>
  </n-layout>
</template>

<style scoped>
</style>
