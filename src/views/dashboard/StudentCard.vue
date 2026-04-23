<template>
    <div :style="{ backgroundColor: bgColor }" style="width: 300px;"> 
        <p >姓名：{{ name }}</p>
        <p >分数:{{ score }}</p>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'

const props = defineProps({
    name: String,
    score: Number,
    customColor: String
})

const bgColor = computed(() => {
  if (props.customColor) return props.customColor
  
  if(props.score >= 60)return 'green'
  return 'red'
})
</script>