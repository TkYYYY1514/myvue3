<template>
    <div class="reform">
        <h1>欢迎回来</h1>
        <p>输入你的账号和密码登陆</p>

        <el-form ref="formRef" :model="form" :rules="rules"hide-required-asterisk>
       
            <!-- 身份选择 -->
            <el-form-item  class="in1">
                <el-select v-model="form.region" placeholder="please select your zone">
                <el-option label="admin" value="admin" />
                <el-option label="user" value="user" />
                </el-select>
            </el-form-item>

            <el-form-item prop="username"class="in1">
                <el-input v-model="form.username" placeholder="请输入账号" />
            </el-form-item>

            <el-form-item  prop="password"class="in1">
                <el-input v-model="form.password" type="password"placeholder="请输入密码"
            show-password/>
            </el-form-item>

            <el-form-item >
                <el-button type="primary" @click="handleLogin":loading="loginLoading"class="in1">
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
import { ElMessage,ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const loginLoading = ref(false)

const accounts = {
    admin: { username: 'admin', password: '123456' },
    user: { username: 'user', password: '123456' }
}

const form = reactive({
    region: 'admin',
    username: accounts.admin.username,
    password: accounts.admin.password
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
    //触发表单验证
    try{
        await formRef.value.validate()

        loginLoading.value = true//登陆按钮圈圈
        // 模拟登录请求延迟
        setTimeout(() => {
            const account = accounts[form.region]
            if (form.username === account.username && form.password === account.password) {
                
                
                loginLoading.value = false

                ElMessage.success('登录成功')
                
                //全屏加载动画
                const fullScreenLoading = ElLoading.service({
                    lock: true,
                    text: '正在进入系统...',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                
                // 延迟0.8s
                setTimeout(() => {
                    //关闭刚刚的动画
                    fullScreenLoading.close()
                    // 跳转
                    router.push('/dashboard/console')
                }, 800)
            } else {
                //不显示
                loginLoading.value = false
                ElMessage.error('账号或密码错误')
            }
            loginLoading.value = false
        }, 500)
    }catch(error) {
         console.log('校验失败', error) 
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