import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  MEDICAL:    '#ef4444',
  FOOD:       '#f59e0b',
  WATER:      '#3b82f6',
  SHELTER:    '#a855f7',
  EDUCATION:  '#22c55e',
  SANITATION: '#06b6d4',
  LIVELIHOOD: '#ec4899',
  OTHER:      '#64748b',
}

export default function NeedDonut({ surveys = [] }) {
  // Count each need category
  const counts = {}
  surveys.forEach(s => {
    if (s.need_category) {
      counts[s.need_category] = (counts[s.need_category] || 0) + 1
    }
  })

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    return (
      <div style={{
        padding: 24, background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--border)', textAlign: 'center',
        color: 'var(--muted)', fontSize: 13, marginBottom: 8,
      }}>
        📊 No survey data yet for Need Breakdown
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14,
      border: '1px solid var(--border)', padding: '20px',
      marginBottom: 8,
    }}>
      <h3 style={{
        fontSize: 13, color: 'var(--muted)',
        fontFamily: 'DM Mono, monospace', marginBottom: 16,
      }}>
        NEED CATEGORY BREAKDOWN
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={COLORS[entry.name] ?? '#64748b'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              color: '#f1f5f9',
              fontSize: 12,
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#f1f5f9', fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}