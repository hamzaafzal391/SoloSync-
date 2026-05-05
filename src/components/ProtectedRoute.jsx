import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function ProtectedRoute({ children }) {
  const { user, authReady } = useSelector((s) => s.auth)
  const location = useLocation()

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Checking session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
