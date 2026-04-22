import { useEffect, useState } from 'react'
import { getHeatmapData }      from '../api'
import HeatMap                 from '../components/map/HeatMap'

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHeatmapData()
      .then(r => {
        // Backend returns {markers: [...]} — extract the array
        const data = r.data
        if (Array.isArray(data)) {
          setMarkers(data)
        } else if (data?.markers) {
          setMarkers(data.markers)
        } else {
          setMarkers([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Map load error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Live Crisis Map</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Real-time heatmap of community needs across India
        </p>
      </div>

      {loading ? (
        <div style={{
          height: 400, background: 'var(--surface)', borderRadius: 16,
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--muted)', fontSize: 13,
        }}>
          Loading map data...
        </div>
      ) : (
        <HeatMap data={markers} />
      )}
    </div>
  )
}