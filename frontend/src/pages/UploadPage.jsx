import { useState }       from 'react'
import { useNavigate }    from 'react-router-dom'
import toast              from 'react-hot-toast'
import DropZone           from '../components/upload/DropZone'
import CameraCapture      from '../components/upload/CameraCapture'
import OfflineBanner      from '../components/upload/OfflineBanner'
import { uploadSurvey }   from '../api'
import { queueSurvey }    from '../utils/offlineQueue'
import { useOfflineSync } from '../hooks/useOfflineSync'
import useSurveyStore     from '../store/surveyStore'

export default function UploadPage() {
  const navigate = useNavigate()
  const { isOnline, queueCount } = useOfflineSync()
  const { setCurrentResult, setIsProcessing } = useSurveyStore()

  const [file,       setFile]       = useState(null)
  const [preview,    setPreview]    = useState(null)
  const [workerName, setWorkerName] = useState('')
  const [loading,    setLoading]    = useState(false)

  const handleFile = (f) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!file) return toast.error('Please select a survey image first')

    if (!isOnline) {
      await queueSurvey({ file, uploadedBy: workerName || 'Field Worker' })
      toast.success('Saved offline — will sync when back online')
      setFile(null)
      setPreview(null)
      return
    }

    setLoading(true)
    setIsProcessing(true)
    navigate('/processing')

    try {
      const fd = new FormData()
      fd.append('survey_image', file)
      fd.append('uploaded_by',  workerName || 'Field Worker')
      const res = await uploadSurvey(fd)
      setCurrentResult(res.data)
      navigate('/result')
    } catch (err) {
      toast.error('Upload failed. Please try again.')
      navigate('/')
    } finally {
      setLoading(false)
      setIsProcessing(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: 500, margin: '0 auto' }}>
      <OfflineBanner isOnline={isOnline} queueCount={queueCount} />

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Upload Survey</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Take or upload a photo of any handwritten field survey
        </p>
      </div>

      <DropZone onFile={handleFile} preview={preview} />

      <div style={{ marginTop: 12 }}>
        <CameraCapture onCapture={handleFile} />
      </div>

      {preview && (
        <button onClick={() => { setFile(null); setPreview(null) }}
          style={{ marginTop: 8, width: '100%', padding: '8px',
            background: 'transparent', color: 'var(--muted)', fontSize: 12 }}>
          ✕ Remove photo
        </button>
      )}

      <input
        value={workerName}
        onChange={e => setWorkerName(e.target.value)}
        placeholder="Your name (optional)"
        style={{
          width: '100%', marginTop: 16, padding: '12px 14px',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 12, color: 'var(--text)', fontSize: 13,
        }}
      />

      <button onClick={handleSubmit} disabled={!file || loading}
        style={{
          width: '100%', marginTop: 16, padding: '16px',
          background: file ? 'var(--green)' : 'var(--surface2)',
          color: file ? '#000' : 'var(--muted)',
          borderRadius: 14, fontFamily: 'Syne, sans-serif',
          fontWeight: 700, fontSize: 15, transition: 'all 0.2s',
          opacity: loading ? 0.7 : 1,
        }}>
        {loading ? '⚡ Analyzing...' : isOnline ? '⚡ Analyze with AI' : '💾 Save Offline'}
      </button>
    </div>
  )
}
