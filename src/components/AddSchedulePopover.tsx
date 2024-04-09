import {
  Button,
  ActionIcon,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Select,
  Stack,
  Space,
} from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { useCallback, useMemo, useState } from "react"
import { useEmployees } from "../hooks/use-employees"
import { useAddSchedule } from "../hooks/use-schedules"
import { Role } from "../types/employee"
import { DoW } from "../types/constants"
import { Schedule, Shift } from "../types/schedule"
import { getStartOfWeek } from "@mantine/dates"
import { shiftToString, stringToShift } from "../utils/time"
import React from "react"

export const AddSchedulePopover = () => {
  const [role, setRole] = useState<Role>()
  const [roleError, setRoleError] = useState("")
  const [day, setDay] = useState<DoW>()
  const [dayError, setDayError] = useState("")
  const [empName, setEmpName] = useState<string>() // employee name
  const [empError, setEmpError] = useState("")
  const [shift, setShift] = useState<Shift>() // employee name
  const [shiftError, setShiftError] = useState("")

  const { employees } = useEmployees()
  const [open, setOpen] = useState(false)
  const createSchedule = useAddSchedule()

  const handleSubmit = useCallback(async () => {
    let valid = true
    const employee = employees.find((e) => e.name === empName)?.id
    if (!employee) {
      setEmpError("Invalid employee selected!")
      valid = false
    } else setEmpError("")
    if (!shift || !Object.values(Shift).includes(shift)) {
      setShiftError("Invalid role selected!")
      valid = false
    } else setShiftError("")
    if (!role || !Object.values(Role).includes(role)) {
      setRoleError("Invalid role selected!")
      valid = false
    } else setRoleError("")
    if (!day || !Object.values(DoW).includes(day)) {
      setDayError("Invalid day selected!")
      valid = false
    } else setDayError("")
    if (valid) {
      const newSchedule: Omit<Schedule, "id"> = {
        employeeId: employee,
        start: shiftToString(shift, role), // give new schedules default values
        end: shiftToString(shift, role),
        day,
        role,
        shift,
        week: getStartOfWeek(new Date()),
      }
      await createSchedule(newSchedule)
      setOpen(false)
      setEmpName(null) // reset fields if successful creation
      setRole(null)
      setDay(null)
      setShift(null)
    }
  }, [empName, role, day, employees])

  const employeeData = useMemo(() => employees.map((e) => e.name), [employees])

  return (
    <Popover shadow="md" position="bottom" offset={-100} opened={open} onChange={setOpen}>
      <PopoverTarget>
        <ActionIcon onClick={() => setOpen(true)} variant="subtle" w="fit-content" px="xs">
          <IconPlus />
          Assign New Shift
        </ActionIcon>
      </PopoverTarget>
      <PopoverDropdown>
        <Stack miw="16em">
          <Select
            required
            label="Employee:"
            placeholder="Select employee..."
            data={employeeData}
            value={empName}
            onChange={(val) => setEmpName(val)}
            comboboxProps={{ withinPortal: false }}
            searchable
            nothingFoundMessage="No employees found..."
            error={empError}
          />
          <Select
            required
            label="Shift"
            placeholder="Select shift..."
            data={Object.values(Shift).map(toString)}
            value={shiftToString(shift, role)}
            onChange={(val) => setShift(stringToShift(val))}
            comboboxProps={{ withinPortal: false }}
            nothingFoundMessage="No shifts available..."
            error={shiftError}
          />
          <Select
            required
            label="Role:"
            placeholder="Select role..."
            data={Object.values(Role)}
            value={role}
            onChange={(val) => setRole(val as Role)}
            comboboxProps={{ withinPortal: false }}
            error={roleError}
          />
          <Select
            comboboxProps={{ withinPortal: false }}
            required
            label="Day"
            placeholder="Select day of week..."
            value={day}
            onChange={(val) => setDay(val as DoW)}
            data={Object.values(DoW)}
            error={dayError}
          />
          <Space />
          <Button type="submit" onClick={handleSubmit}>
            Add
          </Button>
        </Stack>
      </PopoverDropdown>
    </Popover>
  )
}
