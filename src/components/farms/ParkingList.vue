<template>
  <div class="w-full bg-blue-600">
    <!-- 篩選器 -->
    <div ref="filterSection" class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <div class="flex gap-8 items-end flex-wrap">
          <div class="flex-1 min-w-[200px]">
            <label for="locationSearch" class="block font-semibold text-gray-700 mb-2"
              >地點搜尋</label
            >
            <input
              id="locationSearch"
              v-model="searchLocation"
              @input="filterData"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="輸入地點關鍵字..."
              :disabled="loading"
            />
          </div>

          <div class="flex-1 min-w-[200px]">
            <label for="minCapacity" class="block font-semibold text-gray-700 mb-2"
              >最小停車格數</label
            >
            <input
              id="minCapacity"
              v-model="minCapacity"
              @input="filterData"
              type="number"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="停車格數"
              :disabled="loading"
            />
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block font-semibold text-gray-700 mb-2">無障礙設施</label>
            <select
              v-model="accessibleOnly"
              @change="filterData"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              :disabled="loading"
            >
              <option value="">全部停車場</option>
              <option value="true">僅無障礙停車場</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <div class="flex gap-2">
              <button
                @click="resetFilter"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
                :disabled="loading"
              >
                🔄 重置篩選
              </button>
              <button
                @click="refreshData"
                class="px-4 py-2 border border-blue-500 text-blue-500 rounded-md text-sm bg-white hover:bg-blue-50 transition-colors"
                :disabled="loading"
                title="重新載入最新資料"
              >
                🔄 刷新
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="bg-white py-12 px-8 text-center border-b border-gray-200">
      <div
        class="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
      >
        <span class="sr-only">載入中...</span>
      </div>
      <p class="mt-3 text-gray-600">正在載入停車場資料...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div
      v-if="error"
      class="bg-red-100 text-red-800 py-12 px-8 text-center border-b border-gray-200"
    >
      <h4>❌ 載入失敗</h4>
      <p>{{ error }}</p>
      <button
        @click="loadData"
        class="mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm bg-white hover:bg-red-50 transition-colors"
      >
        🔄 重新載入
      </button>
    </div>

    <!-- 資料列表 -->
    <div v-if="filteredData.length > 0 && !loading" class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            v-for="item in paginatedData"
            :key="item.id"
            class="border border-gray-200 rounded-xl bg-white transition-all duration-300 overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-green-500"
          >
            <div class="p-6">
              <h5 class="text-green-800 font-semibold mb-4">🅿️ {{ item.location }}</h5>
              <p class="text-gray-600 leading-relaxed mb-4">
                <strong>地點：</strong>{{ item.location }}<br />
                <strong>總停車格：</strong>{{ item.totalSpaces }} 格<br />
              </p>

              <!-- 停車格詳細資訊 -->
              <div class="mb-4 min-h-[60px]">
                <small class="text-green-600 font-semibold">🚗 停車格分布：</small><br />
                <div class="grid grid-cols-2 gap-2 mt-2">
                  <div class="bg-blue-50 p-2 rounded text-xs">
                    <span class="font-semibold text-blue-800">小客車</span><br />
                    <span class="text-blue-600">{{ item.parkingSpaces.car }} 格</span>
                  </div>
                  <div class="bg-green-50 p-2 rounded text-xs">
                    <span class="font-semibold text-green-800">身心障礙</span><br />
                    <span class="text-green-600">{{ item.parkingSpaces.disabled }} 格</span>
                  </div>
                  <div class="bg-yellow-50 p-2 rounded text-xs">
                    <span class="font-semibold text-yellow-800">摩托車</span><br />
                    <span class="text-yellow-600">{{ item.parkingSpaces.motorcycle }} 格</span>
                  </div>
                  <div class="bg-purple-50 p-2 rounded text-xs">
                    <span class="font-semibold text-purple-800">遊覽車</span><br />
                    <span class="text-purple-600">{{ item.parkingSpaces.bus }} 格</span>
                  </div>
                </div>
              </div>

              <!-- 無障礙設施標籤 -->
              <div class="mb-4 min-h-[40px]">
                <div v-if="item.accessibleFeatures && item.accessibleFeatures.length > 0">
                  <small class="text-green-600 font-semibold">♿ 無障礙設施：</small><br />
                  <span
                    v-for="(feature, index) in item.accessibleFeatures"
                    :key="index"
                    class="inline-block px-2 py-1 rounded text-xs m-0.5 bg-green-100 text-green-800"
                  >
                    {{ feature }}
                  </span>
                </div>
                <div v-else class="text-gray-400 text-sm">
                  <small>♿ 無障礙設施：</small><br />
                  <span class="text-gray-400">暫無資料</span>
                </div>
              </div>

              <!-- 行動按鈕 -->
              <div class="flex gap-2 flex-wrap">
                <button
                  @click="viewOnMap(item)"
                  class="px-3 py-1.5 font-bold bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  🗺️ 地圖
                </button>
                <button
                  @click="addToFavorites(item)"
                  class="px-3 py-1.5 font-semibold border border-yellow-500 text-yellow-500 rounded text-sm bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  ⭐ 收藏
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分頁控制 -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2 flex-wrap">
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏮️ 第一頁
          </button>

          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 上一頁
          </button>

          <div class="flex gap-1 flex-wrap">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 border rounded-md text-sm transition-colors',
                currentPage === page
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一頁 →
          </button>

          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            最後一頁 ⏭️
          </button>
        </div>
      </div>
    </div>

    <!-- 無資料 -->
    <div
      v-if="!loading && !error && filteredData.length === 0"
      class="bg-blue-100 text-blue-800 py-12 px-8 text-center border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto">
        <h4>ℹ️ 沒有找到資料</h4>
        <p>找不到符合條件的停車場，請嘗試其他篩選條件。</p>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div
      v-if="filteredData.length > 0"
      class="bg-green-100 text-green-800 border-b border-gray-200"
    >
      <div class="p-8 max-w-7xl mx-auto">
        <h5>📊 統計資訊</h5>
        <p>
          共找到 <strong>{{ filteredData.length }}</strong> 筆停車場資料（目前顯示第
          <strong>{{ currentPage }}</strong> 頁，共 <strong>{{ totalPages }}</strong> 頁）
        </p>
        <div v-if="searchLocation || minCapacity || accessibleOnly" class="text-sm mt-2">
          <span class="font-semibold">篩選條件：</span>
          <span v-if="searchLocation" class="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2"
            >地點: {{ searchLocation }}</span
          >
          <span v-if="minCapacity" class="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2"
            >最小格數: {{ minCapacity }}</span
          >
          <span v-if="accessibleOnly" class="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2"
            >僅無障礙</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getParkingLots, searchParkingLots } from '@/services/api.js'

export default {
  name: 'ParkingList',
  setup() {
    const data = ref([])
    const loading = ref(false)
    const error = ref('')

    // 篩選條件
    const searchLocation = ref('')
    const minCapacity = ref('')
    const accessibleOnly = ref('')

    // 分頁
    const currentPage = ref(1)
    const itemsPerPage = 12

    // 計算屬性
    const filteredData = computed(() => {
      let filtered = data.value

      // 地點搜尋
      if (searchLocation.value) {
        const location = searchLocation.value.toLowerCase()
        filtered = filtered.filter((item) => item.location.toLowerCase().includes(location))
      }

      // 最小容量篩選
      if (minCapacity.value) {
        const min = parseInt(minCapacity.value)
        filtered = filtered.filter((item) => item.totalSpaces >= min)
      }

      // 無障礙設施篩選
      if (accessibleOnly.value === 'true') {
        filtered = filtered.filter(
          (item) => item.accessibleFeatures && item.accessibleFeatures.length > 0,
        )
      }

      return filtered
    })

    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredData.value.slice(start, end)
    })

    // 方法
    const loadData = async (forceRefresh = false) => {
      loading.value = true
      error.value = ''

      try {
        const response = await getParkingLots(forceRefresh)
        if (response.success) {
          data.value = response.data
          currentPage.value = 1
        } else {
          error.value = response.message || '載入資料失敗'
        }
      } catch (err) {
        error.value = '網路連線錯誤'
        console.error('載入停車場資料錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    const filterData = () => {
      currentPage.value = 1
    }

    const resetFilter = () => {
      searchLocation.value = ''
      minCapacity.value = ''
      accessibleOnly.value = ''
      currentPage.value = 1
    }

    const refreshData = () => {
      loadData(true)
    }

    // 分頁方法
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // 其他功能
    const viewOnMap = (item) => {
      // TODO: 實現地圖功能
      console.log('查看地圖:', item)
      alert(`查看 ${item.location} 的地圖位置`)
    }

    const addToFavorites = (item) => {
      // TODO: 實現收藏功能
      console.log('添加到收藏:', item)
      alert(`已將 ${item.location} 添加到收藏`)
    }

    // 組件掛載時載入資料
    onMounted(() => {
      loadData()
    })

    return {
      data,
      loading,
      error,
      searchLocation,
      minCapacity,
      accessibleOnly,
      filteredData,
      paginatedData,
      currentPage,
      totalPages,
      loadData,
      filterData,
      resetFilter,
      refreshData,
      goToPage,
      previousPage,
      nextPage,
      viewOnMap,
      addToFavorites,
    }
  },
}
</script>

<style scoped>
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:transform:hover {
  transform: translateY(-0.25rem);
}

.hover\:shadow-xl:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
