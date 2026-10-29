import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'

// renders the admin area only for a signed-in admin
export default function ProtectedRoute() {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="ad-auth-loading" role="status">Checking your session…</div>
  if (!isAuthed) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
