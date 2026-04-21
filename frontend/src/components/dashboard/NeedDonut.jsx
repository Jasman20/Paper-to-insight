// ── MEMBER 3 FILLS THIS FILE ──────────────────────────────
// This component shows a donut chart of need categories
// Use Recharts PieChart component
// Data comes from: surveys array → group by need_category → count each

export default function NeedDonut({ surveys = [] }) {
  // TODO: Member 3 implements this
  return (
    <div style={{
      padding: 24, background: 'var(--surface)', borderRadius: 14,
      border: '1px dashed var(--border)', textAlign: 'center',
      color: 'var(--muted)', fontSize: 13, marginBottom: 8,
    }}>
      📊 NeedDonut — Member 3 implements this
    </div>
  )
}
