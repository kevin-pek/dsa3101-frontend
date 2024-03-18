import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/auth"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import { MantineProvider } from "@mantine/core"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { Schedule } from "./pages/Schedule"
import { Employees } from "./pages/Employees"
import { Bookings } from "./pages/Bookings"
import { RequireAuth } from "./components/RequireAuth"
import { Navbar } from "./components/Navbar"
import { Notifications } from "@mantine/notifications"
import 'mantine-react-table/styles.css'


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
    <MantineProvider
      theme={{
        colors: {
          'green': [
            "#f0faf2",
            "#dff2e4",
            "#bbe5c4",
            "#92d8a2",
            "#71cc86",
            "#5dc573",
            "#52c26a",
            "#42ab58",
            "#38984d",
            "#2a8340"
          ],
          'orange': [
            "#fff6e1",
            "#ffeccc",
            "#fed79c",
            "#fcc067",
            "#fcad3b",
            "#fba11f",
            "#fb9b0d",
            "#df8700",
            "#c77700",
            "#ae6600"
          ]
        },
        primaryColor: 'green',
        primaryShade: 9
      }}
    >
      <AuthProvider>
        <InnerApp />
        <Notifications />
      </AuthProvider>
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
