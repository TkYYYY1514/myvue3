<template>

 <el-button @click="handleClick">
   点赞计数
 </el-button>

</template>

<script setup>
import { ref } from 'vue'

const number = ref(0)
const emit = defineEmits(['like'])

const handleClick = () => {
 number.value++
 emit('like',{
   number: number.value,
 }
)
}
</script>