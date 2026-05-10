<template>
    <div >
        
       <button @click="addage">
        年龄++
       </button>

    </div>
 </template>
 
 <script setup>
 import { inject } from 'vue'

 const addage = inject('addage')
 </script>