const P_COLORS = {
  IMMEDIATE:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444' },
  WITHIN_WEEK:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
  WITHIN_MONTH: { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  text: '#22c55e' },
}

function normalizeResource(r) {
  if (typeof r === 'string') {
    return { item: r, quantity: '', priority: 'WITHIN_WEEK' }
  }
  return {
    item:     r.item || r.resource || r.name || r.resource_type || 'Resource',
    quantity: r.quantity || r.amount || r.count || '',
    priority: r.priority || r.urgency || 'WITHIN_WEEK',
  }
}

export default function ResourceList({ resources }) {
  // Safety checks — handle null, undefined, strings, empty arrays
  let items = []

  if (Array.isArray(resources)) {
    items = resources
  .filter(r => r && (typeof r === 'object' || typeof r === 'string'))
  .map(normalizeResource))
  } else if (typeof resources === 'string') {
    try {
      const parsed = JSON.parse(resources)
      if (Array.isArray(parsed)) {
        items = parsed.filter(r => r && typeof r === 'object').map(normalizeResource)
      }
    } catch { /* ignore parse errors */ }
  }

  if (items.length === 0) {
    return (
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Mono, monospace' }}>
          SUGGESTED RESOURCES
        </h3>
        <div style={{
          padding: '14px', background: 'var(--surface2)',
          border: '1px solid var(--border)', borderRadius: 10,
          color: 'var(--muted)', fontSize: 13, textAlign: 'center',
        }}>
          No resources suggested yet
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Mono, monospace' }}>
        SUGGESTED RESOURCES
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((r, i) => {
          const priority = (r.priority || '').toUpperCase().replace(' ', '_')
          const c = P_COLORS[priority] ?? P_COLORS.WITHIN_WEEK
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
              }}>
                {r.priority || 'WITHIN_WEEK'}
              </span>
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
