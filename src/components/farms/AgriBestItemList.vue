<!-- components/AgriBestItemList.vue -->
<template>
  <div class="p-8">
    <!-- 標題和統計 -->
    <div class="mb-8">
      <!-- <h2 class="text-3xl font-bold text-green-800 mb-4">🏆 農漁會年度百大農業精品好禮</h2> -->
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>總計：{{ statistics.total || 0 }} 項</span>
        <span>有圖片：{{ statistics.withImage || 0 }} 項</span>
        <span>有座標：{{ statistics.withCoordinates || 0 }} 項</span>
        <span>有網站：{{ statistics.withWebsite || 0 }} 項</span>
      </div>
    </div>

    <!-- 篩選器 -->
    <div class="mb-6 bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 搜尋框 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜尋關鍵字</label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="輸入產品名稱、類型或縣市..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          />
        </div>

        <!-- 縣市篩選 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">縣市</label>
          <select
            v-model="selectedCounty"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadData"
          >
            <option value="">全部縣市</option>
            <option v-for="county in counties" :key="county" :value="county">
              {{ county }}
            </option>
          </select>
        </div>

        <!-- 類型篩選 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">產品類型</label>
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadData"
          >
            <option value="">全部類型</option>
            <option v-for="type in types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="mt-4 flex gap-2">
        <button
          @click="loadData(true)"
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? '載入中...' : '重新整理' }}
        </button>
        <button
          @click="clearCache"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          清除快取
        </button>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      <p class="mt-2 text-gray-600">載入中...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
    </div>

    <!-- 產品列表 -->
    <div v-else-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <!-- 產品圖片 -->
        <div class="h-48 bg-gray-200 overflow-hidden">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <span class="text-4xl">🏆</span>
          </div>
        </div>

        <!-- 產品資訊 -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {{ item.name }}
          </h3>

          <div class="space-y-2 text-sm text-gray-600">
            <div v-if="item.type" class="flex items-center">
              <span class="font-medium w-16">類型：</span>
              <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {{ item.type }}
              </span>
            </div>

            <div v-if="item.organization" class="flex items-center">
              <span class="font-medium w-16">機構：</span>
              <span>{{ item.organization }}</span>
            </div>

            <div v-if="item.county" class="flex items-center">
              <span class="font-medium w-16">地區：</span>
              <span>{{ item.county }}{{ item.township ? ` ${item.township}` : '' }}</span>
            </div>

            <div v-if="item.price && item.price !== '0'" class="flex items-center">
              <span class="font-medium w-16">價格：</span>
              <span class="text-green-600 font-semibold">NT$ {{ item.price }}</span>
            </div>
          </div>

          <!-- 產品描述 -->
          <div v-if="item.description" class="mt-3">
            <p class="text-sm text-gray-600 line-clamp-3">
              {{ item.description }}
            </p>
          </div>

          <!-- 規格資訊 -->
          <div v-if="item.specification" class="mt-3">
            <p class="text-xs text-gray-500">
              <span class="font-medium">規格：</span>{{ item.specification }}
            </p>
          </div>

          <!-- 操作按鈕 -->
          <div class="mt-4 flex gap-2">
            <button
              v-if="item.phone"
              @click="callPhone(item.phone)"
              class="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              📞 聯絡
            </button>
            <button
              v-if="item.website"
              @click="openWebsite(item.website)"
              class="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              🌐 網站
            </button>
            <button
              v-if="item.coordinates.latitude && item.coordinates.longitude"
              @click="openMap(item.coordinates.latitude, item.coordinates.longitude, item.name)"
              class="flex-1 px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
            >
              🗺️ 地圖
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 無資料 -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🏆</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無資料</h3>
      <p class="text-gray-500">目前沒有符合條件的農漁會年度百大農業精品好禮</p>
    </div>

    <!-- 分頁 -->
    <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="!pagination.hasPrevPage"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一頁
        </button>

        <span class="px-3 py-2 text-sm text-gray-700">
          第 {{ pagination.currentPage }} 頁，共 {{ pagination.totalPages }} 頁
        </span>

        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="!pagination.hasNextPage"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一頁
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import agriBestItemService from '@/services/agriBestItemService.js'

export default {
  name: 'AgriBestItemList',
  setup() {
    const items = ref([])
    const counties = ref([])
    const types = ref([])
    const statistics = ref({})
    const loading = ref(false)
    const error = ref('')
    const searchKeyword = ref('')
    const selectedCounty = ref('')
    const selectedType = ref('')
    const pagination = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(12)

    // 防抖搜尋
    let searchTimeout = null
    const debouncedSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        currentPage.value = 1
        loadData()
      }, 500)
    }

    // 載入資料
    const loadData = async (forceRefresh = false) => {
      loading.value = true
      error.value = ''

      try {
        const result = await agriBestItemService.getAgriBestItems(
          forceRefresh,
          currentPage.value,
          itemsPerPage.value,
          searchKeyword.value,
          selectedCounty.value,
          selectedType.value,
        )

        if (result.success) {
          items.value = result.data
          pagination.value = result.pagination
        } else {
          error.value = result.message
        }
      } catch (err) {
        error.value = '載入資料失敗'
        console.error('載入農漁會年度百大農業精品好禮失敗:', err)
      } finally {
        loading.value = false
      }
    }

    // 載入縣市列表
    const loadCounties = async () => {
      try {
        const result = await agriBestItemService.getAgriBestItemCounties()
        if (result.success) {
          counties.value = result.data
        }
      } catch (err) {
        console.error('載入縣市列表失敗:', err)
      }
    }

    // 載入類型列表
    const loadTypes = async () => {
      try {
        const result = await agriBestItemService.getAgriBestItemTypes()
        if (result.success) {
          types.value = result.data
        }
      } catch (err) {
        console.error('載入類型列表失敗:', err)
      }
    }

    // 載入統計資料
    const loadStatistics = async () => {
      try {
        const result = await agriBestItemService.getAgriBestItemStatistics()
        if (result.success) {
          statistics.value = result.data
        }
      } catch (err) {
        console.error('載入統計資料失敗:', err)
      }
    }

    // 清除快取
    const clearCache = async () => {
      try {
        const result = await agriBestItemService.clearAgriBestItemCache()
        if (result.success) {
          alert('快取已清除')
          loadData(true)
        } else {
          alert('清除快取失敗：' + result.message)
        }
      } catch (err) {
        alert('清除快取失敗')
        console.error('清除快取失敗:', err)
      }
    }

    // 換頁
    const changePage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        currentPage.value = page
        loadData()
      }
    }

    // 處理圖片錯誤
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    // 撥打電話
    const callPhone = (phone) => {
      window.open(`tel:${phone}`)
    }

    // 開啟網站
    const openWebsite = (url) => {
      window.open(url, '_blank')
    }

    // 開啟地圖
    const openMap = (lat, lng, name) => {
      const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`
      window.open(url, '_blank')
    }

    // 監聽分頁變化
    watch(currentPage, () => {
      loadData()
    })

    // 初始化
    onMounted(() => {
      loadData()
      loadCounties()
      loadTypes()
      loadStatistics()
    })

    return {
      items,
      counties,
      types,
      statistics,
      loading,
      error,
      searchKeyword,
      selectedCounty,
      selectedType,
      pagination,
      debouncedSearch,
      loadData,
      clearCache,
      changePage,
      handleImageError,
      callPhone,
      openWebsite,
      openMap,
    }
  },
}
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
