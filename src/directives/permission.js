import { usePermissionStore } from "@/stores/permission";

export default {
    mounted(el,binding){

        const { value } = binding; 
        
        const permissionStore = usePermissionStore()

        if(!value){
            throw new Error('v-permission 需要绑定权限值，例如: v-permission="\'user:create\'"');
        }

        let hasPermission = false;

        if(Array.isArray(value)){
            hasPermission = permissionStore.hasAnyPermission(value)
        }else{
            hasPermission = permissionStore.hasPermission(value)
        }

        if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el);
          }
    }

}