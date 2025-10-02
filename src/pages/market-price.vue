<route lang="yaml">
meta:
  title: '買菜囤貨好幫手'
</route>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <!-- Hero Section -->
    <div class="hero min-h-48 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg mb-6">
      <div class="hero-content text-center">
        <div>
          <h1 class="text-4xl font-bold text-primary">市場行情</h1>
          <p class="py-4 text-base text-base-content/70">農產品、漁產品、家禽等即時市場價格資訊</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div role="tablist" class="tabs tabs-lifted tabs-lg mb-6">
      <button role="tab" class="tab tab-active font-semibold text-base">農產品</button>
      <button role="tab" class="tab tab-disabled opacity-50 text-base">漁產品 (開發中)</button>
      <button role="tab" class="tab tab-disabled opacity-50 text-base">家禽 (開發中)</button>
      <button role="tab" class="tab tab-disabled opacity-50 text-base">羊隻 (開發中)</button>
    </div>

    <!-- Search & Filter -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="form-control flex-1">
            <label class="label">
              <span class="label-text font-semibold text-sm">搜尋作物</span>
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="輸入作物名稱，例如：甘藍、番茄..."
              class="input input-bordered w-full text-base"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold text-sm">快速操作</span>
            </label>
            <div class="flex gap-2">
              <button class="btn btn-primary text-sm" @click="handleSearch">
                <PhMagnifyingGlass :size="20" />
                搜尋
              </button>
              <button class="btn btn-secondary text-sm" @click="handleShowAll">
                <PhListBullets :size="20" />
                顯示全部
              </button>
              <button class="btn btn-ghost text-sm" @click="handleRefresh">
                <PhArrowClockwise :size="20" />
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
      <PhWarning :size="24" class="shrink-0" />
      <span class="text-sm">{{ error }}</span>
    </div>

    <!-- Content -->
    <template v-else-if="priceData && priceData.length > 0">
      <!-- Statistics Summary -->
      <div class="stats stats-vertical lg:stats-horizontal shadow mb-6 w-full">
        <div class="stat">
          <div class="stat-figure text-primary">
            <PhPlant :size="32" />
          </div>
          <div class="stat-title">作物種類</div>
          <div class="stat-value text-primary">{{ groupedData.length }}</div>
          <div class="stat-desc">{{ currentCrop || '所有作物' }}</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <PhCurrencyCircleDollar :size="32" />
          </div>
          <div class="stat-title">平均價格</div>
          <div class="stat-value text-secondary">NT$ {{ averagePrice }}</div>
          <div class="stat-desc">每公斤</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-accent">
            <PhStorefront :size="32" />
          </div>
          <div class="stat-title">市場數</div>
          <div class="stat-value text-accent">{{ uniqueMarkets }}</div>
          <div class="stat-desc">個市場有交易</div>
        </div>
      </div>

      <!-- Card Grid with Auto Rows -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-start">
        <div
          v-for="(item, index) in displayedData"
          :key="index"
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div class="card-body p-4">
            <!-- Collapsed View -->
            <div @click="toggleExpand(index)">
              <h3 class="card-title text-lg flex justify-between items-center">
                <span class="text-base">{{ item.cropName }}</span>
                <div class="badge badge-primary">
                  <PhCaretDown
                    :size="16"
                    class="transition-transform"
                    :class="{ 'rotate-180': expandedCards.has(index) }"
                  />
                </div>
              </h3>

              <div class="flex items-center gap-2 text-sm text-base-content/70 mb-3">
                <PhMapPin :size="16" />
                {{ item.marketName }}
              </div>

              <div class="flex justify-center my-4">
                <div class="stat bg-primary/10 rounded-lg px-6 py-4">
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
              <div class="divider my-2 text-sm">價格詳情</div>
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
              <div class="divider my-2 text-sm">價格趨勢</div>
              <div class="bg-base-200 rounded-lg p-4 h-48">
                <PriceBarChart
                  :crop-name="item.cropName"
                  :market-name="item.marketName"
                  :all-data="priceData"
                />
              </div>

              <!-- Additional Info -->
              <div class="divider my-2 text-sm">交易資訊</div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CropsService } from '@/services/market-price/crops.js'
import PriceBarChart from '@/components/market-price/PriceBarChart.vue'
import {
  PhMagnifyingGlass,
  PhListBullets,
  PhArrowClockwise,
  PhCaretDown,
  PhMapPin,
  PhChartBar,
  PhTable,
  PhWarning,
  PhInfo,
  PhPlant,
  PhCurrencyCircleDollar,
  PhStorefront,
} from '@phosphor-icons/vue'

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

// 依 cropName 分組，只保留每個作物的最新一筆
const groupedData = computed(() => {
  if (!priceData.value) return []

  const cropMap = new Map()

  // 按日期排序（最新的在前）
  const sorted = [...priceData.value].sort((a, b) => {
    const dateA = a.tradeDate.replace(/\./g, '')
    const dateB = b.tradeDate.replace(/\./g, '')
    return dateB.localeCompare(dateA) // 降序
  })

  // 只保留每個作物的第一筆（最新）
  sorted.forEach((item) => {
    if (!cropMap.has(item.cropName)) {
      cropMap.set(item.cropName, item)
    }
  })

  return Array.from(cropMap.values())
})

const displayedData = computed(() => {
  return groupedData.value.slice(0, displayCount.value)
})

const hasMore = computed(() => {
  return displayCount.value < groupedData.value.length
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

function handleRefresh() {
  window.location.reload()
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
