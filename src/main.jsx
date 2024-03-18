import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/auth"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/nprogress/styles.css"
import {
  AppShell,
  AppShellNavbar,
  AppShellMain,
  MantineProvider,
  AppShellHeader,
  Group,
  Burger,
  useMantineColorScheme,
} from "@mantine/core"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { Schedule } from "./pages/Schedule"
import { Employees } from "./pages/Employees"
import { Bookings } from "./pages/Bookings"
import { RequireAuth } from "./components/RequireAuth"
import { Navbar } from "./components/Navbar"
import { Notifications } from "@mantine/notifications"
import "mantine-react-table/styles.css"
import { useDisclosure } from "@mantine/hooks"
import { ActionIcon } from "@mantine/core"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { NavigationProgress } from "@mantine/nprogress"

function InnerApp() {
  const auth = useAuth()
  const [opened, { toggle, close }] = useDisclosure(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <BrowserRouter>
      <AppShell
        disabled={!auth.user}
        header={{ height: 60 }}
        navbar={
          auth.user && {
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }
        }
      >
        <AppShellHeader>
          <Group justify="space-between" px="md" h="100%">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            Staff Scheduler
            <ActionIcon variant="subtle" onClick={() => toggleColorScheme()}>
              {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
            </ActionIcon>
          </Group>
        </AppShellHeader>

        <AppShellNavbar>
          <Navbar onLinkClick={close} />
        </AppShellNavbar>

        <AppShellMain>
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
        </AppShellMain>
      </AppShell>
    </BrowserRouter>
  )
}

function App() {
  return (
    <MantineProvider
      theme={{
        colors: {
          green: [
            "#f0faf2",
            "#dff2e4",
            "#bbe5c4",
            "#92d8a2",
            "#71cc86",
            "#5dc573",
            "#52c26a",
            "#42ab58",
            "#38984d",
            "#2a8340",
          ],
          orange: [
            "#fff6e1",
            "#ffeccc",
            "#fed79c",
            "#fcc067",
            "#fcad3b",
            "#fba11f",
            "#fb9b0d",
            "#df8700",
            "#c77700",
            "#ae6600",
          ],
        },
        primaryColor: "green",
        primaryShade: 9,
      }}
    >
      <AuthProvider>
        <InnerApp />
        <Notifications />
        <NavigationProgress />
      </AuthProvider>
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
