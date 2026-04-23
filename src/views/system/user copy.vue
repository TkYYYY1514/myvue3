<template>
   <div class="user-container">
       <div class="header">
       
            <div class="div-input">
                <el-form-item label="用户名">
                <el-input v-model="username" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="username" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item label="身份">
                <el-input v-model="username" placeholder="请输入身份"></el-input>
            </el-form-item>
            </div>
            
            <div class="div-button">
                <el-button>重置</el-button>
                <el-button>查询</el-button>

                <el-button class="menu-button" 
                    @click="xo">
                    <el-icon ><FullScreen /></el-icon>
                    <!--  全屏 -->
                </el-button>
            </div>
            


      

            


            
      </div>

       <!-- 表格 -->
        <div  class="table-wrapper">
           <el-table 
           :data="userData"
         
           v-loading="loading"
           style="width: 100%;height: 100%;"
           @sort-change="handleSortChange"
           border    stripe 
           
           >

           <el-table-column prop="id" label="ID" min-width="25px"sortable="custom" />
           <el-table-column prop="name" label="姓名" min-width="30px" />
           <el-table-column prop="gander" label="性别" min-width="30px" sortable="custom" >
               <template #default="scope">
                   {{ scope.row.gander === 1 ? '男' : '女' }}
               </template>
           </el-table-column>

           <el-table-column prop="phone" label="电话" min-width="50px" />
           
           <el-table-column prop="date" label="创建时间"min-width="50px" sortable="custom"/>
          
           <el-table-column prop="address" label="地址" />

           <el-table-column prop="roles" label="角色身份">
               <template #default="scope">
                   <el-tag 
                       v-for="role in scope.row.roles" 
                       :key="role.roleCode"
                       
                       size="small"
                       style="margin-right: 5px;">
                       {{ role.roleName }}
                   </el-tag>
               </template>
           </el-table-column>
           
           <el-table-column prop="address" label="操作" min-width="60px">
               <template #default="scope">
                   <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                   <el-button size="small" type="danger"  @click="handleDelete(scope.row)">删除</el-button>
               </template>
           </el-table-column>

           </el-table> 
       </div>
      

       <!-- 分页组件区域 -->
      <div class="pagination-footer" >
       
           <el-pagination
           v-model:current-page="currentPage"
           v-model:page-size="pageSize"
           :page-sizes="[ 20, 40, 100,500 ,1000]"
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
import { inject } from 'vue'
import {  FullScreen } from '@element-plus/icons-vue'
const xo = inject('xx')
const userData = ref([])
const loading = ref(false)

const currentPage = ref(1)//页码
const pageSize = ref(40)
const total = ref(0)//总数据量

const sortState = ref({
   prop: '',  //排序字段
   order: ''  // 'ascending' (升序) 或 'descending' (降序)
}) 





const fetchData = async()=>{
   loading.value = true
   try{
       const res = await axios.get('/api/user/list',{
           params:{
               page:currentPage.value,
               pageSize:pageSize.value,

               //传给后端排序信息
               sortBy: sortState.value.prop,
               sortOrder: sortState.value.order
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


//表头点击方法
const handleSortChange = ({prop,order}) => {
 sortState.value = {prop,order}

 currentPage.value = 1 // 重置回第一页

 fetchData() // 重新请求
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
   overflow: hidden;   /*  */
   box-sizing: border-box;
   /* 关键：禁止容器本身出现滚动条 */
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

.header{
    min-height: 60px; 
}
.div-input{
    display: flex;
    gap: 20px;
}

</style>

