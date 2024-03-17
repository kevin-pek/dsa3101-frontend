import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/auth"
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { Schedule } from "./pages/Schedule"
import { Employees } from "./pages/Employees"
import { Bookings } from "./pages/Bookings"
import { RequireAuth } from "./components/RequireAuth"
import { Navbar } from "./components/Navbar"

function InnerApp() {
  const auth = useAuth()

  return (
    <BrowserRouter>
      <div style={auth.user && { display: "flex", flexDirection: "row" }}>
        {auth.user && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/schedule"
            element={
              <RequireAuth>
                <Schedule />
              </RequireAuth>
            }
          />
          <Route
            path="/employees"
            element={
              <RequireAuth>
                <Employees />
              </RequireAuth>
            }
          />
          <Route
            path="/bookings"
            element={
              <RequireAuth>
                <Bookings />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
