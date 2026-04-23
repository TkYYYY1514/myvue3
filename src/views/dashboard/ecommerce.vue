<template>
   <div class="maxdiv">
      <div class-="p1">
         <h2>p1</h2>
         <TaskButton @add-Task="addTask" />
         <div v-for ="task in tasks" :key="task.id">
               
               <el-tag>{{ task.title }}</el-tag>
         </div>
      </div>

      <div>
         <h2>p2</h2>
         <StudentCard  name="张凯涛" :score="60"/>
         <StudentCard   name="奶龙"    :score="59"/>
      </div>

      <div>
         <h2>p3</h2>
         <LikeButton @like="addLike" />
         <p>你已经喜欢{{ number }}次了</p>
      </div>
     
   </div>
 </template>
 
 <script setup>
import  TaskButton  from './TaskButton.vue'
import  StudentCard  from './StudentCard.vue'
import  LikeButton  from './LikeButton.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

 const tasks = ref([])
const number = ref(0)
 const addTask = (task) => {
   tasks.value.push(task)
 }

 const addLike = (data) => {
  number.value = data.number
 }

 </script>

<style scoped>
.maxdiv{
  height: 100vh;  display: flex;
  justify-content:center;
  align-items: center;  
  
}


.p1{
 
}
</style>