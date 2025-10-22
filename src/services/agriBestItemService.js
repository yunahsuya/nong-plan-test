// services/agriBestItemService.js
import axios from 'axios'

// 建立 API 客戶端
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
  },
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
  },
)

// 取得所有農漁會年度百大農業精品好禮
export const getAgriBestItems = async (
  forceRefresh = false,
  page = 1,
  limit = 12,
  keyword = '',
  county = '',
  type = '',
) => {
  try {
    const params = new URLSearchParams()
    if (forceRefresh) params.append('refresh', 'true')
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (keyword) params.append('keyword', keyword)
    if (county) params.append('county', county)
    if (type) params.append('type', type)

    const url = `/api/agri-best-items?${params.toString()}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message,
      cached: response.data.cached,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得農漁會年度百大農業精品好禮資料失敗',
      error: error.message,
    }
  }
}

// 根據縣市篩選
export const getAgriBestItemsByCounty = async (county, forceRefresh = false) => {
  try {
    const url = forceRefresh
      ? `/api/agri-best-items/county/${encodeURIComponent(county)}?refresh=true`
      : `/api/agri-best-items/county/${encodeURIComponent(county)}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農漁會年度百大農業精品好禮資料失敗',
      error: error.message,
    }
  }
}

// 根據類型篩選
export const getAgriBestItemsByType = async (type, forceRefresh = false) => {
  try {
    const url = forceRefresh
      ? `/api/agri-best-items/type/${encodeURIComponent(type)}?refresh=true`
      : `/api/agri-best-items/type/${encodeURIComponent(type)}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農漁會年度百大農業精品好禮資料失敗',
      error: error.message,
    }
  }
}

// 搜尋
export const searchAgriBestItems = async (keyword) => {
  try {
    const response = await api.get(
      `/api/agri-best-items/search?keyword=${encodeURIComponent(keyword)}`,
    )
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '搜尋農漁會年度百大農業精品好禮失敗',
      error: error.message,
    }
  }
}

// 取得縣市列表
export const getAgriBestItemCounties = async () => {
  try {
    const response = await api.get('/api/agri-best-items/counties')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得縣市列表失敗',
      error: error.message,
    }
  }
}

// 取得類型列表
export const getAgriBestItemTypes = async () => {
  try {
    const response = await api.get('/api/agri-best-items/types')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得類型列表失敗',
      error: error.message,
    }
  }
}

// 取得統計資料
export const getAgriBestItemStatistics = async () => {
  try {
    const response = await api.get('/api/agri-best-items/statistics')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得統計資料失敗',
      error: error.message,
    }
  }
}

// 清除快取
export const clearAgriBestItemCache = async () => {
  try {
    const response = await api.delete('/api/agri-best-items/cache')
    return {
      success: true,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '清除快取失敗',
      error: error.message,
    }
  }
}

// 取得快取狀態
export const getAgriBestItemCacheStatus = async () => {
  try {
    const response = await api.get('/api/agri-best-items/cache/status')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得快取狀態失敗',
      error: error.message,
    }
  }
}

export default {
  getAgriBestItems,
  getAgriBestItemsByCounty,
  getAgriBestItemsByType,
  searchAgriBestItems,
  getAgriBestItemCounties,
  getAgriBestItemTypes,
  getAgriBestItemStatistics,
  clearAgriBestItemCache,
  getAgriBestItemCacheStatus,
}
