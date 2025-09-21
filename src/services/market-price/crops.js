/**
 * 農產品市場行情 API 服務
 * 簡單、直接、無廢話的 HTTP 調用層
 */

const API_BASE = 'http://localhost:4000/api/crops'

export class CropsService {
  /**
   * 獲取農產品分類清單
   * @returns {Promise<Object>} { categories, summary }
   */
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE}/categories`)

      // 檢查 HTTP 狀態
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 後端 API 不可用`)
      }

      // 檢查回應是否為 JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('後端回傳非 JSON 格式，請檢查 API 服務是否正常運行')
      }

      const data = await response.json()

      // 支援兩種回應格式: { status: 'success' } 或 { success: true }
      const isSuccess = data.status === 'success' || data.success === true

      if (!isSuccess) {
        throw new Error(data.message || 'API 呼叫失敗')
      }

      return data.data
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('後端 API 不存在或未啟動，請確認 nong-plan-back-test 服務正在運行')
      }
      throw error
    }
  }

  /**
   * 獲取特定作物的各地價格
   * @param {string} crop - 作物名稱
   * @param {Object} options - 選項 { market?, sort? }
   * @returns {Promise<Object>} { cropName, locations, statistics, pagination }
   */
  static async getCropPrices(crop, options = {}) {
    try {
      const params = new URLSearchParams({ crop })

      if (options.market) params.append('market', options.market)
      if (options.sort) params.append('sort', options.sort)

      const response = await fetch(`${API_BASE}/locations?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 後端 API 不可用`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('後端回傳非 JSON 格式，請檢查 API 服務是否正常運行')
      }

      const data = await response.json()

      // 支援兩種回應格式: { status: 'success' } 或 { success: true }
      const isSuccess = data.status === 'success' || data.success === true

      if (!isSuccess) {
        throw new Error(data.message || 'API 呼叫失敗')
      }

      return data.data
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('後端 API 不存在或未啟動，請確認 nong-plan-back-test 服務正在運行')
      }
      throw error
    }
  }
}
