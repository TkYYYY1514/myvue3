<template>
    <div class="charts-container">
        <v-chart
            v-for="i in 6"
            :key="i"
            class="charts-div"
            :option="option"
            style="width: 100%; height: 100%"
            autoresize
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VChart from 'vue-echarts'
import { chartConfigs } from './chartConfigs'

// 引入 echarts 核心
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, ScatterChart, RadarChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, RadarComponent } from 'echarts/components'

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    RadarChart,
    GaugeChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    RadarComponent,
    TitleComponent
])

// 🔥 直接用 chartConfigs.bar.option，不需要 ref
const option = chartConfigs.bar.option
</script>

<style scoped>
.charts-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 0px;
}

/* 中等屏幕：显示 2 列 */
@media (max-width: 1200px) {
    .charts-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 小屏幕：显示 1 列 */
@media (max-width: 768px) {
    .charts-container {
        grid-template-columns: 1fr;
    }
    .charts-div {
        aspect-ratio: 3/4;
        min-height: 300px;
    }
}

.charts-div {
    aspect-ratio: 4/3;
    box-sizing: border-box;
    border-radius: 20px;
    border: 0.5px solid #7e7070;
    padding: 20px;
    overflow: hidden;
    min-height: 300px;
}
</style>