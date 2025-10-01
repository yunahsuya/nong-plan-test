<route lang="yaml">
meta:
  title: '買菜囤貨好幫手'
</route>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <!-- Hero Section -->
    <div class="hero min-h-[200px] bg-gradient-to-r from-green-50 to-emerald-50 rounded-box mb-6">
      <div class="hero-content text-center">
        <div>
          <h1 class="text-4xl font-bold text-primary">市場行情</h1>
          <p class="py-4 text-base-content/70">農產品、漁產品、家禽等即時市場價格資訊</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div role="tablist" class="tabs tabs-lifted tabs-lg mb-6">
      <button role="tab" class="tab tab-active font-semibold">農產品</button>
      <button role="tab" class="tab tab-disabled opacity-50">漁產品 (開發中)</button>
      <button role="tab" class="tab tab-disabled opacity-50">家禽 (開發中)</button>
      <button role="tab" class="tab tab-disabled opacity-50">羊隻 (開發中)</button>
    </div>

    <!-- Search & Filter -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text font-semibold">搜尋作物</span>
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="輸入作物名稱，例如：高麗菜、番茄..."
              class="input input-bordered w-full"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">快速操作</span>
            </label>
            <div class="flex gap-2">
              <button class="btn btn-primary" @click="handleSearch">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                搜尋
              </button>
              <button class="btn btn-secondary" @click="handleShowAll">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                顯示全部
              </button>
              <button class="btn btn-ghost" @click="handleRefresh">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                刷新
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Content -->
    <template v-else-if="priceData && priceData.length > 0">
      <!-- Statistics Summary -->
      <div class="stats stats-vertical lg:stats-horizontal shadow mb-6 w-full">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <div class="stat-title">總筆數</div>
          <div class="stat-value text-primary">{{ priceData.length }}</div>
          <div class="stat-desc">{{ currentCrop || '所有作物' }}</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="stat-title">平均價格</div>
          <div class="stat-value text-secondary">NT$ {{ averagePrice }}</div>
          <div class="stat-desc">每公斤</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="stat-title">市場數</div>
          <div class="stat-value text-accent">{{ uniqueMarkets }}</div>
          <div class="stat-desc">個市場有交易</div>
        </div>
      </div>

      <!-- Card Grid with Infinite Scroll -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          v-for="(item, index) in displayedData"
          :key="index"
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div class="card-body p-4">
            <!-- Collapsed View -->
            <div @click="toggleExpand(index)">
              <h3 class="card-title text-lg flex justify-between items-center">
                <span>{{ item.cropName }}</span>
                <div class="badge badge-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform"
                    :class="{ 'rotate-180': expandedCards.has(index) }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </h3>

              <div class="flex items-center gap-2 text-sm text-base-content/70 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ item.marketName }}
              </div>

              <div class="flex justify-center my-4">
                <div class="stat bg-primary/10 rounded-box px-6 py-4">
                  <div class="stat-title text-center text-xs">平均價格</div>
                  <div class="stat-value text-center text-3xl text-primary">
                    {{ item.prices.average.toFixed(1) }}
                  </div>
                  <div class="stat-desc text-center text-xs mt-1">元/公斤</div>
                </div>
              </div>
            </div>

            <!-- Expanded View -->
            <div v-show="expandedCards.has(index)" class="mt-4 space-y-3 animate-fadeIn">
              <!-- Price Details -->
              <div class="divider my-2">價格詳情</div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-error/10 rounded-lg p-2">
                  <div class="text-xs opacity-70">上價</div>
                  <div class="text-lg font-bold text-error">{{ item.prices.high.toFixed(1) }}</div>
                </div>
                <div class="bg-warning/10 rounded-lg p-2">
                  <div class="text-xs opacity-70">中價</div>
                  <div class="text-lg font-bold text-warning">
                    {{ item.prices.middle.toFixed(1) }}
                  </div>
                </div>
                <div class="bg-success/10 rounded-lg p-2">
                  <div class="text-xs opacity-70">下價</div>
                  <div class="text-lg font-bold text-success">{{ item.prices.low.toFixed(1) }}</div>
                </div>
              </div>

              <!-- Price Trend Chart -->
              <div class="divider my-2">價格趨勢</div>
              <div class="bg-base-200 rounded-lg p-4 h-48">
                <PriceBarChart
                  :crop-name="item.cropName"
                  :market-name="item.marketName"
                  :all-data="priceData"
                />
              </div>

              <!-- Additional Info -->
              <div class="divider my-2">交易資訊</div>
              <div class="flex flex-col gap-2 text-sm">
                <div class="flex justify-between">
                  <span class="opacity-70">交易量</span>
                  <span class="font-semibold">{{ item.volume.toLocaleString() }} 公斤</span>
                </div>
                <div class="flex justify-between">
                  <span class="opacity-70">交易日期</span>
                  <span class="font-semibold">{{ item.tradeDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Indicator -->
      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <span class="loading loading-dots loading-lg text-primary"></span>
      </div>

      <!-- End of List -->
      <div v-else-if="displayedData.length > 0" class="alert alert-info shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>已顯示全部 {{ displayedData.length }} 筆資料</span>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="hero min-h-[400px] bg-base-200 rounded-box">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 mx-auto text-base-content/20 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <h3 class="text-xl font-bold text-base-content/60">請輸入作物名稱或點擊「顯示全部」</h3>
          <p class="py-2 text-base-content/40">例如：甘藍（高麗菜）、番茄、小白菜等</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CropsService } from '@/services/market-price/crops.js'
import PriceBarChart from '@/components/market-price/PriceBarChart.vue'

const searchQuery = ref('')
const currentCrop = ref('')
const priceData = ref(null)
const loading = ref(false)
const error = ref(null)
const displayCount = ref(10)
const itemsPerLoad = 10
const loadMoreTrigger = ref(null)
const expandedCards = ref(new Set())

// 計算統計數據
const averagePrice = computed(() => {
  if (!priceData.value || priceData.value.length === 0) return '0.00'
  const total = priceData.value.reduce((sum, item) => sum + item.prices.average, 0)
  return (total / priceData.value.length).toFixed(2)
})

const uniqueMarkets = computed(() => {
  if (!priceData.value) return 0
  return new Set(priceData.value.map((item) => item.marketName)).size
})

const displayedData = computed(() => {
  if (!priceData.value) return []
  return priceData.value.slice(0, displayCount.value)
})

const hasMore = computed(() => {
  if (!priceData.value) return false
  return displayCount.value < priceData.value.length
})

// Toggle card expansion
function toggleExpand(index) {
  if (expandedCards.value.has(index)) {
    expandedCards.value.delete(index)
  } else {
    expandedCards.value.add(index)
  }
}

// Infinite scroll observer
let observer = null

function setupIntersectionObserver() {
  if (!loadMoreTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value) {
        loadMore()
      }
    },
    { threshold: 0.1 },
  )

  observer.observe(loadMoreTrigger.value)
}

function loadMore() {
  if (!hasMore.value) return
  displayCount.value += itemsPerLoad
}

async function handleSearch() {
  if (!searchQuery.value.trim()) {
    error.value = '請輸入作物名稱'
    return
  }

  loading.value = true
  error.value = null
  displayCount.value = 10
  expandedCards.value.clear()

  try {
    priceData.value = await CropsService.getPricesByCrop(searchQuery.value.trim())
    currentCrop.value = searchQuery.value.trim()

    if (!priceData.value || priceData.value.length === 0) {
      error.value = `找不到「${searchQuery.value}」的相關資料`
    }
  } catch (err) {
    error.value = err.message || '載入價格資料失敗'
    priceData.value = null
  } finally {
    loading.value = false
    setTimeout(setupIntersectionObserver, 100)
  }
}

async function handleShowAll() {
  loading.value = true
  error.value = null
  displayCount.value = 10
  expandedCards.value.clear()
  currentCrop.value = ''
  searchQuery.value = ''

  try {
    priceData.value = await CropsService.getAllPrices()

    if (!priceData.value || priceData.value.length === 0) {
      error.value = '目前沒有可用的資料'
    }
  } catch (err) {
    error.value = err.message || '載入資料失敗'
    priceData.value = null
  } finally {
    loading.value = false
    setTimeout(setupIntersectionObserver, 100)
  }
}

async function handleRefresh() {
  if (!currentCrop.value && !priceData.value) {
    error.value = '請先搜尋作物或顯示全部'
    return
  }

  loading.value = true
  error.value = null
  expandedCards.value.clear()

  try {
    if (currentCrop.value) {
      priceData.value = await CropsService.getPricesByCrop(currentCrop.value, true)
    } else {
      priceData.value = await CropsService.getAllPrices(true)
    }
  } catch (err) {
    error.value = err.message || '刷新資料失敗'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
