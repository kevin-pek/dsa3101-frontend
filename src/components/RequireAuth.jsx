import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

/**
 * Wrap this around pages that need the user to be logged in
 */
export function RequireAuth({ children }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
