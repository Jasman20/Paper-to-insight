const P_COLORS = {
  IMMEDIATE:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444' },
  WITHIN_WEEK:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
  WITHIN_MONTH: { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  text: '#22c55e' },
}

export default function ResourceList({ resources = [] }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Mono, monospace' }}>
        SUGGESTED RESOURCES
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {resources.map((r, i) => {
          const c = P_COLORS[r.priority] ?? P_COLORS.WITHIN_MONTH
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', background: 'var(--surface2)',
              borderRadius: 10, border: '1px solid var(--border)',
            }}>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 100,
                background: c.bg, border: `1px solid ${c.border}`, color: c.text,
                fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap',
              }}>{r.priority}</span>
              <span style={{ fontSize: 13, flex: 1 }}>{r.item}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
                {r.quantity}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
