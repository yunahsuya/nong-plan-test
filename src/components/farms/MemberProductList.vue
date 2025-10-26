<!-- components/education/MemberProductList.vue -->
<template>
  <div class="p-8">
    <!-- 標題和統計 -->
    <div class="mb-8">
      <!-- <h2 class="text-3xl font-bold text-green-800 mb-4">🎓 農民學院找產品</h2> -->
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>總計：{{ statistics.total || 0 }} 項</span>
        <span>有機認證：{{ statistics.byVerifyMarker?.organic || 0 }} 項</span>
        <span>產銷履歷：{{ statistics.byVerifyMarker?.TAP || 0 }} 項</span>
        <span>全年供應：{{ statistics.available || 0 }} 項</span>
      </div>
    </div>

    <!-- 篩選器 -->
    <div class="mb-6 bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 搜尋框 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜尋關鍵字</label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="輸入農民姓名、作物名稱..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          />
        </div>

        <!-- 農民篩選 -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">農民</label>
          <select
            v-model="selectedMember"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadData"
          >
            <option value="">全部農民</option>
            <option v-for="member in members" :key="member" :value="member">
              {{ member }}
            </option>
          </select>
        </div> -->

        <!-- 作物篩選 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">作物</label>
          <select
            v-model="selectedCrop"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadData"
          >
            <option value="">全部作物</option>
            <option v-for="crop in crops" :key="crop" :value="crop">
              {{ crop }}
            </option>
          </select>
        </div>

        <!-- 驗證標章篩選 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">驗證標章</label>
          <select
            v-model="selectedVerifyMarker"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadData"
          >
            <option value="">全部標章</option>
            <option v-for="marker in verifyMarkers" :key="marker" :value="marker">
              {{ getVerifyMarkerName(marker) }}
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
        <!-- 產品資訊卡片 -->
        <div class="p-6">
          <!-- 農民姓名 -->
          <!-- <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <span class="text-2xl mr-2">👨‍🌾</span>
              {{ item.memberName }}
            </h3>
          </div> -->

          <!-- 作物名稱 -->
          <div class="mb-4">
            <h4 class="text-xl font-bold text-green-700 flex items-center">
              <span class="text-2xl mr-2">🌱</span>
              {{ item.crop }}
            </h4>
          </div>

          <!-- 驗證標章 -->
          <div class="mb-4">
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                getVerifyMarkerClass(item.verifyMarker),
              ]"
            >
              <span class="mr-1">{{ getVerifyMarkerIcon(item.verifyMarker) }}</span>
              {{ getVerifyMarkerName(item.verifyMarker) }}
            </span>
          </div>

          <!-- 產量資訊 -->
          <div class="mb-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">產量：</span>
              <span class="font-semibold text-green-600">{{ formatYield(item.yield) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">最小出貨量：</span>
              <span class="font-semibold text-blue-600">{{ item.shipmentsMin }}</span>
            </div>
          </div>

          <!-- 季節資訊 -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <span class="text-sm text-gray-600 mr-2">供應季節：</span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600',
                ]"
              >
                {{ item.isAvailable ? '目前可供應' : '非供應季節' }}
              </span>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="season in item.season"
                :key="season"
                class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {{ season }}
              </span>
            </div>
          </div>

          <!-- 標籤 -->
          <div class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 分類 -->
          <!-- <div class="mb-4">
            <span class="text-sm text-gray-600">分類：</span>
            <span class="ml-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
              {{ item.category }}
            </span>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 無資料 -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🎓</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無資料</h3>
      <p class="text-gray-500">目前沒有符合條件的農民學院產品</p>
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
import memberProductService from '@/services/memberProductService.js'

export default {
  name: 'MemberProductList',
  setup() {
    const items = ref([])
    const members = ref([])
    const crops = ref([])
    const verifyMarkers = ref([])
    const statistics = ref({})
    const loading = ref(false)
    const error = ref('')
    const searchKeyword = ref('')
    const selectedMember = ref('')
    const selectedCrop = ref('')
    const selectedVerifyMarker = ref('')
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
        const result = await memberProductService.getMemberProducts(
          forceRefresh,
          currentPage.value,
          itemsPerPage.value,
          searchKeyword.value,
          selectedMember.value,
          selectedCrop.value,
          selectedVerifyMarker.value,
        )

        if (result.success) {
          items.value = result.data
          pagination.value = result.pagination
        } else {
          error.value = result.message
        }
      } catch (err) {
        error.value = '載入資料失敗'
        console.error('載入農民學院找產品失敗:', err)
      } finally {
        loading.value = false
      }
    }

    // 載入農民列表
    const loadMembers = async () => {
      try {
        const result = await memberProductService.getMembers()
        if (result.success) {
          members.value = result.data
        }
      } catch (err) {
        console.error('載入農民列表失敗:', err)
      }
    }

    // 載入作物列表
    const loadCrops = async () => {
      try {
        const result = await memberProductService.getCrops()
        if (result.success) {
          crops.value = result.data
        }
      } catch (err) {
        console.error('載入作物列表失敗:', err)
      }
    }

    // 載入驗證標章列表
    const loadVerifyMarkers = async () => {
      try {
        const result = await memberProductService.getVerifyMarkers()
        if (result.success) {
          verifyMarkers.value = result.data
        }
      } catch (err) {
        console.error('載入驗證標章列表失敗:', err)
      }
    }

    // 載入統計資料
    const loadStatistics = async () => {
      try {
        const result = await memberProductService.getStatistics()
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
        const result = await memberProductService.clearCache()
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

    // 取得驗證標章名稱
    const getVerifyMarkerName = (marker) => {
      const names = {
        TAP: '產銷履歷',
        organic: '有機認證',
        preorganic: '有機轉型期',
        NOpesticide: '無農藥',
      }
      return names[marker] || marker
    }

    // 取得驗證標章圖示
    const getVerifyMarkerIcon = (marker) => {
      const icons = {
        TAP: '🏷️',
        organic: '🌿',
        preorganic: '🌱',
        NOpesticide: '🛡️',
      }
      return icons[marker] || '📋'
    }

    // 取得驗證標章樣式
    const getVerifyMarkerClass = (marker) => {
      const classes = {
        TAP: 'bg-blue-100 text-blue-800',
        organic: 'bg-green-100 text-green-800',
        preorganic: 'bg-yellow-100 text-yellow-800',
        NOpesticide: 'bg-purple-100 text-purple-800',
      }
      return classes[marker] || 'bg-gray-100 text-gray-800'
    }

    // 格式化產量
    const formatYield = (yieldValue) => {
      if (yieldValue >= 10000) {
        return `${(yieldValue / 10000).toFixed(1)}萬`
      } else if (yieldValue >= 1000) {
        return `${(yieldValue / 1000).toFixed(1)}千`
      }
      return yieldValue.toString()
    }

    // 監聽分頁變化
    watch(currentPage, () => {
      loadData()
    })

    // 初始化
    onMounted(() => {
      loadData()
      loadMembers()
      loadCrops()
      loadVerifyMarkers()
      loadStatistics()
    })

    return {
      items,
      members,
      crops,
      verifyMarkers,
      statistics,
      loading,
      error,
      searchKeyword,
      selectedMember,
      selectedCrop,
      selectedVerifyMarker,
      pagination,
      debouncedSearch,
      loadData,
      clearCache,
      changePage,
      getVerifyMarkerName,
      getVerifyMarkerIcon,
      getVerifyMarkerClass,
      formatYield,
    }
  },
}
</script>
