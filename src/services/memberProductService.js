// services/memberProductService.js
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

// 取得所有農民學院找產品
export const getMemberProducts = async (forceRefresh = false, page = 1, limit = 12, keyword = '', member = '', crop = '', verifyMarker = '') => {
  try {
    const params = new URLSearchParams()
    if (forceRefresh) params.append('refresh', 'true')
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (keyword) params.append('keyword', keyword)
    if (member) params.append('member', member)
    if (crop) params.append('crop', crop)
    if (verifyMarker) params.append('verifyMarker', verifyMarker)
    
    const url = `/api/education/member-product?${params.toString()}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message,
      cached: response.data.cached
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得農民學院找產品資料失敗',
      error: error.message
    }
  }
}

// 根據農民姓名篩選
export const getMemberProductsByMember = async (member, forceRefresh = false) => {
  try {
    const url = forceRefresh 
      ? `/api/education/member-product/member/${encodeURIComponent(member)}?refresh=true` 
      : `/api/education/member-product/member/${encodeURIComponent(member)}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農民學院找產品資料失敗',
      error: error.message
    }
  }
}

// 根據作物篩選
export const getMemberProductsByCrop = async (crop, forceRefresh = false) => {
  try {
    const url = forceRefresh 
      ? `/api/education/member-product/crop/${encodeURIComponent(crop)}?refresh=true` 
      : `/api/education/member-product/crop/${encodeURIComponent(crop)}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農民學院找產品資料失敗',
      error: error.message
    }
  }
}

// 根據驗證標章篩選
export const getMemberProductsByVerifyMarker = async (verifyMarker, forceRefresh = false) => {
  try {
    const url = forceRefresh 
      ? `/api/education/member-product/verify-marker/${encodeURIComponent(verifyMarker)}?refresh=true` 
      : `/api/education/member-product/verify-marker/${encodeURIComponent(verifyMarker)}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農民學院找產品資料失敗',
      error: error.message
    }
  }
}

// 根據分類篩選
export const getMemberProductsByCategory = async (category, forceRefresh = false) => {
  try {
    const url = forceRefresh 
      ? `/api/education/member-product/category/${encodeURIComponent(category)}?refresh=true` 
      : `/api/education/member-product/category/${encodeURIComponent(category)}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '篩選農民學院找產品資料失敗',
      error: error.message
    }
  }
}

// 搜尋
export const searchMemberProducts = async (keyword) => {
  try {
    const response = await api.get(`/api/education/member-product/search?keyword=${encodeURIComponent(keyword)}`)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '搜尋農民學院找產品失敗',
      error: error.message
    }
  }
}

// 取得農民列表
export const getMembers = async () => {
  try {
    const response = await api.get('/api/education/member-product/members')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得農民列表失敗',
      error: error.message
    }
  }
}

// 取得作物列表
export const getCrops = async () => {
  try {
    const response = await api.get('/api/education/member-product/crops')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得作物列表失敗',
      error: error.message
    }
  }
}

// 取得驗證標章列表
export const getVerifyMarkers = async () => {
  try {
    const response = await api.get('/api/education/member-product/verify-markers')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得驗證標章列表失敗',
      error: error.message
    }
  }
}

// 取得分類列表
export const getCategories = async () => {
  try {
    const response = await api.get('/api/education/member-product/categories')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得分類列表失敗',
      error: error.message
    }
  }
}

// 取得統計資料
export const getStatistics = async () => {
  try {
    const response = await api.get('/api/education/member-product/statistics')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得統計資料失敗',
      error: error.message
    }
  }
}

// 清除快取
export const clearCache = async () => {
  try {
    const response = await api.delete('/api/education/member-product/cache')
    return {
      success: true,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '清除快取失敗',
      error: error.message
    }
  }
}

// 取得快取狀態
export const getCacheStatus = async () => {
  try {
    const response = await api.get('/api/education/member-product/cache/status')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得快取狀態失敗',
      error: error.message
    }
  }
}

export default {
  getMemberProducts,
  getMemberProductsByMember,
  getMemberProductsByCrop,
  getMemberProductsByVerifyMarker,
  getMemberProductsByCategory,
  searchMemberProducts,
  getMembers,
  getCrops,
  getVerifyMarkers,
  getCategories,
  getStatistics,
  clearCache,
  getCacheStatus
}