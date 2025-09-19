import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 快取檔案路徑 - 指向後端專案的 cache 目錄
const CACHE_DIR = path.join(__dirname, '..', '..', '..', 'nong-plan-back', 'cache')
const FARMS_CACHE_FILE = path.join(CACHE_DIR, 'farms.json')
const CONFIG_FILE = path.join(CACHE_DIR, 'cache-config.json')

// 預設快取設定
const DEFAULT_CONFIG = {
  enabled: true,
  ttl: 24 * 60 * 60 * 1000, // 24小時 (毫秒)
  maxRetries: 3,
  lastUpdate: null
}

// 確保快取目錄存在
const ensureCacheDir = async () => {
  try {
    await fs.access(CACHE_DIR)
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true })
    console.log('📁 建立快取目錄:', CACHE_DIR)
  }
}

// 讀取快取設定
export const getCacheConfig = async () => {
  try {
    await ensureCacheDir()
    const configData = await fs.readFile(CONFIG_FILE, 'utf-8')
    return { ...DEFAULT_CONFIG, ...JSON.parse(configData) }
  } catch {
    // 如果檔案不存在，建立預設設定
    await saveCacheConfig(DEFAULT_CONFIG)
    return DEFAULT_CONFIG
  }
}

// 儲存快取設定
export const saveCacheConfig = async (config) => {
  try {
    await ensureCacheDir()
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
  } catch (error) {
    console.error('❌ 儲存快取設定失敗:', error)
  }
}

// 檢查快取是否有效
export const isCacheValid = async () => {
  try {
    const config = await getCacheConfig()
    
    if (!config.enabled) {
      return false
    }
    
    if (!config.lastUpdate) {
      return false
    }
    
    const now = new Date().getTime()
    const lastUpdate = new Date(config.lastUpdate).getTime()
    
    return (now - lastUpdate) < config.ttl
  } catch {
    return false
  }
}

// 讀取快取資料
export const readCache = async () => {
  try {
    if (!(await isCacheValid())) {
      console.log('⏰ 快取已過期，需要重新取得資料')
      return null
    }
    
    const cacheData = await fs.readFile(FARMS_CACHE_FILE, 'utf-8')
    const data = JSON.parse(cacheData)
    
    console.log('📖 從快取讀取資料:', data.length, '筆')
    return data
  } catch (error) {
    console.log('快取檔案不存在或讀取失敗:', error.message)
    return null
  }
}

// 寫入快取資料
export const writeCache = async (data) => {
  try {
    await ensureCacheDir()
    
    // 儲存資料到快取檔案
    await fs.writeFile(FARMS_CACHE_FILE, JSON.stringify(data, null, 2))
    
    // 更新快取設定
    const config = await getCacheConfig()
    config.lastUpdate = new Date().toISOString()
    await saveCacheConfig(config)
    
    console.log('💾 資料已快取:', data.length, '筆，快取時間:', config.lastUpdate)
  } catch (error) {
    console.error('❌ 寫入快取失敗:', error)
  }
}

// 清除快取
export const clearCache = async () => {
  try {
    await fs.unlink(FARMS_CACHE_FILE)
    const config = await getCacheConfig()
    config.lastUpdate = null
    await saveCacheConfig(config)
    console.log('快取已清除')
  } catch (error) {
    console.log('快取檔案不存在，無需清除')
  }
}

// 取得快取狀態
export const getCacheStatus = async () => {
  try {
    const config = await getCacheConfig()
    const isValid = await isCacheValid()
    const cacheExists = await fs.access(FARMS_CACHE_FILE).then(() => true).catch(() => false)
    
    return {
      enabled: config.enabled,
      ttl: config.ttl,
      lastUpdate: config.lastUpdate,
      isValid,
      cacheExists,
      nextUpdate: config.lastUpdate ? new Date(new Date(config.lastUpdate).getTime() + config.ttl).toISOString() : null
    }
  } catch {
    return {
      enabled: false,
      ttl: 0,
      lastUpdate: null,
      isValid: false,
      cacheExists: false,
      nextUpdate: null
    }
  }
}