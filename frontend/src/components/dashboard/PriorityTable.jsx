import { getSeverityColor, getNeedColor } from '../../utils/severityColors'

export default function PriorityTable({ surveys = [] }) {
  const top = surveys
    .filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
    .slice(0, 8)

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, fontFamily: 'DM Mono, monospace' }}>
        TOP PRIORITY CASES
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {top.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
            No critical cases yet
          </p>
        ) : top.map((s, i) => (
          <div key={s.id ?? i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 12,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: getSeverityColor(s.severity),
              boxShadow: `0 0 8px ${getSeverityColor(s.severity)}`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.village_name}, {s.district}
              </div>
              <div style={{ fontSize: 11, color: getNeedColor(s.need_category), marginTop: 2 }}>
                {s.need_category}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontFamily: 'DM Mono, monospace', color: getSeverityColor(s.severity) }}>
                {s.severity_score}/10
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.people_affected ?? '?'} people</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
