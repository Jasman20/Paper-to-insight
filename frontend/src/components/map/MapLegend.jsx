// Color legend below the map
// CRITICAL=red, HIGH=orange, MEDIUM=yellow, LOW=green
const LEGEND = [
  { label: 'CRITICAL', color: '#ef4444' },
  { label: 'HIGH',     color: '#f97316' },
  { label: 'MEDIUM',   color: '#eab308' },
  { label: 'LOW',      color: '#22c55e' },
]

export default function MapLegend() {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '12px 16px',
      background: 'var(--surface)', flexWrap: 'wrap',
      borderTop: '1px solid var(--border)',
    }}>
      {LEGEND.map(({ label, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: color, flexShrink: 0,
          }} />
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
