import axios from 'axios'

// ── REPLACE BASE URL ───────────────────────────────────────────────────
// For local dev: http://localhost:8000
// After Member 4 deploys: replace with Google Cloud Run URL in .env
// ───────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
})

export const uploadSurvey  = (formData) => api.post('/api/survey/upload', formData)
export const getAllSurveys  = ()         => api.get('/api/survey/all')
export const getStats       = ()         => api.get('/api/dashboard/stats')
export const getHeatmapData = ()         => api.get('/api/dashboard/heatmap-data')
export const downloadReport = ()         => api.get('/api/reports/generate', { responseType: 'blob' })
