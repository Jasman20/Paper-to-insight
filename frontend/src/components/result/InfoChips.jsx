import { getNeedColor } from '../../utils/severityColors'

export default function InfoChips({ village, district, needCategory, peopleAffected, immediate }) {
  const chips = [
    { label: '📍 Location',  value: `${village ?? '—'}, ${district ?? '—'}` },
    { label: '🆘 Need',      value: needCategory, color: getNeedColor(needCategory) },
    { label: '👥 Affected',  value: `${peopleAffected ?? '?'} people` },
    { label: '⚡ Immediate', value: immediate ? 'YES' : 'NO', color: immediate ? 'var(--red)' : 'var(--green)' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
      {chips.map(chip => (
        <div key={chip.label} style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em', marginBottom: 4 }}>
            {chip.label}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: chip.color ?? 'var(--text)' }}>
            {chip.value}
          </div>
        </div>
      ))}
    </div>
  )
}
