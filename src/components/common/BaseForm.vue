<template>
    <el-form
        ref="elFormRef"
        :model="formModel"
        :rules="formRules"
        :label-width="labelWidth"
    >
        <el-row :gutter="20">
            <el-col
                v-for="item in schemas"
                :key="item.key"
                :span="item.span || 24"
            >
                <el-form-item :label="item.label" :prop="item.prop">
                    <!-- 输入框 -->
                    <el-input
                        v-if="item.type === 'input'"
                        v-model="formModel[item.prop]"
                        :placeholder="item.placeholder"
                        :disabled="item.disabled"
                        :maxlength="item.maxlength"
                    />

                    
                    <!-- 密码框 -->
                    <el-input
                        v-else-if="item.type === 'password'"
                        v-model="formModel[item.prop]"
                        type="password"
                        :placeholder="item.placeholder"
                        show-password
                        :disabled="item.disabled"
                    />

                    <!-- 下拉选择框 -->
                    <el-select
                        v-else-if="item.type === 'select'"
                        v-model="formModel[item.prop]"
                        :placeholder="item.placeholder"
                        style="width: 100%"
                        :disabled="item.disabled"
                        :multiple="item.multiple"
                    >
                    <el-option
                        v-for="opt in getOptions(item)"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                    </el-select>

                    <!-- 单选框组 -->
                    <el-radio-group
                        v-else-if="item.type === 'radio'"
                        v-model="formModel[item.prop]"
                        :disabled="item.disabled"
                    >

                        <el-radio
                            v-for="opt in item.options"
                            :key="opt.value"
                            :value="opt.value"
                            >
                            {{ opt.label }}
                        </el-radio>
                    </el-radio-group>


                <!-- 插槽：用于处理更复杂的自定义表单项 -->
                    <slot
                        v-else
                        :name="item.prop"
                        :model="formModel"
                    />
                </el-form-item>

            </el-col>
        </el-row>    

    </el-form>
</template>

<script setup>
import { ref, reactive, watch, defineExpose, onMounted } from 'vue';
const props = defineProps({
    //表单字段配置数组
    schemas: {
        type: Array, required: true, default: () => []
    },
    // 表单初始数据
    modelValue: { 
        type: Object, required: true, default: () => ({})
     },
    // 标签宽度
    labelWidth: {
         type: String, default: '100px' 
    }

})

const emits = defineEmits(['update:modelValue']);

const elFormRef = ref(null);
const formModel = reactive({});
const formRules = reactive({});

// 组件挂载后初始化表单
onMounted(() => {
  initForm();
});

const dynamicOptions = reactive({}); // 存储动态加载的选项数据

const getOptions = (item) => {
  // 如果配置里直接写了 options，优先用配置的（兜底）
  if (item.options) return item.options;
  // 否则返回 API 请求回来的数据
  return dynamicOptions[item.prop] || [];
};

const loadApiData = async (item) => {
  if (item.api && !dynamicOptions[item.prop]) {
    try {
      const res = await item.api()
      
      // 1. 获取原始数据
      // 注意：request 工具已经在响应拦截器中返回了后端数据
      // 后端返回的数据结构应该是 { code: 200, data: { list: [...] } }
      let rawData = res.data || res 
      
      // 2. 【特殊处理】如果你的接口数据在 data.list 里
      // 这里做一个判断，如果配置了 root 字段，就取 root 下的数据
      if (item.optionsProps && item.optionsProps.root) {
         rawData = rawData[item.optionsProps.root]
      }

      // 3. 数据格式转换
      if (item.optionsProps && rawData) {
        const { label, value } = item.optionsProps
        dynamicOptions[item.prop] = rawData.map(row => ({
          label: row[label],
          value: row[value]
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }
}

// 初始化表单
const initForm = () => {
  // 清空所有字段
  Object.keys(formModel).forEach(key => delete formModel[key]);
  Object.keys(formRules).forEach(key => delete formRules[key]);
  
  // 初始化 schemas 中定义的字段
  props.schemas.forEach(item => {
    let value = props.modelValue[item.prop] ?? item.default ?? (item.multiple ? [] : '');
    // 确保性别字段的类型正确（数字类型）
    if (item.prop === 'gender' && typeof value === 'string') {
      value = parseInt(value);
    }
    // 确保角色字段的类型正确（数组类型）
    if (item.prop === 'role' && !Array.isArray(value)) {
      value = [];
    }
    formModel[item.prop] = value;
    if (item.rules) formRules[item.prop] = item.rules;
  });
  
  // 保留 id 字段（如果存在）
  if (props.modelValue.id) {
    formModel.id = props.modelValue.id;
  }
  
  // 加载 API 数据（异步）
  props.schemas.forEach(item => {
    if (item.api) loadApiData(item);
  });
};

// 监听传入的数据变化，重新初始化表单
watch(
  () => props.modelValue,
  (newValue) => {
    // 避免循环更新
    if (JSON.stringify(newValue) !== JSON.stringify(formModel)) {
      initForm();
    }
  },
  { immediate: true, deep: true }
);

// 监听 formModel 的变化，触发 update:modelValue 事件
watch(
  formModel,
  (newValue) => {
    // 避免循环更新
    if (JSON.stringify(newValue) !== JSON.stringify(props.modelValue)) {
      emits('update:modelValue', { ...newValue });
    }
  },
  { deep: true }
);

// 暴露给父组件的方法
const validate = () => {
  return new Promise((resolve) => {
    if (elFormRef.value) {
      elFormRef.value.validate().then((valid) => {
        resolve(valid);
      }).catch(() => {
        resolve(false);
      });
    } else {
      resolve(true);
    }
  });
};

const resetFields = () => {
  elFormRef.value.resetFields();
};

const clearValidate = () => {
  elFormRef.value.clearValidate();
};

defineExpose({
  validate,
  resetFields,
  clearValidate,
  // 暴露 formModel 以便父组件可以直接获取数据
  formModel
});
</script>

<style  scoped>

</style>