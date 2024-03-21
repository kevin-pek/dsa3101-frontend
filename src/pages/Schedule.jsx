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
} from "@mantine/core"
import { WeeklySchedule } from "../components/WeeklySchedule"
import {
  IconPlus,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react"
import { useState } from "react"
// import { TimeInput } from "@mantine/dates"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const roles = ["Waiter", "Chef", "Dishwasher", "Manager"]

const AddEmployeePopover = ({ employees, onAddEmployee }) => {
  const [role, setRole] = useState()
  const [employee, setEmployee] = useState()

  return (
    <Stack>
      <Select
        label="Employee:"
        placeholder="Select employee..."
        data={employees}
        value={employee}
        onChange={(_value, option) => setEmployee(option)}
        searchable
      />
      <Select
        label="Role:"
        placeholder="Select role..."
        data={roles}
        value={role}
        onChange={(_value, option) => setRole(option)}
      />
      <Select label="Day" placeholder="Select day of week..." data={daysOfWeek} />
      {/* <Group>
        <TimeInput label="Start" step={1800} />
        <TimeInput label="End" step={1800} />
      </Group> */}
      <Button onClick={onAddEmployee}>Add</Button>
    </Stack>
  )
}

export function Schedule() {
  const cost = 1000
  const diff = -10
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  const addEmployee = () => {}

  return (
    <Container fluid>
      <WeeklySchedule schedule={schedule} />

      <Divider
        label={
          <Popover shadow="md" position="bottom" offset={-50}>
            <PopoverTarget>
              <ActionIcon variant="subtle" w="fit-content" px="xs">
                <IconPlus />
                Assign New Shift
              </ActionIcon>
            </PopoverTarget>
            <PopoverDropdown>
              <AddEmployeePopover
                onAddEmployee={addEmployee}
                employees={schedule}
              />
            </PopoverDropdown>
          </Popover>
        }
        labelPosition="center"
      />

      <Space h="md" />

      <Grid>
        <GridCol span={4}>
          <Stack>
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

            <Paper withBorder p="md" radius="md">
              <Text size="md" c="dimmed" fw={700}>
                Legend
              </Text>
              <Text fz="md" c="dimmed" my={8}>
                Each role is indicated by their colour
              </Text>
              <List withPadding center style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <ListItem component="span" icon={<ColorSwatch size="1.1em" color="var(--mantine-color-orange-6)" />}>Dishwasher</ListItem>
                <ListItem component="span" icon={<ColorSwatch size="1.1em" color="teal" />}>Chef</ListItem>
                <ListItem component="span" icon={<ColorSwatch size="1.1em" color="var(--mantine-color-green-4)" />}>Waiter</ListItem>
              </List>
            </Paper>

          </Stack>
        </GridCol>

        <GridCol span={8}>
          <Grid>
            <GridCol>
              <Text size="xl" fw={700}>Settings</Text>
              <Text>Adjust these inputs according to your current policy.</Text>
            </GridCol>
            <GridCol span={6} style={{ display: "flex", flexDirection: "column", gap: "8px"}}>
              <NumberInput
                label="Max Work Hours per Week (FT)"
                defaultValue={60}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Weekly Salary (FT)"
                placeholder="Dollars"
                defaultValue={600.00}
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
                defaultValue={14.00}
                decimalScale={2}
                fixedDecimalScale
                min={0}
                prefix="$"
              />
            </GridCol>
            <GridCol span={6} style={{ display: "flex", flexDirection: "column", gap: "8px"}}>
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

          <Button mt="md" fullWidth>Generate Schedule</Button>
        </GridCol>
      </Grid>
    </Container>
  )
}

const schedule = [
  {
    employeeId: 1,
    name: "John",
    start: "1200",
    end: "2000",
    day: "Monday",
    role: "Waiter",
  },
]
