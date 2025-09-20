<template>
  <div class="tourism-page">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1 class="page-title">�� 農遊體驗</h1>
      <p class="page-subtitle">探索台灣無障礙休閒農場，享受自然農遊樂趣</p>
      <p class="page-description">
        提供完整的農遊資訊服務，包含農場、步道、老街、市集、美食、伴手禮、停車場、廁所等一條龍服務
      </p>
    </div>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 左側選單 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>🌿 農場分類</h3>
          <p class="sidebar-subtitle">選擇您想探索的農場類型</p>
        </div>
        
        <!-- 農遊項目選單 -->
        <div class="other-categories">
          <div class="other-category-list">
            <div 
              v-for="category in otherCategories" 
              :key="category.id"
              class="other-category-item"
              :class="{ 'active': selectedOtherCategory === category.id }"
              @click="selectOtherCategory(category.id)"
            >
              <i :class="category.icon"></i>
              <span>{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側內容區域 -->
      <div class="content-area">
        <ComprehensiveTourism 
          :selected-other-category="selectedOtherCategory"
          @category-changed="handleCategoryChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ComprehensiveTourism from '@/components/farms/ComprehensiveTourism.vue'

export default {
  name: 'TourismPage',
  components: {
    ComprehensiveTourism
  },
  setup() {
    const selectedOtherCategory = ref('trails') // 預設選擇無障礙設施

    // 農遊項目分類
    const otherCategories = ref([
      {
        id: 'trails',
        name: '無障礙設施',
        icon: '♿'
      },
      {
        id: 'old-streets',
        name: '體驗',
        icon: '🏮'
      },
      {
        id: 'markets',
        name: '市集',
        icon: '🏪'
      },
      {
        id: 'food',
        name: '美食',
        icon: '��️'
      },
      {
        id: 'souvenirs',
        name: '伴手禮',
        icon: '🎁'
      },
      {
        id: 'parking',
        name: '停車場',
        icon: '🅿️'
      },
      {
        id: 'toilets',
        name: '廁所',
        icon: '��'
      }
    ])

    // 選擇其他分類
    const selectOtherCategory = (categoryId) => {
      selectedOtherCategory.value = categoryId
    }

    // 處理子組件的分類變更
    const handleCategoryChange = (categoryType, categoryId) => {
      if (categoryType === 'other') {
        selectedOtherCategory.value = categoryId
      }
    }

    return {
      selectedOtherCategory,
      otherCategories,
      selectOtherCategory,
      handleCategoryChange
    }
  }
}
</script>

<!-- 樣式保持不變 -->
<style scoped>
.tourism-page {
  min-height: 100vh;
  background: #0c3965;
  width: 100%;
}

.page-header {
  background: white;
  padding: 3rem 2rem;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.page-title {
  color: #2d5016;
  font-weight: 600;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  color: #495057;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 主要內容區域 */
.main-content {
  display: flex;
  min-height: calc(100vh - 200px);
}

/* 左側選單 */
.sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.sidebar-header {
  margin-bottom: 2rem;
  text-align: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 1rem;
}

.sidebar-header h3 {
  color: #2d5016;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.sidebar-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

/* 農遊項目分類 */
.other-categories {
  padding-top: 0;
}

.other-category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.other-category-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.other-category-item:hover {
  border-color: #28a745;
  background: #f8fff9;
}

.other-category-item.active {
  border-color: #28a745;
  background: #28a745;
  color: white;
}

.other-category-item i {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
}

.other-category-item span {
  font-weight: 500;
  font-size: 0.9rem;
}

/* 右側內容區域 */
.content-area {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .sidebar {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 1rem;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 2rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .page-description {
    font-size: 0.9rem;
  }
  
  .sidebar {
    padding: 0.75rem;
  }
  
  .other-category-item {
    padding: 0.5rem 0.75rem;
  }
  
  .other-category-item i {
    font-size: 1rem;
    margin-right: 0.5rem;
  }
  
  .other-category-item span {
    font-size: 0.85rem;
  }
}
</style>

<route lang="yaml">
meta:
  title: '農遊體驗'
</route>