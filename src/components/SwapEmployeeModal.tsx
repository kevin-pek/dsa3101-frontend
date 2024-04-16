import { Stack, Select, Button, Space, ComboboxItem } from "@mantine/core"
import React, { useCallback, useState, useMemo } from "react"
import { useEmployees } from "../hooks/use-employees"
import { useLocalSchedule } from "../hooks/use-schedules"
import { Role } from "../types/employee"
import { Schedule } from "../types/schedule"
import { DoW } from "../types/constants"

interface SwapEmployeeModalProps {
  onSubmit: CallableFunction
  schedule: Schedule
}

export const SwapEmployeeModal = ({ onSubmit, schedule }: SwapEmployeeModalProps) => {
  const { employees } = useEmployees()
  const updateSchedule = useLocalSchedule((state) => state.updateItem)
  const employeeData = useMemo<ComboboxItem[]>(
    () => employees.map((e) => ({ label: e.name, value: e.id.toString() })),
    [employees],
  )
  const [searchVal, setSearchVal] = useState(
    employees.find((e) => e.id === schedule.employeeId)?.name,
  )
  const [emp, setEmp] = useState<ComboboxItem>(
    employeeData.find((e) => parseInt(e.value) === schedule.employeeId),
  )
  const [employeeError, setEmployeeError] = useState("")
  const [dow, setDow] = useState<DoW>(schedule.day)
  const [dowError, setDowError] = useState("")
  const [role, setRole] = useState<Role>(schedule.role)
  const [roleError, setRoleError] = useState("")

  const handleSwap = useCallback(async () => {
    let valid = true
    if (!emp || !employees.some((e) => e.id === parseInt(emp.value))) {
      setEmployeeError("Invalid employee selected!")
      valid = false
    } else setEmployeeError("")
    if (!dow || !Object.values(DoW).includes(dow)) {
      setDowError("Invalid Day of Week!")
      valid = false
    } else setDowError("")
    if (!role || !Object.values(Role).includes(role)) {
      setRoleError("Invalid role selected!")
      valid = false
    } else setRoleError("")
    if (valid) {
      const newSchedule = {
        ...schedule,
        day: dow,
        employeeId: parseInt(emp.value),
        role: role,
      }
      updateSchedule(newSchedule)
      onSubmit()
    }
  }, [emp, employees, role, dow])

  return (
    <Stack>
      <Select
        required
        label="Swap with:"
        placeholder="Select another employee..."
        data={employeeData}
        defaultValue={emp?.label ?? ""}
        searchValue={searchVal}
        onSearchChange={setSearchVal}
        onChange={(_, opt) => setEmp(opt)}
        comboboxProps={{ withinPortal: false }}
        searchable
        clearable
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
      <Select
        required
        label="Day:"
        placeholder="Change day..."
        data={Object.values(DoW)}
        value={dow}
        onChange={(val) => setDow(val as DoW)}
        comboboxProps={{ withinPortal: false }}
        error={dowError}
      />
      <Space h="md" />
      <Button type="submit" onClick={handleSwap}>
        Swap
      </Button>
    </Stack>
  )
}
