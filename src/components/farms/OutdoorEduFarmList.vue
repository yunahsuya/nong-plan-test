<template>
  <div class="w-full bg-blue-600">
    <!-- 篩選器 -->
    <div ref="filterSection" class="bg-white border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
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
          
          <!-- 服務項目篩選 -->
          <div class="flex-1 min-w-[200px]">
            <label for="serveItemSelect" class="block font-semibold text-gray-700 mb-2">服務項目</label>
            <select 
              id="serveItemSelect"
              v-model="selectedServeItem" 
              @change="filterData" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              :disabled="loading"
            >
              <option value="">全部服務項目</option>
              
              <!-- 教育類 -->
              <optgroup label="🎓 教育導覽">
                <option value="環境教育">環境教育</option>
                <option value="生態導覽">生態導覽</option>
                <option value="園區導覽">園區導覽</option>
                <option value="導覽解說">導覽解說</option>
                <option value="產業解說">產業解說</option>
                <option value="文化導覽">文化導覽</option>
                <option value="夜間導覽">夜間導覽</option>
                <option value="夜間觀察">夜間觀察</option>
              </optgroup>
              
              <!-- 手作DIY類 -->
              <optgroup label="🎨 手作DIY">
                <option value="餅乾製作">餅乾製作</option>
                <option value="薑餅製作">薑餅製作</option>
                <option value="香皂製作">香皂製作</option>
                <option value="蜜蠟製作">蜜蠟製作</option>
                <option value="湯圓製作">湯圓製作</option>
                <option value="手工湯圓">手工湯圓</option>
                <option value="醬菜製作">醬菜製作</option>
                <option value="橘餅製作">橘餅製作</option>
                <option value="披薩製作">披薩製作</option>
                <option value="手工披薩">手工披薩</option>
                <option value="窯烤披薩">窯烤披薩</option>
                <option value="筆筒製作">筆筒製作</option>
                <option value="壓花製作">壓花製作</option>
              </optgroup>
              
              <!-- 竹製品類 -->
              <optgroup label="🎋 竹製品體驗">
                <option value="竹玩製作">竹玩製作</option>
                <option value="竹製茶杯">竹製茶杯</option>
                <option value="竹製水槍">竹製水槍</option>
                <option value="竹耙彩繪">竹耙彩繪</option>
                <option value="竹笛製作">竹笛製作</option>
                <option value="竹筒飯">竹筒飯</option>
              </optgroup>
              
              <!-- 彩繪類 -->
              <optgroup label="🎨 彩繪體驗">
                <option value="乳牛彩繪">乳牛彩繪</option>
                <option value="彩繪甲蟲">彩繪甲蟲</option>
                <option value="竹耙彩繪">竹耙彩繪</option>
              </optgroup>
              
              <!-- 農事體驗類 -->
              <optgroup label="🌾 農事體驗">
                <option value="採果體驗">採果體驗</option>
                <option value="扦插採果">扦插採果</option>
                <option value="種子體驗">種子體驗</option>
                <option value="稻田採收">稻田採收</option>
                <option value="地瓜體驗">地瓜體驗</option>
                <option value="鳳梨體驗">鳳梨體驗</option>
                <option value="茶業體驗">茶業體驗</option>
              </optgroup>
              
              <!-- 米食類 -->
              <optgroup label="🍚 米食體驗">
                <option value="碾米體驗">碾米體驗</option>
                <option value="製米體驗">製米體驗</option>
                <option value="香米製作">香米製作</option>
              </optgroup>
              
              <!-- 自然生態類 -->
              <optgroup label="🌳 自然生態">
                <option value="森林探索">森林探索</option>
                <option value="溪流生態">溪流生態</option>
                <option value="水圳巡禮">水圳巡禮</option>
              </optgroup>
              
              <!-- 盆栽園藝類 -->
              <optgroup label="🪴 盆栽園藝">
                <option value="創意盆栽">創意盆栽</option>
                <option value="香草盆栽">香草盆栽</option>
              </optgroup>
              
              <!-- 文化體驗類 -->
              <optgroup label="🏮 文化體驗">
                <option value="天燈釋放">天燈釋放</option>
                <option value="陀螺文化">陀螺文化</option>
                <option value="藍染體驗">藍染體驗</option>
                <option value="葉拓體驗">葉拓體驗</option>
              </optgroup>
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
              placeholder="輸入農場名稱或關鍵字..."
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
      <p class="mt-3 text-gray-600">正在載入戶外教育農場資料...</p>
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
  v-for="item in paginatedData" 
  :key="item.id" 
  class="border border-gray-200 rounded-xl bg-white transition-all duration-300 overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-green-500"
>
  <div class="p-6 flex flex-col h-full">
    <h5 class="text-green-800 font-semibold mb-4">{{ item.name }}</h5>
    <p class="text-gray-600 leading-relaxed mb-4 flex-grow">
      <strong>地址：</strong>{{ item.address }}<br>
      <span v-if="item.tel"><strong>電話：</strong>{{ item.tel }}<br></span>
      <span v-if="item.website"><strong>網站：</strong><a :href="item.website" target="_blank" class="text-blue-600 hover:underline break-all">{{ item.website.length > 40 ? item.website.substring(0, 30) + '...' : item.website }}</a><br></span>
      <span v-if="item.township"><strong>鄉鎮：</strong>{{ item.township }}<br></span>
    </p>
    
    <!-- 服務項目標籤 - 可點擊篩選 -->
    <div class="mb-4 mt-auto">
      <div v-if="item.serveItems && item.serveItems.length > 0">
        <small class="text-green-600 font-semibold">🎓 服務項目：</small><br>
        <span 
          v-for="(feature, index) in item.serveItems" 
          :key="index"
          @click="filterByServeItem(feature)"
          :class="[
            'inline-block px-2 py-1 rounded text-xs m-0.5 cursor-pointer transition-all duration-200',
            selectedServeItem === feature
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-sm'
          ]"
          :title="`點擊篩選「${feature}」`"
        >
          {{ feature }}
        </span>
      </div>
      <div v-else class="text-gray-400 text-sm">
        <small>🎓 服務項目：</small><br>
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
                  v-if="item.website" 
                  @click="openWebsite(item.website)" 
                  class="px-3 py-1.5 font-semibold border border-blue-500 text-blue-500 rounded text-sm bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  🌐 網站
                </button>
                <button 
                  v-if="item.facebook" 
                  @click="openWebsite(item.facebook)" 
                  class="px-3 py-1.5 font-semibold border border-blue-500 text-blue-500 rounded text-sm bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  📘 Facebook
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
                  : 'bg-white border-gray-300 hover:bg-gray-50'
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
    <div v-if="!loading && !error && filteredData.length === 0" class="bg-blue-100 text-blue-800 py-12 px-8 text-center border-b border-gray-200">
      <div class="max-w-7xl mx-auto">
        <h4>ℹ️ 沒有找到資料</h4>
        <p>找不到符合條件的戶外教育農場，請嘗試其他篩選條件。</p>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div v-if="filteredData.length > 0" class="bg-green-100 text-green-800 border-b border-gray-200">
      <div class="p-8 max-w-7xl mx-auto">
        <h5>📊 統計資訊</h5>
        <p>共找到 <strong>{{ filteredData.length }}</strong> 筆戶外教育農場資料（目前顯示第 <strong>{{ currentPage }}</strong> 頁，共 <strong>{{ totalPages }}</strong> 頁）</p>
        <div v-if="selectedCounty || selectedServeItem" class="text-sm mt-2">
          <span class="font-semibold">篩選條件：</span>
          <span v-if="selectedCounty" class="inline-block bg-green-200 px-2 py-1 rounded text-xs mr-1">📍 {{ selectedCounty }}</span>
          <span v-if="selectedServeItem" class="inline-block bg-blue-200 px-2 py-1 rounded text-xs">🎓 {{ selectedServeItem }}</span>
        </div>
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
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <strong class="text-green-800">{{ fav.name }}</strong><br>
                <small class="text-gray-600">{{ fav.category }}</small><br>
                <small class="text-gray-500">{{ fav.address }}</small>
              </div>
              <button 
                @click="removeFromFavorites(fav.id)" 
                class="px-3 py-1.5 border border-red-500 text-red-500 rounded text-sm bg-white hover:bg-red-50 transition-colors ml-2"
              >
                ❌ 移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { getOutdoorEduFarms } from '@/services/api.js'

export default {
  name: 'OutdoorEduFarmList',
  setup() {
    const selectedCounty = ref('')
    const selectedServeItem = ref('')
    const searchKeyword = ref('')
    const loading = ref(false)
    const error = ref('')
    const rawData = ref([])
    const favorites = ref([])
    const filterSection = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 10

    // 計算屬性：篩選後的資料
    const filteredData = computed(() => {
      let filtered = rawData.value

      // 縣市篩選
      if (selectedCounty.value) {
        filtered = filtered.filter(item => {
          const countyName = item.countyName || item.county || ''
          const address = item.address || ''
          return countyName.includes(selectedCounty.value) || 
                 address.includes(selectedCounty.value)
        })
      }

      // 服務項目篩選
      if (selectedServeItem.value) {
        filtered = filtered.filter(item => {
          if (!item.serveItems || item.serveItems.length === 0) {
            return false
          }
          return item.serveItems.some(serveItem => 
            serveItem.includes(selectedServeItem.value)
          )
        })
      }

      // 關鍵字搜尋
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(keyword) ||
          item.address?.toLowerCase().includes(keyword) ||
          item.serveItems?.some(item => item.toLowerCase().includes(keyword))
        )
      }

      return filtered
    })

    // 計算總頁數
    const totalPages = computed(() => {
      return Math.ceil(filteredData.value.length / itemsPerPage)
    })

    // 當前頁的資料
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredData.value.slice(start, end)
    })

    // 監聽篩選條件變化，重置到第一頁
    watch([selectedCounty, selectedServeItem, searchKeyword], () => {
      currentPage.value = 1
    })

    // 換頁
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        // 滾動到頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // 上一頁
    const previousPage = () => {
      goToPage(currentPage.value - 1)
    }

    // 下一頁
    const nextPage = () => {
      goToPage(currentPage.value + 1)
    }

    // 載入資料
    const loadData = async (forceRefresh = false) => {
      loading.value = true
      error.value = ''

      try {
        console.log(`正在載入戶外教育農場資料...`)
        
        const result = await getOutdoorEduFarms(forceRefresh)
        
        if (result.success) {
          rawData.value = result.data
          console.log(`✅ 載入戶外教育農場資料成功:`, rawData.value.length, '筆')
        } else {
          error.value = result.message || '載入資料失敗'
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
      selectedServeItem.value = ''
      searchKeyword.value = ''
      currentPage.value = 1
    }

    // 點擊服務項目標籤進行篩選
    const filterByServeItem = (serveItem) => {
      // 如果點擊的是已選中的項目，則取消篩選
      if (selectedServeItem.value === serveItem) {
        selectedServeItem.value = ''
      } else {
        selectedServeItem.value = serveItem
      }
      
      // 滾動到篩選區域
      if (filterSection.value) {
        filterSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // 在地圖上查看
    const viewOnMap = (item) => {
      const address = item.address
      if (address) {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        window.open(mapUrl, '_blank')
      } else {
        alert('此地點沒有地址資訊')
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
          category: '戶外教育農場',
          address: item.address
        })
        alert(`已將 ${item.name} 加入收藏`)
      } else {
        alert('此農場已在收藏列表中')
      }
    }

    // 移除收藏
    const removeFromFavorites = (id) => {
      const index = favorites.value.findIndex(fav => fav.id === id)
      if (index > -1) {
        favorites.value.splice(index, 1)
      }
    }

    // 組件掛載時載入資料
    onMounted(() => {
      loadData()
    })

    return {
      selectedCounty,
      selectedServeItem,
      searchKeyword,
      loading,
      error,
      filteredData,
      paginatedData,
      currentPage,
      totalPages,
      favorites,
      filterSection,
      loadData,
      refreshData,
      filterData,
      resetFilter,
      filterByServeItem,
      viewOnMap,
      openWebsite,
      addToFavorites,
      removeFromFavorites,
      goToPage,
      previousPage,
      nextPage
    }
  }
}
</script>