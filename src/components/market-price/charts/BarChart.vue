<template>
  <BaseChart type="bar" :data="chartData" :options="chartOptions" />
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
  horizontal: {
    type: Boolean,
    default: false,
  },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}))

const chartOptions = computed(() => ({
  indexAxis: props.horizontal ? 'y' : 'x',
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
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
}))
</script>
