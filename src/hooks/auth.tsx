import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"

export interface AuthContext {
  setUser: (username: string | null) => void
  user: string | null
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(sessionStorage.getItem('user'))

  useEffect(() => {
    if (user) sessionStorage.setItem('user', user)
    else sessionStorage.removeItem('user')
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
