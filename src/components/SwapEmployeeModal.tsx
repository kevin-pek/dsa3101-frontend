import { Stack, Select, Button, Space } from "@mantine/core"
import React, { useCallback, useState, useMemo } from "react"
import { useEmployees } from "../hooks/use-employees"
import { useLocalSchedule } from "../hooks/use-schedules"
import { Role } from "../types/employee"
import { Schedule } from "../types/schedule"

interface SwapEmployeeModalProps {
  onSubmit: CallableFunction
  schedule: Schedule
}

export const SwapEmployeeModal = ({ onSubmit, schedule }: SwapEmployeeModalProps) => {
  const { employees } = useEmployees()
  const updateSchedule = useLocalSchedule((state) => state.updateItem)
  const [selectedEmployee, setSelectedEmployee] = useState<string>()
  const [employeeError, setEmployeeError] = useState("")
  const [role, setRole] = useState<Role>()
  const [roleError, setRoleError] = useState("")

  const handleSwap = useCallback(async () => {
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
      const newSchedule = {
        ...schedule,
        employeeId: employee,
        role: role,
      }
      updateSchedule(newSchedule)
      onSubmit()
    }
  }, [selectedEmployee, employees, role])

  const employeeData = useMemo(() => employees.map((e) => e.name), [employees])

  return (
    <Stack>
      <Select
        required
        label="Swap with:"
        placeholder="Select another employee..."
        data={employeeData}
        value={selectedEmployee}
        onChange={(val) => setSelectedEmployee(val)}
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
        onChange={(val) => setRole(val as Role)}
        comboboxProps={{ withinPortal: false }}
        error={roleError}
      />
      <Space h="md" />
      <Button type="submit" onClick={handleSwap}>
        Swap
      </Button>
    </Stack>
  )
}
