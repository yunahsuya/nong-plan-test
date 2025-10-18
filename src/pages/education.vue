<route lang="yaml">
meta:
  title: '農業教育'
</route>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <!-- 頁面標題 -->
    <div class="bg-white px-8 py-12 text-center border-b border-gray-200 shadow-sm">
      <h1 class="text-green-800 font-bold text-5xl mb-4 flex items-center justify-center gap-3">
        <PhFarm class="w-12 h-12 text-green-600" weight="duotone" />
        農業教育資源
      </h1>
      <p class="text-gray-600 text-xl mb-2">探索豐富的農業知識與學習資源</p>
      <p class="text-gray-500 text-base max-w-4xl mx-auto">
        提供農民學院、水產知識、品種介紹、廢棄物再利用等多元化教育內容
      </p>
    </div>

    <!-- 主要內容區域 -->
    <div class="max-w-7xl mx-auto px-8 py-12">
      <!-- 教育資源分類導航 -->
      <div class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <div
            v-for="category in educationCategories"
            :key="category.id"
            :class="[
              'bg-white rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg',
              selectedCategory === category.id
                ? 'border-green-500 bg-green-50 shadow-lg'
                : 'border-gray-200 hover:border-green-300',
            ]"
            @click="selectCategory(category.id)"
          >
            <div class="text-center">
              <div class="mb-3 flex justify-center">
                <component
                  :is="category.icon"
                  class="w-12 h-12"
                  :class="category.iconColor"
                  weight="duotone"
                />
              </div>
              <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ category.name }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ category.description }}</p>
              <div class="text-xs text-gray-500">資料筆數: {{ getCategoryCount(category.id) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 篩選器 -->
      <div
        v-if="selectedCategory"
        class="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200"
      >
        <h3 class="text-green-800 font-semibold text-xl mb-4 flex items-center gap-2">
          <PhMagnifyingGlass class="w-6 h-6 text-blue-600" weight="duotone" />
          篩選條件
        </h3>
        <div class="flex gap-6 items-end flex-wrap">
          <div class="flex-1 min-w-[200px]">
            <label class="block font-semibold text-gray-700 mb-2">安全等級</label>
            <select
              v-model="selectedSafetyLevel"
              @change="filterData"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :disabled="loading"
            >
              <option value="">全部安全等級</option>
              <option
                v-for="level in availableSafetyLevels"
                :key="level.value"
                :value="level.value"
              >
                {{ level.label }}
              </option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block font-semibold text-gray-700 mb-2">關鍵字搜尋</label>
            <input
              v-model="searchKeyword"
              @input="filterData"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="輸入關鍵字搜尋..."
              :disabled="loading"
            />
          </div>
          <div class="flex gap-2">
            <button
              @click="resetFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
              :disabled="loading"
            >
              <PhArrowCounterClockwise class="w-4 h-4" />
              重置篩選
            </button>
            <button
              @click="refreshData"
              class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
              :disabled="loading"
            >
              <PhArrowsClockwise class="w-4 h-4 text-white" />
              刷新資料
            </button>
          </div>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"
        ></div>
        <p class="mt-4 text-gray-600">正在載入教育資源...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div class="text-red-600 text-4xl mb-4 flex justify-center">
          <PhWarningCircle class="w-12 h-12" weight="duotone" />
        </div>
        <h3 class="text-red-800 font-semibold text-lg mb-2">載入失敗</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadData"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          重新載入
        </button>
      </div>

      <!-- 資料展示區域 -->
      <div v-else-if="selectedCategory && filteredData.length > 0" class="space-y-8">
        <!-- 統計資訊 -->
        <div
          id="search-results-title"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-green-800 font-semibold text-xl">
              {{ getCategoryInfo(selectedCategory).name }} - 搜尋結果
            </h3>
            <div class="text-sm text-gray-600">共找到 {{ filteredData.length }} 筆資料</div>
          </div>
        </div>

        <!-- 資料卡片網格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 品種介紹卡片 -->
          <VarietiesCard
            v-if="selectedCategory === 'varieties'"
            v-for="(item, index) in paginatedData"
            :key="item.id || index"
            :item="item"
          />

          <!-- 水產知識卡片 -->
          <AquacultureCard
            v-if="selectedCategory === 'aquaculture'"
            v-for="(item, index) in paginatedData"
            :key="item.id || index"
            :item="item"
          />

          <!-- 農民學院產品卡片 -->
          <ProductCard
            v-if="selectedCategory === 'product'"
            v-for="(item, index) in paginatedData"
            :key="item.id || index"
            :item="item"
          />
        </div>

        <!-- 分頁 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <div class="flex gap-2 items-center">
            <!-- 第一頁按鈕 -->
            <button
              v-if="currentPage > 1"
              @click="currentPage = 1"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1',
                currentPage === 1
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
              ]"
            >
              <PhCaretLineLeft class="w-4 h-4" />
              第一頁
            </button>

            <!-- 上一頁按鈕 -->
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
              ]"
            >
              <PhCaretLeft class="w-4 h-4" />
              上一頁
            </button>

            <!-- 第一頁數字 -->
            <button
              v-if="currentPage > 3"
              @click="currentPage = 1"
              class="px-3 py-2 rounded-lg text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              1
            </button>

            <!-- 省略號 -->
            <span v-if="currentPage > 4" class="px-2 text-gray-400">...</span>

            <!-- 當前頁前後頁碼 -->
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition-colors',
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
              ]"
            >
              {{ page }}
            </button>

            <!-- 省略號 -->
            <span v-if="currentPage < totalPages - 3" class="px-2 text-gray-400">...</span>

            <!-- 最後一頁數字 -->
            <button
              v-if="currentPage < totalPages - 2"
              @click="currentPage = totalPages"
              class="px-3 py-2 rounded-lg text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              {{ totalPages }}
            </button>

            <!-- 下一頁按鈕 -->
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
              ]"
            >
              下一頁
              <PhCaretRight class="w-4 h-4"  />
            </button>

            <!-- 最後一頁按鈕 -->
            <button
              v-if="currentPage < totalPages"
              @click="currentPage = totalPages"
              :class="[
                'px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1',
                currentPage === totalPages
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
              ]"
            >
              最後一頁
              <PhCaretLineRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- 無資料狀態 -->
      <div v-else-if="selectedCategory && !loading" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4 flex justify-center">
          <PhTray class="w-16 h-16" weight="duotone" />
        </div>
        <h3 class="text-gray-600 font-semibold text-xl mb-2">暫無相關資料</h3>
        <p class="text-gray-500">請嘗試調整篩選條件或選擇其他分類</p>
      </div>

      <!-- 未選擇分類狀態 -->
      <div v-else class="text-center py-12">
        <div class="text-green-400 text-6xl mb-4 flex justify-center">
          <PhPlant class="w-16 h-16" weight="duotone" />
        </div>
        <h3 class="text-gray-600 font-semibold text-xl mb-2">選擇教育資源分類</h3>
        <p class="text-gray-500">請點擊上方分類卡片開始探索農業教育資源</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getEducationCategories, getEducationData } from '../services/api.js'
import VarietiesCard from '../components/education/VarietiesCard.vue'
import AquacultureCard from '../components/education/AquacultureCard.vue'
import ProductCard from '../components/education/ProductCard.vue'

// 導入 Phosphor Icons
import {
  PhFarm,
  PhGrains,
  PhFish,
  PhPlant,
  PhMagnifyingGlass,
  PhArrowCounterClockwise,
  PhArrowsClockwise,
  PhWarningCircle,
  PhCaretLineLeft, // 第一頁 - 雙線左箭頭
  PhCaretLeft, // 上一頁 - 單線左箭頭
  PhCaretRight, // 下一頁 - 單線右箭頭
  PhCaretLineRight, // 最後一頁 - 雙線右箭頭
  PhTray,
} from '@phosphor-icons/vue'

// 響應式資料
const selectedCategory = ref('')
const selectedSafetyLevel = ref('')
const searchKeyword = ref('')
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// 各分類的資料
const productData = ref([])
const aquacultureData = ref([])
const varietiesData = ref([])

// 教育資源分類定義
const educationCategories = ref([
  {
    id: 'product',
    name: '農民學院找產品',
    icon: PhGrains,
    iconColor: 'text-green-700',
    description: '農民產品與農產資訊',
  },
  {
    id: 'aquaculture',
    name: '水產知識淺說',
    icon: PhFish,
    iconColor: 'text-blue-600',
    description: '水產知識小遊戲',
  },
  {
    id: 'varieties',
    name: '農業試驗所品種介紹',
    icon: PhPlant,
    iconColor: 'text-green-600',
    description: '農作品種介紹與資訊',
  },
])

// 計算屬性
const availableSafetyLevels = computed(() => {
  const levels = new Set()
  const currentData = getCurrentData()
  currentData.forEach((item) => {
    if (item.verify_marker) levels.add(item.verify_marker)
  })

  // 安全等級對應表 - 中文與英文
  const levelMap = {
    TAP: '產銷履歷認證 (TAP)',
    organic: '有機認證 (Organic)',
    preorganic: '有機轉型期 (Pre-Organic)',
    NOpesticide: '無農藥 (No Pesticide)',
  }

  return Array.from(levels)
    .map((level) => ({
      value: level,
      label: levelMap[level] || level,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

// 新增：計算可見的頁碼
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const filteredData = computed(() => {
  let data = getCurrentData()

  // 安全等級篩選
  if (selectedSafetyLevel.value) {
    data = data.filter(
      (item) => item.verify_marker && item.verify_marker === selectedSafetyLevel.value,
    )
  }

  // 關鍵字篩選
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.title && item.title.toLowerCase().includes(keyword)) ||
        (item.address && item.address.toLowerCase().includes(keyword)) ||
        (item.description && item.description.toLowerCase().includes(keyword)),
    )
  }

  return data
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredData.value.slice(start, end)
})

// 方法
const getCurrentData = () => {
  switch (selectedCategory.value) {
    case 'product':
      return productData.value
    case 'aquaculture':
      return aquacultureData.value
    case 'varieties':
      return varietiesData.value
    default:
      return []
  }
}

const getCategoryCount = (categoryId) => {
  switch (categoryId) {
    case 'product':
      return productData.value.length
    case 'aquaculture':
      return aquacultureData.value.length
    case 'varieties':
      return varietiesData.value.length
    default:
      return 0
  }
}

const loadCategoryData = async (categoryId) => {
  loading.value = true
  error.value = ''

  try {
    const result = await getEducationData(categoryId)

    if (!result.success) {
      throw new Error(result.message)
    }

    // 儲存到對應的資料陣列
    switch (categoryId) {
      case 'product':
        productData.value = result.data
        break
      case 'aquaculture':
        aquacultureData.value = result.data
        break
      case 'varieties':
        varietiesData.value = result.data
        break
    }
  } catch (err) {
    error.value = `載入 ${getCategoryInfo(categoryId).name} 資料失敗: ${err.message}`
    console.error('載入資料失敗:', err)
  } finally {
    loading.value = false
  }
}

const getCategoryInfo = (categoryId) => {
  return educationCategories.value.find((cat) => cat.id === categoryId) || {}
}

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  selectedSafetyLevel.value = ''
  searchKeyword.value = ''

  // 如果該分類還沒有資料，則載入
  if (getCategoryCount(categoryId) === 0) {
    await loadCategoryData(categoryId)
  }
}

const filterData = () => {
  currentPage.value = 1
}

const resetFilter = () => {
  selectedSafetyLevel.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
}

const refreshData = async () => {
  if (selectedCategory.value) {
    await loadCategoryData(selectedCategory.value)
  }
}

const loadData = async () => {
  if (selectedCategory.value) {
    await loadCategoryData(selectedCategory.value)
  }
}

// 監聽分頁變化
watch(currentPage, () => {
  // 使用 nextTick 確保 DOM 更新後再滾動
  nextTick(() => {
    // 滾動到搜尋結果標題區域
    const titleElement = document.getElementById('search-results-title')
    if (titleElement) {
      titleElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  })
})

// 載入教育資源分類
// const loadEducationCategories = async () => {
//   try {
//     const result = await getEducationCategories()
//     if (result.success) {
//       educationCategories.value = result.data
//     }
//   } catch (error) {
//     console.error('載入教育資源分類失敗:', error)
//   }
// }

// 組件掛載時載入預設資料
onMounted(async () => {
  // await loadEducationCategories()
  // 設定「農民學院找產品」為預設選項
  await selectCategory('product')
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
