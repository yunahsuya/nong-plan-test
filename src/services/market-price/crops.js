/**
 * 農產品市場行情 API
 *
 * Linus says: "Talk is cheap. Show me the code."
 * 對應真實後端 API: /api/prices/*
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/prices',
  timeout: 10000,
})

/**
 * 統一錯誤處理
 */
async function handleRequest(requestFn) {
  try {
    const { data } = await requestFn()
    return data.success ? data.data : null
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'API 請求失敗')
  }
}

export const CropsService = {
  /**
   * 獲取所有價格資料
   * GET /api/prices
   * @param {boolean} refresh - 是否強制刷新快取
   */
  getAllPrices: (refresh = false) => handleRequest(() => api.get('/', { params: { refresh } })),

  /**
   * 根據作物名稱查詢
   * GET /api/prices/crop/:crop
   * @param {string} crop - 作物名稱（支援模糊搜尋）
   * @param {boolean} refresh - 是否強制刷新快取
   */
  getPricesByCrop: (crop, refresh = false) =>
    handleRequest(() => api.get(`/crop/${encodeURIComponent(crop)}`, { params: { refresh } })),

  /**
   * 根據市場名稱查詢
   * GET /api/prices/market/:market
   * @param {string} market - 市場名稱（支援模糊搜尋）
   * @param {boolean} refresh - 是否強制刷新快取
   */
  getPricesByMarket: (market, refresh = false) =>
    handleRequest(() => api.get(`/market/${encodeURIComponent(market)}`, { params: { refresh } })),

  /**
   * 獲取快取狀態
   * GET /api/prices/cache/status
   */
  getCacheStatus: () => handleRequest(() => api.get('/cache/status')),

  /**
   * 清除快取
   * DELETE /api/prices/cache
   */
  clearCache: () => handleRequest(() => api.delete('/cache')),

  /**
   * 強制刷新快取
   * POST /api/prices/cache/refresh
   */
  refreshCache: () => handleRequest(() => api.post('/cache/refresh')),
}
