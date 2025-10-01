<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

// 註冊 Chart.js 組件
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  cropName: {
    type: String,
    required: true,
  },
  marketName: {
    type: String,
    required: true,
  },
  allData: {
    type: Array,
    required: true,
  },
})

const chartCanvas = ref(null)
let chartInstance = null

// 過濾並排序相同作物+市場的資料
const filteredData = computed(() => {
  return props.allData
    .filter(
      (item) =>
        item.cropName === props.cropName && item.marketName === props.marketName
    )
    .sort((a, b) => {
      // 將 "114.09.29" 轉換為可比較的數字
      const dateA = a.tradeDate.replace(/\./g, '')
      const dateB = b.tradeDate.replace(/\./g, '')
      return dateA.localeCompare(dateB)
    })
})

// 準備圖表資料
const chartData = computed(() => {
  if (filteredData.value.length === 0) {
    return {
      labels: [],
      averages: [],
      highs: [],
      lows: [],
    }
  }

  return {
    labels: filteredData.value.map((item) => item.tradeDate),
    averages: filteredData.value.map((item) => item.prices.average),
    highs: filteredData.value.map((item) => item.prices.high),
    lows: filteredData.value.map((item) => item.prices.low),
  }
})

function createChart() {
  if (!chartCanvas.value) return

  // 銷毀舊圖表
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  // 如果沒有資料，顯示提示
  if (chartData.value.labels.length === 0) {
    ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#999'
    ctx.textAlign = 'center'
    ctx.fillText('無歷史資料', chartCanvas.value.width / 2, chartCanvas.value.height / 2)
    return
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: '平均價',
          data: chartData.value.averages,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        },
        {
          label: '上價',
          data: chartData.value.highs,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
          borderDash: [5, 5],
          fill: false,
        },
        {
          label: '下價',
          data: chartData.value.lows,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 11,
            },
            padding: 10,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 13,
          },
          bodyFont: {
            size: 12,
          },
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} 元/公斤`
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: 10,
            },
            callback: (value) => `${value}元`,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10,
            },
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  })
}

onMounted(() => {
  createChart()
})

watch([() => props.cropName, () => props.marketName, () => props.allData], createChart, {
  deep: true,
})
</script>
