import { useEffect }   from 'react'
import { getStats }    from '../api'
import useSurveyStore  from '../store/surveyStore'
import StatsGrid       from '../components/dashboard/StatsGrid'
import PriorityTable   from '../components/dashboard/PriorityTable'
import NeedDonut       from '../components/dashboard/NeedDonut'
import SeverityBar     from '../components/dashboard/SeverityBar'
import { useSurveys }  from '../hooks/useSurveys'

export default function DashboardPage() {
  const { stats, setStats } = useSurveyStore()
  const { surveys, loading } = useSurveys()

  useEffect(() => {
    getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          {loading ? 'Loading...' : `${surveys.length} total surveys`}
        </p>
      </div>

      <StatsGrid stats={stats} />
      <NeedDonut surveys={surveys} />
      <SeverityBar surveys={surveys} />
      <PriorityTable surveys={surveys} />
    </div>
  )
}
