import { useDisclosure, useCounter } from '@mantine/hooks';
import { Modal, Button, Group, Text, Badge } from '@mantine/core';
import DatePicker from './DatePicker.jsx'

function DemandModal() {
  const [opened, { close, open }] = useDisclosure(false);
  const [count, { increment, decrement }] = useCounter(3, { min: 0 });

  const badges = Array(count)
    .fill(0)
    .map((_, index) => <Badge key={index}>Badge {index}</Badge>);

  return (
    <>
    <div>
      
    </div>
      <Modal opened={opened} onClose={close} size="auto" fontWeight="bold" title=" Demand Forecast Figures">
        <Text>Select Date</Text>

        <div style={{
          display: 'inline-block',
          textAlign: 'center',
          margin: '0 auto',
        }}>
          <DatePicker />
        </div>

        <Text>Input Number of Customers</Text>

        <Group wrap="nowrap" mt="md">
          {badges}
        </Group>

        <Group mt="xl">
          <Button onClick={increment}>Increase</Button>
          <Button onClick={decrement}>Decrease</Button>
        </Group>
      </Modal>

      <Button onClick={open}>Input Demand Figures</Button>
    </>
  );
}

export default DemandModal