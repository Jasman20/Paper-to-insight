import { useNavigate }  from 'react-router-dom'
import useSurveyStore   from '../store/surveyStore'
import SeverityBanner   from '../components/result/SeverityBanner'
import InfoChips        from '../components/result/InfoChips'
import ResourceList     from '../components/result/ResourceList'
import RawTextView      from '../components/result/RawTextView'

export default function ResultPage() {
  const navigate = useNavigate()
  const { currentResult } = useSurveyStore()

  if (!currentResult) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: 16 }}>No result yet.</p>
        <button onClick={() => navigate('/')} style={{
          padding: '12px 24px', background: 'var(--green)',
          color: '#000', borderRadius: 12,
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
        }}>Upload a Survey</button>
      </div>
    )
  }

  const { extracted, assessment } = currentResult

  return (
    <div style={{ padding: '20px', maxWidth: 500, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/')} style={{
          padding: '8px 12px', background: 'var(--surface2)',
          border: '1px solid var(--border)', borderRadius: 8,
          color: 'var(--muted)', fontSize: 12,
        }}>← Back</button>
        <h1 style={{ fontSize: 22 }}>Survey Result</h1>
      </div>

      <SeverityBanner severity={assessment?.severity} score={assessment?.severity_score} />
      <InfoChips
        village={extracted?.village_name} district={extracted?.district}
        needCategory={assessment?.need_category}
        peopleAffected={extracted?.people_affected}
        immediate={assessment?.immediate_action_needed}
      />

      {assessment?.allocation_suggestion && (
        <div style={{
          padding: '14px 16px', background: 'var(--surface2)',
          border: '1px solid var(--border)', borderRadius: 12, marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em', marginBottom: 6, fontFamily: 'DM Mono, monospace' }}>
            🎯 ACTION PLAN
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>{assessment.allocation_suggestion}</p>
        </div>
      )}

      <ResourceList resources={assessment?.suggested_resources} />
      <RawTextView text={extracted?.raw_text} language={extracted?.language_detected} />

      <button onClick={() => navigate('/map')} style={{
        width: '100%', marginTop: 20, padding: '14px',
        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 12, color: 'var(--blue)',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
      }}>
        🗺️ View on Heatmap
      </button>
    </div>
  )
}
