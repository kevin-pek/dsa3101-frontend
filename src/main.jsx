import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/use-auth"
import {
  AppShell,
  AppShellNavbar,
  AppShellMain,
  MantineProvider,
  AppShellHeader,
  Group,
  Burger,
  useMantineColorScheme,
  Title,
} from "@mantine/core"
import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { Planner } from "./pages/Planner"
import { Employees } from "./pages/Employees"
import { Events } from "./pages/Events"
import { RequireAuth } from "./components/RequireAuth"
import { Navbar } from "./components/Navbar"
import { Notifications, notifications } from "@mantine/notifications"
import { useDisclosure } from "@mantine/hooks"
import { ActionIcon } from "@mantine/core"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { NavigationProgress } from "@mantine/nprogress"
import { DatesProvider } from "@mantine/dates"
import { SWRConfig } from "swr"
import { IconCheck } from "@tabler/icons-react"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/nprogress/styles.css"
import "mantine-react-table/styles.css"
import "@mantine/dates/styles.css"

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
            width: 180,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }
        }
      >
        <AppShellHeader>
          <Group justify="space-between" px="md" h="100%">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={2}>Staff Scheduler</Title>
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
              path="/events"
              element={
                <RequireAuth>
                  <Events />
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
        {/* Set Monday as first day of week, ensure time follows SG time */}
        <DatesProvider settings={{ locale: "sg", firstDayOfWeek: 1, timezone: "Asia/Singapore" }}>
          <SWRConfig
            value={{
              refreshInterval: 0, // disable automatic refetching
              revalidateIfStale: false,
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              onError: (error, key) => {
                notifications.show({
                  id: key,
                  title: "Error",
                  message: error.message || "Failed to fetch data.",
                  color: "red",
                  withBorder: true,
                  autoClose: true,
                  withCloseButton: true,
                })
              },
              onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                notifications.update({
                  id: key,
                  title: "Error",
                  message: `${error.message || "Failed to fetch data"}. Retrying fetch ${key} data... Attempt ${retryCount + 1}`,
                  color: "red",
                  withBorder: true,
                  loading: true,
                  autoClose: true,
                  withCloseButton: true,
                })
                if (error.status === 404) return // dont retry on not found
                if (retryCount >= 5) return // only retry up to 5 times
                // Retry with exponential backoff
                const backoff = Math.min(1000 * 2 ** retryCount, 30000)
                setTimeout(() => revalidate({ retryCount }), backoff)
              },
              onSuccess: (data, key) => {
                const label =
                  key === "/schedule" ? "Schedule" : key === "/employee" ? "Employee" : "Event"
                notifications.show({
                  id: key,
                  color: "teal",
                  title: "Success",
                  message: `${label} data fetched successfully.`,
                  icon: <IconCheck />,
                  loading: false,
                  autoClose: 2000,
                  withCloseButton: true,
                })
              },
            }}
          >
            <InnerApp />
            <Notifications />
            <NavigationProgress />
          </SWRConfig>
        </DatesProvider>
      </AuthProvider>
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
