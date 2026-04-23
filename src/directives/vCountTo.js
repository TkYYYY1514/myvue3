export default {
    mounted(el,binding){
      startAnimation(el,binding)
    },

    updated(el,binding){
        const oldValue = getValue(binding.oldValue)
        const newValue = getValue(binding.value)

        if(oldValue !== newValue){

            if(el._cleanup ) el._cleanup()
              startAnimation(el,binding)
        }
    },
    unmounted(el) {
        // 清理动画，防止内存泄漏
        if (el._cleanup) el._cleanup()
    }

}


//获取值
function getValue(val){
    if (typeof val === 'number') return val

    return val?.endVal ?? 0

}


function startAnimation(el,binding){ 
    let config 

    if(typeof binding.value === 'number'){
        // 用户使用：v-count-to="1000"

        const currentText = el.innerText
        const currentNum = parseFloat(currentText.replace(/[^0-9.-]/g, '')) || 0

        config = {
            endVal: binding.value,    // 目标值
            startVal: currentNum,     // 起始值（当前显示的值）
            duration: 800,           // 动画时长 2 秒
            decimals: 0,              // 小数位数
            prefix: '',               // 前缀
            suffix: ''                // 后缀
        }
    }else{
         // 用户使用：v-count-to="{ endVal: 1000, prefix: '$' }"
    
        const currentText = el.innerText
        const currentNum = parseFloat(currentText.replace(/[^0-9.-]/g, '')) || 0
        
        config = {
            endVal: 0,                // 默认值
            startVal: currentNum,     // 起始值
            duration: 2000,           // 默认 2 秒
            decimals: 0,              // 默认 0 位小数
            prefix: '',               // 默认无前缀
            suffix: '',               // 默认无后缀
            ...binding.value          // 用户配置覆盖默认值
          }
    }

    const { endVal, startVal, duration, decimals, prefix, suffix } = config


    let animationId = null  // 存储 requestAnimationFrame 的 ID，用于取消动画
    let startTime = null    // 动画开始的时间戳

    // 格式化数字显示
    const formatNumber = (num) => {
        // num.toFixed(decimals)：保留 decimals 位小数
        // 例如：1234.567.toFixed(2) → "1234.57"
        return `${prefix}${num.toFixed(decimals)}${suffix}`
    }


    // 缓动函数：让动画更自然
    // t 是进度（0 到 1），返回缓动后的进度
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    // 效果：开始快，结束慢

    
      // 动画函数（递归调用）
  const animate = (timestamp) => {
    // timestamp：浏览器传入的当前时间戳（毫秒）
    
    // 第一次调用时，记录开始时间
    if (!startTime) startTime = timestamp
    
    // 计算已经过去的时间
    const elapsed = timestamp - startTime
    
    // 计算动画进度（0 到 1）
    // Math.min() 确保进度不超过 1
    let progress = Math.min(elapsed / duration, 1)
    
    // 应用缓动函数
    const easedProgress = easeOutCubic(progress)
    
    // 计算当前应该显示的值
    // 公式：起始值 + (目标值 - 起始值) × 进度
    const currentValue = startVal + (endVal - startVal) * easedProgress
    
    // 更新 DOM 元素的文本内容
    el.innerText = formatNumber(currentValue)
    
    // 如果动画还没完成（进度小于 1）
    if (progress < 1) {
      // 继续下一帧动画
      animationId = requestAnimationFrame(animate)
    } else {
      // 动画完成，确保显示最终值
      el.innerText = formatNumber(endVal)
      
      // 取消动画（虽然已经完成，但为了保险）
      if (animationId) cancelAnimationFrame(animationId)
    }
  }

    // 如果起始值等于目标值，不需要动画，直接显示
    if (startVal === endVal) {
        el.innerText = formatNumber(endVal)
        return  // 提前结束函数
      }
      
      // 启动动画
      animationId = requestAnimationFrame(animate)
      
      // 在元素上保存清理函数，供 updated 和 unmounted 使用
      el._cleanup = () => {
        // 如果动画还在进行，取消它
        if (animationId) cancelAnimationFrame(animationId)
      }
    
    
}

