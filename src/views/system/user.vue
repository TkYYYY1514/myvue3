<template>
    <div class="user-container">
       <div class="header" v-if="lp">
        <h3>用户管理</h3> 
       </div>

        <!-- 表格 -->
         <div  class="table-wrapper">
            <el-table :data="userData"height="100%"
            v-loading="loading"style="width: 100%">

            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="date" label="创建" width="180" />
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="address" label="地址" />

            </el-table> 
        </div>
       

        <!-- 分页组件区域 -->
       <div class="pagination-footer">
        <button @click="lp = !lp">
            隐藏
        </button>
            <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
       </div>
        
    </div>  
 </template>
 
 <script setup>
 import{ref,onMounted} from 'vue'
 import axios from 'axios'
 import { ElMessage } from 'element-plus'

 const userData = ref([])
 const loading = ref(false)

 const currentPage = ref(1)//页码
 const pageSize = ref(20)
 const total = ref(0)//总数据量
const lp = ref(false)
const fetchData = async()=>{
    loading.value = true
    try{
        const res = await axios.get('/api/user/list',{
            params:{
                page:currentPage.value,
                pageSize:pageSize.value
            }
        })
      
        if(res.data.code === 200){
            userData.value = res.data.data.list
            total.value = res.data.data.total
        }else {
            ElMessage.error(res.data.message)

        }
    }catch(error) { 
        console.error('请求错误：',error)
        ElMessage.error('网络请求异常')
    }finally{
        loading.value = false
    }
}


// 当用户改变“每页显示条数”时触发
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1 // 改变每页大小时，重置回第一页
  fetchData()           // 重新请求
}

// 当用户点击“页码”或“下一页”时触发
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()           // 重新请求
}



onMounted(() => {
  fetchData()
})
 </script>

 <style scoped>
.user-container{
    display: flex;
    flex-direction: column;
    height: 100%;       /* 关键：填满父容器 el-main 的高度 */
    width: 100%;
    overflow: hidden;   /* 关键：禁止容器本身出现滚动条 */
    box-sizing: border-box;
}
.header {
    flex-shrink: 0;     /* 防止被挤压 */
    padding: 5 0px;
}
.table-wrapper {
    flex: 1;            
    min-height: 0;      /* 关键：Flex 布局下防止内容溢出 */
    overflow: hidden;   /* 隐藏该层的滚动条，让内部的 el-table 处理 */
    position: relative;
    padding: 10px;      
    box-sizing: border-box;
}

.pagination-footer {
    flex-shrink: 0;
    padding: 10px 0;
    display: flex;
    justify-content: center;
}


:deep(.el-table__body-wrapper) {
    /* 确保表格体可以滚动 */
    overflow-y: auto !important; 
}
</style>

