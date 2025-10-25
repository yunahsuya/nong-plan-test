<!-- SouvenirList.vue -->
<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <!-- 標題區域 -->
    <div class="bg-white px-8 py-6 border-b border-gray-200">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-green-800 font-bold text-3xl mb-2">農村伴手禮</h2>
        <p class="text-gray-600 text-lg">精選台灣各地優質農產品伴手禮</p>
      </div>
    </div>

    <!-- 篩選和控制區域 -->
    <div class="bg-white px-8 py-4 border-b border-gray-200">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- 搜尋欄 -->
          <div class="flex-1 min-w-[300px]">
            <div class="relative">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜尋伴手禮名稱、縣市或特色..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <i
                class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i>
            </div>
          </div>

          <!-- 縣市篩選 -->
          <div class="min-w-[200px]">
            <select
              v-model="selectedCounty"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">全部縣市</option>
              <option v-for="county in counties" :key="county" :value="county">
                {{ county }}
              </option>
            </select>
          </div>

          <!-- 重新整理按鈕 -->
          <button
            @click="refreshData"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-sync-alt mr-2" :class="{ 'animate-spin': loading }"></i>
            重新整理
          </button>
        </div>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
        <p class="text-gray-600">載入伴手禮資料中...</p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mx-8 mt-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-600 text-2xl mr-3"></i>
        <div>
          <h3 class="text-red-800 font-semibold">載入失敗</h3>
          <p class="text-red-600">{{ error }}</p>
          <button
            @click="loadSouvenirs"
            class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    </div>

    <!-- 伴手禮列表 -->
    <div v-else class="max-w-7xl mx-auto px-8 py-6">
      <!-- 統計資訊 -->
      <div class="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="flex flex-wrap gap-6 text-sm text-gray-600">
          <div class="flex items-center">
            <i class="fas fa-gift text-green-600 mr-2"></i>
            <span>總計 {{ pagination.totalItems || 0 }} 項伴手禮</span>
          </div>
          <div v-if="selectedCounty" class="flex items-center">
            <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
            <span>{{ selectedCounty }} 地區</span>
          </div>
          <div v-if="searchKeyword" class="flex items-center">
            <i class="fas fa-search text-purple-600 mr-2"></i>
            <span>關鍵字: "{{ searchKeyword }}"</span>
          </div>
        </div>
      </div>

      <div class="mb-6 flex justify-between items-center">
        <div class="text-sm text-gray-600">
          顯示第 {{ pagination.startItem }}-{{ pagination.endItem }} 項，共
          {{ pagination.totalItems }} 項
        </div>

        <!-- 每頁顯示數量選擇 -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">每頁顯示：</span>
          <select
            v-model="itemsPerPage"
            @change="changeItemsPerPage"
            class="px-2 py-1 border rounded"
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>
      </div>

      <!-- 伴手禮網格 -->
      <div
        v-if="paginatedSouvenirs.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="souvenir in paginatedSouvenirs"
          :key="souvenir.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <!-- 產品圖片 -->
          <div class="h-48 bg-gray-200 flex items-center justify-center">
            <img
              v-if="souvenir.image"
              :src="souvenir.image"
              :alt="souvenir.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-gray-400 text-6xl">
              <i class="fas fa-gift"></i>
            </div>
          </div>

          <!-- 產品資訊 -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{{ souvenir.name }}</h3>

            <!-- 特色描述 -->
            <p v-if="souvenir.feature" class="text-gray-600 text-sm mb-3 line-clamp-3">
              {{ souvenir.feature }}
            </p>

            <!-- 價格資訊 -->
            <div v-if="souvenir.price" class="mb-3">
              <span class="text-green-600 font-bold text-lg">NT$ {{ souvenir.price }}</span>
            </div>

            <!-- 縣市標籤 -->
            <div class="mb-3">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ souvenir.county }}
              </span>
            </div>

            <!-- 聯絡資訊 -->
            <div class="space-y-1 text-sm text-gray-600">
              <div v-if="souvenir.salePlace" class="flex items-start">
                <i class="fas fa-map-marker-alt text-gray-400 mt-0.5 mr-2 flex-shrink-0"></i>
                <span class="line-clamp-1">{{ souvenir.salePlace }}</span>
              </div>
              <div v-if="souvenir.contactTel" class="flex items-center">
                <i class="fas fa-phone text-gray-400 mr-2"></i>
                <a :href="`tel:${souvenir.contactTel}`" class="text-blue-600 hover:underline">
                  {{ souvenir.contactTel }}
                </a>
              </div>
              <div v-if="souvenir.produceOrg" class="flex items-center">
                <i class="fas fa-building text-gray-400 mr-2"></i>
                <span>{{ souvenir.produceOrg }}</span>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="mt-4 flex gap-2">
              <button
                v-if="souvenir.website"
                @click="openWebsite(souvenir.website)"
                class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <i class="fas fa-external-link-alt mr-1"></i>
                官網
              </button>
              <button
                v-if="souvenir.coordinates"
                @click="showOnMap(souvenir)"
                class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i class="fas fa-map-marker-alt mr-1"></i>
                地圖
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分頁導航 - 移到底部 -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center gap-2">
          <button
            @click="goToPage(1)"
            :disabled="pagination.currentPage === 1"
            class="px-3 py-2 border rounded disabled:opacity-50"
          >
            首頁
          </button>
          <button
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="!pagination.hasPrevPage"
            class="px-3 py-2 border rounded disabled:opacity-50"
          >
            上一頁
          </button>

          <!-- 頁碼 -->
          <template v-for="page in visiblePages" :key="page">
            <button
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 border rounded',
                page === pagination.currentPage ? 'bg-green-600 text-white' : 'hover:bg-gray-100',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <button
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="!pagination.hasNextPage"
            class="px-3 py-2 border rounded disabled:opacity-50"
          >
            下一頁
          </button>
          <button
            @click="goToPage(pagination.totalPages)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-2 border rounded disabled:opacity-50"
          >
            末頁
          </button>
        </nav>
      </div>

      <!-- 無結果 -->
      <div v-else class="text-center py-12">
        <i class="fas fa-search text-gray-400 text-6xl mb-4"></i>
        <h3 class="text-gray-600 text-xl mb-2">找不到相關伴手禮</h3>
        <p class="text-gray-500">請嘗試調整搜尋條件</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { getRuralSouvenirs } from '@/services/api'

export default {
  name: 'SouvenirList',

  setup() {
    const souvenirs = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchKeyword = ref('')
    const selectedCounty = ref('')
    // 分頁
    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 12,
      hasNextPage: false,
      hasPrevPage: false,
      startItem: 1,
      endItem: 12,
    })

    // 載入伴手禮資料
    const loadSouvenirs = async (forceRefresh = false) => {
      loading.value = true
      error.value = null

      try {
        const result = await getRuralSouvenirs(
          forceRefresh,
          currentPage.value,
          itemsPerPage.value,
          searchKeyword.value,
          selectedCounty.value,
        )

        if (result.success) {
          souvenirs.value = result.data
          // 更新分頁資訊
          if (result.pagination) {
            pagination.value = result.pagination
          }
          console.log(`✅ 成功載入 ${result.data.length} 項伴手禮${result.cached ? ' (快取)' : ''}`)
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        error.value = err.message || '載入伴手禮資料失敗'
        console.error('❌ 載入伴手禮失敗:', err)
      } finally {
        loading.value = false
      }
    }

    // 重新整理資料
    const refreshData = () => {
      loadSouvenirs(true)
    }

    // 計算縣市列表
    const counties = computed(() => {
      const countySet = new Set()
      souvenirs.value.forEach((item) => {
        if (item.county) {
          countySet.add(item.county)
        }
      })
      return Array.from(countySet).sort()
    })

    // 篩選伴手禮
    const filteredSouvenirs = computed(() => {
      return souvenirs.value
    })

    // 計算分頁資料
    const paginatedSouvenirs = computed(() => {
      // 直接返回後端返回的資料，不再進行前端分頁
      return souvenirs.value
    })

    // 計算可見頁碼
    const visiblePages = computed(() => {
      const total = pagination.value.totalPages
      const current = pagination.value.currentPage
      const pages = []

      let start = Math.max(1, current - 2)
      let end = Math.min(total, current + 2)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // 開啟網站
    const openWebsite = (url) => {
      if (url) {
        window.open(url, '_blank')
      }
    }

    // 顯示地圖
    const showOnMap = (souvenir) => {
      if (souvenir.coordinates && souvenir.coordinates.latitude && souvenir.coordinates.longitude) {
        const { latitude, longitude } = souvenir.coordinates
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
        window.open(mapUrl, '_blank')
      }
    }

    // 監聽搜尋條件變化
    watch([searchKeyword, selectedCounty], () => {
      currentPage.value = 1 // 重置到第一頁
      loadSouvenirs() // 重新載入資料
    })

    // 組件掛載時載入資料
    onMounted(() => {
      loadSouvenirs()
    })

    // 分頁方法
    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        currentPage.value = page
        loadSouvenirs() // 載入新頁面的資料
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const changeItemsPerPage = () => {
      currentPage.value = 1
      loadSouvenirs() // 重新載入資料
    }

    return {
      souvenirs,
      loading,
      error,
      searchKeyword,
      selectedCounty,
      counties,
      filteredSouvenirs,
      paginatedSouvenirs, // 新增
      pagination, // 新增
      visiblePages, // 新增
      currentPage, // 新增
      itemsPerPage, // 新增
      loadSouvenirs,
      refreshData,
      openWebsite,
      showOnMap,
      goToPage, // 新增
      changeItemsPerPage, // 新增
    }
  },
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
