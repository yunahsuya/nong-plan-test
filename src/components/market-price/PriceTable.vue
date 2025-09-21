<template>
  <div class="price-table">
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h3 class="card-title">{{ cropName }} 價格詳情</h3>
          <select
            v-model="sortBy"
            class="select select-bordered select-sm"
            @change="$emit('sort-change', sortBy)"
          >
            <option value="">默認排序</option>
            <option value="price_desc">價格高到低</option>
            <option value="price_asc">價格低到高</option>
            <option value="volume_desc">交易量高到低</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>市場</th>
                <th>平均價格</th>
                <th>價格區間</th>
                <th>交易量</th>
                <th>交易金額</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="location in locations" :key="location.id">
                <td>{{ location.market.name }}</td>
                <td class="font-mono">NT$ {{ location.prices.average.toFixed(2) }}</td>
                <td class="font-mono text-sm">
                  {{ location.prices.low.toFixed(2) }} ~ {{ location.prices.high.toFixed(2) }}
                </td>
                <td class="font-mono">{{ location.volume.toLocaleString() }} 公斤</td>
                <td class="font-mono">NT$ {{ location.totalValue.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  cropName: {
    type: String,
    required: true,
  },
  locations: {
    type: Array,
    required: true,
  },
})

defineEmits(['sort-change'])

const sortBy = ref('')
</script>
