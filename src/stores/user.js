import { defineStore } from "pinia"
import { login} from "@/api/auth"
import { usePermissionStore } from '@/stores/permission'

export const useUserStore = defineStore('user',{ 
    state:()=>({
        token:'',
        permissions:[],
        username:''
    }),
    actions:{
        async loginAction(loginForm){
            const res = await login(loginForm)  
            const {token,permissions,username} = res.data

            this.token = token
            this.permissions = permissions
            this.username = username
            localStorage.setItem('token',token)
            //保存token到本地

            return Promise.resolve(res)
        },

        logouAction(){
            const permissionStore = usePermissionStore()
            permissionStore.clearPermissions()
            this.token = ''
            this.permissions = []
            this.username = ''
            localStorage.removeItem('token')
            
            localStorage.removeItem('user_permissions')
        }
    }

})