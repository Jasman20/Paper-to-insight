import { useRef, useState } from 'react'

export const useCamera = () => {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const [stream,     setStream]     = useState(null)
  const [cameraOpen, setCameraOpen] = useState(false)

  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // rear camera on mobile
      })
      setStream(s)
      setCameraOpen(true)
      if (videoRef.current) videoRef.current.srcObject = s
    } catch (err) {
      console.error('Camera error:', err)
    }
  }

  const capturePhoto = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    return new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9))
  }

  const closeCamera = () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraOpen(false)
  }

  return { videoRef, canvasRef, cameraOpen, openCamera, capturePhoto, closeCamera }
}
