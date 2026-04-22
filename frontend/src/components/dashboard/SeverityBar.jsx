import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const SEVERITY_ORDER  = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const SEVERITY_COLORS = {
  LOW:      '#22c55e',
  MEDIUM:   '#eab308',
  HIGH:     '#f97316',
  CRITICAL: '#ef4444',
}

export default function SeverityBar({ surveys = [] }) {
  // Count each severity level
  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
  surveys.forEach(s => {
    if (s.severity && counts[s.severity] !== undefined) {
      counts[s.severity]++
    }
  })

  const data = SEVERITY_ORDER.map(sev => ({
    name:  sev,
    count: counts[sev],
    color: SEVERITY_COLORS[sev],
  }))

  if (surveys.length === 0) {
    return (
      <div style={{
        padding: 24, background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--border)', textAlign: 'center',
        color: 'var(--muted)', fontSize: 13, marginBottom: 8,
      }}>
        📊 No survey data yet for Severity Distribution
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
        SEVERITY DISTRIBUTION
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={40}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              color: '#f1f5f9',
              fontSize: 12,
            }}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}