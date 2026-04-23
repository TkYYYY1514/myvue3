<template>
    <div class="user-container">
        <div>
            <el-button @click="handleAdd">添加</el-button>

            <el-button class="menu-button" 
               @click="xo">
               <el-icon  v-if="!isFullScreen"><FullScreen /></el-icon>
               <el-icon v-else ><Close /></el-icon>
               <!--  全屏 -->
           </el-button>

        </div>

                <!-- 弹窗 -->
            <!-- 弹窗 -->
            <el-dialog
                v-model="dialogVisible"
                :title="dialogTitle"
                width="500px"
                @close=""
                >
               
                <BaseForm
                    ref="formRef"
                    :schemas="dynamicSchemas"
                    v-model="formData"
                />

                <template #footer>
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
                </template>
            </el-dialog>

        <!-- 表格 -->
        <div class="table-wrapper">
            <el-table 
                :data="userData"
                v-loading="loading"
                style="width: 100%"
                border 
                stripe>

                <el-table-column prop="roleId" label="角色ID" width="80px" />
                <el-table-column prop="roleName" label="角色名称" width="120px" />
                <el-table-column prop="roleCode" label="角色编码" width="150px" />
                
                <!-- 权限列表用标签展示 -->
                <el-table-column prop="text" label="权限列表" min-width="250px">
                    <template #default="scope">
                        <el-tag 
                            v-for="text  in scope.row.permissionTexts" 
                            :key="text "
                            size="small"
                            style="margin-right: 5px; margin-bottom: 5px;">
                            {{ text  }}
                        </el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column prop="status" label="状态" width="80px">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ scope.row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="120px">
                    <template #default="scope">
                        <el-button size="default" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </div>
    </div>  
</template>
 
<script setup>
import { ref, onMounted,computed  } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { inject } from 'vue'
import {  FullScreen,Close  } from '@element-plus/icons-vue'
import BaseForm from '@/components/common/BaseForm.vue'; 
import { roleFormSchemas } from '@/utils/roleForm.js';//表单及其配置

const xo = inject('xx')
const userData = ref([])
const loading = ref(false)

const dialogVisible = ref(false); // 表单可见性
const formData = ref({})
const isEdit = ref(false); 
const dialogTitle = ref('添加角色');
const formRef = ref(null);
// 获取角色列表
const fetchData = async () => {
    loading.value = true
    try {
        const res = await axios.get('/api/role/list')
      
        if (res.data.code === 200) {
            userData.value = res.data.data.list
        } else {
            ElMessage.error(res.data.message)
        }
    } catch (error) { 
        console.error('请求错误：', error)
        ElMessage.error('网络请求异常')
    } finally {
        loading.value = false
    }
}


const dynamicSchemas = computed(() => {
  return roleFormSchemas.map(item => {
    
    return item;
  });
});

// 添加
const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = "添加角色";
  formData.value = {}; 
  dialogVisible.value = true; // 现在能正常打开了！
};

// 编辑
const handleEdit = (row) => {
  isEdit.value = true;
  dialogTitle.value = "编辑角色";
  formData.value = { ...row }; // 回填数据
  dialogVisible.value = true;
};

const submitLoading = ref(false)
// ==================== 提交（新增+编辑） ====================
const handleSubmit = async () => {
    const { roleName, roleCode, permissions } = formData.value

  if (
    
    !roleName?.trim() ||
    !roleCode?.trim() ||
    !permissions || permissions.length === 0
  ) {
    ElMessage.error('请完整填写所有必填项！')
    return
  }

    if (submitLoading.value) return
  try {
    submitLoading.value = true
    await formRef.value.validate();
    const url = isEdit.value ? '/api/role/update' : '/api/role/add';
    const res = await axios.post(url, formData.value);
    
    if (res.data.code === 200) {
      ElMessage.success(res.data.message);
      dialogVisible.value = false;
      fetchData();
    } else {
      ElMessage.error(res.data.message);
    }
  } catch (e) {
    ElMessage.error('校验失败');
  } finally {
    // 5. 无论成功失败，关闭加载
    submitLoading.value = false
  }
};


// 删除角色
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除角色 "${row.roleName}" 吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        
        // 调用删除接口
        const res = await axios.post('/api/role/delete', {
            roleId: row.roleId
        })
        
        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            fetchData()  // 重新加载数据
        } else {
            ElMessage.error(res.data.message)
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败：', error)
            ElMessage.error('删除失败')
        }
    }
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

.table-wrapper {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
}
</style>