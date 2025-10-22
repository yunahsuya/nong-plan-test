<!-- nong-plan-test/src/components/farms/ToiletList.vue -->
<template>
  <div class="toilet-list-container p-6">
    <!-- 標題和搜尋區域 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-green-800 mb-4">🚻 農科園區公共廁所</h2>

      <!-- 搜尋和篩選 -->
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[300px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋廁所地點..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>

        <button
          @click="toggleAccessibleFilter"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all duration-300',
            showAccessibleOnly
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white text-green-500 border-2 border-green-500 hover:bg-green-50',
          ]"
        >
          ♿ 無障礙廁所
        </button>

        <button
          @click="refreshData"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          🔄 重新整理
        </button>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      <p class="mt-2 text-gray-600">載入中...</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 text-lg mb-2">❌ {{ error }}</div>
      <button @click="loadToilets" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        重新載入
      </button>
    </div>

    <!-- 廁所列表 -->
    <div v-else-if="filteredToilets.length > 0" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="toilet in filteredToilets"
          :key="toilet.id"
          class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ toilet.地點 }}</h3>
            <span class="text-sm text-gray-500">#{{ toilet.項次 }}</span>
          </div>

          <div class="space-y-2">
            <div class="flex items-center text-gray-600">
              <span class="font-medium">容納人數：</span>
              <span>{{ toilet.容納人數 }}</span>
            </div>

            <div
              v-if="toilet.accessibleFeatures?.length > 0"
              class="flex items-center text-green-600"
            >
              <span class="mr-1">♿</span>
              <span class="text-sm">{{ toilet.accessibleFeatures.join('、') }}</span>
            </div>

            <div class="flex flex-wrap gap-1 mt-3">
              <span
                v-for="tag in toilet.tags"
                :key="tag"
                class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 無資料狀態 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 text-lg mb-2">🚻</div>
      <p class="text-gray-600">找不到符合條件的廁所資料</p>
    </div>

    <!-- 統計資訊 -->
    <div v-if="!loading && !error" class="mt-8 bg-gray-50 rounded-lg p-4">
      <div class="flex flex-wrap gap-6 text-center">
        <div>
          <div class="text-2xl font-bold text-green-600">{{ totalToilets }}</div>
          <div class="text-sm text-gray-600">總廁所數</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ accessibleToilets }}</div>
          <div class="text-sm text-gray-600">無障礙廁所</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600">{{ filteredToilets.length }}</div>
          <div class="text-sm text-gray-600">顯示中</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getPublicToilets } from '@/services/api.js'

export default {
  name: 'ToiletList',
  setup() {
    const toilets = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const showAccessibleOnly = ref(false)

    // 計算屬性
    const filteredToilets = computed(() => {
      let filtered = [...toilets.value]

      // 搜尋篩選
      if (searchQuery.value) {
        filtered = filtered.filter((toilet) =>
          toilet.地點.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
      }

      // 無障礙篩選
      if (showAccessibleOnly.value) {
        filtered = filtered.filter(
          (toilet) => toilet.accessibleFeatures && toilet.accessibleFeatures.length > 0,
        )
      }

      return filtered
    })

    const totalToilets = computed(() => toilets.value.length)
    const accessibleToilets = computed(
      () =>
        toilets.value.filter(
          (toilet) => toilet.accessibleFeatures && toilet.accessibleFeatures.length > 0,
        ).length,
    )

    // 載入廁所資料
    const loadToilets = async (forceRefresh = false) => {
      loading.value = true
      error.value = null

      try {
        const result = await getPublicToilets(forceRefresh)

        if (result.success) {
          toilets.value = result.data
          console.log(`✅ 成功載入 ${result.data.length} 筆廁所資料`)
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        error.value = err.message
        console.error('❌ 載入廁所資料失敗:', err)
      } finally {
        loading.value = false
      }
    }

    // 搜尋處理
    const handleSearch = () => {
      // 即時搜尋，不需要額外處理
    }

    // 切換無障礙篩選
    const toggleAccessibleFilter = () => {
      showAccessibleOnly.value = !showAccessibleOnly.value
    }

    // 重新整理資料
    const refreshData = () => {
      loadToilets(true)
    }

    // 組件掛載時載入資料
    onMounted(() => {
      loadToilets()
    })

    return {
      toilets,
      loading,
      error,
      searchQuery,
      showAccessibleOnly,
      filteredToilets,
      totalToilets,
      accessibleToilets,
      loadToilets,
      handleSearch,
      toggleAccessibleFilter,
      refreshData,
    }
  },
}
</script>

<style scoped>
.toilet-list-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
