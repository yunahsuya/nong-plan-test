<route lang="yaml">
  meta:
    title: '農業教育'
  </route>
  
  <template>
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <!-- 頁面標題 -->
      <div class="bg-white px-8 py-12 text-center border-b border-gray-200 shadow-sm">
        <h1 class="text-green-800 font-bold text-5xl mb-4">�� 農業教育資源</h1>
        <p class="text-gray-600 text-xl mb-2">探索豐富的農業知識與學習資源</p>
        <p class="text-gray-500 text-base max-w-4xl mx-auto">
          提供農民學院、水產知識、品種介紹、廢棄物再利用等多元化教育內容
        </p>
      </div>
  
      <!-- 主要內容區域 -->
      <div class="max-w-7xl mx-auto px-8 py-12">
        <!-- 教育資源分類導航 -->
        <div class="mb-12">
          <h2 class="text-center text-green-800 font-semibold text-3xl mb-8">📚 教育資源分類</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div 
              v-for="category in educationCategories" 
              :key="category.id"
              :class="[
                'bg-white rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg',
                selectedCategory === category.id 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-200 hover:border-green-300'
              ]"
              @click="selectCategory(category.id)"
            >
              <div class="text-center">
                <div class="text-4xl mb-3">{{ category.icon }}</div>
                <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ category.name }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ category.description }}</p>
                <div class="text-xs text-gray-500">
                  資料筆數: {{ getCategoryCount(category.id) }}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 篩選器 -->
        <div v-if="selectedCategory" class="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
          <h3 class="text-green-800 font-semibold text-xl mb-4">�� 篩選條件</h3>
          <div class="flex gap-6 items-end flex-wrap">
            <div class="flex-1 min-w-[200px]">
              <label class="block font-semibold text-gray-700 mb-2">縣市</label>
              <select 
                v-model="selectedCounty" 
                @change="filterData" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :disabled="loading"
              >
                <option value="">全部縣市</option>
                <option v-for="county in availableCounties" :key="county" :value="county">
                  {{ county }}
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
              >
            </div>
            <div class="flex gap-2">
              <button 
                @click="resetFilter" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
                :disabled="loading"
              >
                🔄 重置
              </button>
              <button 
                @click="refreshData" 
                class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                :disabled="loading"
              >
                🔄 刷新資料
              </button>
            </div>
          </div>
        </div>
  
        <!-- 載入狀態 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p class="mt-4 text-gray-600">正在載入教育資源...</p>
        </div>
  
        <!-- 錯誤狀態 -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div class="text-red-600 text-4xl mb-4">❌</div>
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
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-green-800 font-semibold text-xl">
                {{ getCategoryInfo(selectedCategory).name }} - 搜尋結果
              </h3>
              <div class="text-sm text-gray-600">
                共找到 {{ filteredData.length }} 筆資料
              </div>
            </div>
          </div>
  
          <!-- 資料卡片網格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(item, index) in paginatedData" 
              :key="item.id || index"
              class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <!-- 卡片標題 -->
              <div class="flex items-start justify-between mb-4">
                <h4 class="font-semibold text-lg text-gray-800 line-clamp-2">
                  {{ item.name || item.title || '未命名' }}
                </h4>
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {{ getCategoryInfo(selectedCategory).name }}
                </span>
              </div>
  
              <!-- 卡片內容 -->
              <div class="space-y-3">
                <!-- 地址 -->
                <div v-if="item.address" class="flex items-start">
                  <span class="text-gray-400 mr-2">📍</span>
                  <span class="text-sm text-gray-600">{{ item.address }}</span>
                </div>
  
                <!-- 電話 -->
                <div v-if="item.tel || item.phone" class="flex items-center">
                  <span class="text-gray-400 mr-2">📞</span>
                  <span class="text-sm text-gray-600">{{ item.tel || item.phone }}</span>
                </div>
  
                <!-- 縣市 -->
                <div v-if="item.county" class="flex items-center">
                  <span class="text-gray-400 mr-2">🏛️</span>
                  <span class="text-sm text-gray-600">{{ item.county }}</span>
                </div>
  
                <!-- 網站 -->
                <div v-if="item.website || item.url" class="flex items-center">
                  <span class="text-gray-400 mr-2">🌐</span>
                  <a 
                    :href="item.website || item.url" 
                    target="_blank" 
                    class="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    查看網站
                  </a>
                </div>
  
                <!-- 營業時間 -->
                <div v-if="item.hours" class="flex items-center">
                  <span class="text-gray-400 mr-2">🕒</span>
                  <span class="text-sm text-gray-600">{{ item.hours }}</span>
                </div>
  
                <!-- 描述 -->
                <div v-if="item.description" class="text-sm text-gray-600 line-clamp-3">
                  {{ item.description }}
                </div>
  
                <!-- 特殊欄位 (根據不同 API 顯示不同內容) -->
                <div v-if="selectedCategory === 'aquaculture'" class="space-y-2">
                  <div v-if="item.gameType" class="flex items-center">
                    <span class="text-gray-400 mr-2">🎮</span>
                    <span class="text-sm text-gray-600">遊戲類型: {{ item.gameType }}</span>
                  </div>
                </div>
  
                <div v-if="selectedCategory === 'varieties'" class="space-y-2">
                  <div v-if="item.cropType" class="flex items-center">
                    <span class="text-gray-400 mr-2">🌾</span>
                    <span class="text-sm text-gray-600">作物類型: {{ item.cropType }}</span>
                  </div>
                  <div v-if="item.varietyName" class="flex items-center">
                    <span class="text-gray-400 mr-2">🌱</span>
                    <span class="text-sm text-gray-600">品種: {{ item.varietyName }}</span>
                  </div>
                </div>
  
                <div v-if="selectedCategory === 'waste'" class="space-y-2">
                  <div v-if="item.organizationType" class="flex items-center">
                    <span class="text-gray-400 mr-2">🏢</span>
                    <span class="text-sm text-gray-600">機構類型: {{ item.organizationType }}</span>
                  </div>
                  <div v-if="item.wasteType" class="flex items-center">
                    <span class="text-gray-400 mr-2">♻️</span>
                    <span class="text-sm text-gray-600">廢棄物類型: {{ item.wasteType }}</span>
                  </div>
                </div>
              </div>
  
              <!-- 操作按鈕 -->
              <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button 
                  v-if="item.website || item.url"
                  @click="openWebsite(item.website || item.url)"
                  class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  🌐 查看網站
                </button>
                <button 
                  v-if="item.coordinates"
                  @click="showOnMap(item)"
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🗺️ 查看地圖
                </button>
              </div>
            </div>
          </div>
  
          <!-- 分頁 -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8">
            <div class="flex gap-2">
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 rounded-lg text-sm transition-colors',
                  currentPage === page 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                ]"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- 無資料狀態 -->
        <div v-else-if="selectedCategory && !loading" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">��</div>
          <h3 class="text-gray-600 font-semibold text-xl mb-2">暫無相關資料</h3>
          <p class="text-gray-500">請嘗試調整篩選條件或選擇其他分類</p>
        </div>
  
        <!-- 未選擇分類狀態 -->
        <div v-else class="text-center py-12">
          <div class="text-green-400 text-6xl mb-4">��</div>
          <h3 class="text-gray-600 font-semibold text-xl mb-2">選擇教育資源分類</h3>
          <p class="text-gray-500">請點擊上方分類卡片開始探索農業教育資源</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { getEducationCategories, getEducationData } from '../services/api.js'
  
  // 響應式資料
  const selectedCategory = ref('')
  const selectedCounty = ref('')
  const searchKeyword = ref('')
  const loading = ref(false)
  const error = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 12
  
  // 各分類的資料
  const marketData = ref([])
  const productData = ref([])
  const aquacultureData = ref([])
  const varietiesData = ref([])
  const wasteData = ref([])
  
  // 教育資源分類定義
  const educationCategories = ref([
    {
      id: 'market',
      name: '農民學院找通路',
      icon: '🏪',
      description: '農民市集與通路資訊',
      apiUrl: 'https://data.moa.gov.tw/Service/OpenData/MarketUnitData.aspx?IsTransData=1&UnitId=178'
    },
    {
      id: 'product',
      name: '農民學院找產品',
      icon: '🌾',
      description: '農民產品與農產資訊',
      apiUrl: 'https://data.moa.gov.tw/Service/OpenData/MemberProductData.aspx?IsTransData=1&UnitId=173'
    },
    {
      id: 'aquaculture',
      name: '水產知識淺說',
      icon: '🐟',
      description: '水產知識小遊戲',
      apiUrl: 'https://data.moa.gov.tw/Service/OpenData/Tfrin.aspx?key=1200&IsTransData=1&UnitId=373'
    },
    {
      id: 'varieties',
      name: '農業試驗所品種介紹',
      icon: '🌱',
      description: '農作品種介紹與資訊',
      apiUrl: 'https://data.moa.gov.tw/Service/OpenData/Tarivariety.aspx?IsTransData=1&UnitId=356'
    },
    {
      id: 'waste',
      name: '農業廢棄物再利用',
      icon: '♻️',
      description: '廢棄物再利用機構',
      apiUrl: 'https://data.moenv.gov.tw/api/v2/wr_p_56?api_key=540e2ca4-41e1-4186-8497-fdd67024ac44&limit=1000&sort=ImportDate%20desc&format=JSON'
    }
  ])

  // 教育資源分類定義
  // const educationCategories = ref([])
  
  // 計算屬性
  const availableCounties = computed(() => {
    const counties = new Set()
    const currentData = getCurrentData()
    currentData.forEach(item => {
      if (item.county) counties.add(item.county)
    })
    return Array.from(counties).sort()
  })
  
  const filteredData = computed(() => {
    let data = getCurrentData()
    
    // 縣市篩選
    if (selectedCounty.value) {
      data = data.filter(item => 
        item.county && item.county.includes(selectedCounty.value)
      )
    }
    
    // 關鍵字篩選
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      data = data.filter(item => 
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.title && item.title.toLowerCase().includes(keyword)) ||
        (item.address && item.address.toLowerCase().includes(keyword)) ||
        (item.description && item.description.toLowerCase().includes(keyword))
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
      case 'market': return marketData.value
      case 'product': return productData.value
      case 'aquaculture': return aquacultureData.value
      case 'varieties': return varietiesData.value
      case 'waste': return wasteData.value
      default: return []
    }
  }
  
  const getCategoryCount = (categoryId) => {
    switch (categoryId) {
      case 'market': return marketData.value.length
      case 'product': return productData.value.length
      case 'aquaculture': return aquacultureData.value.length
      case 'varieties': return varietiesData.value.length
      case 'waste': return wasteData.value.length
      default: return 0
    }
  }
  
  const getCategoryInfo = (categoryId) => {
    return educationCategories.value.find(cat => cat.id === categoryId) || {}
  }
  
  const selectCategory = async (categoryId) => {
    selectedCategory.value = categoryId
    currentPage.value = 1
    selectedCounty.value = ''
    searchKeyword.value = ''
    
    // 如果該分類還沒有資料，則載入
    if (getCategoryCount(categoryId) === 0) {
      await loadCategoryData(categoryId)
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
      case 'market':
        marketData.value = result.data
        break
      case 'product':
        productData.value = result.data
        break
      case 'aquaculture':
        aquacultureData.value = result.data
        break
      case 'varieties':
        varietiesData.value = result.data
        break
      case 'waste':
        wasteData.value = result.data
        break
    }
    
  } catch (err) {
    error.value = `載入 ${getCategoryInfo(categoryId).name} 資料失敗: ${err.message}`
    console.error('載入資料失敗:', err)
  } finally {
    loading.value = false
  }
}
  
  const filterData = () => {
    currentPage.value = 1
  }
  
  const resetFilter = () => {
    selectedCounty.value = ''
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
  
  const openWebsite = (url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }
  
  const showOnMap = (item) => {
    if (item.coordinates) {
      const { latitude, longitude } = item.coordinates
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
      window.open(mapUrl, '_blank')
    }
  }
  
  // 監聽分頁變化
  watch(currentPage, () => {
    // 可以添加滾動到頂部的邏輯
  })

// 載入教育資源分類
const loadEducationCategories = async () => {
  try {
    const result = await getEducationCategories()
    if (result.success) {
      educationCategories.value = result.data
    }
  } catch (error) {
    console.error('載入教育資源分類失敗:', error)
  }
}

// 組件掛載時載入預設資料
onMounted(() => {
  loadEducationCategories()
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