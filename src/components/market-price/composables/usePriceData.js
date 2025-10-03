import { ref, computed } from 'vue'
import { CropsService } from '@/services/market-price/crops.js'

export function usePriceData() {
  const priceData = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const currentCrop = ref('')

  // 計算統計數據
  const averagePrice = computed(() => {
    if (!priceData.value || priceData.value.length === 0) return '0.00'
    const total = priceData.value.reduce((sum, item) => sum + item.prices.average, 0)
    return (total / priceData.value.length).toFixed(2)
  })

  const uniqueMarkets = computed(() => {
    if (!priceData.value) return 0
    return new Set(priceData.value.map((item) => item.marketName)).size
  })

  // 依 cropName 分組，只保留每個作物的最新一筆
  const groupedData = computed(() => {
    if (!priceData.value) return []

    const cropMap = new Map()

    // 按日期排序（最新的在前）
    const sorted = [...priceData.value].sort((a, b) => {
      const dateA = a.tradeDate.replace(/\./g, '')
      const dateB = b.tradeDate.replace(/\./g, '')
      return dateB.localeCompare(dateA) // 降序
    })

    // 只保留每個作物的第一筆（最新）
    sorted.forEach((item) => {
      if (!cropMap.has(item.cropName)) {
        cropMap.set(item.cropName, item)
      }
    })

    return Array.from(cropMap.values())
  })

  // 搜尋特定作物
  async function searchCrop(cropName) {
    if (!cropName.trim()) {
      error.value = '請輸入作物名稱'
      return false
    }

    loading.value = true
    error.value = null

    try {
      priceData.value = await CropsService.getPricesByCrop(cropName.trim())
      currentCrop.value = cropName.trim()

      if (!priceData.value || priceData.value.length === 0) {
        error.value = `找不到「${cropName}」的相關資料`
        return false
      }
      return true
    } catch (err) {
      error.value = err.message || '載入價格資料失敗'
      priceData.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  // 顯示全部
  async function loadAllPrices() {
    loading.value = true
    error.value = null
    currentCrop.value = ''

    try {
      priceData.value = await CropsService.getAllPrices()

      if (!priceData.value || priceData.value.length === 0) {
        error.value = '目前沒有可用的資料'
        return false
      }
      return true
    } catch (err) {
      error.value = err.message || '載入資料失敗'
      priceData.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    priceData,
    loading,
    error,
    currentCrop,

    // Computed
    averagePrice,
    uniqueMarkets,
    groupedData,

    // Methods
    searchCrop,
    loadAllPrices,
  }
}
