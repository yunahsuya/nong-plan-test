<template>
  <div
    class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full"
  >
    <!-- 卡片標題 -->
    <div class="flex items-start justify-between mb-4">
      <h4 class="font-semibold text-lg text-gray-800 line-clamp-2">
        {{ item.crop || item.name || '未命名產品' }}
      </h4>

      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
        等級：{{ item.verify_marker }}
      </span>
    </div>

    <!-- 卡片內容 - 使用 flex-1 讓內容區域自動擴展 -->
    <div class="space-y-2 flex-1">
      <!-- 生產者 -->
      <div v-if="item.member_name" class="flex items-center">
        <span class="text-gray-400 mr-2">👤</span>
        <span class="text-sm text-gray-600">生產者: {{ item.member_name }}</span>
      </div>

      <!-- 月供貨量 -->
      <div v-if="item.yield" class="flex items-center">
        <PhPackage class="w-5 h-5 text-orange-600 mr-2" weight="duotone" />
        <span class="text-sm text-gray-600">月供貨量: {{ item.yield }}kg</span>
      </div>

      <!-- 產季 -->
      <div v-if="item.season" class="flex items-center">
        <PhCalendarDots class="w-5 h-5 text-blue-600 mr-2" weight="duotone" />
        <span class="text-sm text-gray-600">產季: {{ item.season }}</span>
      </div>

      <!-- 最小出貨量 -->
      <div v-if="item.shipments_min" class="flex items-center">
        <PhTruck class="w-5 h-5 text-black-600 mr-2" weight="duotone" />
        <span class="text-sm text-gray-600">最小出貨量: {{ item.shipments_min }}kg</span>
      </div>
    </div>

    <!-- 操作按鈕 - 固定在底部 -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
      <!-- 我有興趣按鈕 -->
      <button
        v-if="item.url"
        @click="openLink(item.url)"
        class="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
      >
        <PhEyes class="w-4 h-4" weight="fill" />
        我有興趣
      </button>

      <!-- 地圖按鈕 -->
      <button
        v-if="
          item.coordinates && item.coordinates.longitude !== 0 && item.coordinates.latitude !== 0
        "
        @click="showOnMap(item)"
        class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
      >
        查看地圖
      </button>
    </div>
  </div>
</template>

<script setup>
import { PhPackage, PhCalendarDots, PhTruck, PhEyes } from '@phosphor-icons/vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const openLink = (url) => {
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
