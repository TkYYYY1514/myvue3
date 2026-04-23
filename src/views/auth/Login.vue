<template>
    <div class="reform">
        <h1>欢迎回来</h1>
        <p>输入你的账号和密码登陆</p>

        <el-form ref="formRef" :model="form" :rules="rules"hide-required-asterisk>
       
            <!-- 身份选择 -->
            <el-form-item  class="in1">
                <el-select v-model="form.region" placeholder="please select your zone">
                    <el-option label="super" value="super" />
                    <el-option label="admin" value="admin" />
                    <el-option label="user" value="user" />     
                </el-select>
            </el-form-item>

            <el-form-item prop="username"class="in1">
                <el-input v-model="form.username" placeholder="请输入账号"
                @keyup.enter="handleLogin" />
            </el-form-item>

            <el-form-item  prop="password"class="in1">
                <el-input v-model="form.password" type="password"placeholder="请输入密码"
                @keyup.enter="handleLogin"
            show-password/>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="handleLogin":loading="loginLoading" class="in1">
                    {{ loginLoading ? '验证中...' : '登录' }}</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align: center; margin-top: 20px;">
            还没有账号？去 <span class="register-link" @click="goToRegister">注册</span>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch,ref  } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'  // 导入权限 Store


const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()//获取权限实例


const formRef = ref(null)
const loginLoading = ref(false)

const accounts = {
    super: { username: 'super', password: '123456' },
    admin: { username: 'admin', password: '123456' },
    user: { username: 'user', password: '123456' }
}

const form = reactive({
    region: 'super',
    username: accounts.super.username,
    password: accounts.super.password
})

//校验
const rules ={
    username:[
        {required: true, message: '请输入用户名', trigger: 'blur'}
    ],
    password:[
        {required: true, message: '请输入密码', trigger: 'blur'},
        {min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
    ]
}

watch(() => form.region, (newregion) => {
    const account = accounts[newregion]
    form.username = account.username
    form.password = account.password
})
function goToRegister() {
    router.push('/auth/register')
}
const handleLogin = async() => {
    
    if (!formRef.value) return
    
    //触发表单验证
    try{
        await formRef.value.validate()
        loginLoading.value = true//按钮转圈圈

        const res = await userStore.loginAction({
            username: form.username,
            password: form.password,
        })

        const { permissions } = res.data

        // 设置权限
        permissionStore.setPermissions(permissions)
        

        localStorage.setItem('user_permissions', JSON.stringify(permissions))
       
         // 动态添加路由
        permissionStore.routes.forEach(route => {
            router.addRoute(route)
        })
        
         // 添加 404 兜底
        router.addRoute({ 
            path: '/:pathMatch(.*)*', 
            name: 'NotFound',
            redirect: '/404' 
        })

        ElMessage.success('登录成功')
        // 延迟一下再跳转，确保路由已添加完成
        setTimeout(() => {
            router.replace('/dashboard/console')
        }, 100)
        
    }catch(error) {
        // 错误提示由后端返回，不需要二次提示
    }finally{
        loginLoading.value = false
    }
    
}

</script>

<style scoped>
.register-link {
    color: #409eff;
    cursor: pointer;
    text-decoration: none;
}

.in1{
   width: 100%;
 }
.reform{
    padding: 0px;
    margin:0px;
    height: 80%;
    width: 80%;
}
</style>