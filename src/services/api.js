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

// ==================== 農場相關 API ====================

// 取得所有無障礙休閒農場
export const getAccessibleFarms = async (forceRefresh = false) => {
  try {
    const url = forceRefresh ? '/api/accessible-farms?refresh=true' : '/api/accessible-farms'
    const response = await api.get(url)
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
export const getFarmsByCounty = async (county, forceRefresh = false) => {
  try {
    const url = forceRefresh 
      ? `/api/accessible-farms/${encodeURIComponent(county)}?refresh=true` 
      : `/api/accessible-farms/${encodeURIComponent(county)}`
    const response = await api.get(url)
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

// 取得快取狀態
export const getCacheStatus = async () => {
  try {
    const response = await api.get('/api/cache/status')
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

// 清除快取
export const clearCache = async () => {
  try {
    const response = await api.delete('/api/cache')
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

// 重新整理快取
export const refreshCache = async () => {
  try {
    const response = await api.post('/api/cache/refresh')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '重新整理快取失敗',
      error: error.message
    }
  }
}

// ==================== 其他 API（暫時保留） ====================

// 取得教育農場
export const getEducationalFarms = async () => {
  try {
    const response = await api.get('/api/educational-farms')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得教育農場資料失敗',
      error: error.message
    }
  }
}

// 取得農村旅遊資訊（步道、老街）
export const getRuralTourism = async () => {
  try {
    const response = await api.get('/api/rural-tourism')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得農村旅遊資料失敗',
      error: error.message
    }
  }
}

// 取得步道資料
export const getTrails = async () => {
  try {
    const response = await api.get('/api/trails')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得步道資料失敗',
      error: error.message
    }
  }
}

// 取得老街資料
export const getOldStreets = async () => {
  try {
    const response = await api.get('/api/old-streets')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得老街資料失敗',
      error: error.message
    }
  }
}

// 取得農民市集
export const getFarmerMarkets = async () => {
  try {
    const response = await api.get('/api/farmer-markets')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得市集資料失敗',
      error: error.message
    }
  }
}

// 取得農村美食
export const getRuralFood = async () => {
  try {
    const response = await api.get('/api/rural-food')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得美食資料失敗',
      error: error.message
    }
  }
}

// 取得農村伴手禮
export const getRuralSouvenirs = async () => {
  try {
    const response = await api.get('/api/rural-souvenirs')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得伴手禮資料失敗',
      error: error.message
    }
  }
}

// 取得百大精品
export const getAgriBestItems = async () => {
  try {
    const response = await api.get('/api/agri-best-items')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得百大精品資料失敗',
      error: error.message
    }
  }
}

// 取得農民產品
export const getMemberProducts = async () => {
  try {
    const response = await api.get('/api/member-products')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得農民產品資料失敗',
      error: error.message
    }
  }
}

// 取得停車場資料
export const getParkingLots = async () => {
  try {
    const response = await api.get('/api/parking-lots')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得停車場資料失敗',
      error: error.message
    }
  }
}

// 取得公共廁所資料
export const getPublicToilets = async () => {
  try {
    const response = await api.get('/api/public-toilets')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得廁所資料失敗',
      error: error.message
    }
  }
}

// ==================== 通用搜尋API ====================

// 通用搜尋API
export const searchTourismData = async (category, filters = {}) => {
  try {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/api/${category}/search?${params}`)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '搜尋失敗',
      error: error.message
    }
  }
}

// 根據分類獲取資料的通用函數
export const fetchDataByCategory = async (category, forceRefresh = false) => {
  const categoryMap = {
    'farms': async () => {
      const result = await getAccessibleFarms(forceRefresh)
      return result.success ? result.data : []
    },
    'trails': async () => {
      const trails = await getTrails()
      return trails.success ? trails.data : []
    },
    'old-streets': async () => {
      const oldStreets = await getOldStreets()
      return oldStreets.success ? oldStreets.data : []
    },
    'markets': async () => {
      const markets = await getFarmerMarkets()
      return markets.success ? markets.data : []
    },
    'food': async () => {
      const food = await getRuralFood()
      return food.success ? food.data : []
    },
    'souvenirs': async () => {
      const [ruralSouvenirs, agriBestItems, memberProducts] = await Promise.all([
        getRuralSouvenirs(),
        getAgriBestItems(),
        getMemberProducts()
      ])
      
      const allSouvenirs = []
      if (ruralSouvenirs.success) allSouvenirs.push(...ruralSouvenirs.data)
      if (agriBestItems.success) allSouvenirs.push(...agriBestItems.data)
      if (memberProducts.success) allSouvenirs.push(...memberProducts.data)
      
      return allSouvenirs
    },
    'parking': async () => {
      const parking = await getParkingLots()
      return parking.success ? parking.data : []
    },
    'toilets': async () => {
      const toilets = await getPublicToilets()
      return toilets.success ? toilets.data : []
    }
  }
  
  if (!categoryMap[category]) {
    throw new Error(`不支援的分類: ${category}`)
  }
  
  return await categoryMap[category]()
}

// ==================== 健康檢查 API ====================

// 健康檢查
export const healthCheck = async () => {
  try {
    const response = await api.get('/')
    return {
      success: true,
      data: response.data,
      message: '服務正常'
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '服務異常',
      error: error.message
    }
  }
}

// ==================== 批次操作 API ====================

// 批次取得多個分類資料
export const batchFetchData = async (categories, forceRefresh = false) => {
  try {
    const promises = categories.map(category => 
      fetchDataByCategory(category, forceRefresh)
    )
    
    const results = await Promise.allSettled(promises)
    
    const data = {}
    const errors = {}
    
    results.forEach((result, index) => {
      const category = categories[index]
      if (result.status === 'fulfilled') {
        data[category] = result.value
      } else {
        errors[category] = result.reason.message
      }
    })
    
    return {
      success: Object.keys(errors).length === 0,
      data,
      errors,
      message: Object.keys(errors).length === 0 ? '批次載入成功' : '部分資料載入失敗'
    }
  } catch (error) {
    return {
      success: false,
      message: '批次載入失敗',
      error: error.message
    }
  }
}

// ==================== 統計分析 API ====================

// 取得農場統計資料
export const getFarmStatistics = async () => {
  try {
    const farms = await getAccessibleFarms()
    if (!farms.success) {
      throw new Error(farms.message)
    }
    
    const statistics = {
      total: farms.data.length,
      byCounty: {},
      byAccessibleItems: {},
      withWebsite: 0,
      withCoordinates: 0
    }
    
    farms.data.forEach(farm => {
      // 按縣市統計
      const county = farm.countyName || farm.county || '未知'
      statistics.byCounty[county] = (statistics.byCounty[county] || 0) + 1
      
      // 按無障礙設施統計
      if (farm.accessibleItems && farm.accessibleItems.length > 0) {
        farm.accessibleItems.forEach(item => {
          statistics.byAccessibleItems[item] = (statistics.byAccessibleItems[item] || 0) + 1
        })
      }
      
      // 有網站的農場
      if (farm.website) {
        statistics.withWebsite++
      }
      
      // 有座標的農場
      if (farm.coordinates && farm.coordinates.latitude && farm.coordinates.longitude) {
        statistics.withCoordinates++
      }
    })
    
    return {
      success: true,
      data: statistics,
      message: '統計資料載入成功'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || '統計資料載入失敗',
      error: error.message
    }
  }
}

// ==================== 匯出功能 ====================

// 匯出農場資料為 CSV
export const exportFarmsToCSV = async (filters = {}) => {
  try {
    const farms = await getAccessibleFarms()
    if (!farms.success) {
      throw new Error(farms.message)
    }
    
    let filteredFarms = farms.data
    
    // 應用篩選條件
    if (filters.county) {
      filteredFarms = filteredFarms.filter(farm => 
        (farm.countyName || farm.county || '').includes(filters.county)
      )
    }
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      filteredFarms = filteredFarms.filter(farm => 
        farm.name?.toLowerCase().includes(keyword) ||
        (farm.address?.chinese || farm.address || '').toLowerCase().includes(keyword)
      )
    }
    
    // 轉換為 CSV 格式
    const csvHeaders = [
      '農場名稱',
      '縣市',
      '鄉鎮',
      '地址',
      '電話',
      '網站',
      '經度',
      '緯度',
      '無障礙設施'
    ]
    
    const csvRows = filteredFarms.map(farm => [
      farm.name || '',
      farm.countyName || farm.county || '',
      farm.township || '',
      farm.address?.chinese || farm.address || '',
      farm.tel || '',
      farm.website || '',
      farm.coordinates?.longitude || '',
      farm.coordinates?.latitude || '',
      (farm.accessibleItems || []).join('、')
    ])
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    return {
      success: true,
      data: {
        content: csvContent,
        filename: `無障礙農場資料_${new Date().toISOString().split('T')[0]}.csv`,
        count: filteredFarms.length
      },
      message: `成功匯出 ${filteredFarms.length} 筆農場資料`
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || '匯出失敗',
      error: error.message
    }
  }
}


// ==================== 教育資源 API ====================

// 取得教育資源分類
export const getEducationCategories = async () => {
  try {
    const response = await api.get('/api/education/categories')
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '取得教育資源分類失敗',
      error: error.message
    }
  }
}

// 取得特定分類的教育資源資料
export const getEducationData = async (category, forceRefresh = false) => {
  try {
    const url = forceRefresh 
      ? `/api/education/data/${category}?refresh=true` 
      : `/api/education/data/${category}`
    const response = await api.get(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || `取得 ${category} 教育資源資料失敗`,
      error: error.message
    }
  }
}

// 清除教育資源快取
export const clearEducationCache = async () => {
  try {
    const response = await api.delete('/api/education/cache')
    return {
      success: true,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '清除教育資源快取失敗',
      error: error.message
    }
  }
}

// 重新整理教育資源快取
export const refreshEducationCache = async (category = null) => {
  try {
    const url = category 
      ? `/api/education/cache/refresh/${category}` 
      : '/api/education/cache/refresh'
    const response = await api.post(url)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '重新整理教育資源快取失敗',
      error: error.message
    }
  }
}

// ==================== 預設匯出 ====================

export default { 
  api, 
  getAccessibleFarms, 
  getFarmsByCounty,
  getCacheStatus,
  clearCache,
  refreshCache,
  getEducationalFarms,
  getRuralTourism,
  getTrails,
  getOldStreets,
  getFarmerMarkets,
  getRuralFood,
  getRuralSouvenirs,
  getAgriBestItems,
  getMemberProducts,
  getParkingLots,
  getPublicToilets,
  searchTourismData,
  fetchDataByCategory,
  healthCheck,
  batchFetchData,
  getFarmStatistics,
  exportFarmsToCSV,

  // 新增教育資源 API
  getEducationCategories,
  getEducationData,
  clearEducationCache,
  refreshEducationCache
}