<template>
    <div class="div">
      <div>
         <h2>P1</h2>
       <p1>
      <template #p01>
         这是一条普通文本消息 
      </template>

      <template #p02>
         <p>这是一个带有<span style="color: red;">颜色</span>的消息 </p>
      </template>

       </p1>
      </div>
       
      <div>
         <h2 >P2</h2>
         <p2 type="info"> 这是提示消息 </p2>
         <p2 type="success"> 这是成功消息 </p2>
         <p2 type="warning"> 这是警告消息 </p2>
         <p2 type="error"> 这是错误消息 </p2>
       

      </div>
       
      <div>
         <h2 >P3</h2>
         <button @click="toggle">切换</button>
         <Transition name="fade" mode="out-in">
            <component :is="isHome ? p31 : p32" />
         </Transition>
      </div>
         

      <div>
         <h2 >P4</h2>
         
         <p41></p41>
         
         <p42></p42>
      </div>
         

    </div>
 </template>
 
 <script setup>
 
 import { ref,provide  } from 'vue'
 import  p1  from './p1.vue'
 import  p2  from './p2.vue'
 import  p31  from './p31.vue'
 import  p32  from './p32.vue'

 import  p41  from './p41.vue'
 import  p42  from './p42.vue'
 const data = ref({
  name: '张凯涛',
  age:  28,
})

provide('data', data)


provide('addage', (newAge) => {
   data.value.age++
})

const isHome = ref(true)
const toggle = () => {
  isHome.value = !isHome.value  
}
 </script>

<style scoped>
 .div{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
 }

 .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>