<template>
  <BaseChart type="line" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import BaseChart from './BaseChart.vue'

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  datasets: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}))

const chartOptions = computed(() => ({
  plugins: {
    title: {
      display: !!props.title,
      text: props.title,
    },
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}))
</script>
