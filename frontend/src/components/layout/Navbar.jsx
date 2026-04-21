import { useOfflineSync } from '../../hooks/useOfflineSync'

export default function Navbar() {
  const { isOnline, queueCount, isSyncing } = useOfflineSync()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,14,26,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>📋</div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>
          Paper<span style={{ color: 'var(--green)' }}>2</span>Insight
        </span>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isSyncing && (
          <span style={{ fontSize: 11, color: 'var(--blue)', fontFamily: 'DM Mono, monospace' }}>
            ⟳ syncing...
          </span>
        )}
        {queueCount > 0 && !isSyncing && (
          <span style={{
            fontSize: 10, background: 'rgba(245,158,11,0.15)',
            color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 100, padding: '3px 10px',
            fontFamily: 'DM Mono, monospace',
          }}>
            {queueCount} queued
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: isOnline ? 'var(--green)' : 'var(--red)',
            boxShadow: `0 0 6px ${isOnline ? '#22c55e' : '#ef4444'}`,
          }} />
          <span style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </nav>
  )
}
