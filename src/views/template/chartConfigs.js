// chartConfigs.js
import * as echarts from 'echarts'  // ← 必须导入

export const chartConfigs = {
    // 1. 立体柱状图
    bar: {
        titleText: '立体柱状图',
        option: {
            
            title: {
                text: '立体柱状图',
                left: 'center',
                textStyle: {
                    color: '#666',
                    fontWeight: 700,
                },
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '18%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五'],
                axisLine: { lineStyle: { color: '#ccc' } },
                axisLabel: { color: '#888' }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
                axisLabel: { color: '#888' }
            },
            series: [
                
                // ===== 1. 柱身 =====
                {
                    
                    name: '柱身',
                    type: 'bar',
                    data: [120, 200, 150, 80, 250],
                    barWidth: 40,
                    itemStyle: {
                        // 🔥 使用 echarts.graphic.LinearGradient
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6FC3FF' },
                            { offset: 1, color: '#1A4A7A' }
                        ])
                    },

                     // 🔥 必须加这行！开启柱子背景
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(148, 147, 147, 0.35)'
                      },
                    z: 2,
                },
                // ===== 2. 底座 =====
                {
                    name: '底座',
                    type: 'pictorialBar',
                    data: [120, 200, 150, 80, 250],
                    barWidth: 40,
                    symbol: 'rect',
                    symbolPosition: 'start',
                    symbolOffset: [0, 2],
                    symbolSize: [44, 6],
                    itemStyle: { color: '#1A4A7A', opacity: 0.6 },
                    z: 1,
                },
                // ===== 3. 顶盖 =====
                {
                    name: '顶盖',
                    type: 'pictorialBar',
                    data: [120, 200, 150, 80, 250],
                    barWidth: 40,
                    symbol: 'circle',
                    symbolPosition: 'end',
                    symbolOffset: [0, -2],
                    symbolSize: [44, 10],
                    itemStyle: { color: '#6FC3FF', opacity: 0.9 },
                    z: 3,
                }
            ]
        }
    }
}