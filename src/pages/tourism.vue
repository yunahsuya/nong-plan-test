<template>
  <div class="tourism-page">
    <div class="container-fluid">
      <!-- 頁面標題 -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="page-title">🌾 農遊體驗</h1>
          <p class="page-subtitle">探索台灣無障礙休閒農場，享受自然農遊樂趣</p>
        </div>
      </div>

      <!-- 農場列表組件 -->
      <AccessibleFarmList />
    </div>
  </div>
</template>

<script>
// 修改這裡的引用路徑
import AccessibleFarmList from '@/components/farms/AccessibleFarmList.vue'

export default {
  name: 'TourismPage',
  components: {
    AccessibleFarmList
  }
}
</script>

<style scoped>
.tourism-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.page-title {
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.page-subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
}
</style>

<route lang="yaml">
meta:
  title: '農遊體驗'
</route>