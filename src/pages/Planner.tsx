import {
  Button,
  Divider,
  Text,
  Paper,
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
  ActionIcon,
  ModalBody,
  Modal,
} from "@mantine/core"
import { WeeklySchedule } from "../components/schedule/WeeklySchedule"
import { IconCoin, IconArrowUpRight, IconArrowDownRight, IconPlus } from "@tabler/icons-react"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import React, { useEffect, useState } from "react"
import { AddScheduleModal } from "../components/AddSchedulePopover"
import { useSchedules } from "../hooks/use-schedules"
import { getStartOfWeek } from "@mantine/dates"
import { Schedule } from "../types/schedule"

export function Planner() {
  const { schedules } = useSchedules()
  const [opened, { open, close }] = useDisclosure(false) // modal for adding shift open
  const cost = 1000
  const diff = -10
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  const isMobile = useMediaQuery("(max-width: 50em)")

  // schedules to display are those that fall within the current week
  const [currSched, setCurrSched] = useState<Schedule[]>([])
  useEffect(() => {
    const weekStart = getStartOfWeek(new Date())
    const sched = schedules.filter((s) => weekStart === getStartOfWeek(s.week))
    setCurrSched(sched.length > 0 ? sched : [])
  }, [schedules])

  return (
    <Container fluid>
      <ScrollArea>
        <WeeklySchedule schedule={currSched} setSchedule={setCurrSched} />
      </ScrollArea>

      <Divider label={
        <ActionIcon onClick={open} variant="subtle" w="fit-content" px="xs">
          <IconPlus />
          Assign New Shift
        </ActionIcon>
      } labelPosition="center" />
    <Modal title="Add New Shift" centered fullScreen={isMobile} opened={opened} onClose={close}>
      <ModalBody>
        <AddScheduleModal onSubmit={close} />
      </ModalBody>
    </Modal>

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
                  icon={<ColorSwatch size="1.1em" color="var(--mantine-color-pink-4)" />}
                >
                  Manager
                </ListItem>
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
