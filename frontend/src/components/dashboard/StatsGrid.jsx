export default function StatsGrid({ stats }) {
  if (!stats) return null
  const BOXES = [
    { label: '🔴 Critical',        value: stats.critical_cases,                       color: '#ef4444' },
    { label: '🟠 High Priority',   value: stats.high_priority,                        color: '#f97316' },
    { label: '📋 Total Surveys',   value: stats.total_surveys,                        color: '#3b82f6' },
    { label: '👥 People Affected', value: stats.total_people_affected?.toLocaleString(), color: '#22c55e' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
      {BOXES.map(b => (
        <div key={b.label} style={{
          background: `${b.color}10`, border: `1px solid ${b.color}30`,
          borderRadius: 14, padding: '18px 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, fontFamily: 'Syne, sans-serif', fontWeight: 800, color: b.color }}>
            {b.value ?? '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{b.label}</div>
        </div>
      ))}
    </div>
  )
}
