import { Stack, Select, Button } from "@mantine/core"
import React, { useCallback, useState, useMemo } from "react"
import { useEmployees } from "../hooks/use-employees"
import { useSchedules } from "../hooks/use-schedules"
import { useSWRConfig } from "swr"
import { Role } from "../types/employee"

export const SwapEmployeeModal = ({ onSubmit }) => {
  const { employees } = useEmployees()
  const { schedules } = useSchedules()
  const { mutate } = useSWRConfig()
  const [selectedEmployee, setSelectedEmployee] = useState()
  const [employeeError, setEmployeeError] = useState("")
  const [role, setRole] = useState<Role>()
  const [roleError, setRoleError] = useState("")

  const handleSwap = useCallback(() => {
    console.log("Swap!")
    let valid = true
    const employee = employees.find((e) => e.name === selectedEmployee)?.id
    if (!employee) {
      setEmployeeError("Invalid employee selected!")
      valid = false
    } else setEmployeeError("")
    if (!role || !Object.values(Role).includes(role)) {
      setRoleError("Invalid role selected!")
      valid = false
    } else setRoleError("")
    if (valid) {
      // mutate("Schedule", [...schedule])
      onSubmit()
    }
  }, [selectedEmployee, employees, role, schedules])

  const employeeData = useMemo(() => employees.map((e) => e.name), [employees])

  return (
    <Stack>
      <Select
        required
        label="Swap with:"
        placeholder="Select another employee..."
        data={employeeData}
        value={selectedEmployee}
        onChange={setSelectedEmployee}
        comboboxProps={{ withinPortal: false }}
        searchable
        nothingFoundMessage="No employees found..."
        error={employeeError}
      />
      <Select
        required
        label="Role:"
        placeholder="Change role..."
        data={Object.values(Role)}
        value={role}
        onChange={setRole}
        comboboxProps={{ withinPortal: false }}
        error={roleError}
      />
      <Button type="submit" onClick={handleSwap}>
        Swap
      </Button>
    </Stack>
  )
}
