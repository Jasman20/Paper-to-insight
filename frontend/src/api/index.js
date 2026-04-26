import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL
console.log('🔍 API URL:', BASE)

const api = axios.create({
  baseURL: BASE,
  timeout: 60000,
})

export const uploadSurvey  = (formData) => api.post('/api/survey/upload', formData)
export const getAllSurveys  = ()         => api.get('/api/survey/all')
export const getStats       = ()         => api.get('/api/dashboard/stats')
export const getHeatmapData = ()         => api.get('/api/dashboard/heatmap-data')
export const downloadReport = ()         => api.get('/api/reports/generate', { responseType: 'blob' })
