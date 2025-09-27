<template>
  <div class="min-h-screen bg-blue-600 w-full">
    <!-- 頁面標題 -->
    <div class="bg-white px-8 py-12 text-center border-b border-gray-200">
      <h1 class="text-green-800 font-semibold text-4xl mb-4">🌾 農遊體驗</h1>
      <p class="text-gray-600 text-xl mb-2">探索台灣無障礙休閒農場，享受自然農遊樂趣</p>
      <p class="text-gray-500 text-base max-w-4xl mx-auto mb-8">
        提供完整的農遊資訊服務，包含農場、步道、老街、市集、美食、伴手禮、停車場、廁所等一條龍服務
      </p>
      
      <!-- 水平排列的按鈕 -->
      <h5 class="text-center mb-8 text-green-800 font-semibold text-2xl">選擇您要探索的項目</h5>
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="[
            'flex flex-col items-center justify-center px-3 py-2 border-2 rounded-lg transition-all duration-300 min-w-[140px] min-h-[60px] cursor-pointer text-base',
            selectedCategory === category.id 
              ? 'border-[#28A745] bg-[#28A745] text-white -translate-y-0.5 shadow-lg shadow-[#28A745]/30' 
              : 'border-gray-300 bg-white text-gray-800 hover:border-[#28A745] hover:bg-[#28A745]/10 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#28A745]/15'
          ]"
        >
          <i :class="category.icon" class="text-lg mb-1"></i>
          <span class="font-semibold text-sm text-center">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="flex min-h-[calc(100vh-200px)]">
      <!-- 左側選單 -->
      <div class="w-[350px] bg-white border-r border-gray-200 p-8 overflow-y-auto shadow-lg lg:w-[300px] md:w-full md:border-r-0 md:border-b md:p-4 sm:p-3">
        <div class="mb-8 text-center border-b-2 border-gray-200 pb-4">
          <h3 class="text-green-800 font-semibold text-2xl mb-2">🌱 農場分類</h3>
          <p class="text-gray-500 text-sm">選擇您想探索的農場類型</p>
        </div>
        
        <!-- 農遊項目選單 -->
        <div class="pt-0">
          <div class="flex flex-col gap-2">
            <div 
              v-for="category in otherCategories" 
              :key="category.id"
              :class="[
                'flex items-center px-4 py-3 border rounded-lg  cursor-pointer transition-all duration-300',
                selectedOtherCategory === category.id 
  ? 'border-green-500 bg-green-600 text-white shadow-lg' 
  : 'border-gray-200 bg-white hover:border-green-500 hover:bg-green-50'
              ]"
              @click="selectOtherCategory(category.id)"
            >
              <i :class="category.icon" class="text-xl mr-3 w-5 text-center"></i>
              <span class="font-medium text-sm">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側內容區域 -->
      <div class="flex-1 bg-gray-50 overflow-y-auto">
        <ComprehensiveTourism 
          :selected-other-category="selectedOtherCategory"
          :selected-category="selectedCategory"
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
    const selectedCategory = ref('farms') // 預設選擇農場

    // 主要分類按鈕
    const categories = ref([
      {
        id: 'farms',
        name: '農場',
        icon: '🌾',
        description: '無障礙休閒農場'
      },
      {
        id: 'trails',
        name: '步道',
        icon: '🥾',
        description: '無障礙步道'
      },
      {
        id: 'old-streets',
        name: '老街',
        icon: '🏮',
        description: '歷史老街'
      },
      {
        id: 'markets',
        name: '活動（市集）',
        icon: '🏪',
        description: '農民市集活動'
      },
      {
        id: 'food',
        name: '美食',
        icon: '🍽️',
        description: '在地美食'
      },
      {
        id: 'souvenirs',
        name: '伴手禮',
        icon: '🎁',
        description: '特色伴手禮'
      },
      {
        id: 'parking',
        name: '停車場',
        icon: '🅿️',
        description: '無障礙停車'
      },
      {
        id: 'toilets',
        name: '廁所',
        icon: '🚻',
        description: '無障礙廁所'
      }
    ])

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
        icon: '🍽️'
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
        icon: '🚻'
      }
    ])

    // 選擇主要分類
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
    }

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
      selectedCategory,
      categories,
      otherCategories,
      selectCategory,
      selectOtherCategory,
      handleCategoryChange
    }
  }
}
</script>

<route lang="yaml">
meta:
  title: '農遊體驗'
</route>