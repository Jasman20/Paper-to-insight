import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster }        from 'react-hot-toast'
import Navbar             from './components/layout/Navbar'
import BottomNav          from './components/layout/BottomNav'
import UploadPage         from './pages/UploadPage'
import ProcessingPage     from './pages/ProcessingPage'
import ResultPage         from './pages/ResultPage'
import DashboardPage      from './pages/DashboardPage'
import MapPage            from './pages/MapPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111827',
            color:      '#f1f5f9',
            border:     '1px solid rgba(255,255,255,0.07)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize:   '13px',
          },
        }}
      />
      <Navbar />
      <main style={{ paddingBottom: '72px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/"           element={<UploadPage />}     />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/result"     element={<ResultPage />}     />
          <Route path="/dashboard"  element={<DashboardPage />}  />
          <Route path="/map"        element={<MapPage />}        />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  )
}
