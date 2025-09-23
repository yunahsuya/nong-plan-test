<template>
  <div class="w-full bg-blue-600">
    <!-- 分類選擇器 -->
    <div class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <h5 class="text-center mb-8 text-green-800 font-semibold text-2xl">選擇您要探索的項目</h5>
        

<!-- 水平排列的按鈕 -->
<div class="flex flex-wrap gap-2 justify-center">
  <button
    v-for="category in categories"
    :key="category.id"
    @click="selectCategory(category.id)"
    :class="[
      'flex flex-col items-center justify-center px-3 py-2 border-2 rounded-lg transition-all duration-300 min-w-[80px] min-h-[60px] cursor-pointer text-base',
      selectedCategory === category.id 
        ? 'border-[#28A745] bg-[#28A745] text-white -translate-y-0.5 shadow-lg shadow-[#28A745]/30' 
        : 'border-gray-300 bg-white text-gray-800 hover:border-[#28A745] hover:bg-[#28A745]/10 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#28A745]/15'
    ]"
    :disabled="loading"
  >
    <i :class="category.icon" class="text-lg mb-1"></i>
    <span class="font-semibold text-sm text-center">{{ category.name }}</span>
  </button>
</div>

      </div>
    </div>

    <!-- 篩選器 -->
    <div v-if="selectedCategory" class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <!-- <h5 class="text-center mb-8 text-green-800 font-semibold text-2xl">�� 篩選條件</h5> -->
        <div class="flex gap-8 items-end flex-wrap">
          <div class="flex-1 min-w-[200px]">
            <label for="countySelect" class="block font-semibold text-gray-700 mb-2">縣市</label>
            <select 
              id="countySelect"
              v-model="selectedCounty" 
              @change="filterData" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              :disabled="loading"
            >
              <option value="">全部縣市</option>
              <option value="台北市">台北市</option>
              <option value="新北市">新北市</option>
              <option value="桃園市">桃園市</option>
              <option value="台中市">台中市</option>
              <option value="台南市">台南市</option>
              <option value="高雄市">高雄市</option>
              <option value="基隆市">基隆市</option>
              <option value="新竹市">新竹市</option>
              <option value="嘉義市">嘉義市</option>
              <option value="新竹縣">新竹縣</option>
              <option value="苗栗縣">苗栗縣</option>
              <option value="彰化縣">彰化縣</option>
              <option value="南投縣">南投縣</option>
              <option value="雲林縣">雲林縣</option>
              <option value="嘉義縣">嘉義縣</option>
              <option value="屏東縣">屏東縣</option>
              <option value="宜蘭縣">宜蘭縣</option>
              <option value="花蓮縣">花蓮縣</option>
              <option value="台東縣">台東縣</option>
              <option value="澎湖縣">澎湖縣</option>
              <option value="金門縣">金門縣</option>
              <option value="連江縣">連江縣</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label for="keywordInput" class="block font-semibold text-gray-700 mb-2">關鍵字搜尋</label>
            <input 
              id="keywordInput"
              v-model="searchKeyword" 
              @input="filterData"
              type="text" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="輸入景點名稱或關鍵字..."
              :disabled="loading"
            >
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
      <div class="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" role="status">
        <span class="sr-only">載入中...</span>
      </div>
      <p class="mt-3 text-gray-600">正在載入{{ getCurrentCategoryName() }}資料...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="bg-red-100 text-red-800 py-12 px-8 text-center border-b border-gray-200">
      <h4>❌ 載入失敗</h4>
      <p>{{ error }}</p>
      <button @click="loadData" class="mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm bg-white hover:bg-red-50 transition-colors">
        🔄 重新載入
      </button>
    </div>

    <!-- 資料列表 -->
    <div v-if="filteredData.length > 0 && !loading" class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            v-for="item in filteredData" 
            :key="item.id" 
            class="border border-gray-200 rounded-xl bg-white transition-all duration-300 overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-green-500"
          >
            <div class="p-6">
              <h5 class="text-green-800 font-semibold mb-4">{{ item.name }}</h5>
                            <p class="text-gray-600 leading-relaxed mb-4">
                <strong>地址：</strong>{{ getAddress(item) }}<br>
                <span v-if="item.tel"><strong>電話：</strong>{{ item.tel }}<br></span>
                <span v-if="item.website"><strong>網站：</strong><a :href="item.website" target="_blank" class="text-blue-600 hover:underline break-all">{{ item.website.length > 40 ? item.website.substring(0, 30) + '...' : item.website }}</a><br></span>
                <span v-if="item.township"><strong>鄉鎮：</strong>{{ item.township }}<br></span>
              </p>
              
                <!-- 無障礙設施標籤 -->
                <div class="mb-4 min-h-[60px]">
                <div v-if="item.accessibleItems && item.accessibleItems.length > 0">
                  <small class="text-green-600 font-semibold">♿ 無障礙設施：</small><br>
                  <span 
                    v-for="feature in item.accessibleItems" 
                    :key="feature"
                    class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs m-0.5"
                  >
                    {{ feature }}
                  </span>
                </div>
                <div v-else class="text-gray-400 text-sm">
                  <small>♿ 無障礙設施：</small><br>
                  <span class="text-gray-400">暫無資料</span>
                </div>
              </div>

              <!-- 行動按鈕 -->
              <div class="flex gap-2 flex-wrap">
                <button 
                  @click="viewOnMap(item)" 
                  class="px-3 py-1.5 font-bold bg-blue-600 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  🗺️ 地圖
                </button>
                <button 
                  v-if="item.website" 
                  @click="openWebsite(item.website)" 
                  class="px-3 py-1.5 font-semibold border border-blue-500 text-blue-500 rounded text-sm bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  🌐 網站
                </button>
                <button 
                  @click="addToFavorites(item)" 
                  class="px-3 py-1.5 font-semibold border border-yellow-500 text-yellow-500 bg-gray-600  rounded text-sm bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  ⭐ 收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 無資料 -->
    <div v-if="!loading && !error && filteredData.length === 0 && selectedCategory" class="bg-blue-100 text-blue-800 py-12 px-8 text-center border-b border-gray-200">
      <div class="max-w-7xl mx-auto">
        <h4>ℹ️ 沒有找到資料</h4>
        <p>找不到符合條件的{{ getCurrentCategoryName() }}，請嘗試其他篩選條件。</p>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div v-if="filteredData.length > 0" class="bg-green-100 text-green-800 border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <h5>�� 統計資訊</h5>
        <p>共找到 <strong>{{ filteredData.length }}</strong> 筆{{ getCurrentCategoryName() }}資料</p>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div v-if="favorites.length > 0" class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <h5 class="text-center mb-8 text-green-800 font-semibold text-2xl">⭐ 我的收藏</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="fav in favorites" 
            :key="fav.id" 
            class="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <strong>{{ fav.name }}</strong><br>
                <small>{{ fav.category }} - {{ fav.address }}</small>
              </div>
              <button 
                @click="removeFromFavorites(fav.id)" 
                class="px-3 py-1.5 border border-red-500 text-red-500 rounded text-sm bg-white hover:bg-red-50 transition-colors"
              >
                ❌ 移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

   <!-- 小遊戲區域 -->
   <div class="bg-white">
      <div class="p-8 max-w-7xl mx-auto">
        <h5 class="text-center mb-8 text-green-800 font-semibold text-2xl">�� 農遊小遊戲</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button @click="startQuiz" class="p-4 border-2 border-gray-300 rounded-lg bg-white transition-all duration-300 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:transform hover:-translate-y-0.5">
            🧠 農場知識問答
          </button>
          <button @click="startMemory" class="p-4 border-2 border-gray-300 rounded-lg bg-white transition-all duration-300 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:transform hover:-translate-y-0.5">
            🧩 記憶配對遊戲
          </button>
          <button @click="startPuzzle" class="p-4 border-2 border-gray-300 rounded-lg bg-white transition-all duration-300 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:transform hover:-translate-y-0.5">
            🧩 拼圖遊戲
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { getAccessibleFarms, getFarmsByCounty } from '@/services/api.js'

export default {
  name: 'ComprehensiveTourism',
  props: {
    selectedOtherCategory: {
      type: String,
      default: 'trails'
    }
  },
  setup(props) {
    const selectedCategory = ref('farms') // 預設選擇農場
    const selectedCounty = ref('')
    const searchKeyword = ref('')
    const loading = ref(false)
    const error = ref('')
    const rawData = ref([])
    const favorites = ref([])

    // 分類定義
    const categories = ref([
      {
        id: 'farms',
        name: '農場',
        icon: '��',
        description: '無障礙休閒農場',
        apiEndpoint: '/api/accessible-farms'
      },
      {
        id: 'trails',
        name: '步道',
        icon: '��',
        description: '無障礙步道',
        apiEndpoint: '/api/trails'
      },
      {
        id: 'old-streets',
        name: '老街',
        icon: '🏮',
        description: '歷史老街',
        apiEndpoint: '/api/old-streets'
      },
      {
        id: 'markets',
        name: '活動（市集）',
        icon: '🏪',
        description: '農民市集活動',
        apiEndpoint: '/api/farmer-markets'
      },
      {
        id: 'food',
        name: '美食',
        icon: '��️',
        description: '在地美食',
        apiEndpoint: '/api/rural-food'
      },
      {
        id: 'souvenirs',
        name: '伴手禮',
        icon: '��',
        description: '特色伴手禮',
        apiEndpoint: '/api/souvenirs'
      },
      {
        id: 'parking',
        name: '停車場',
        icon: '🅿️',
        description: '無障礙停車',
        apiEndpoint: '/api/parking-lots'
      },
      {
        id: 'toilets',
        name: '廁所',
        icon: '🚻',
        description: '無障礙廁所',
        apiEndpoint: '/api/public-toilets'
      }
    ])

    // 計算屬性：篩選後的資料
    const filteredData = computed(() => {
      let filtered = rawData.value

      // 縣市篩選
      if (selectedCounty.value) {
        filtered = filtered.filter(item => {
          const countyName = item.countyName || item.county || ''
          const address = getAddress(item) || ''
          return countyName.includes(selectedCounty.value) || 
                 address.includes(selectedCounty.value)
        })
      }

      // 關鍵字搜尋
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(keyword) ||
          getAddress(item)?.toLowerCase().includes(keyword) ||
          item.accessibleItems?.some(item => item.toLowerCase().includes(keyword))
        )
      }

      return filtered
    })

    // 取得地址
    const getAddress = (item) => {
      if (item.address) {
        if (typeof item.address === 'string') {
          return item.address
        } else if (item.address.chinese) {
          return item.address.chinese
        }
      }
      return ''
    }

    // 選擇分類
    const selectCategory = async (categoryId) => {
      selectedCategory.value = categoryId
      selectedCounty.value = ''
      searchKeyword.value = ''
      await loadData()
    }

    // 載入資料
    const loadData = async (forceRefresh = false) => {
      if (!selectedCategory.value) return

      loading.value = true
      error.value = ''

      try {
        console.log(`正在載入${getCurrentCategoryName()}資料...`)
        
        if (selectedCategory.value === 'farms') {
          // 載入無障礙農場資料
          const result = await getAccessibleFarms()
          if (result.success) {
            rawData.value = result.data
            console.log(`✅ 載入無障礙農場資料成功:`, rawData.value.length, '筆')
          } else {
            throw new Error(result.message)
          }
        } else {
          // 其他分類暫時顯示空資料
          rawData.value = []
          console.log(`⚠️ ${getCurrentCategoryName()}功能開發中...`)
        }
      } catch (err) {
        error.value = '載入資料失敗，請稍後再試'
        console.error('❌ 載入資料錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    // 刷新資料
    const refreshData = () => {
      loadData(true)
    }

    // 篩選資料
    const filterData = () => {
      // 篩選邏輯已在 computed 中處理
    }

    // 重置篩選
    const resetFilter = () => {
      selectedCounty.value = ''
      searchKeyword.value = ''
    }

    // 獲取當前分類名稱
    const getCurrentCategoryName = () => {
      const category = categories.value.find(cat => cat.id === selectedCategory.value)
      return category ? category.name : ''
    }

          // 在地圖上查看
    const viewOnMap = (item) => {
      if (item.name) {
        // 使用農場名稱開啟 Google Maps
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`
        window.open(url, '_blank')
      } else {
        alert(`無法取得 ${item.name} 的名稱資訊`)
      }
    }

    // 開啟網站
    const openWebsite = (url) => {
      window.open(url, '_blank')
    }

    // 加入收藏
    const addToFavorites = (item) => {
      const existingIndex = favorites.value.findIndex(fav => fav.id === item.id)
      if (existingIndex === -1) {
        favorites.value.push({
          id: item.id,
          name: item.name,
          category: getCurrentCategoryName(),
          address: getAddress(item)
        })
        alert(`已將 ${item.name} 加入收藏`)
      } else {
        alert('此項目已在收藏列表中')
      }
    }

    // 移除收藏
    const removeFromFavorites = (id) => {
      const index = favorites.value.findIndex(fav => fav.id === id)
      if (index > -1) {
        favorites.value.splice(index, 1)
      }
    }

    // 小遊戲功能
    const startQuiz = () => {
      alert('�� 農場知識問答遊戲即將開始！')
    }

    const startMemory = () => {
      alert('🧩 記憶配對遊戲即將開始！')
    }

    const startPuzzle = () => {
      alert('🧩 拼圖遊戲即將開始！')
    }

    // 監聽父組件的分類變更
    watch(() => props.selectedOtherCategory, (newCategory) => {
      if (newCategory === 'trails') {
        selectedCategory.value = 'farms'
        loadData()
      }
    }, { immediate: true })

    // 組件掛載時載入資料
    onMounted(() => {
      if (props.selectedOtherCategory === 'trails') {
        selectedCategory.value = 'farms'
        loadData()
      }
    })

    return {
      categories,
      selectedCategory,
      selectedCounty,
      searchKeyword,
      loading,
      error,
      filteredData,
      favorites,
      selectCategory,
      loadData,
      refreshData,
      filterData,
      resetFilter,
      getCurrentCategoryName,
      getAddress,
      viewOnMap,
      openWebsite,
      addToFavorites,
      removeFromFavorites,
      startQuiz,
      startMemory,
      startPuzzle
    }
  }
}
</script>

