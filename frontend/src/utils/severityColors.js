export const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MEDIUM:   '#eab308',
  LOW:      '#22c55e',
}

export const NEED_COLORS = {
  MEDICAL:    '#ef4444',
  FOOD:       '#f59e0b',
  WATER:      '#3b82f6',
  SHELTER:    '#a855f7',
  EDUCATION:  '#22c55e',
  SANITATION: '#06b6d4',
  LIVELIHOOD: '#ec4899',
  OTHER:      '#64748b',
}

export const getSeverityColor = (s) => SEVERITY_COLORS[s] ?? '#64748b'
export const getNeedColor     = (n) => NEED_COLORS[n]     ?? '#64748b'
