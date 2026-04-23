// src/utils/formSchemas.js
// import { getRoles } from '@/api/role'
import { getPermissions } from '@/api/role' 
// 用户表单的配置
export const roleFormSchemas = [
    {
        prop: 'roleId',
        type: 'hidden',
        placeholder: '角色ID',
        
      },  
    {
      prop: 'roleName',
      label: '角色名称',
      type: 'input',
      placeholder: '角色名称',
      maxlength: 10,
      rules: [
        { required: true, message: '角色名称不能为空', trigger: 'blur' }
      ]
    },
    {
        prop: 'roleCode',
        label: '角色编码',
        type: 'input',
        placeholder: '角色编码',
        maxlength: 20,
        rules: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ]
      },
      {
        prop: 'permissions',  // 必须对应后端字段
        label: '分配权限',
        type: 'select',
        multiple: true,
        placeholder: '请选择权限',
        api: getPermissions,  // 调用权限接口
        optionsProps: {
          root: 'list',
          label: 'permissionName',  // 中文
          value: 'permissionId'     // 英文权限码
        },
        rules: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ]
      },

  
    {
        prop: 'status',
        label: '状态',
        type: 'radio',
        default: 1,
        rules: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
    }
  ];