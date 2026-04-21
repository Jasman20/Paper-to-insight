export default function OfflineBanner({ isOnline, queueCount }) {
  if (isOnline) return null
  return (
    <div style={{
      background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
      borderRadius: 10, padding: '10px 16px', margin: '0 0 16px 0',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 18 }}>📶</span>
      <div>
        <strong style={{ color: 'var(--amber)', fontSize: 13 }}>You are offline</strong>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>
          Surveys saved locally and uploaded when back online.
          {queueCount > 0 && ` (${queueCount} pending)`}
        </p>
      </div>
    </div>
  )
}
