<template>
  <div class="category-selector">
    <div class="mb-4">
      <h2 class="text-xl font-bold">農產品分類</h2>
      <p class="text-sm text-gray-600">
        共 {{ summary?.totalCategories }} 種作物，{{ summary?.totalMarkets }} 個市場
      </p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
      <p>載入中...</p>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="category in categories"
        :key="category.name"
        class="card bg-base-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
        @click="selectCategory(category)"
      >
        <div class="card-body p-4">
          <h3 class="card-title text-base">{{ category.name }}</h3>
          <div class="stats stats-horizontal">
            <div class="stat px-2">
              <div class="stat-title text-xs">平均價格</div>
              <div class="stat-value text-sm">NT$ {{ category.avgPrice.toFixed(2) }}</div>
            </div>
            <div class="stat px-2">
              <div class="stat-title text-xs">市場數</div>
              <div class="stat-value text-sm">{{ category.marketCount }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            交易量: {{ category.totalVolume.toLocaleString() }} 公斤
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CropsService } from '@/services/market-price/crops.js'

const emit = defineEmits(['select'])

const categories = ref([])
const summary = ref(null)
const loading = ref(false)
const error = ref(null)

onMounted(() => {
  loadCategories()
})

async function loadCategories() {
  try {
    loading.value = true
    error.value = null

    const data = await CropsService.getCategories()
    categories.value = data.categories
    summary.value = data.summary
  } catch (err) {
    error.value = err.message
    console.error('載入分類失敗:', err)
  } finally {
    loading.value = false
  }
}

function selectCategory(category) {
  emit('select', category)
}
</script>
