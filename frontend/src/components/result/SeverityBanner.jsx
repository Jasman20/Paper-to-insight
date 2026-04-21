import { getSeverityColor } from '../../utils/severityColors'

const ICONS = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🟢' }

export default function SeverityBanner({ severity, score }) {
  const color = getSeverityColor(severity)
  return (
    <div style={{
      borderRadius: 14, padding: '16px 20px',
      background: `${color}18`, border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 16,
    }}>
      <div>
        <div style={{ fontSize: 10, color, fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', marginBottom: 4 }}>
          SEVERITY LEVEL
        </div>
        <h2 style={{ color, fontSize: 20 }}>{ICONS[severity]} {severity}</h2>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 32, fontFamily: 'Syne, sans-serif', fontWeight: 800, color }}>
          {score}
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
          out of 10
        </div>
      </div>
    </div>
  )
}
