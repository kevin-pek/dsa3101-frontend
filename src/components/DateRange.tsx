import React, { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css'

function DateRange() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  console.log(value)
  return (
        <DatePickerInput
            label="Pick Date Range"
            type="range" 
            value={value} 
            onChange={setValue}
        />
  );
}

export default DateRange;