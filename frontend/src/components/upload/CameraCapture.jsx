import { useCamera } from '../../hooks/useCamera'

export default function CameraCapture({ onCapture }) {
  const { videoRef, canvasRef, cameraOpen, openCamera, capturePhoto, closeCamera } = useCamera()

  const handleCapture = async () => {
    const blob = await capturePhoto()
    const file = new File([blob], 'survey.jpg', { type: 'image/jpeg' })
    onCapture(file)
    closeCamera()
  }

  return (
    <div>
      {!cameraOpen ? (
        <button onClick={openCamera} style={{
          width: '100%', padding: '14px',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 12, color: 'var(--blue)',
          fontSize: 14, fontFamily: 'Syne, sans-serif', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          📷  Open Camera
        </button>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <video ref={videoRef} autoPlay playsInline
            style={{ width: '100%', borderRadius: 16, display: 'block' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{
            position: 'absolute', bottom: 16, left: 0, right: 0,
            display: 'flex', gap: 12, justifyContent: 'center',
          }}>
            <button onClick={closeCamera} style={{
              padding: '10px 20px', borderRadius: 100,
              background: 'rgba(239,68,68,0.2)', color: 'var(--red)',
              border: '1px solid rgba(239,68,68,0.4)', fontSize: 13,
            }}>✕ Cancel</button>
            <button onClick={handleCapture} style={{
              padding: '10px 28px', borderRadius: 100,
              background: 'var(--green)', color: '#000',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
            }}>⚡ Capture</button>
          </div>
        </div>
      )}
    </div>
  )
}
