const ITEMS = [
  { color: '#ef4444', label: 'CRITICAL' },
  { color: '#f97316', label: 'HIGH'     },
  { color: '#eab308', label: 'MEDIUM'   },
  { color: '#22c55e', label: 'LOW'      },
]

export default function MapLegend() {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '12px 16px',
      background: 'var(--surface)', flexWrap: 'wrap',
    }}>
      {ITEMS.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
          {label}
        </div>
      ))}
    </div>
  )
}