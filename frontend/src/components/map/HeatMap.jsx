import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import SurveyMarker from './SurveyMarker'
import MapLegend    from './MapLegend'

// Fix Leaflet default marker icon broken in Vite
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const INDIA_CENTER = [20.5937, 78.9629]

export default function HeatMap({ data = [] }) {
  // Safety: ensure data is always an array
  const markers = Array.isArray(data) ? data : []

  if (markers.length === 0) {
    return (
      <div style={{
        height: 400, background: 'var(--surface)', borderRadius: 16,
        border: '1px dashed var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, color: 'var(--muted)',
      }}>
        <span style={{ fontSize: 40 }}>🗺️</span>
        <p style={{ fontSize: 13 }}>No geo-tagged surveys yet</p>
        <p style={{ fontSize: 11, color: 'var(--muted)' }}>
          Add LocationIQ key to backend .env to enable geocoding
        </p>
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        style={{ height: 420, width: '100%', background: '#0a0e1a' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {markers.map((survey, i) => (
          <SurveyMarker key={i} survey={survey} />
        ))}
      </MapContainer>
      <MapLegend />
    </div>
  )
}