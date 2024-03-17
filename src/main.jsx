import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./hooks/auth"
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { Planner } from "./pages/Planner"
import { Employees } from "./pages/Employees"
import { Bookings } from "./pages/Bookings"
import { RequireAuth } from "./components/RequireAuth"

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/planner"
              element={
                <RequireAuth>
                  <Planner />
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
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
