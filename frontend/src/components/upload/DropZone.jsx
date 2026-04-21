import { useDropzone } from 'react-dropzone'

export default function DropZone({ onFile, preview }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => files[0] && onFile(files[0]),
  })

  return (
    <div {...getRootProps()} style={{
      border: `2px dashed ${isDragActive ? 'var(--green)' : 'rgba(34,197,94,0.25)'}`,
      borderRadius: 16,
      padding: preview ? 0 : '40px 20px',
      background: isDragActive ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.02)',
      textAlign: 'center', cursor: 'pointer',
      transition: 'all 0.2s', overflow: 'hidden',
      minHeight: 200, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="survey preview"
          style={{ width: '100%', borderRadius: 14, display: 'block' }} />
      ) : (
        <div>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>
            {isDragActive ? 'Drop it here!' : 'Upload Field Survey'}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>
            Tap to choose photo or drag & drop
          </p>
        </div>
      )}
    </div>
  )
}
