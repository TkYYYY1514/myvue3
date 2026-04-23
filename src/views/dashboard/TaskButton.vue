<template>
     <el-input v-model="title" style="width: 200px;" >

    </el-input>
  <el-button @click="handleClick">
    添加任务
  </el-button>

</template>

<script setup>
import { ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'

const title = ref('')
const emit = defineEmits(['add-Task'])

const handleClick = () => {
  if (!title.value) return ElMessage.error('请输入任务标题')
  emit('add-Task',{
    id: Date.now(),
    title:  title.value,
    status: 'pending'
  }
)
  title.value = ''
  ElMessage.success('添加任务成功')
}
</script>