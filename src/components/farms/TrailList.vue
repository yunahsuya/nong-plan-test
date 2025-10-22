<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <!-- 標題和搜尋 -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-green-800 mb-4">🥾 步道探索</h2>
        <p class="text-gray-600 mb-6">探索台灣美麗的農村步道，享受自然風光</p>

        <!-- 搜尋和篩選 -->
        <div class="flex flex-wrap gap-4 mb-6">
          <div class="flex-1 min-w-[300px]">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜尋步道名稱或地點..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              @input="handleSearch"
            />
          </div>
          <select
            v-model="selectedCounty"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            @change="handleCountyFilter"
          >
            <option value="">全部縣市</option>
            <option v-for="county in counties" :key="county" :value="county">
              {{ county }}
            </option>
          </select>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"
        ></div>
        <p class="mt-2 text-gray-600">載入中...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadTrails"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          重新載入
        </button>
      </div>

      <!-- 步道列表 -->
      <div v-else-if="trails.length > 0">
        <!-- 資料統計 -->
        <div class="mb-4 text-sm text-gray-600">
          顯示第 {{ pagination.currentPage }} 頁，共 {{ pagination.totalPages }} 頁 (總計
          {{ pagination.totalItems }} 筆資料)
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="trail in trails"
            :key="trail.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ trail.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ trail.county }} {{ trail.town }}</p>

              <div class="space-y-2 text-sm text-gray-600">
                <div v-if="trail.areaLocation" class="flex items-start">
                  <span class="font-medium w-16">位置：</span>
                  <span class="flex-1">{{ trail.areaLocation }}</span>
                </div>

                <div v-if="trail.maintainUnit" class="flex items-start">
                  <span class="font-medium w-16">管理：</span>
                  <span class="flex-1">{{ trail.maintainUnit }}</span>
                </div>

                <div v-if="trail.tel" class="flex items-center">
                  <span class="font-medium w-16">電話：</span>
                  <span>{{ trail.tel }}</span>
                </div>

                <div v-if="trail.stayTime" class="flex items-center">
                  <span class="font-medium w-16">建議時間：</span>
                  <span>{{ trail.stayTime }}</span>
                </div>
              </div>

              <div v-if="trail.feature" class="mt-4">
                <p class="text-sm text-gray-700 line-clamp-3">{{ trail.feature }}</p>
              </div>

              <div v-if="trail.trafficGuidelines" class="mt-4">
                <details class="text-sm">
                  <summary class="font-medium text-green-700 cursor-pointer">交通指引</summary>
                  <div class="mt-2 text-gray-600">
                    <!-- 解析並分段顯示交通指引 -->
                    <div v-html="formatTrafficGuidelines(trail.trafficGuidelines)"></div>
                  </div>
                </details>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in trail.tags"
                  :key="tag"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分頁控制 -->
        <div class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <!-- 第一頁 -->
            <button
              @click="goToPage(1)"
              :disabled="pagination.currentPage === 1"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pagination.currentPage === 1
                  ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
              ]"
              title="第一頁"
            >
              <PhCaretLineLeft :size="16" class="inline-block" />
              第一頁
            </button>

            <!-- 上一頁 -->
            <button
              @click="goToPage(pagination.currentPage - 1)"
              :disabled="!pagination.hasPrevPage"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pagination.hasPrevPage
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed',
              ]"
              title="上一頁"
            >
              <PhCaretLeft :size="16" class="inline-block" />
              上一頁
            </button>

            <!-- 頁碼 -->
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  page === pagination.currentPage
                    ? 'text-white bg-green-600 border border-green-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-gray-400">...</span>
            </template>

            <!-- 下一頁 -->
            <button
              @click="goToPage(pagination.currentPage + 1)"
              :disabled="!pagination.hasNextPage"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pagination.hasNextPage
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed',
              ]"
              title="下一頁"
            >
              下一頁
              <PhCaretRight :size="16" class="inline-block" />
            </button>

            <!-- 最後一頁 -->
            <button
              @click="goToPage(pagination.totalPages)"
              :disabled="pagination.currentPage === pagination.totalPages"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pagination.currentPage === pagination.totalPages
                  ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
              ]"
              title="最後一頁"
            >
              最後一頁
              <PhCaretLineRight :size="16" class="inline-block" />
            </button>
          </nav>
        </div>
      </div>

      <!-- 無資料狀態 -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600">找不到符合條件的步道</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { getTrails, getTrailsByCounty, searchTrails } from '@/services/api.js'

import {
  PhArrowCounterClockwise,
  PhArrowsClockwise,
  PhCaretLineLeft,
  PhCaretLineRight,
  PhCaretLeft,
  PhCaretRight,
} from '@phosphor-icons/vue'

export default {
  name: 'TrailList',
  components: {
    PhCaretLineLeft,
    PhCaretLeft,
    PhCaretRight,
    PhCaretLineRight,
    PhArrowCounterClockwise,
    PhArrowsClockwise,
  },
  setup() {
    const trails = ref([])
    const loading = ref(false)
    const error = ref('')
    const searchKeyword = ref('')
    const selectedCounty = ref('')
    const currentPage = ref(1)
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 9,
      hasNextPage: false,
      hasPrevPage: false,
    })

    // 計算屬性
    const counties = computed(() => {
      // 由於現在使用分頁，我們需要從所有資料中提取縣市
      // 這裡可以考慮在後端提供縣市列表API
      const countySet = new Set()
      // 暫時使用常見縣市列表
      return [
        '台北市',
        '新北市',
        '桃園市',
        '台中市',
        '台南市',
        '高雄市',
        '基隆市',
        '新竹市',
        '嘉義市',
        '新竹縣',
        '苗栗縣',
        '彰化縣',
        '南投縣',
        '雲林縣',
        '嘉義縣',
        '屏東縣',
        '宜蘭縣',
        '花蓮縣',
        '台東縣',
        '澎湖縣',
        '金門縣',
        '連江縣',
      ]
    })

    // 計算可見的頁碼
    const visiblePages = computed(() => {
      const totalPages = pagination.value.totalPages
      const current = pagination.value.currentPage
      const pages = []

      if (totalPages <= 7) {
        // 如果總頁數少於等於7頁，顯示所有頁碼
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 複雜的分頁邏輯
        pages.push(1)

        if (current > 4) {
          pages.push('...')
        }

        const start = Math.max(2, current - 1)
        const end = Math.min(totalPages - 1, current + 1)

        for (let i = start; i <= end; i++) {
          pages.push(i)
        }

        if (current < totalPages - 3) {
          pages.push('...')
        }

        if (totalPages > 1) {
          pages.push(totalPages)
        }
      }

      return pages
    })

    // 載入步道資料
    const loadTrails = async (page = 1) => {
      loading.value = true
      error.value = ''

      try {
        let result

        if (selectedCounty.value) {
          result = await getTrailsByCounty(selectedCounty.value, page)
        } else if (searchKeyword.value) {
          result = await searchTrails({ keyword: searchKeyword.value, page })
        } else {
          result = await getTrails(page)
        }

        if (result.success) {
          trails.value = result.data
          pagination.value = result.pagination
          currentPage.value = page
        } else {
          error.value = result.message
        }
      } catch (err) {
        error.value = '載入步道資料時發生錯誤'
        console.error('載入步道資料錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    // 搜尋處理
    const handleSearch = () => {
      currentPage.value = 1
      loadTrails(1)
    }

    // 縣市篩選處理
    const handleCountyFilter = () => {
      currentPage.value = 1
      loadTrails(1)
    }

    // 跳轉到指定頁面
    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages && page !== currentPage.value) {
        loadTrails(page)
      }
    }

    // 格式化交通指引
    const formatTrafficGuidelines = (guidelines) => {
      if (!guidelines) return ''

      // 將文字分段處理
      let formatted = guidelines
        .replace(/\r\n/g, '\n') // 統一換行符號
        .replace(/\n/g, '<br>') // 將換行轉為 HTML

      // 識別開車和大眾運輸段落
      formatted = formatted
        .replace(/(開車)/g, '<div class="mt-3"><strong class="text-blue-700">🚗 $1</strong>')
        .replace(/(大眾運輸)/g, '<div class="mt-3"><strong class="text-green-700">🚌 $1</strong>')

      // 處理編號列表
      formatted = formatted.replace(/(\d+\.)/g, '<br><span class="ml-4">$1</span>')

      // 關閉 div 標籤
      formatted += '</div>'

      return formatted
    }

    onMounted(() => {
      loadTrails(1)
    })

    return {
      trails,
      loading,
      error,
      searchKeyword,
      selectedCounty,
      pagination,
      counties,
      visiblePages,
      loadTrails,
      handleSearch,
      handleCountyFilter,
      goToPage,
      formatTrafficGuidelines,
    }
  },
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
