<template>
  <div class="accessible-farm-list">
    <div class="row">
      <div class="col-12">
        <!-- 篩選器 -->
        <div class="filter-section mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">🔍 篩選農場</h5>
              <div class="row align-items-end">
                <div class="col-md-6">
                  <label for="countySelect" class="form-label">選擇縣市</label>
                  <select 
                    id="countySelect"
                    v-model="selectedCounty" 
                    @change="filterFarms" 
                    class="form-select"
                    :disabled="loading"
                  >
                    <option value="">全部縣市</option>
                    <option value="宜蘭縣">宜蘭縣</option>
                    <option value="南投縣">南投縣</option>
                    <option value="高雄市">高雄市</option>
                    <option value="苗栗縣">苗栗縣</option>
                    <option value="臺中市">台中市</option>
                    <option value="臺東縣">台東縣</option>
                    <option value="新竹縣">新竹縣</option>
                    <option value="彰化縣">彰化縣</option>
                    <option value="台南市">台南市</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <button 
                    @click="resetFilter" 
                    class="btn btn-outline-secondary"
                    :disabled="loading || !selectedCounty"
                  >
                    🔄 重置篩選
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 載入狀態 -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">載入中...</span>
          </div>
          <p class="mt-3 text-muted">正在載入農場資料...</p>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <h4 class="alert-heading">❌ 載入失敗</h4>
          <p>{{ error }}</p>
          <button @click="loadFarms" class="btn btn-outline-danger btn-sm">
            🔄 重新載入
          </button>
        </div>

        <!-- 農場列表 -->
        <div v-if="farms.length > 0" class="row">
          <div 
            v-for="farm in farms" 
            :key="farm.id" 
            class="col-lg-4 col-md-6 mb-4"
          >
            <div class="card h-100 farm-card">
              <div class="card-body">
                <h5 class="card-title">{{ farm.name }}</h5>
                <p class="card-text">
                  <strong>地址：</strong>{{ farm.address.chinese }}<br>
                  <strong>電話：</strong>{{ farm.tel }}<br>
                  <strong>♿ 無障礙設施：</strong>
                  <span v-if="farm.accessibleItems.length > 0">
                    <span 
                      v-for="(item, index) in farm.accessibleItems" 
                      :key="index"
                      class="badge bg-success me-1"
                    >
                      {{ item }}
                    </span>
                  </span>
                  <span v-else class="text-muted">無</span>
                </p>
                <div v-if="farm.website" class="mb-3">
                  <a 
                    :href="farm.website" 
                    target="_blank" 
                    class="btn btn-primary btn-sm"
                  >
                    🌐 官方網站
                  </a>
                </div>
                <div class="location-info">
                  <small class="text-muted">
                    📍 座標: {{ farm.coordinates.latitude }}, {{ farm.coordinates.longitude }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 無資料 -->
        <div v-if="!loading && !error && farms.length === 0" class="text-center py-5">
          <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">ℹ️ 沒有找到農場</h4>
            <p>找不到符合條件的農場資料，請嘗試其他篩選條件。</p>
          </div>
        </div>

        <!-- 統計資訊 -->
        <div v-if="farms.length > 0" class="row mt-4">
          <div class="col-12">
            <div class="alert alert-success" role="alert">
              <h5 class="alert-heading">統計資訊</h5>
              <p class="mb-0">共找到 <strong>{{ farms.length }}</strong> 筆農場資料</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAccessibleFarms, getFarmsByCounty } from '@/services/api.js'

export default {
  name: 'AccessibleFarmList',
  setup() {
    const farms = ref([])
    const loading = ref(false)
    const error = ref('')
    const selectedCounty = ref('')

    // 載入農場資料
    const loadFarms = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const response = await getAccessibleFarms()
        if (response.success) {
          farms.value = response.data
          console.log('✅ 載入農場資料成功:', farms.value.length, '筆')
        } else {
          error.value = response.message || '載入資料失敗'
          console.error('❌ 載入農場資料失敗:', response.message)
        }
      } catch (err) {
        error.value = '網路連線錯誤'
        console.error('❌ 載入農場資料錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    // 篩選農場
    const filterFarms = async () => {
      if (!selectedCounty.value) {
        await loadFarms()
        return
      }

      loading.value = true
      error.value = ''
      
      try {
        const response = await getFarmsByCounty(selectedCounty.value)
        if (response.success) {
          farms.value = response.data
          console.log('✅ 篩選農場資料成功:', farms.value.length, '筆')
        } else {
          error.value = response.message || '篩選資料失敗'
          console.error('❌ 篩選農場資料失敗:', response.message)
        }
      } catch (err) {
        error.value = '篩選資料錯誤'
        console.error('❌ 篩選農場資料錯誤:', err)
      } finally {
        loading.value = false
      }
    }

    // 重置篩選
    const resetFilter = () => {
      selectedCounty.value = ''
      loadFarms()
    }

    // 組件掛載時載入資料
    onMounted(() => {
      loadFarms()
    })

    return {
      farms,
      loading,
      error,
      selectedCounty,
      filterFarms,
      resetFilter,
      loadFarms
    }
  }
}
</script>

<style scoped>
.accessible-farm-list {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.farm-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.farm-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.location-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.filter-section .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.badge {
  font-size: 0.8rem;
}
</style>