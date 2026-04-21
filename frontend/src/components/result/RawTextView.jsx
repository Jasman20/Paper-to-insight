import { useState } from 'react'

export default function RawTextView({ text, language }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '10px 14px',
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: open ? '10px 10px 0 0' : 10,
        color: 'var(--muted)', fontSize: 13,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>📖 What AI read from survey</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
          {language ?? ''} {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{
          padding: '14px', background: 'var(--surface2)',
          borderRadius: '0 0 10px 10px',
          border: '1px solid var(--border)', borderTop: 'none',
          fontSize: 13, lineHeight: 1.7,
          color: 'var(--muted)', fontFamily: 'DM Mono, monospace',
        }}>
          {text ?? 'No raw text available'}
        </div>
      )}
    </div>
  )
}
