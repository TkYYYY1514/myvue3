<template>
      <div class="box">
        <h3>拖拽卡片试试</h3>
        <div>
      <h3 v-count-to="number"></h3>
      <button @click="number += 1000">1000</button>
      <button @click="number += 5000">5000</button>
      <button @click="number += 100">+100</button>
    </div>
        <!-- 拖拽容器 -->
        <div ref="listRef" class="card-list">
          <div class="card" v-for="item in list" :key="item.id">
            {{ item.text }}
          </div>
          <div class=   "card">
            <el-button type="primary">保存</el-button>      
          </div>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue'
    import Sortable from 'sortablejs'
    
    const number = ref(0)
    // 卡片数据
    const list = ref([
      { id: 1, text: '卡片 1' },
      { id: 2, text: '卡片 2' },
      { id: 3, text: '卡片 3' },
      { id: 4, text: '卡片 4' },
    ])
    
    // 容器 DOM
    const listRef = ref(null)
    
    onMounted(() => {
      // 创建拖拽
      Sortable.create(listRef.value, {
        animation: 200, // 动画
        onEnd(e) {
          // 拖动结束
          const oldIndex = e.oldIndex
          const newIndex = e.newIndex
    
          // 更新数组顺序
          const item = list.value.splice(oldIndex, 1)[0]
          list.value.splice(newIndex, 0, item)
        }
      })
    })
    </script>
    
    <style scoped>
    .box {
      padding: 20px;
    }
    .card-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .card {
      width: 300px;
      height: 300px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
    }
    .card:active {
      cursor: grabbing;
    }
    </style>