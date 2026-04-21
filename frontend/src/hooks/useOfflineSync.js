import { useState, useEffect } from 'react'
import { getQueue, dequeueSurvey } from '../utils/offlineQueue'
import { uploadSurvey } from '../api'
import toast from 'react-hot-toast'

export const useOfflineSync = () => {
  const [isOnline,   setIsOnline]   = useState(navigator.onLine)
  const [queueCount, setQueueCount] = useState(0)
  const [isSyncing,  setIsSyncing]  = useState(false)

  useEffect(() => {
    const up   = () => { setIsOnline(true);  toast.success('Back online! Syncing...') }
    const down = () => { setIsOnline(false); toast.error('You are offline. Surveys saved locally.') }
    window.addEventListener('online',  up)
    window.addEventListener('offline', down)
    loadCount()
    return () => {
      window.removeEventListener('online',  up)
      window.removeEventListener('offline', down)
    }
  }, [])

  useEffect(() => { if (isOnline) syncQueue() }, [isOnline])

  const loadCount = async () => {
    const q = await getQueue()
    setQueueCount(q.length)
  }

  const syncQueue = async () => {
    const queue = await getQueue()
    if (!queue.length) return
    setIsSyncing(true)
    for (const item of queue) {
      try {
        const fd = new FormData()
        fd.append('survey_image', item.file)
        fd.append('uploaded_by',  item.uploadedBy ?? 'Field Worker')
        await uploadSurvey(fd)
        await dequeueSurvey(item.id)
        toast.success('Offline survey synced!')
      } catch { /* retry next time */ }
    }
    await loadCount()
    setIsSyncing(false)
  }

  return { isOnline, queueCount, isSyncing, syncQueue }
}
