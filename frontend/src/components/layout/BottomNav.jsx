import { NavLink } from 'react-router-dom'

const TABS = [
  { path: '/',          icon: '📸', label: 'Upload'    },
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/map',       icon: '🗺️', label: 'Map'       },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,14,26,0.97)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
    }}>
      {TABS.map(tab => (
        <NavLink key={tab.path} to={tab.path}
          style={({ isActive }) => ({
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0', gap: 4, textDecoration: 'none',
            color: isActive ? 'var(--green)' : 'var(--muted)',
            borderTop: isActive ? '2px solid var(--green)' : '2px solid transparent',
            transition: 'all 0.2s',
          })}
        >
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}>
            {tab.label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
