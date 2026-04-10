<template>
    <div class="reform">
        

        <el-form ref="formRef" :model="form" :rules="rules" hide-required-asterisk>
            <h1>注册新账号</h1>
            <p>填写信息完成注册</p>
            <el-form-item prop="username"class = 'in1'>
                <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item  prop="password"class = 'in1'>
                <el-input 
                    v-model="form.password" 
                    type="password"
                    placeholder="请输入密码（至少6位）"
                    show-password
                />
            </el-form-item>

            <el-form-item  prop="password2"class = 'in1'>
                <el-input 
                    v-model="form.password2" 
                    type="password"
                    placeholder="请再次输入密码"
                    show-password
                />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleRegister" :loading="registerLoading"class = 'in1'>注册</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align: center; margin-top: 20px;">
            已有账号？去 <span class="register-link" @click="goToLogin">登录</span>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const registerLoading = ref(false)

const form = reactive({
    username: '',
    password: '',
    password2: ''
})

// 校验规则
const validatePassword2 = (rule, value, callback) => {
    if (value !== form.password) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    password2: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validatePassword2, trigger: 'blur' }
    ]
}

const goToLogin = () => {
    router.push('/login')
}

const handleRegister = async () => {
    try {
        await formRef.value.validate()

        registerLoading.value = true
        
        setTimeout(() => {
            // 模拟注册成功
            ElMessage.success('注册成功，正在跳转登录')
            
            setTimeout(() => {
                router.push('/login')
            }, 800)
            
            registerLoading.value = false
        }, 500)
        
    } catch (error) {
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
/* .register-link:hover {
    text-decoration: underline;
}悬浮下划线 
 */
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