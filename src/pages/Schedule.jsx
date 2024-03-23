import {
  Button,
  ActionIcon,
  Divider,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Text,
  Paper,
  Select,
  Stack,
  Group,
  Container,
  Grid,
  NumberInput,
  Space,
  GridCol,
  List,
  ListItem,
  ColorSwatch,
  ScrollArea,
} from "@mantine/core"
import { WeeklySchedule } from "../components/WeeklySchedule"
import { IconPlus, IconCoin, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react"
import { useCallback, useMemo, useState } from "react"
import { useSWRConfig } from "swr"
import { useEmployees } from "../hooks/use-employees"
import { useSchedule } from "../hooks/use-schedule"
import { roles, daysOfWeek } from "../utils/constants"
import { useMediaQuery } from "@mantine/hooks"

const AddSchedulePopover = () => {
  const [role, setRole] = useState()
  const [roleError, setRoleError] = useState("")
  const [selectedDay, setSelectedDay] = useState()
  const [dayError, setDayError] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState()
  const [employeeError, setEmployeeError] = useState("")
  const { employees } = useEmployees()
  const { schedule } = useSchedule()
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)

  const handleSubmit = useCallback(() => {
    let valid = true
    const employee = employees.find((e) => e.name === selectedEmployee)?.id
    if (!employee) {
      setEmployeeError("Invalid employee selected!")
      valid = false
    } else setEmployeeError("")
    if (!role || !roles.includes(role)) {
      setRoleError("Invalid role selected!")
      valid = false
    } else setRoleError("")
    if (!selectedDay || !daysOfWeek.includes(selectedDay)) {
      setDayError("Invalid day selected!")
      valid = false
    } else setDayError("")
    if (valid) {
      const newSchedule = {
        employeeId: employee,
        start: "1000", // give new schedules default values
        end: "2200",
        day: selectedDay,
        role: role,
      }
      console.debug("Inserting schedule: ", newSchedule)
      // mutate("Schedule", [...schedule, newSchedule])
      setOpen(false)
      setSelectedEmployee() // reset fields if successful creation
      setRole()
      setSelectedDay()
    }
  }, [schedule, selectedEmployee, role, selectedDay, employees])

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
            placeholder="Select role..."
            data={roles}
            value={role}
            onChange={setRole}
            comboboxProps={{ withinPortal: false }}
            error={roleError}
          />
          <Select
            comboboxProps={{ withinPortal: false }}
            required
            label="Day"
            placeholder="Select day of week..."
            value={selectedDay}
            onChange={setSelectedDay}
            data={daysOfWeek}
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

export function Schedule() {
  const cost = 1000
  const diff = -10
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  const isMobile = useMediaQuery("(max-width: 50em)")

  return (
    <Container fluid>
      <ScrollArea>
        <WeeklySchedule />
      </ScrollArea>

      <Divider label={<AddSchedulePopover />} labelPosition="center" />

      <Space h="md" />

      <Grid>
        <GridCol span={isMobile ? 12 : 4}>
          <Stack>
            <Paper withBorder p="md" radius="md">
              <Text size="md" c="dimmed" fw={700}>
                Legend
              </Text>
              <Text fz="md" c="dimmed" my={8}>
                Each role is indicated by their colour
              </Text>
              <List
                withPadding
                center
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1.1em" color="var(--mantine-color-orange-6)" />}
                >
                  Dishwasher
                </ListItem>
                <ListItem component="span" icon={<ColorSwatch size="1.1em" color="teal" />}>
                  Chef
                </ListItem>
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1.1em" color="var(--mantine-color-green-4)" />}
                >
                  Waiter
                </ListItem>
              </List>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Group justify="space-between">
                <Text size="md" c="dimmed" fw={700}>
                  Projected Cost
                </Text>
                <IconCoin size="1.4rem" stroke={1.5} />
              </Group>
              <Group align="flex-end" gap="xs" mt={25}>
                <Text size="lg">{cost}</Text>
                <Text c={diff > 0 ? "teal" : "red"} fz="sm" fw={500}>
                  <span>{diff}%</span>
                  <DiffIcon size="1rem" stroke={1.5} />
                </Text>
              </Group>
              <Text fz="md" c="dimmed" mt={8}>
                based on currently shown schedule
              </Text>
            </Paper>
          </Stack>
        </GridCol>

        <GridCol span={isMobile ? 12 : 8}>
          <Grid>
            <GridCol>
              <Text size="xl" fw={700}>
                Settings
              </Text>
              <Text>Adjust these inputs according to your current policy.</Text>
            </GridCol>
            <GridCol span={6} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <NumberInput
                label="Max Work Hours per Week (FT)"
                defaultValue={60}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Weekly Salary (FT)"
                placeholder="Dollars"
                defaultValue={600.0}
                decimalScale={2}
                fixedDecimalScale
                min={0}
                prefix="$"
              />
              <NumberInput
                label="Max Work Hours per Week (PT)"
                defaultValue={48}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Hourly Rate (PT)"
                placeholder="Dollars"
                defaultValue={14.0}
                decimalScale={2}
                fixedDecimalScale
                min={0}
                prefix="$"
              />
            </GridCol>
            <GridCol span={6} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <NumberInput
                label="Min. Number of Chefs"
                defaultValue={4}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Min. Number of Waiters"
                defaultValue={3}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Min. Number of Dishwashers"
                defaultValue={1}
                min={0}
                allowDecimal={false}
              />
            </GridCol>
          </Grid>

          <Button mt="md" fullWidth>
            Generate Schedule
          </Button>
        </GridCol>
      </Grid>

      <Space h="xl" />
    </Container>
  )
}
