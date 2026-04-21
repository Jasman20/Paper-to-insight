// ── MEMBER 3 FILLS THIS FILE ──────────────────────────────
// This component shows a bar chart of severity distribution
// Use Recharts BarChart component
// Data: count of LOW / MEDIUM / HIGH / CRITICAL surveys

export default function SeverityBar({ surveys = [] }) {
  // TODO: Member 3 implements this
  return (
    <div style={{
      padding: 24, background: 'var(--surface)', borderRadius: 14,
      border: '1px dashed var(--border)', textAlign: 'center',
      color: 'var(--muted)', fontSize: 13, marginBottom: 8,
    }}>
      📊 SeverityBar — Member 3 implements this
    </div>
  )
}
