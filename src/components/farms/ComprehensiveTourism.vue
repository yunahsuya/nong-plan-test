<template>
  <div class="comprehensive-tourism">
    <!-- 分類選擇器 -->
    <div class="category-selector">
      <div class="section-content">
        <h5 class="section-title">選擇您要探索的項目</h5>
        
        <!-- 水平排列的按鈕 -->
        <div class="category-buttons">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="['category-btn', { 'active': selectedCategory === category.id }]"
            :disabled="loading"
          >
            <i :class="category.icon" class="category-icon"></i>
            <span class="category-name">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 篩選器 -->
    <div v-if="selectedCategory" class="filter-section">
      <div class="section-content">
        <h5 class="section-title">🔍 篩選條件</h5>
        <div class="filter-controls">
          <div class="filter-group">
            <label for="countySelect" class="form-label">縣市</label>
            <select 
              id="countySelect"
              v-model="selectedCounty" 
              @change="filterData" 
              class="form-select"
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
          <div class="filter-group">
            <label for="keywordInput" class="form-label">關鍵字搜尋</label>
            <input 
              id="keywordInput"
              v-model="searchKeyword" 
              @input="filterData"
              type="text" 
              class="form-control" 
              placeholder="輸入景點名稱或關鍵字..."
              :disabled="loading"
            >
          </div>
          <div class="filter-group">
            <div class="filter-buttons">
              <button 
                @click="resetFilter" 
                class="btn btn-outline-secondary"
                :disabled="loading"
              >
                🔄 重置篩選
              </button>
              <button 
                @click="refreshData" 
                class="btn btn-outline-primary"
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
    <div v-if="loading" class="loading-section">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-3 text-muted">正在載入{{ getCurrentCategoryName() }}資料...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="error-section">
      <h4>❌ 載入失敗</h4>
      <p>{{ error }}</p>
      <button @click="loadData" class="btn btn-outline-danger btn-sm">
        🔄 重新載入
      </button>
    </div>

    <!-- 資料列表 -->
    <div v-if="filteredData.length > 0 && !loading" class="data-list">
      <div class="section-content">
        <div class="data-grid">
          <div 
            v-for="item in filteredData" 
            :key="item.id" 
            class="data-card"
          >
            <div class="card-content">
              <h5 class="card-title">{{ item.name }}</h5>
              <p class="card-text">
                <strong>地址：</strong>{{ getAddress(item) }}<br>
                <span v-if="item.tel"><strong>電話：</strong>{{ item.tel }}<br></span>
                <span v-if="item.website"><strong>網站：</strong><a :href="item.website" target="_blank">{{ item.website }}</a><br></span>
                <span v-if="item.township"><strong>鄉鎮：</strong>{{ item.township }}<br></span>
              </p>
              
              <!-- 無障礙設施標籤 -->
              <div v-if="item.accessibleItems && item.accessibleItems.length > 0" class="accessible-section">
                <small class="accessible-label">♿ 無障礙設施：</small><br>
                <span 
                  v-for="feature in item.accessibleItems" 
                  :key="feature"
                  class="accessible-tag"
                >
                  {{ feature }}
                </span>
              </div>

              <!-- 行動按鈕 -->
              <div class="action-buttons">
                <button 
                  @click="viewOnMap(item)" 
                  class="btn btn-primary btn-sm"
                >
                  🗺️ 地圖
                </button>
                <button 
                  v-if="item.website" 
                  @click="openWebsite(item.website)" 
                  class="btn btn-outline-primary btn-sm"
                >
                  🌐 網站
                </button>
                <button 
                  @click="addToFavorites(item)" 
                  class="btn btn-outline-warning btn-sm"
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
    <div v-if="!loading && !error && filteredData.length === 0 && selectedCategory" class="no-data-section">
      <div class="section-content">
        <h4>ℹ️ 沒有找到資料</h4>
        <p>找不到符合條件的{{ getCurrentCategoryName() }}，請嘗試其他篩選條件。</p>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div v-if="filteredData.length > 0" class="stats-section">
      <div class="section-content">
        <h5>�� 統計資訊</h5>
        <p>共找到 <strong>{{ filteredData.length }}</strong> 筆{{ getCurrentCategoryName() }}資料</p>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div v-if="favorites.length > 0" class="favorites-section">
      <div class="section-content">
        <h5>⭐ 我的收藏</h5>
        <div class="favorites-grid">
          <div 
            v-for="fav in favorites" 
            :key="fav.id" 
            class="favorite-item"
          >
            <div class="favorite-content">
              <div class="favorite-info">
                <strong>{{ fav.name }}</strong><br>
                <small>{{ fav.category }} - {{ fav.address }}</small>
              </div>
              <button 
                @click="removeFromFavorites(fav.id)" 
                class="btn btn-outline-danger btn-sm"
              >
                ❌ 移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 小遊戲區域 -->
    <div class="games-section">
      <div class="section-content">
        <h5>🎮 農遊小遊戲</h5>
        <div class="games-grid">
          <button @click="startQuiz" class="game-btn">
            🧠 農場知識問答
          </button>
          <button @click="startMemory" class="game-btn">
            🧩 記憶配對遊戲
          </button>
          <button @click="startPuzzle" class="game-btn">
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
      if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
        const url = `https://www.google.com/maps?q=${item.coordinates.latitude},${item.coordinates.longitude}`
        window.open(url, '_blank')
      } else {
        alert(`查看 ${item.name} 的地圖位置`)
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

<!-- 樣式保持不變 -->
<style scoped>
.comprehensive-tourism {
  width: 100%;
  background: #186cc1;
}

/* 通用區段樣式 */
.section-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2d5016;
  font-weight: 600;
  font-size: 1.5rem;
}

/* 分類選擇器 */
.category-selector {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border: 2px solid #dee2e6;
  border-radius: 0.75rem;
  background: white;
  transition: all 0.3s ease;
  min-width: 120px;
  min-height: 100px;
  cursor: pointer;
  font-size: 0.9rem;
}

.category-btn:hover {
  border-color: #28a745;
  background: #f8fff9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15);
}

.category-btn.active {
  border-color: #28a745;
  background: #28a745;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.category-icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
}

/* 篩選器 */
.filter-section {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.filter-controls {
  display: flex;
  gap: 2rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-select, .form-control {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

/* 載入和錯誤狀態 */
.loading-section, .error-section, .no-data-section {
  background: white;
  padding: 3rem 2rem;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.error-section {
  background: #f8d7da;
  color: #721c24;
}

.no-data-section {
  background: #d1ecf1;
  color: #0c5460;
}

/* 資料列表 */
.data-list {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.data-card {
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  background: white;
  transition: all 0.3s ease;
  overflow: hidden;
}

.data-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-color: #28a745;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  color: #2d5016;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-text {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.accessible-section {
  margin-bottom: 1rem;
}

.accessible-tag {
  display: inline-block;
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  margin: 0.125rem;
}

.accessible-label {
  color: #28a745;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 統計資訊 */
.stats-section {
  background: #d4edda;
  color: #155724;
  border-bottom: 1px solid #e9ecef;
}

/* 收藏列表 */
.favorites-section {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.favorite-item {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
}

.favorite-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-info {
  flex: 1;
}

/* 小遊戲區域 */
.games-section {
  background: white;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.game-btn {
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 0.5rem;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.game-btn:hover {
  border-color: #28a745;
  background: #f8fff9;
  transform: translateY(-2px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .section-content {
    padding: 1rem;
  }
  
  .category-buttons {
    gap: 0.5rem;
  }
  
  .category-btn {
    min-width: 100px;
    min-height: 80px;
    padding: 0.75rem 1rem;
  }
  
  .category-icon {
    font-size: 1.5rem;
  }
  
  .category-name {
    font-size: 0.8rem;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .data-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .category-buttons {
    gap: 0.25rem;
  }
  
  .category-btn {
    min-width: 80px;
    min-height: 70px;
    padding: 0.5rem;
  }
  
  .category-icon {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
  
  .category-name {
    font-size: 0.75rem;
  }
}
</style>