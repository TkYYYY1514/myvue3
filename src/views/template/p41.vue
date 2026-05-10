<template>
    <div >
        
       <h1>用户信息</h1>

       <p>用户名：{{ data.name }}</p>
       <p>年龄：{{ data.age }}</p>

    </div>
 </template>
 
 <script setup>
import { inject } from 'vue'
const data = inject('data')

 </script>