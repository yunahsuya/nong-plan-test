<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <!-- 載入狀態 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="loading loading-spinner loading-lg text-primary"></div>
      <span class="ml-4 text-lg">載入美食資料中...</span>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">載入失敗</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchFoods" class="btn btn-primary">重新載入</button>
    </div>

    <!-- 主要內容 -->
    <div v-else class="p-6">
      <!-- 標題和統計 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <PhOnigiri :size="32" weight="duotone" />
              美食探索
            </h2>
            <p class="text-gray-600">發現台灣各地的特色美食與休閒農場餐廳</p>
          </div>
          <div class="mt-4 lg:mt-0">
            <div class="stats stats-horizontal shadow-sm">
              <div class="stat">
                <div class="stat-title">總數</div>
                <div class="stat-value text-primary">{{ foods.length }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">支援信用卡</div>
                <div class="stat-value text-secondary">{{ creditCardCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 篩選器 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- 縣市篩選 -->
          <div class="flex-1">
            <label class="label">
              <span class="label-text font-semibold">縣市</span>
            </label>
            <select
              v-model="selectedCity"
              @change="filterFoods"
              class="select select-bordered w-full"
            >
              <option value="">全部縣市</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <!-- 搜尋框 -->
          <div class="flex-1">
            <label class="label">
              <span class="label-text font-semibold">搜尋</span>
            </label>
            <div class="relative">
              <input
                v-model="searchKeyword"
                @input="filterFoods"
                type="text"
                placeholder="搜尋美食名稱、特色..."
                class="input input-bordered w-full pl-10"
              />
              <PhMagnifyingGlass
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              />
            </div>
          </div>

          <!-- 設施篩選 -->
          <div class="flex gap-4 items-end">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="creditCardFilter"
                @change="filterFoods"
                class="checkbox checkbox-primary"
              />
              <span class="text-sm">信用卡</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="travelCardFilter"
                @change="filterFoods"
                class="checkbox checkbox-secondary"
              />
              <span class="text-sm">旅遊卡</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 美食列表 -->
      <div v-if="filteredFoods.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">沒有找到符合條件的美食</h3>
        <p class="text-gray-500">請嘗試調整篩選條件</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="food in paginatedFoods"
          :key="food.id"
          class="card bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <!-- 圖片 -->
          <figure class="h-48 bg-gray-200">
            <img
              v-if="food.pic_url"
              :src="food.pic_url"
              :alt="food.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <span class="text-4xl">🍽️</span>
            </div>
          </figure>

          <!-- 內容 -->
          <div class="card-body p-4">
            <h3 class="card-title text-lg font-semibold line-clamp-2">{{ food.name }}</h3>

            <!-- 位置資訊 -->
            <div class="flex items-center text-sm text-gray-600 mb-2">
              <PhMapPin class="h-4 w-4 mr-1" />
              <span>{{ food.city }}{{ food.town ? ` ${food.town}` : '' }}</span>
            </div>

            <!-- 聯絡資訊 -->
            <div v-if="food.tel" class="flex items-center text-sm text-gray-600 mb-2">
              <PhPhone class="h-4 w-4 mr-1" />
              <span>{{ food.tel }}</span>
            </div>

            <!-- 特色描述 -->
            <p v-if="food.food_feature" class="text-sm text-gray-700 line-clamp-3 mb-3">
              {{ food.food_feature }}
            </p>

            <!-- 設施標籤 -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-if="food.credit_card" class="badge badge-primary badge-sm">信用卡</span>
              <span v-if="food.travel_card" class="badge badge-secondary badge-sm">旅遊卡</span>
              <span v-if="food.parking_lot" class="badge badge-accent badge-sm">停車場</span>
            </div>

            <!-- 按鈕 -->
            <div class="card-actions justify-end">
              <button @click="viewDetails(food)" class="btn btn-primary btn-sm">查看詳情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分頁 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="btn-group">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn-sm"
          >
            上一頁
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="['btn btn-sm', page === currentPage ? 'btn-active' : '']"
          >
            {{ page }}
          </button>

          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn btn-sm"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>

    <!-- 詳情模態框 -->
    <div v-if="selectedFood" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-2xl mb-4">{{ selectedFood.name }}</h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 左側：圖片 -->
          <div>
            <img
              v-if="selectedFood.pic_url"
              :src="selectedFood.pic_url"
              :alt="selectedFood.name"
              class="w-full h-64 object-cover rounded-lg"
            />
            <div v-else class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span class="text-6xl text-gray-400">🍽️</span>
            </div>
          </div>

          <!-- 右側：詳細資訊 -->
          <div class="space-y-4">
            <!-- 基本資訊 -->
            <div>
              <h4 class="font-semibold text-lg mb-2">基本資訊</h4>
              <div class="space-y-2 text-sm">
                <div v-if="selectedFood.address" class="flex items-start">
                  <PhMapPin class="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>{{ selectedFood.address }}</span>
                </div>
                <div v-if="selectedFood.tel" class="flex items-center">
                  <Phone class="h-4 w-4 mr-2 text-gray-500" />
                  <a :href="`tel:${selectedFood.tel}`" class="text-blue-600 hover:underline">
                    {{ selectedFood.tel }}
                  </a>
                </div>
                <div v-if="selectedFood.email" class="flex items-center">
                  <Envelope class="h-4 w-4 mr-2 text-gray-500" />
                  <a :href="`mailto:${selectedFood.email}`" class="text-blue-600 hover:underline">
                    {{ selectedFood.email }}
                  </a>
                </div>
                <div v-if="selectedFood.url" class="flex items-center">
                  <PhMapPin class="h-4 w-4 mr-1" />
                  <a :href="selectedFood.url" target="_blank" class="text-blue-600 hover:underline">
                    官方網站
                  </a>
                </div>
              </div>
            </div>

            <!-- 營業資訊 -->
            <div v-if="selectedFood.open_hours || selectedFood.price">
              <h4 class="font-semibold text-lg mb-2">營業資訊</h4>
              <div class="space-y-2 text-sm">
                <div v-if="selectedFood.open_hours">
                  <span class="font-medium">營業時間：</span>
                  <span>{{ selectedFood.open_hours }}</span>
                </div>
                <div v-if="selectedFood.price">
                  <span class="font-medium">價格：</span>
                  <span>{{ selectedFood.price }}</span>
                </div>
              </div>
            </div>

            <!-- 設施 -->
            <div>
              <h4 class="font-semibold text-lg mb-2">設施服務</h4>
              <div class="flex flex-wrap gap-2">
                <span v-if="selectedFood.credit_card" class="badge badge-primary">信用卡</span>
                <span v-if="selectedFood.travel_card" class="badge badge-secondary">旅遊卡</span>
                <span v-if="selectedFood.parking_lot" class="badge badge-accent">停車場</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 特色描述 -->
        <div v-if="selectedFood.food_feature" class="mt-6">
          <h4 class="font-semibold text-lg mb-2">美食特色</h4>
          <p class="text-gray-700 leading-relaxed">{{ selectedFood.food_feature }}</p>
        </div>

        <!-- 注意事項 -->
        <div v-if="selectedFood.reminder || selectedFood.pet_notice" class="mt-6">
          <h4 class="font-semibold text-lg mb-2">注意事項</h4>
          <div class="space-y-2 text-sm text-gray-600">
            <p v-if="selectedFood.reminder">{{ selectedFood.reminder }}</p>
            <p v-if="selectedFood.pet_notice">寵物相關：{{ selectedFood.pet_notice }}</p>
          </div>
        </div>

        <div class="modal-action">
          <button @click="selectedFood = null" class="btn">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PhMagnifyingGlass,
  PhMapPin,
  PhPhone,
  PhEnvelopeSimple,
  PhGlobe,
  PhOnigiri,
} from '@phosphor-icons/vue'
import { getRuralFood } from '@/services/api.js'

// 響應式資料
const foods = ref([])
const loading = ref(false)
const error = ref(null)
const selectedFood = ref(null)

// 篩選器
const selectedCity = ref('')
const searchKeyword = ref('')
const creditCardFilter = ref(false)
const travelCardFilter = ref(false)

// 分頁
const currentPage = ref(1)
const itemsPerPage = 9

// 計算屬性
const cities = computed(() => {
  const citySet = new Set()
  foods.value.forEach((food) => {
    if (food.city) citySet.add(food.city)
  })
  return Array.from(citySet).sort()
})

const filteredFoods = computed(() => {
  let result = foods.value

  // 縣市篩選
  if (selectedCity.value) {
    result = result.filter((food) => food.city === selectedCity.value)
  }

  // 關鍵字搜尋
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (food) =>
        food.name.toLowerCase().includes(keyword) ||
        food.food_feature.toLowerCase().includes(keyword) ||
        food.address.toLowerCase().includes(keyword),
    )
  }

  // 設施篩選
  if (creditCardFilter.value) {
    result = result.filter((food) => food.credit_card)
  }

  if (travelCardFilter.value) {
    result = result.filter((food) => food.travel_card)
  }

  return result
})

const paginatedFoods = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFoods.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredFoods.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const creditCardCount = computed(() => {
  return foods.value.filter((food) => food.credit_card).length
})

// 方法
const fetchFoods = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getRuralFood()
    foods.value = response?.data || []
  } catch (err) {
    error.value = err.message || '載入美食資料失敗'
    console.error('載入美食資料失敗:', err)
  } finally {
    loading.value = false
  }
}

const filterFoods = () => {
  currentPage.value = 1 // 重置到第一頁
}

const viewDetails = (food) => {
  selectedFood.value = food
}

// 生命週期
onMounted(() => {
  fetchFoods()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
