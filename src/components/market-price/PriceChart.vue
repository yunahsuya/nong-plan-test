<template>
  <div class="price-chart">
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h3 class="card-title">{{ cropName }} 價格分佈</h3>
          <select v-model="chartType" class="select select-bordered select-sm">
            <option value="bar">柱狀圖</option>
            <option value="line">線圖</option>
          </select>
        </div>

        <div class="h-64">
          <BarChart
            v-if="chartType === 'bar'"
            :labels="chartLabels"
            :datasets="chartDatasets"
            :title="`${cropName} 各市場價格比較`"
          />
          <LineChart
            v-else
            :labels="chartLabels"
            :datasets="chartDatasets"
            :title="`${cropName} 價格趨勢`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BarChart from './charts/BarChart.vue'
import LineChart from './charts/LineChart.vue'

const props = defineProps({
  cropName: {
    type: String,
    required: true,
  },
  locations: {
    type: Array,
    required: true,
  },
})

const chartType = ref('bar')

const chartLabels = computed(() => {
  return props.locations.map((loc) => loc.market.name)
})

const chartDatasets = computed(() => [
  {
    label: '平均價格 (NT$/公斤)',
    data: props.locations.map((loc) => loc.prices.average),
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgba(59, 130, 246, 1)',
    borderWidth: 1,
  },
  {
    label: '最高價格 (NT$/公斤)',
    data: props.locations.map((loc) => loc.prices.high),
    backgroundColor: 'rgba(239, 68, 68, 0.5)',
    borderColor: 'rgba(239, 68, 68, 1)',
    borderWidth: 1,
  },
  {
    label: '最低價格 (NT$/公斤)',
    data: props.locations.map((loc) => loc.prices.low),
    backgroundColor: 'rgba(34, 197, 94, 0.5)',
    borderColor: 'rgba(34, 197, 94, 1)',
    borderWidth: 1,
  },
])
</script>
