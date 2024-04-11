import {
  IconUsers,
  IconDashboard,
  IconCalendarWeek,
  IconCalendarEvent,
  IconLogout,
} from "@tabler/icons-react"
import classes from "./navbar.module.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"

const data = [
  { link: "/", label: "Dashboard", icon: IconDashboard },
  { link: "/schedule", label: "Schedule", icon: IconCalendarWeek },
  { link: "/employees", label: "Employees", icon: IconUsers },
  { link: "/events", label: "Events", icon: IconCalendarEvent },
]

export function Navbar({ onLinkClick }) {
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
        onLinkClick()
        navigate(item.link)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

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
