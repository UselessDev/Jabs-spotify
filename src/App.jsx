import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101317] text-slate-200">
        Loading your library...
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage user={user} />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/app" replace /> : <AuthPage />}
      />
      <Route
        path="/app"
        element={user ? <DashboardPage /> : <Navigate to="/auth" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
