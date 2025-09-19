import axios from 'axios'

// 接後端
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
})

export default { api }
