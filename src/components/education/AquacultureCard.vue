<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <!-- 卡片標題 -->
    <div class="flex items-start justify-between mb-4">
      <h4 class="font-semibold text-lg text-gray-800 line-clamp-2">
        {{ item.title || item.name || '未命名' }}
      </h4>
      <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        水產知識淺說
      </span>
    </div>
    
    <!-- 卡片內容 -->
    <div class="space-y-3">
      <!-- 遊戲類型 -->
      <div v-if="item.gameType" class="flex items-center">
        <span class="text-gray-400 mr-2">🎮</span>
        <span class="text-sm text-gray-600">遊戲類型: {{ item.gameType }}</span>
      </div>
      
      <!-- 描述 -->
      <div v-if="item.description" class="flex items-start">
        <span class="text-sm text-gray-600 line-clamp-3">{{ item.description }}</span>
      </div>
    </div>
    
    <!-- 操作按鈕 -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
      <!-- 閱讀更多 -->
      <button 
        v-if="item.link || item.url"
        @click="openLink(item.link || item.url)"
        class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
      >
      👀 閱讀更多
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

const openLink = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
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