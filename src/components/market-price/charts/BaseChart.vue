<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
/**
 * Chart.js 基礎組件 - 斯巴達式設計
 * 一個組件，一個職責：渲染圖表
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  destroyChart()
})

watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true },
)

function createChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options,
    },
  })
}

function updateChart() {
  if (!chartInstance) return

  chartInstance.data = props.data
  chartInstance.update('none')
}

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}
</script>
