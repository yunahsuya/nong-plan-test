<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
    <!-- 卡片標題 -->
    <div class="flex items-start justify-between mb-4">
      <h4 class="font-semibold text-lg text-gray-800 line-clamp-2">
        {{ item.title || '未命名品種' }}
      </h4>

      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"> 
        發佈：{{ item.pubDate }}
      </span>

      <!-- <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
        農業試驗所品種介紹
      </span> -->
    </div>
    
    <!-- 卡片內容 - 使用 flex-1 讓內容區域自動擴展 -->
    <div class="space-y-3 flex-1">
      <!-- 發布日期 -->
      <!-- <div v-if="item.pubDate" class="flex items-center">
        <span class="text-gray-400 mr-2">📅</span>
        <span class="text-sm text-gray-600">發布日期: {{ item.pubDate }}</span>
      </div> -->
      
      <!-- 品種權證號 -->
      <div v-if="parsedInfo.certificateNumber" class="text-sm text-gray-600">
        <span class="font-medium">品種權證號：</span>{{ parsedInfo.certificateNumber }}
      </div>
      
      <!-- 權利狀態 -->
      <div v-if="parsedInfo.rightStatus" class="text-sm text-gray-600">
        <span class="font-medium">權利狀態：</span>{{ parsedInfo.rightStatus }}
      </div>
      
      <!-- 權利起迄期間 -->
      <div v-if="parsedInfo.rightPeriod" class="text-sm text-gray-600">
        <span class="font-medium">權利起迄期間：</span>{{ parsedInfo.rightPeriod }}
      </div>
      
            <!-- 品種特性簡介 -->
            <div v-if="parsedInfo.characteristics" class="text-sm text-gray-600">
        <span class="font-medium">品種特性簡介：</span>
        <div class="mt-1 line-clamp-3">{{ parsedInfo.characteristics }}</div>
      </div>
    </div>
    
     <!-- 操作按鈕 - 固定在底部 -->
     <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
      <!-- 詳細連結 -->
      <button 
        v-if="item.link"
        @click="openLink(item.link)"
        class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <PhGlobe :size="16" weight="bold" />
        查看詳細資訊
      </button>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { PhGlobe } from '@phosphor-icons/vue'


const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// 解析品種描述資訊
const parsedInfo = computed(() => {
  if (!props.item.description) {
    return {}
  }
  
  const description = props.item.description
  
  // 使用正則表達式提取各個欄位
  const certificateMatch = description.match(/品種權證號：([^\r\n]+)/)
  const statusMatch = description.match(/權利狀態：([^\r\n]+)/)
  const periodMatch = description.match(/權利起迄期間：([^\r\n]+)/)
  const characteristicsMatch = description.match(/品種特性簡介：\s*([\s\S]+)/)
  
  return {
    certificateNumber: certificateMatch ? certificateMatch[1].trim() : null,
    rightStatus: statusMatch ? statusMatch[1].trim() : null,
    rightPeriod: periodMatch ? periodMatch[1].trim() : null,
    characteristics: characteristicsMatch ? characteristicsMatch[1].trim() : null
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