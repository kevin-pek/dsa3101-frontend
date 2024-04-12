import React from 'react';
import { Select } from '@mantine/core';
import { IconSelect } from "@tabler/icons-react";

function Dropdown({ selected, setSelected }) {
    const options = [
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Yearly', label: 'Yearly' }
    ];

    return (
            <Select
                value={selected}
                onChange={setSelected}
                data={options}
                label="Current Selected View"
                placeholder="Select option"
                width={200}
            />
    );
}

export default Dropdown;
