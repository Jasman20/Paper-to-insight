import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSurveyStore from '../store/surveyStore'

const STEPS = [
  { icon: '📸', title: 'Image received',        sub: 'Survey photo uploaded successfully',      done: true   },
  { icon: '👁️', title: 'Gemini Vision reading',  sub: 'Extracting handwritten text...',          done: true   },
  { icon: '🤖', title: 'Scoring severity',       sub: 'Categorizing community need...',          active: true },
  { icon: '🗺️', title: 'Updating map',           sub: 'Geocoding via LocationIQ + saving to DB...', done: false  },
]

export default function ProcessingPage() {
  const navigate = useNavigate()
  const { isProcessing, currentResult } = useSurveyStore()

  useEffect(() => {
    if (!isProcessing && currentResult) navigate('/result')
  }, [isProcessing, currentResult])

  return (
    <div style={{ padding: '40px 20px', maxWidth: 500, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>AI is reading your survey...</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
        Gemini Vision is analyzing the handwriting. Usually 5–10 seconds.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', borderRadius: 12,
            background: step.done
              ? 'rgba(34,197,94,0.05)'
              : step.active ? 'rgba(59,130,246,0.05)' : 'var(--surface)',
            border: `1px solid ${step.done
              ? 'rgba(34,197,94,0.2)'
              : step.active ? 'rgba(59,130,246,0.25)' : 'var(--border)'}`,
            opacity: !step.done && !step.active ? 0.4 : 1,
          }}>
            <span style={{ fontSize: 22 }}>{step.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{step.title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{step.sub}</div>
            </div>
            <span style={{
              fontSize: 14,
              color: step.done ? 'var(--green)' : step.active ? 'var(--blue)' : 'var(--muted)',
            }}>
              {step.done ? '✓' : step.active ? '●' : '○'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '65%',
          background: 'linear-gradient(90deg, var(--blue), var(--green))',
          borderRadius: 2, animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { width: 20%; }
          50%  { width: 80%; }
          100% { width: 20%; }
        }
      `}</style>
    </div>
  )
}
