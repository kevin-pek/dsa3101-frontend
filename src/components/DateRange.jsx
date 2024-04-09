import React, { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Group } from '@mantine/core';

function DateRange() {
  const [value, setValue] = useState([null, null]);

  return (
    <Group justify="center">
        <DatePicker type="range" allowSingleDateInRange value={value} onChange={setValue} />
    </Group>
  );
}

export default DateRange;