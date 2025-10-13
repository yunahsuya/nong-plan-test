import axios from 'axios'

// 建立農業部 API 客戶端
const moaApi = axios.create({
  baseURL: 'https://data.moa.gov.tw/Service/OpenData',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'NongPlan-Backend/1.0'
  }
})

// 使用 localStorage 作為快取（瀏覽器兼容）
const CACHE_PREFIX = 'moa_cache_'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24小時

const readCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    if (now - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    
    return data
  } catch {
    return null
  }
}

const writeCache = (key, data) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.warn('快取寫入失敗:', error)
  }
}

// 通用API呼叫函數
const fetchFromMOA = async (endpoint, params = {}) => {
  try {
    console.log(`🌐 正在呼叫農業部 API: ${endpoint}`)
    
    const response = await moaApi.get(endpoint, { params })
    
    if (!Array.isArray(response.data)) {
      throw new Error('農業部 API 回應格式不正確')
    }
    
    console.log(`✅ 農業部 API 回應成功: ${response.data.length} 筆資料`)
    return response.data
  } catch (error) {
    console.error(`❌ 農業部 API 呼叫失敗: ${endpoint}`, error)
    throw error
  }
}

// ==================== 農場相關 API ====================

// 1. 提供無障礙設施之休閒農業區及休閒農場
export const fetchAccessibleFarms = async (forceRefresh = false) => {
  const cacheKey = 'accessible-farms'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('ODwsv/ODwsvAccessibleFarm.aspx', {
      IsTransData: 1,
      UnitId: 241
    })
    
    const cleanedData = rawData.map(farm => ({
      id: `farm-${farm.FarmNm_CH}-${farm.County}`.replace(/\s+/g, '-'),
      name: farm.FarmNm_CH,
      tel: farm.TEL,
      fax: farm.FAX,
      postalCode: farm.PCode,
      county: farm.County,
      township: farm.Township,
      address: farm.Address_CH,
      website: farm.WebURL,
      coordinates: {
        longitude: parseFloat(farm.Longitude),
        latitude: parseFloat(farm.Latitude)
      },
      accessibleFeatures: farm.AccessibleItem?.split('、') || [],
      category: '農場',
      tags: ['無障礙農場', '休閒農業']
    })).filter(farm => farm.name && farm.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// 2. 農業體驗戶外教育休閒農場
export const fetchEducationalFarms = async (forceRefresh = false) => {
  const cacheKey = 'educational-farms'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('ODwsv/ODwsvOutdoorEdu.aspx', {
      IsTransData: 1,
      UnitId: 242
    })
    
    const cleanedData = rawData.map(farm => ({
      id: `edu-farm-${farm.Name}-${farm.County}`.replace(/\s+/g, '-'),
      name: farm.Name,
      tel: farm.Tel,
      county: farm.County,
      address: farm.Address,
      website: farm.Website,
      coordinates: {
        longitude: parseFloat(farm.Longitude),
        latitude: parseFloat(farm.Latitude)
      },
      category: '農場',
      tags: ['教育農場', '戶外教學', '農業體驗']
    })).filter(farm => farm.name && farm.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 步道、老街相關 API ====================

// 3. 擁抱田園風光-農村旅遊資訊（包含步道、老街）
export const fetchRuralTourism = async (forceRefresh = false) => {
  const cacheKey = 'rural-tourism'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('ODwsv/ODwsvMovingRoad.aspx', {
      IsTransData: 1,
      UnitId: 195
    })
    
    const cleanedData = rawData.map(item => ({
      id: `rural-${item.Name}-${item.County}`.replace(/\s+/g, '-'),
      name: item.Name,
      tel: item.Tel,
      county: item.County,
      address: item.Address,
      website: item.Website,
      coordinates: {
        longitude: parseFloat(item.Longitude),
        latitude: parseFloat(item.Latitude)
      },
      category: item.Type === '步道' ? '步道' : '老街',
      tags: ['農村旅遊', item.Type]
    })).filter(item => item.name && item.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 市集相關 API ====================

// 4. 農民學院找通路（市集）
export const fetchFarmerMarkets = async (forceRefresh = false) => {
  const cacheKey = 'farmer-markets'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('MarketUnitData.aspx', {
      IsTransData: 1,
      UnitId: 178
    })
    
    const cleanedData = rawData.map(market => ({
      id: `market-${market.name?.replace(/\s+/g, '-') || 'unknown'}`,
      name: market.name || '未知市集',
      product: market.product || '',
      verify_marker: market.verify_marker || '',
      rules: market.rules || '',
      category: '市集',
      tags: ['農民市集', '農產品', '通路'],
      // 根據 verify_marker 生成標籤
      certificationTags: market.verify_marker ? market.verify_marker.split(',') : []
    })).filter(market => market.name && market.name !== '未知市集')
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 美食相關 API ====================

// 5. 農村地方美食小吃特色料理
export const fetchRuralFood = async (forceRefresh = false) => {
  const cacheKey = 'rural-food'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('ODwsv/ODwsvTravelFood.aspx', {
      IsTransData: 1,
      UnitId: 193
    })
    
    const cleanedData = rawData.map(food => ({
      id: `food-${food.Name}-${food.County}`.replace(/\s+/g, '-'),
      name: food.Name,
      tel: food.Tel,
      county: food.County,
      address: food.Address,
      website: food.Website,
      hours: food.Hours,
      coordinates: {
        longitude: parseFloat(food.Longitude),
        latitude: parseFloat(food.Latitude)
      },
      category: '美食',
      tags: ['農村美食', '特色料理', '在地小吃']
    })).filter(food => food.name && food.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 伴手禮相關 API ====================

// 6. 推薦農村優良伴手禮
export const fetchRuralSouvenirs = async (forceRefresh = false) => {
  const cacheKey = 'rural-souvenirs'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('ODwsv/ODwsvAgriculturalProduce.aspx', {
      IsTransData: 1,
      UnitId: 197
    })
    
    const cleanedData = rawData.map(item => ({
      id: `souvenir-${item.Name}-${item.County}`.replace(/\s+/g, '-'),
      name: item.Name,
      tel: item.Tel,
      county: item.County,
      address: item.Address,
      website: item.Website,
      coordinates: {
        longitude: parseFloat(item.Longitude),
        latitude: parseFloat(item.Latitude)
      },
      category: '伴手禮',
      tags: ['農村伴手禮', '優良產品']
    })).filter(item => item.name && item.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// 7. 農漁會年度百大農業精品好禮
export const fetchAgriBestItems = async (forceRefresh = false) => {
  const cacheKey = 'agri-best-items'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('ODwsv/ODwsvAgriBestItem.aspx', {
      IsTransData: 1,
      UnitId: 375
    })
    
    const cleanedData = rawData.map(item => ({
      id: `best-item-${item.Name}-${item.County}`.replace(/\s+/g, '-'),
      name: item.Name,
      tel: item.Tel,
      county: item.County,
      address: item.Address,
      website: item.Website,
      coordinates: {
        longitude: parseFloat(item.Longitude),
        latitude: parseFloat(item.Latitude)
      },
      category: '伴手禮',
      tags: ['百大精品', '農漁會', '優質伴手禮']
    })).filter(item => item.name && item.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// 8. 農民學院找產品
export const fetchMemberProducts = async (forceRefresh = false) => {
  const cacheKey = 'member-products'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('MemberProductData.aspx', {
      IsTransData: 1,
      UnitId: 173
    })
    
    const cleanedData = rawData.map(product => ({
      id: `product-${product.Name}-${product.County}`.replace(/\s+/g, '-'),
      name: product.Name,
      tel: product.Tel,
      county: product.County,
      address: product.Address,
      website: product.Website,
      coordinates: {
        longitude: parseFloat(product.Longitude),
        latitude: parseFloat(product.Latitude)
      },
      category: '伴手禮',
      tags: ['農民產品', '在地農產']
    })).filter(product => product.name && product.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 停車場 API ====================


// 9. 農科園區停車場一覽表
export const fetchParkingLots = async (forceRefresh = false) => {
  const cacheKey = 'parking-lots'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('DataFileService.aspx', {
      UnitId: 885,
      IsTransData: 1
    })
    
    // 根據實際 API 回應格式調整
    const cleanedData = rawData.map(parking => ({
      項次: parking.項次,
      地點: parking.地點,
      停車格數量: parking.停車格數量
    }))
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 廁所 API ====================


// 10. 農科園區公共廁所一覽表
export const fetchPublicToilets = async (forceRefresh = false) => {
  const cacheKey = 'public-toilets'
  
  if (!forceRefresh) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
  }
  
  try {
    const rawData = await fetchFromMOA('DataFileService.aspx', {
      UnitId: 886,
      IsTransData: 1
    })
    
    const cleanedData = rawData.map(toilet => ({
      id: `toilet-${toilet.Name}-${toilet.County}`.replace(/\s+/g, '-'),
      name: toilet.Name,
      tel: toilet.Tel,
      county: toilet.County,
      address: toilet.Address,
      coordinates: {
        longitude: parseFloat(toilet.Longitude),
        latitude: parseFloat(toilet.Latitude)
      },
      category: '廁所',
      tags: ['農科園區', '公共廁所'],
      accessibleFeatures: ['無障礙廁所']
    })).filter(toilet => toilet.name && toilet.address)
    
    await writeCache(cacheKey, cleanedData)
    return cleanedData
  } catch (error) {
    const cachedData = await readCache(cacheKey)
    if (cachedData) return cachedData
    throw error
  }
}

// ==================== 通用函數 ====================

// 根據分類獲取資料
export const fetchDataByCategory = async (category, forceRefresh = false) => {
  const categoryMap = {
    'farms': async () => {
      const [accessibleFarms, educationalFarms] = await Promise.all([
        fetchAccessibleFarms(forceRefresh),
        fetchEducationalFarms(forceRefresh)
      ])
      return [...accessibleFarms, ...educationalFarms]
    },
    'trails': async () => {
      const ruralTourism = await fetchRuralTourism(forceRefresh)
      return ruralTourism.filter(item => item.category === '步道')
    },
    'old-streets': async () => {
      const ruralTourism = await fetchRuralTourism(forceRefresh)
      return ruralTourism.filter(item => item.category === '老街')
    },
    'markets': async () => {
      return await fetchFarmerMarkets(forceRefresh)
    },
    'food': async () => {
      return await fetchRuralFood(forceRefresh)
    },
    'souvenirs': async () => {
      const [ruralSouvenirs, agriBestItems, memberProducts] = await Promise.all([
        fetchRuralSouvenirs(forceRefresh),
        fetchAgriBestItems(forceRefresh),
        fetchMemberProducts(forceRefresh)
      ])
      return [...ruralSouvenirs, ...agriBestItems, ...memberProducts]
    },
    'parking': async () => {
      return await fetchParkingLots(forceRefresh)
    },
    'toilets': async () => {
      return await fetchPublicToilets(forceRefresh)
    }
  }
  
  if (!categoryMap[category]) {
    throw new Error(`不支援的分類: ${category}`)
  }
  
  return await categoryMap[category]()
}

// 清除所有快取
export const clearAllCache = async () => {
  const cacheKeys = [
    'accessible-farms', 'educational-farms', 'rural-tourism',
    'farmer-markets', 'rural-food', 'rural-souvenirs',
    'agri-best-items', 'member-products', 'parking-lots', 'public-toilets'
  ]
  
  for (const key of cacheKeys) {
    await writeCache(key, null)
  }
  
  console.log('✅ 已清除所有快取')
}

// 向後相容性 - 保留原有的函數名稱
export const fetchFarmsFromMOA = fetchAccessibleFarms
export const filterFarmsByCounty = async (county, forceRefresh = false) => {
  const allFarms = await fetchAccessibleFarms(forceRefresh)
  return allFarms.filter(farm => 
    farm.county === county || 
    farm.address?.includes(county)
  )
}
export const refreshCache = clearAllCache