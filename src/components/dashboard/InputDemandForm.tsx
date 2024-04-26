import React, { useState } from "react"
import { useCounter } from "@mantine/hooks"
import {
  Button,
  Title,
  Space,
  NumberInput,
  Stack,
  ActionIcon,
  ActionIconGroup,
  Grid,
} from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useAddActualDemand } from "../../hooks/use-demand"
import { DoW } from "../../types/constants"
import dayjs from "dayjs"
import { IconCheck } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"

// use this array since the getDay() function starts from Sunday
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function InputDemandForm() {
  const addDemand = useAddActualDemand()
  const [count, handlers] = useCounter(0, { min: 0, max: 100000 })
  const [date, setDate] = useState(new Date())

  const incrementByTen = () => {
    handlers.set(count + 10)
  }

  const decrementByTen = () => {
    handlers.set(count - 10)
  }

  const handleSubmit = async () => {
    const demand = {
      customers: count,
      date: dayjs(date).format("YYYY-MM-DD"),
      day: days[date.getDay()] as DoW,
      time: date.toLocaleTimeString(),
    }
    await addDemand(demand)
    notifications.show({
      color: "teal",
      title: "Success",
      message: `Demand data uploaded successfully.`,
      icon: <IconCheck />,
      loading: false,
      autoClose: 2000,
      withCloseButton: true,
    })
    handlers.reset()
  }

  return (
    <Stack>
      <Title order={5}>Input Actual Customer Count:</Title>
      <DateTimePicker value={date} onChange={setDate} label="Date & Time:" />
      <Grid>
        <Grid.Col span={8}>
          <NumberInput
            label="No. of Customers"
            value={count}
            onChange={handlers.set}
            placeholder="Enter number of customers..."
          />
        </Grid.Col>
        <Grid.Col span={4} style={{ alignContent: "flex-end" }}>
          <ActionIconGroup>
            <ActionIcon p="md" px="lg" variant="default" onClick={incrementByTen}>
              +10
            </ActionIcon>
            <ActionIcon p="md" px="lg" variant="default" onClick={decrementByTen}>
              -10
            </ActionIcon>
          </ActionIconGroup>
        </Grid.Col>
      </Grid>
      <Space />
      <Button type="submit" fullWidth onClick={handleSubmit}>
        Submit
      </Button>
    </Stack>
  )
}

export default InputDemandForm
