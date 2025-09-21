<route lang="yaml">
meta:
  title: '買菜囤貨好幫手'
</route>

<template>
  <div class="market-price-page container mx-auto p-4 space-y-6">
    <div class="hero bg-base-200 rounded-lg">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-3xl font-bold">市場行情</h1>
          <p class="py-2">農產品、漁產品、家禽等即時市場價格資訊</p>
        </div>
      </div>
    </div>

    <div class="tabs tabs-boxed justify-center">
      <a class="tab tab-active">農產品</a>
      <a class="tab tab-disabled">漁產品 (開發中)</a>
      <a class="tab tab-disabled">家禽 (開發中)</a>
      <a class="tab tab-disabled">羊隻 (開發中)</a>
    </div>

    <CategorySelector @select="handleCategorySelect" />

    <template v-if="selectedCategory && priceData">
      <StatsSummary :statistics="priceData.statistics" />

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PriceChart
          :crop-name="selectedCategory.name"
          :locations="priceData.locations"
        />

        <PriceTable
          :crop-name="selectedCategory.name"
          :locations="priceData.locations"
          @sort-change="handleSortChange"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CropsService } from '@/services/market-price/crops.js'
import CategorySelector from '@/components/market-price/CategorySelector.vue'
import StatsSummary from '@/components/market-price/StatsSummary.vue'
import PriceChart from '@/components/market-price/PriceChart.vue'
import PriceTable from '@/components/market-price/PriceTable.vue'

const selectedCategory = ref(null)
const priceData = ref(null)
const loading = ref(false)

async function handleCategorySelect(category) {
  selectedCategory.value = category
  await loadPriceData(category.name)
}

async function handleSortChange(sortBy) {
  if (!selectedCategory.value) return
  await loadPriceData(selectedCategory.value.name, { sort: sortBy })
}

async function loadPriceData(cropName, options = {}) {
  try {
    loading.value = true
    priceData.value = await CropsService.getCropPrices(cropName, options)
  } catch (error) {
    console.error('載入價格資料失敗:', error)
  } finally {
    loading.value = false
  }
}
</script>
