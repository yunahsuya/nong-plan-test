<template>
  <div>
    <!-- Search & Filter -->
    <SearchBar
      v-model="searchQuery"
      @search="handleSearch"
      @show-all="handleShowAll"
      @refresh="handleRefresh"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error shadow-lg">
      <PhWarning :size="24" class="shrink-0" />
      <span class="text-sm">{{ error }}</span>
    </div>

    <!-- Content -->
    <template v-else-if="priceData && priceData.length > 0">
      <!-- Statistics Summary -->
      <StatsSummary
        :crop-count="groupedData.length"
        :average-price="averagePrice"
        :market-count="uniqueMarkets"
        :current-crop="currentCrop"
      />

      <!-- Card Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-start">
        <ProduceCard v-for="(item, index) in displayedData" :key="index" :item="item" />
      </div>

      <!-- Load More Indicator -->
      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <span class="loading loading-dots loading-lg text-primary"></span>
      </div>

      <!-- End of List -->
      <div v-else-if="displayedData.length > 0" class="alert alert-info shadow-lg">
        <PhInfo :size="24" class="shrink-0" />
        <span class="text-sm">已顯示全部 {{ displayedData.length }} 筆資料</span>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="hero min-h-96 bg-base-200 rounded-box">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <PhPlant :size="96" class="mx-auto text-base-content/20 mb-4" />
          <h3 class="text-xl font-bold text-base-content/60">請輸入作物名稱或點擊「顯示全部」</h3>
          <p class="py-2 text-sm text-base-content/40">例如：甘藍（高麗菜）、番茄、小白菜等</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhWarning, PhInfo, PhPlant } from '@phosphor-icons/vue'
import SearchBar from './search-bar.vue'
import StatsSummary from './stats-summary.vue'
import ProduceCard from './produce-card.vue'
import { usePriceData } from '../composables/usePriceData.js'
import { useInfiniteScroll } from '../composables/useInfiniteScroll.js'

const searchQuery = ref('')

// 使用 composables
const {
  priceData,
  loading,
  error,
  currentCrop,
  averagePrice,
  uniqueMarkets,
  groupedData,
  searchCrop,
  loadAllPrices,
} = usePriceData()

const { displayedData, hasMore, loadMoreTrigger, setupIntersectionObserver, reset } =
  useInfiniteScroll(groupedData)

async function handleSearch() {
  reset()
  const success = await searchCrop(searchQuery.value)
  if (success) {
    setTimeout(setupIntersectionObserver, 100)
  }
}

async function handleShowAll() {
  reset()
  searchQuery.value = ''
  const success = await loadAllPrices()
  if (success) {
    setTimeout(setupIntersectionObserver, 100)
  }
}

function handleRefresh() {
  window.location.reload()
}
</script>
