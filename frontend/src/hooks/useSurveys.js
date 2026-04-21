// Replaces useFirestore.js — polls the REST API instead of Firestore real-time listener
import { useEffect, useState, useCallback } from 'react'
import { getAllSurveys } from '../api'

const POLL_INTERVAL_MS = 10000 // refresh every 10 seconds

export const useSurveys = () => {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSurveys = useCallback(async () => {
    try {
      const res = await getAllSurveys()
      setSurveys(res.data)
    } catch (err) {
      console.error('[useSurveys] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSurveys()
    const timer = setInterval(fetchSurveys, POLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [fetchSurveys])

  return { surveys, loading, refetch: fetchSurveys }
}
