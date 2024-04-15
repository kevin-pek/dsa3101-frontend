import { Button, Select, Stack, Space, ComboboxItem } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import { useEmployees } from "../hooks/use-employees"
import { Role } from "../types/employee"
import { DoW } from "../types/constants"
import { Schedule, Shift } from "../types/schedule"
import { getStartOfWeek } from "@mantine/dates"
import { shiftToString, stringToTimeString } from "../utils/time"
import React from "react"
import { useLocalSchedule } from "../hooks/use-schedules"
import dayjs from "dayjs"

interface AddScheduleModalProps {
  onSubmit: CallableFunction
}

export const AddScheduleModal = ({ onSubmit }: AddScheduleModalProps) => {
  const [role, setRole] = useState<Role>()
  const [roleError, setRoleError] = useState("")
  const [day, setDay] = useState<DoW>()
  const [dayError, setDayError] = useState("")
  const [emp, setEmp] = useState<ComboboxItem>() // selected employee combobox

  const [empError, setEmpError] = useState("")
  const [shift, setShift] = useState<Shift>()
  const [shiftError, setShiftError] = useState("")

  const addSchedule = useLocalSchedule((state) => state.addItem)
  const newId = useLocalSchedule((state) => state.newId)

  const { employees } = useEmployees()

  const handleSubmit = useCallback(async () => {
    let valid = true
    if (!emp || !employees.some((e) => e.id === parseInt(emp.value))) {
      setEmpError("Please select an employee.")
      valid = false
    } else setEmpError("")
    if (!shift || !Object.values(Shift).includes(shift)) {
      setShiftError("Please select a shift.")
      valid = false
    } else setShiftError("")
    if (!role || !Object.values(Role).includes(role)) {
      setRoleError("Please select a role.")
      valid = false
    } else setRoleError("")
    if (!day || !Object.values(DoW).includes(day)) {
      setDayError("Please select a day.")
      valid = false
    } else setDayError("")
    if (valid) {
      const timings = shiftToString(shift, role).split(" - ")
      const newSchedule: Schedule = {
        employeeId: parseInt(emp.value),
        start: stringToTimeString(timings[0]), // give new schedules default values
        end: stringToTimeString(timings[1]),
        day,
        role,
        shift,
        week: dayjs(getStartOfWeek(new Date())).format("YYYY-MM-DD"),
        id: newId,
      }
      addSchedule(newSchedule)
      setEmp(null) // reset fields if successful creation
      setRole(null)
      setDay(null)
      setShift(null)
      onSubmit()
    }
  }, [emp, role, day, employees, shift])

  // shifts with start end times added
  const addShiftTimes = useCallback(
    (shift: Shift) => ({
      label: `${shift.toString()} ${role ? "(" + shiftToString(shift, role) + ")" : ""}`,
      value: shift,
    }),
    [role],
  )

  const employeeData = useMemo<ComboboxItem[]>(() => employees.map((e) => ({ label: e.name, value: e.id.toString() })), [employees])

  return (
    <Stack miw="16em">
      <Select
        required
        label="Employee:"
        placeholder="Select employee..."
        data={employeeData}
        onChange={(_, opt) => setEmp(opt)}
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
        data={Object.values(Shift).filter(s => s !== Shift.None).map(addShiftTimes)}
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
