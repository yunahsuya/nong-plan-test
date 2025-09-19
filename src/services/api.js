import axios from 'axios'

// 建立 API 客戶端
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API 請求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ 請求錯誤:', error)
    return Promise.reject(error)
  }
)

// 回應攔截器
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API 回應: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ 回應錯誤:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

// 取得所有無障礙休閒農場
export const getAccessibleFarms = async () => {
  try {
    const response = await api.get('/api/accessible-farms')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得農場資料失敗',
      error: error.message
    }
  }
}

// 根據縣市篩選農場
export const getFarmsByCounty = async (county) => {
  try {
    const response = await api.get(`/api/accessible-farms/${encodeURIComponent(county)}`)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農場資料失敗',
      error: error.message
    }
  }
}

export default { api, getAccessibleFarms, getFarmsByCounty }