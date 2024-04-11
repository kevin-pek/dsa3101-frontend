import { Button, Select, Stack, Space } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import { useEmployees } from "../hooks/use-employees"
import { Role } from "../types/employee"
import { DoW } from "../types/constants"
import { Schedule, Shift } from "../types/schedule"
import { getStartOfWeek } from "@mantine/dates"
import { shiftToString } from "../utils/time"
import React from "react"
import { useLocalSchedule } from "../hooks/use-schedules"

interface AddScheduleModalProps {
  onSubmit: CallableFunction
}

export const AddScheduleModal = ({ onSubmit }: AddScheduleModalProps) => {
  const [role, setRole] = useState<Role>()
  const [roleError, setRoleError] = useState("")
  const [day, setDay] = useState<DoW>()
  const [dayError, setDayError] = useState("")
  const [empName, setEmpName] = useState<string>() // employee name
  const [empError, setEmpError] = useState("")
  const [shift, setShift] = useState<Shift>() // employee name
  const [shiftError, setShiftError] = useState("")

  const addSchedule = useLocalSchedule((state) => state.addItem)
  const newId = useLocalSchedule((state) => state.newId)

  const { employees } = useEmployees()

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
      const newSchedule: Schedule = {
        employeeId: employee,
        start: shiftToString(shift, role).substring(0, 3), // give new schedules default values
        end: shiftToString(shift, role).slice(-3),
        day,
        role,
        shift,
        week: getStartOfWeek(new Date()),
        id: newId,
      }
      addSchedule(newSchedule)
      setEmpName(null) // reset fields if successful creation
      setRole(null)
      setDay(null)
      setShift(null)
      onSubmit()
    }
  }, [empName, role, day, employees])

  const addShiftTimes = useCallback((shift: Shift) => (`${shift.toString()} ${role ? "(" + shiftToString(shift, role) + ")" : ""}`), [role])

  const employeeData = useMemo(() => employees.map((e) => e.name), [employees])

  return (
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
        comboboxProps={{ withinPortal: false }}
        required
        label="Day"
        placeholder="Select day of week..."
        value={day}
        onChange={(val) => setDay(val as DoW)}
        data={Object.values(DoW)}
        error={dayError}
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
        required
        label="Shift"
        placeholder="Select shift..."
        data={Object.values(Shift).map(addShiftTimes)}
        value={shift}
        onChange={(val) => setShift(val as Shift)}
        comboboxProps={{ withinPortal: false }}
        nothingFoundMessage="No shifts available..."
        error={shiftError}
      />
      <Space />
      <Button type="submit" onClick={handleSubmit}>
        Add
      </Button>
    </Stack>
  )
}
