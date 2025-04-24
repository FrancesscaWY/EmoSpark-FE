<script setup lang="ts">
import {ref, h} from "vue";
import {NAvatar, NButton, useMessage} from "naive-ui";
import {useRouter} from "vue-router";

interface ChildInfo {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  avatar?: string
}

const message = useMessage()
// 静态测试数据：至少包含3条儿童信息
const childrenData = ref<ChildInfo[]>([
  { id: 1, name: 'Liam', age: 6, gender: 'Male', phone: '12345678901' },
  { id: 2, name: 'Olivia', age: 7, gender: 'Female', phone: '12345678902' },
  { id: 3, name: 'Noah', age: 8, gender: 'Male', phone: '12345678903' },
  { id: 4, name: 'Emma', age: 5, gender: 'Female', phone: '12345678904' },
  { id: 5, name: 'Oliver', age: 6, gender: 'Male', phone: '12345678905' },
  { id: 6, name: 'Ava', age: 7, gender: 'Female', phone: '12345678906' },
  { id: 7, name: 'Elijah', age: 8, gender: 'Male', phone: '12345678907' },
  { id: 8, name: 'Sophia', age: 6, gender: 'Female', phone: '12345678908' },
  { id: 9, name: 'William', age: 7, gender: 'Male', phone: '12345678909' },
  { id: 10, name: 'Isabella', age: 8, gender: 'Female', phone: '12345678910' },
  { id: 11, name: 'James', age: 6, gender: 'Male', phone: '12345678911' },
  { id: 12, name: 'Mia', age: 5, gender: 'Female', phone: '12345678912' }
])
const treatmentDialogVisible = ref(false)
const selectedChild = ref<ChildInfo|null>(null)
const getRandomColor = (seed: number) => {
  const colors = ['#f56c6c', '#e6a23c', '#67c23a', '#409EFF', '#909399', '#00b894', '#fd79a8']
  return colors[seed % colors.length]
}
// 定义表格配置
const columns = [
  {
    title: '',
    key: 'avatar',
    width: 70,
    render: (row: ChildInfo) => {
      const randomColor = getRandomColor(row.id);
      // 使用 NAvatar 显示头像
      return h(NAvatar, {
        size: 'large',
        round: true,
        src: row.avatar || undefined,
        style:{
          backgroundColor: row.avatar? 'transparent':randomColor,
          color:'#fff'
        }
      }, {
        default: () => row.name.charAt(0)
      })
    }
  },
  {title: '姓名', key: 'name',width:100},
  {title: '年龄', key: 'age',width:100},
  {title: '性别', key: 'gender',width:100},
  {title: '家属电话', key: 'phone',width:150},
  {
    title: '操作',
    key: 'start',
    render: (row: ChildInfo) => {
      return [
        h(NButton, {
              type: 'primary',
              size: 'medium',
              tertiary: true,
              onClick: () => startTreatment(row)
            },
            {default: () => '开始治疗'}),
        h(NButton, {
          type: 'error',
          size: 'medium',
          tertiary: true,
          style: {marginLeft: '8px'},
          onClick: () => removeAssociation(row)
        }, {default: () => '解除关联'})
      ]
    }
  },
]
const router = useRouter()

const startTreatment = (child: ChildInfo) => {
  selectedChild.value = child
  treatmentDialogVisible.value = true
  router.push({
    name:'/psychologist/treatment',
    query:{
      name:child.name,
      age:child.age.toString(),
      gender:child.gender,
      phone:child.phone
    }
  })
}
const removeAssociation = (child: ChildInfo) => {
  message.warning(`已解除与${child.name}`)
}

const rowKey = (row: ChildInfo) => row.id
const confirmTreatment = ()=>{
  if(selectedChild.value){
    message.success(`开始治疗${selectedChild.value.name}`)
  }else{
   message.warning('没有选择儿童')
  }
  treatmentDialogVisible.value = false
}
</script>

<template>
  <n-layout style="height: 100vh; display: flex; justify-content: center; align-items: center;">
    <n-card>
      <n-text style="font-size:16px" strong>
        我关联的儿童
      </n-text>
    </n-card>
    <n-card style="overflow-x: auto;" >
      <div style="min-width: 900px;">
      <n-data-table
          :columns="columns"
          :data="childrenData"
          :row-key="rowKey"
          :max-height="500"
          :table-layout="'fixed'"
          size="medium"
          bordered
      />
      </div>
    </n-card>
  </n-layout>

  <n-modal
    v-model:show="treatmentDialogVisible"
    title="确认开始治疗"
    preset="dialog"
    :mask-closable="false"
    style="width:400px"
  >
    <div v-if="selectedChild">
      <p><strong>姓名：</strong>{{ selectedChild.name }}</p>
      <p><strong>年龄：</strong>{{ selectedChild.age }}</p>
      <p><strong>性别：</strong>{{ selectedChild.gender }}</p>
      <p><strong>电话：</strong>{{ selectedChild.phone }}</p>
    </div>
    <template #action>
      <n-button round  type="tertiary" @click="treatmentDialogVisible=false">取消</n-button>
      <n-button round  @click="confirmTreatment" style="margin-left: 12px;">
        确认
      </n-button>
    </template>
  </n-modal>
</template>

<style scoped>

</style>