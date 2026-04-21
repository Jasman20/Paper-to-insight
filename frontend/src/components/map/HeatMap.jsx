// Interactive map using React-Leaflet + LocationIQ tile layer
// Replaces Google Maps — uses free OpenStreetMap tiles served via LocationIQ CDN
import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MapLegend from './MapLegend'
import SurveyMarker from './SurveyMarker'

// LocationIQ tile URL (uses your VITE_LOCATIONIQ_ACCESS_TOKEN)
// Falls back to plain OpenStreetMap if token is not set
const LOCATIONIQ_TOKEN = import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN

const tileUrl = LOCATIONIQ_TOKEN && !LOCATIONIQ_TOKEN.startsWith('REPLACE')
  ? `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_TOKEN}`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const tileAttribution = LOCATIONIQ_TOKEN && !LOCATIONIQ_TOKEN.startsWith('REPLACE')
  ? '&copy; <a href="https://locationiq.com">LocationIQ</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

// India centre
const INDIA_CENTER = [20.5937, 78.9629]

export default function HeatMap({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        height: 400, background: 'var(--surface)', borderRadius: 16,
        border: '1px dashed var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, color: 'var(--muted)',
      }}>
        <span style={{ fontSize: 40 }}>🗺️</span>
        <p style={{ fontSize: 13 }}>No geo-tagged surveys yet</p>
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        style={{ height: 400, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer url={tileUrl} attribution={tileAttribution} />

        {data.map((survey, i) => (
          <SurveyMarker key={i} survey={survey} />
        ))}
      </MapContainer>

      <MapLegend />
    </div>
  )
}
