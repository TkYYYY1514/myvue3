<template>
   <div class="user-container">
       <div class="header">
       
            <div class="div-input">
                <el-form-item label="用户名">
                <el-input v-model="searchForm.username"
                 placeholder="请输入用户名"
                 @keyup.enter="handleSearch"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchForm.phone" 
                placeholder="请输入手机号"
                @keyup.enter="handleSearch"></el-input>
            </el-form-item>

            <el-form-item label="身份">
                <el-input v-model="searchForm.role" 
                placeholder="请输入身份"
                @keyup.enter="handleSearch"></el-input>
            </el-form-item>
            </div>
            
            <div class="div-button">
                <el-button  @click="handleReset">重置</el-button>
                <el-button  @click="handleSearch">查询</el-button>
                <el-button  @click="handleAdd">添加</el-button>
                <el-button  @click="handleExport">
                    <el-icon><Download /></el-icon>
                    导出选中 ({{ selectedDataMap.size }})
                </el-button>


                <el-button class="menu-button" 
                    @click="xo">
                    <el-icon ><FullScreen /></el-icon>
                    <!--  全屏 -->
                </el-button>

            </div>

            <!-- 弹窗 -->
            <el-dialog
                v-model="dialogVisible"
                :title="dialogTitle"
                width="500px"
                @close=""
                >
                <!-- 使用封装好的 BaseForm -->
                <BaseForm
                    ref="formRef"
                    :schemas="dynamicSchemas"
                    v-model="formData"
                />

                <template #footer>
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary":loading=isSubmitting @click="handleSubmit">确定</el-button>
                </template>
            </el-dialog>
            

      </div>

       <!-- 表格 -->
            <div class="table-wrapper">
            <div v-loading="loading" class="loading-container">
                <!-- 表头 -->
                <div class="table-header">
                    <div class="table-cell checkbox-cell">
                       <el-checkbox 
                           v-model="isCurrentPageAllSelected" 
                           @change="handleSelectAll"
                           :indeterminate="isIndeterminate"
                       />
                   </div>

                    <div class="table-cell">ID</div>
                    <div class="table-cell">用户名</div>
                    <div class="table-cell">性别</div>
                    <div class="table-cell">手机号</div>
                    <div class="table-cell">密码</div>
                    <div class="table-cell">角色身份</div>
                    <div class="table-cell">操作</div>
                </div>
                
                <div v-if="userData.length === 0 && !loading" class="empty-data-tip">
                    <el-empty description="暂无用户数据" />
                </div>



                <!-- 虚拟滚动列表 -->
                <RecycleScroller
                    class="scroller"
                    :items="userData"
                    :item-size="40"
                    key-field="id"
                    v-slot="{ item }"
                >
                    <div class="table-row">
                        <div class="table-cell checkbox-cell">
                           <el-checkbox 
                               :model-value="selectedIds.has(item.id)"
                               @change="(val) => handleSelectChange(item, val)"
                           />
                       </div>

                        <div class="table-cell">{{ item.id }}</div>
                        <div class="table-cell">{{ item.username }}</div>
                        <div class="table-cell">{{ item.gender === 1 ? '男' : '女' }}</div>
                        <div class="table-cell">{{ item.phone }}</div>
                        <div class="table-cell">{{ item.password }}</div>
                       
                        <!-- 在 template 中修改角色列 -->
                        <div class="table-cell">
                            <!-- 使用 el-tooltip 包裹 -->
                            <el-tooltip 
                                effect="dark" 
                                placement="top-start" 
                                :disabled="item.roles.length <= 2" 
                            >
                                <template #content>
                                    <!-- 自定义 tooltip 内容，可以垂直排列 -->
                                    <div v-for="r in item.roles" :key="r.roleCode" style="padding: 2px 0;">
                                        {{ r.roleName }}
                                    </div>
                                </template>
                                
                                <!-- 实际显示的内容，保持单行省略 -->
                                <div class="role-tags-wrapper">
                                    <el-tag
                                        v-for="role in item.roles"
                                        :key="role.roleCode"
                                        size="small"
                                        style="margin-right: 5px;"
                                    >
                                        {{ role.roleName }}
                                    </el-tag>
                                </div>
                            </el-tooltip>
                        </div>

                        <div class="table-cell">
                            <el-button size="default" @click="handleEdit(item)">编辑</el-button>
                            <el-button v-permission="'user:delete'"  size="default" type="danger" @click="handleDelete(item)">删除</el-button>
                        </div>
                    </div>
                </RecycleScroller>
            </div>
            </div>

      

       <!-- 分页组件区域 -->
      <div class="pagination-footer" >
       
           <el-pagination
           v-model:current-page="currentPage"
           v-model:page-size="pageSize"
           :page-sizes="[ 50, 100, 1000,10000 ,100000]"
           layout="total, sizes, prev, pager, next, jumper"
           :total="total"
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           />
      </div>
       
   </div>  
</template>

<script setup>

import{ref,onMounted,computed } from 'vue'
import { ElMessage ,ElMessageBox } from 'element-plus'
import { inject } from 'vue'
import {  FullScreen,Download  } from '@element-plus/icons-vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import * as XLSX from 'xlsx'
import BaseForm from '@/components/common/BaseForm.vue'; 
import { userFormSchemas } from '@/utils/userForm';//表单及其配置
import { getUserList, addUser, updateUser, deleteUser } from '@/api/user';//用户相关API

// 动态生成表单配置，根据 isEdit 状态调整密码字段的规则
const dynamicSchemas = computed(() => {
  return userFormSchemas.map(item => {
    
    return item;
  });
});

const xo = inject('xx')
const userData = ref([])
const loading = ref(false)

const currentPage = ref(1)//页码
const pageSize = ref(1000)
const total = ref(0)//总数据量

const sortState = ref({
   prop: '',  //排序字段
   order: ''  // 'ascending' (升序) 或 'descending' (降序)
}) 

const searchForm = ref({
    username: '',   // 用户名
    phone: '',      // 手机号
    role: ''        // 身份/角色
})

// --- 弹窗与表单逻辑 ---
const dialogVisible = ref(false); // 控制弹窗显示
const isEdit = ref(true);        // 标记当前是新增还是编辑模式
const formRef = ref(null);        // 表单组件实例

// 表单数据对象
const formData = ref({});

// 动态计算弹窗标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑用户' : '新增用户';
});

// --- 方法 ---

// 1. 点击“新增”按钮
const handleAdd = () => {
  isEdit.value = false;
  formData.value = {}; // 新增时清空数据
  dialogVisible.value = true;
};

// 2. 点击“编辑”按钮
const handleEdit = (row) => {
  isEdit.value = true;
  formData.value = JSON.parse(JSON.stringify(row));
  
  // ✅ 将表格的 roles 对象数组转换为表单需要的 roleId 数组
  if (row.roles && Array.isArray(row.roles)) {
    formData.value.role = row.roles.map(r => r.roleId);
  } else {
    formData.value.role = [];
  }
  
  dialogVisible.value = true;
};

// 3. 点击“确定”按钮提交表单
const isSubmitting = ref(false);



const handleSubmit = async () => {
  // 防重复提交
  if (isSubmitting.value) return;
  
 
  
 
  
  const { username, phone, password, role } = formData.value

  if (
    !username?.trim() ||
    !phone?.trim() ||
    !password?.trim() ||
    !role || role.length === 0
  ) {
    ElMessage.error('请完整填写所有必填项！')
    return
  }

  try {

    isSubmitting.value = true;
      // 转换为普通对象，确保数据正确传递
      const formDataObj = JSON.parse(JSON.stringify(formData.value));
      
      let data;
      if (isEdit.value) {
        // 编辑模式
        data = await updateUser(formDataObj);
      } else {
        // 新增模式
        data = await addUser(formDataObj);
      }
    
    if (data.code === 200) {
      ElMessage.success(isEdit.value ? '编辑成功' : '添加成功');
      dialogVisible.value = false;
      fetchData(); // 刷新数据
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error(isEdit.value ? '编辑失败，请重试' : '添加失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

// 4. 点击“删除”按钮
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    loading.value = true;
    const data = await deleteUser(row.id);
    if (data.code === 200) {
      ElMessage.success('删除成功');
      fetchData(); // 刷新数据
    } else {
      ElMessage.error(data.message);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
      ElMessage.error('删除失败，请重试');
    }
  } finally {
    loading.value = false;
  }
};







const selectedIds = ref(new Set()) // 用于存储选中的用户ID
const selectedDataMap = ref(new Map()) // 用于存储选中的用户数据

const isCurrentPageAllSelected  = computed(() => {
    if (userData.value.length === 0) return false
    return userData.value.every(item => selectedIds.value.has(item.id))
})
const isIndeterminate = computed(() => {
    const currentSelectedCount = userData.value.filter(item => selectedIds.value.has(item.id)).length
    return currentSelectedCount > 0 && currentSelectedCount < userData.value.length
})

// 处理单个勾选
const handleSelectChange = (item, checked) => {
    if (checked) {
        selectedIds.value.add(item.id)
        selectedDataMap.value.set(item.id, item) // 缓存完整数据
    } else {
        selectedIds.value.delete(item.id)
        selectedDataMap.value.delete(item.id)
    }
}

// 处理表头全选
const handleSelectAll = async (checked) => {
    if (checked) {
        // 弹出选择：全选当前页 还是 全选所有数据
        try {
            await ElMessageBox.confirm(
                `当前共有 ${total.value} 条数据，请选择全选范围`,
                '全选提示',
                {
                    confirmButtonText: '全选所有数据',
                    cancelButtonText: '仅全选当前页',
                    distinguishCancelAndClose: true,
                    type: 'info'
                }
            ).then(async () => {
                // 用户选择“全选所有数据”
                loading.value = true
                try {
                    // 请求所有数据（不分页或大分页）
                    const res = await axios.get('/api/user/list', {
                        params: {
                            page: 1,
                            pageSize: total.value, // 获取全部
                            username: searchForm.value.username,
                            phone: searchForm.value.phone,
                            role: searchForm.value.role,
                            sortBy: sortState.value.prop,
                            sortOrder: sortState.value.order
                        }
                    })
                    if (res.data.code === 200) {
                        const allList = res.data.data.list
                        allList.forEach(item => {
                            selectedIds.value.add(item.id)
                            selectedDataMap.value.set(item.id, item)
                        })
                        ElMessage.success(`已全选所有 ${allList.length} 条数据`)
                    }
                } catch (e) {
                    ElMessage.error('获取全量数据失败')
                } finally {
                    loading.value = false
                }
            }).catch((action) => {
                if (action === 'cancel') {
                    // 用户选择“仅全选当前页”
                    userData.value.forEach(item => {
                        selectedIds.value.add(item.id)
                        selectedDataMap.value.set(item.id, item)
                    })
                    ElMessage.success('已全选当前页数据')
                }
            })
        } catch (e) {
            // 关闭弹窗不做操作
        }

    } else {
        // 取消全选：仅取消当前页的选中状态（或者你可以选择取消所有，这里演示取消当前页）
        userData.value.forEach(item => {
            selectedIds.value.delete(item.id)
            selectedDataMap.value.delete(item.id)
        })
    }
}

//  导出选中数据
const handleExport = () => {
    if (selectedDataMap.value.size === 0) {
        ElMessage.warning('请先选择要导出的数据')
        return
    }

    // 从 Map 中提取所有选中的行数据
    const exportList = Array.from(selectedDataMap.value.values())

    const formattedData = exportList.map(item => ({
        'ID': item.id,
        '姓名': item.name,
        '性别': item.gender === 1 ? '男' : '女',
        '手机号': item.phone,
        '创建时间': item.date,
        '角色身份': item.roles.map(r => r.roleName).join(', '),
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '选中用户')
    XLSX.writeFile(workbook, `选中用户_${new Date().getTime()}.xlsx`)
    
    ElMessage.success(`成功导出 ${exportList.length} 条数据`)
}


const fetchData = async()=>{
   loading.value = true
   try{
       const params = {
           page: currentPage.value,
           pageSize: pageSize.value,
           //传给后端排序信息
           sortBy: sortState.value.prop,
           sortOrder: sortState.value.order,
           //传给后端搜索信息
           username: searchForm.value.username,
           phone: searchForm.value.phone,
           role: searchForm.value.role,
       };
       const data = await getUserList(params);
       if(data.code === 200){
           userData.value = data.data.list
           total.value = data.data.total
       }else {
           ElMessage.error(data.message)
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


const handleSearch = () => {
    currentPage.value = 1 // 重置到第一页
    fetchData()
}

// 重置按钮点击事件
const handleReset = () => {
    // 清空搜索条件
    searchForm.value = {
        username: '',
        phone: '',
        role: ''
    }
    //清空勾选状态
    selectedIds.value.clear()
    selectedDataMap.value.clear()
   

    // 重置后重新查询
    currentPage.value = 1
    fetchData()
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
.user-container {
   display: flex;
   flex-direction: column;
   height: 100%;
   width: 100%;
   overflow: hidden;
   box-sizing: border-box;
}

.header {
   flex-shrink: 0;
   padding: 5px 0;
   min-height: 60px;
}

.table-wrapper {
   flex: 1;
   min-height: 0;
   overflow: hidden;
   position: relative;
   padding: 10px;
   box-sizing: border-box;
   display: flex;
   flex-direction: column;
}

.loading-container {
   height: 100%;
   display: flex;
   flex-direction: column;
   border: 1px solid #8e8f90;
   overflow: hidden; 
}

.table-header, .table-row {
   display: grid;
   /* 关键：定义7列的宽度。可以使用 px, fr, minmax 等 */
   /* ID(80) 姓名(100) 性别(60) 电话(120) 时间(180) 角色(自适应1fr) 操作(150) */
  
   grid-template-columns: 50px  100px 100px 60px 120px 180px 1fr 250px;
  
}

.checkbox-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0; /* 复选框不需要左右 padding */
}

:deep(.el-checkbox) {
    margin-right: 0;
}
/* 确保 el-checkbox 在格子里居中 */

.table-header {
  
   background-color: #9b9da1;
   font-weight: bold;
   flex-shrink: 0;
   border-bottom: 1px solid #8e8f90;
}

.table-row {

   align-items: center; /* 垂直居中 */
   border-bottom: 1px solid #8e8f90;
   height: 40px; /* 固定行高，配合 virtual scroller 的 item-size */
   box-sizing: border-box;

   border: 1px solid #8e8f90;
}

.table-row:hover {
   background-color: #838589;
}

.table-cell {
   padding: 0 10px;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}



.pagination-footer {
   flex-shrink: 0;
   padding: 10px 0;
   display: flex;
   justify-content: center;
}

.div-input {
   display: flex;
   gap: 20px;
}



.scroller {
  /* Firefox 支持 */
  scrollbar-width: thin;
  scrollbar-color: #c0c4cc #f5f7fa;
}

.scroller::-webkit-scrollbar {
  width: 4px;
}

:deep(.el-tag) {
  transition: none !important;
  animation: none !important;
}
/* 关闭tag动画 */

.empty-data-tip {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 确保占满剩余空间 */
    min-height: 200px; 
}



</style>
