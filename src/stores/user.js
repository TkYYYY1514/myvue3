import { defineStore } from "pinia"
import { login} from "@/api/auth"

export const useUserStore = defineStore('user',{ 
    state:()=>({
        token:'',
        roles:[],
        username:''
    }),
    actions:{
        async loginAction(loginForm){
            const res = await login(loginForm)  
            const {token,roles,username} = res.data

            this.token = token
            this.roles = roles
            this.username = username
            localStorage.setItem('token',token)
            //保存token到本地

            return Promise.resolve(res)
        },

        logouAction(){
            this.token = ''
            this.roles = []
            this.username = ''
            localStorage.removeItem('token')
            //登出：清除token
        }
    }

})