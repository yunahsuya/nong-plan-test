<template>
  <div class="market-list">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">農民市集</h2>
      
      <!-- 搜尋和篩選 -->
      <div class="flex flex-wrap gap-4 mb-4">
        <input 
          v-model="searchKeyword"
          type="text" 
          placeholder="搜尋市集名稱或產品..."
          class="input input-bordered flex-1 min-w-64"
          @input="handleSearch"
        />
        
        <select 
          v-model="selectedCounty"
          class="select select-bordered"
          @change="handleSearch"
        >
          <option value="">所有縣市</option>
          <option 
            v-for="county in counties" 
            :key="county" 
            :value="county"
          >
            {{ county }}
          </option>
        </select>
        
        <select 
          v-model="selectedCertification"
          class="select select-bordered"
          @change="handleSearch"
        >
          <option value="">所有認證標章</option>
          <option value="organic">有機認證</option>
          <option value="TAP">產銷履歷</option>
          <option value="CAS">CAS認證</option>
          <option value="preorganic">有機轉型期</option>
          <option value="NOpesticide">無農藥</option>
        </select>
        
        <button 
          @click="refreshData"
          class="btn btn-outline"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          重新整理
        </button>
      </div>
      
      <!-- 統計資訊 -->
      <div v-if="statistics" class="stats stats-horizontal shadow mb-6">
        <div class="stat">
          <div class="stat-title">總市集數</div>
          <div class="stat-value text-primary">{{ statistics.total }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">有機認證</div>
          <div class="stat-value text-success">{{ statistics.byCertification.organic || 0 }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">產銷履歷</div>
          <div class="stat-value text-info">{{ statistics.byCertification.TAP || 0 }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">CAS認證</div>
          <div class="stat-value text-warning">{{ statistics.byCertification.CAS || 0 }}</div>
        </div>
      </div>
    </div>
    
    <!-- 市集列表 -->
    <div v-if="loading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <div v-else-if="markets.length === 0" class="text-center py-8">
      <p class="text-gray-500">找不到符合條件的市集</p>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="market in markets" 
          :key="market.id"
          class="card bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <h3 class="card-title">{{ market.name }}</h3>
            
            <!-- 縣市資訊 -->
            <div v-if="market.product" class="mb-2">
              <span class="font-semibold">產品：</span>
              <span class="text-sm">{{ market.product }}</span>
            </div>
            
            <div v-if="market.verify_marker" class="mb-3">
              <span class="font-semibold">認證標章：</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span 
                  v-for="cert in market.certificationTags" 
                  :key="cert"
                  class="badge badge-outline badge-sm"
                >
                  {{ cert }}
                </span>
              </div>
            </div>
            
            <div v-if="market.rules" class="text-sm text-gray-600">
              <span class="font-semibold">規則：</span>
              <p class="mt-1">{{ market.rules }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分頁控制 -->
      <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center">
        <div class="join">
          <!-- 第一頁按鈕 -->
          <button 
            @click="goToPage(1)"
            class="join-item btn"
            :disabled="pagination.currentPage === 1"
          >
            第一頁
          </button>
          
          <!-- 上一頁按鈕 -->
          <button 
            @click="goToPage(pagination.currentPage - 1)"
            class="join-item btn"
            :disabled="!pagination.hasPreviousPage"
          >
            «
          </button>
          
          <!-- 頁碼按鈕 -->
          <template v-for="page in visiblePages" :key="page">
            <button 
              @click="goToPage(page)"
              class="join-item btn"
              :class="{ 'btn-active': page === pagination.currentPage }"
            >
              {{ page }}
            </button>
          </template>
          
          <!-- 下一頁按鈕 -->
          <button 
            @click="goToPage(pagination.currentPage + 1)"
            class="join-item btn"
            :disabled="!pagination.hasNextPage"
          >
            »
          </button>
          
          <!-- 最後一頁按鈕 -->
          <button 
            @click="goToPage(pagination.totalPages)"
            class="join-item btn"
            :disabled="pagination.currentPage === pagination.totalPages"
          >
            最後一頁
          </button>
        </div>
      </div>
      
      <!-- 分頁資訊 -->
      <div v-if="pagination" class="text-center mt-4 text-sm text-gray-600">
        第 {{ pagination.currentPage }} 頁，共 {{ pagination.totalPages }} 頁
        （總共 {{ pagination.totalItems }} 筆資料）
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPaginatedMarkets, getMarketStatistics } from '@/services/api.js'

// 固定的縣市列表
const counties = ref([
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', 
  '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣',
  '基隆市', '新竹市', '嘉義市'
])

const markets = ref([])
const statistics = ref(null)
const pagination = ref(null)
const loading = ref(false)
const searchKeyword = ref('')
const selectedCounty = ref('')
const selectedCertification = ref('')

// 計算可見的頁碼
const visiblePages = computed(() => {
  if (!pagination.value) return []
  
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  const pages = []
  
  // 顯示當前頁前後各2頁
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const loadMarkets = async (page = 1, forceRefresh = false) => {
  loading.value = true
  try {
    const params = {
      page,
      limit: 9,
      keyword: searchKeyword.value || undefined,
      county: selectedCounty.value || undefined,
      certification: selectedCertification.value || undefined
    }
    
    if (forceRefresh) {
      params.refresh = true
    }
    
    const result = await getPaginatedMarkets(params)
    if (result.success) {
      markets.value = result.data
      pagination.value = result.pagination
      
      // 處理認證標章標籤
      markets.value.forEach(market => {
        if (market.verify_marker) {
          market.certificationTags = market.verify_marker.split(',').map(tag => tag.trim())
        }
      })
    }
  } catch (error) {
    console.error('載入市集失敗:', error)
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const result = await getMarketStatistics()
    if (result.success) {
      statistics.value = result.data
    }
  } catch (error) {
    console.error('載入統計資料失敗:', error)
  }
}

const handleSearch = async () => {
  await loadMarkets(1) // 搜尋時回到第一頁
}

const refreshData = () => {
  loadMarkets(pagination.value?.currentPage || 1, true)
  loadStatistics()
}

const goToPage = async (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  await loadMarkets(page)
}

onMounted(() => {
  loadMarkets()
  loadStatistics()
  // 移除 loadCounties() 呼叫，因為現在使用固定的縣市列表
})
</script>