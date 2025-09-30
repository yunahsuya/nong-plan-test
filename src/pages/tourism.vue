<template>
  <div class="min-h-screen bg-blue-600 w-full">
    <!-- 頁面標題 -->
    <div class="bg-white px-8 py-12 text-center border-b border-gray-200">
      <h1 class="text-green-800 font-semibold text-4xl mb-4">🌾 農遊體驗</h1>
      <p class="text-gray-600 text-xl mb-2">探索台灣休閒農場，享受自然農遊樂趣</p>
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
    <div v-if="selectedCategory === 'farms'" class="flex min-h-[calc(100vh-200px)]">
      <!-- 左側選單 - 只在農場分類時顯示 -->
      <div class="w-[350px] bg-white border-r border-gray-200 p-8 overflow-y-auto shadow-lg lg:w-[300px] md:w-full md:border-r-0 md:border-b md:p-4 sm:p-3">
        <div class="mb-8 text-center border-b-2 border-gray-200 pb-4">
          <h3 class="text-green-800 font-semibold text-2xl mb-2">🌱 農場分類</h3>
          <p class="text-gray-500 text-sm">選擇您想探索的農場類型</p>
        </div>
        
        <!-- 農場類型選單 -->
        <div class="pt-0">
          <div class="flex flex-col gap-3">
            <div 
              :class="[
                'flex items-center px-4 py-4 border-2 rounded-lg cursor-pointer transition-all duration-300',
                selectedFarmType === 'accessible' 
                  ? 'border-green-500 bg-green-500 text-white shadow-lg' 
                  : 'border-gray-300 bg-white text-gray-800 hover:border-green-500 hover:bg-green-50'
              ]"
              @click="selectFarmType('accessible')"
            >
              <span class="font-medium text-base">無障礙休閒農場</span>
            </div>
            
            <div 
              :class="[
                'flex items-center px-4 py-4 border-2 rounded-lg cursor-pointer transition-all duration-300',
                selectedFarmType === 'outdoor-edu' 
                  ? 'border-green-500 bg-green-500 text-white shadow-lg' 
                  : 'border-gray-300 bg-white text-gray-800 hover:border-green-500 hover:bg-green-50'
              ]"
              @click="selectFarmType('outdoor-edu')"
            >
              <span class="font-medium text-base">戶外教育農場</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側內容區域 -->
      <div class="flex-1 bg-gray-50 overflow-y-auto">
        <!-- 無障礙農場組件 -->
        <AccessibleFarmList 
          v-if="selectedFarmType === 'accessible'"
        />
        
        <!-- 戶外教育農場組件 -->
        <OutdoorEduFarmList 
          v-else-if="selectedFarmType === 'outdoor-edu'"
        />
      </div>
    </div>

    <!-- 其他分類的內容區域（步道、老街等） -->
    <div v-else class="w-full bg-white p-8">
      <div class="max-w-7xl mx-auto text-center py-12">
        <h3 class="text-gray-600 text-xl">{{ getCurrentCategoryName() }} 功能開發中...</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AccessibleFarmList from '@/components/farms/AccessibleFarmList.vue'
import OutdoorEduFarmList from '@/components/farms/OutdoorEduFarmList.vue'

export default {
  name: 'TourismPage',
  components: {
    AccessibleFarmList,
    OutdoorEduFarmList
  },
  setup() {
    const selectedCategory = ref('farms') // 預設選擇農場
    const selectedFarmType = ref('accessible') // 預設選擇無障礙農場

    // 主要分類按鈕
    const categories = ref([
      {
        id: 'farms',
        name: '農場',
        icon: '🌾'
      },
      {
        id: 'trails',
        name: '步道',
        icon: '🥾'
      },
      {
        id: 'old-streets',
        name: '老街',
        icon: '🏮'
      },
      {
        id: 'markets',
        name: '活動（市集）',
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

    // 選擇農場類型
    const selectFarmType = (typeId) => {
      selectedFarmType.value = typeId
    }

    // 獲取當前分類名稱
    const getCurrentCategoryName = () => {
      const category = categories.value.find(cat => cat.id === selectedCategory.value)
      return category ? category.name : ''
    }

    return {
      selectedCategory,
      selectedFarmType,
      categories,
      selectCategory,
      selectFarmType,
      getCurrentCategoryName
    }
  }
}
</script>

<route lang="yaml">
meta:
  title: '農遊體驗'
</route>