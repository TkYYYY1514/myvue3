<template>
    <div  class="div-box">

      <div>
         <ECharts :option="charta" class="chart"/>
      </div>
      

      <ECharts :option="chartb" class="chart"/>
    </div>

 </template>
 
 <script setup>
 import { ref } from 'vue'
 import ECharts from '@/components/common/ECharts.vue';

 const charta = ref({
  title: { text: '基础柱状图' },
  tooltip: {},
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [6,8,5,4,3,2],
    }
  ]
})


const chartb = ref({
  title: { text: '基础饼图' },
  tooltip: {},
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'pie',
      data: [6,8,5,4,3,2],
    }
  ]
})
 </script>


<style scoped>
.div-box{
  display: flex;
  width: 1600px;
  height: 1600px;
  
}
.chart{
   
}

</style>