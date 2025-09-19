import axios from 'axios'
import { readCache, writeCache, isCacheValid } from './cacheService.js'

// 建立農業部 API 客戶端
const moaApi = axios.create({
  baseURL: 'https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvAccessibleFarm.aspx',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'NongPlan-Backend/1.0'
  }
})

// 從農業部 API 取得原始資料
const fetchRawDataFromMOA = async () => {
  console.log('🌐 正在呼叫農業部 API...')
  
  const response = await moaApi.get('', {
    params: {
      IsTransData: 1,
      UnitId: 241
    }
  })
  
  if (!Array.isArray(response.data)) {
    throw new Error('農業部 API 回應格式不正確')
  }
  
  console.log('✅ 農業部 API 回應成功:', response.data.length, '筆原始資料')
  return response.data
}

// 資料清理和轉換
const cleanAndTransformData = (rawData) => {
  return rawData.map(farm => ({
    id: `${farm.County}-${farm.FarmNm_CH}`.replace(/\s+/g, '-'),
    name: farm.FarmNm_CH,
    tel: farm.TEL,
    fax: farm.FAX,
    postalCode: farm.PCode,
    county: farm.County,
    township: farm.Township,
    address: {
      chinese: farm.Address_CH,
      english: farm.Address_EN
    },
    website: farm.WebURL,
    coordinates: {
      longitude: parseFloat(farm.Longitude),
      latitude: parseFloat(farm.Latitude)
    },
    accessibleItems: farm.AccessibleItem?.split('、') || []
  })).filter(farm => farm.name && farm.address.chinese)
}

// 主要取得農場資料函數（含快取）
export const fetchFarmsFromMOA = async (forceRefresh = false) => {
  try {
    // 如果強制重新整理，直接呼叫 API
    if (forceRefresh) {
      console.log('�� 強制重新整理，跳過快取')
      const rawData = await fetchRawDataFromMOA()
      const cleanedData = cleanAndTransformData(rawData)
      await writeCache(cleanedData)
      return cleanedData
    }
    
    // 檢查快取是否有效
    const cachedData = await readCache()
    if (cachedData) {
      return cachedData
    }
    
    // 快取無效，從 API 取得資料
    console.log('📡 快取無效，從農業部 API 取得資料')
    const rawData = await fetchRawDataFromMOA()
    const cleanedData = cleanAndTransformData(rawData)
    
    // 儲存到快取
    await writeCache(cleanedData)
    
    return cleanedData
  } catch (error) {
    // 如果 API 呼叫失敗，嘗試使用舊的快取資料
    console.log('⚠️ API 呼叫失敗，嘗試使用快取資料')
    const cachedData = await readCache()
    
    if (cachedData) {
      console.log('✅ 使用快取資料作為備援')
      return cachedData
    }
    
    // 重新拋出錯誤
    if (error.code === 'ECONNABORTED') {
      throw new Error('農業部服務回應超時，請稍後再試')
    } else if (error.response) {
      throw new Error(`農業部服務錯誤: ${error.response.status} ${error.response.statusText}`)
    } else {
      throw new Error(`無法連接農業部服務: ${error.message}`)
    }
  }
}

// 根據縣市篩選農場
export const filterFarmsByCounty = async (county, forceRefresh = false) => {
  try {
    const allFarms = await fetchFarmsFromMOA(forceRefresh)
    
    const filteredFarms = allFarms.filter(farm => 
      farm.county === county || 
      farm.township?.includes(county) ||
      farm.address.chinese?.includes(county)
    )
    
    return filteredFarms
  } catch (error) {
    throw error
  }
}

// 清除快取並重新取得資料
export const refreshCache = async () => {
  console.log('�� 清除快取並重新取得資料')
  return await fetchFarmsFromMOA(true)
}