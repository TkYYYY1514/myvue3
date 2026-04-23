// src/utils/formSchemas.js
import { getRoles } from '@/api/role'

// 用户表单的配置
export const userFormSchemas = [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      maxlength: 20,
      rules: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
      ]
    },
    {
        prop: 'phone',
        label: '手机号',
        type: 'input',
        placeholder: '请输入手机号',
        rules: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ]
      },
    {
      prop: 'password',
      label: '密码',
      type: 'password',
      placeholder: '请输入密码',
      rules: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
      ]
    },
    {
      prop: 'role',
      label: '角色身份',
      type: 'select',
      multiple: true, 
      placeholder: '请选择角色',
      api: getRoles, 
      rules: [
        { required: true, message: '角色身份不能为空', trigger: 'blur' }
      ],
      optionsProps: {
        // 注意：因为你 Mock 返回的是 data.list，
        // 所以 BaseForm 需要知道去 list 里找数据
        root: 'list', 
        label: 'roleName',
        value: 'roleId'
    }

    },
    {
        prop: 'gender',
        label: '性别',
        type: 'radio',
        default: 1,
        rules: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 }
        ]
    }
  ];