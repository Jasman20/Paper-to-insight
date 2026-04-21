import { useEffect, useState } from 'react'
import { getHeatmapData }      from '../api'
import HeatMap                 from '../components/map/HeatMap'

export default function MapPage() {
  const [mapData, setMapData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHeatmapData()
      .then(r => { setMapData(r.data); setLoading(false) })
      .catch(console.error)
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
        <HeatMap data={mapData} />
      )}
    </div>
  )
}
