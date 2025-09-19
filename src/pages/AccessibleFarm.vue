<template>
  <div class="accessible-farm-list">
    <h2>無障礙休閒農場</h2>
    
    <!-- 篩選器 -->
    <div class="filters mb-4">
      <select v-model="selectedCounty" @change="filterFarms" class="form-select">
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

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- 農場列表 -->
    <div v-if="farms.length > 0" class="row">
      <div v-for="farm in farms" :key="farm.FarmNm_CH" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ farm.FarmNm_CH }}</h5>
            <p class="card-text">
              <strong>地址：</strong>{{ farm.Address_CH }}<br>
              <strong>電話：</strong>{{ farm.TEL }}<br>
              <strong>無障礙設施：</strong>{{ farm.AccessibleItem }}
            </p>
            <div v-if="farm.WebURL" class="mb-3">
              <a :href="farm.WebURL" target="_blank" class="btn btn-primary btn-sm">
                官方網站
              </a>
            </div>
            <div class="location-info">
              <small class="text-muted">
                經度: {{ farm.Longitude }}, 緯度: {{ farm.Latitude }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 無資料 -->
    <div v-if="!loading && !error && farms.length === 0" class="alert alert-info">
      找不到符合條件的農場
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
        } else {
          error.value = response.message || '載入資料失敗'
        }
      } catch (err) {
        error.value = '網路連線錯誤'
        console.error('載入農場資料錯誤:', err)
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
        } else {
          error.value = response.message || '篩選資料失敗'
        }
      } catch (err) {
        error.value = '篩選資料錯誤'
        console.error('篩選農場資料錯誤:', err)
      } finally {
        loading.value = false
      }
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
      filterFarms
    }
  }
}
</script>

<style scoped>
.accessible-farm-list {
  padding: 20px;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.location-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>