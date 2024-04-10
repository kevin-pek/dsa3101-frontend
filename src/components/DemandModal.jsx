import { useState } from 'react';
import { useDisclosure, useCounter } from '@mantine/hooks';
import { Modal, Button, Group, Text, TextInput } from '@mantine/core';
import DateRange from './DateRange.jsx';

function DemandModal() {
  const [opened, { close, open }] = useDisclosure(false);
  const [count, handlers] = useCounter(0, { min: 0, max: 100000 });
  const [inputValue, setInputValue] = useState('');

  const incrementByTen = () => {
    handlers.set(count + 10);
  };

  const decrementByTen = () => {
    handlers.set(count - 10);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSetCount = () => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue)) {
      handlers.set(newValue);
      setInputValue('');
    }
  };

  return (
    <>
      <div></div>
      <Modal opened={opened} onClose={close} size="auto" fontWeight="bold" title=" Demand Forecast Figures">
        <Text>Select Date</Text>

        <DateRange />

        <div style={{ padding: '20px' }}></div>

        <Text>Enter Number of Customers</Text>

        <div>
          <Text>Count: {count}</Text>
          <div style={{ padding: '10px' }}></div>
          <Group justify="center">
            {/* Input field for manual count input */}
            <TextInput
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter count"
              style={{ width: '100px' }}
            />

            {/* Button to set the count manually */}
            <Button onClick={handleSetCount}>Submit Count</Button>

            <Button onClick={handlers.reset}>Reset</Button>

            <Button onClick={handlers.increment}>Increase</Button>
            <Button onClick={incrementByTen}>Increase by 10</Button>

            <Button onClick={handlers.decrement}>Decrease</Button>
            <Button onClick={decrementByTen}>Decrease by 10</Button>

          </Group>
        </div>
      </Modal>

      <Button onClick={open}>Input Demand Figures</Button>
    </>
  );
}

export default DemandModal;