// Individual map pin with popup showing survey details
// Uses React-Leaflet CircleMarker + Popup
import { CircleMarker, Popup } from 'react-leaflet'

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MEDIUM:   '#eab308',
  LOW:      '#22c55e',
}

export default function SurveyMarker({ survey }) {
  if (!survey.lat || !survey.lng) return null

  const color = survey.color || SEVERITY_COLORS[survey.severity?.toUpperCase()] || '#94a3b8'

  return (
    <CircleMarker
      center={[survey.lat, survey.lng]}
      radius={10}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 2,
      }}
    >
      <Popup>
        <div style={{ minWidth: 160, fontSize: 13, lineHeight: 1.6 }}>
          <strong>{survey.village_name || 'Unknown Village'}</strong>
          {survey.district && <div style={{ color: '#64748b' }}>{survey.district}</div>}
          <div style={{ marginTop: 6 }}>
            <span style={{
              background: color + '22', color,
              padding: '2px 8px', borderRadius: 100, fontSize: 11,
            }}>
              {survey.severity || 'N/A'}
            </span>
          </div>
          {survey.need_category && (
            <div style={{ marginTop: 4, color: '#475569' }}>
              Need: <strong>{survey.need_category}</strong>
            </div>
          )}
          {survey.people_affected && (
            <div style={{ color: '#475569' }}>
              People: <strong>{survey.people_affected}</strong>
            </div>
          )}
        </div>
      </Popup>
    </CircleMarker>
  )
}
