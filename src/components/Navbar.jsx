import {
  IconUsers,
  IconDashboard,
  IconCalendarWeek,
  IconCalendarEvent,
  IconLogout,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { useState } from "react"
import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core"
import classes from "./navbar.module.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/auth"

const data = [
  { link: "/", label: "Dashboard", icon: IconDashboard },
  { link: "/schedule", label: "Schedule", icon: IconCalendarWeek },
  { link: "/employees", label: "Employees", icon: IconUsers },
  { link: "/bookings", label: "Bookings", icon: IconCalendarEvent },
]

export function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === location.pathname || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault()
        navigate(item.link)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          Staff Scheduler
          <ActionIcon variant="subtle" onClick={() => toggleColorScheme()}>
            {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
          </ActionIcon>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="/login"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault()
            auth.setUser(null)
            navigate("/login")
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  )
}
