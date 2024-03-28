import React from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { fakeBookings } from '../sampleBookings';

export function Bookings() {
  const columns = [
    { 
      accessorKey: 'eventName',
      header: 'Event Name', 
      mantineEditTextInputProps: ({ cell, row }) => ({ 
        type: 'text',
        required: true
      })
    },
    {
      accessorKey: 'eventDate',
      header: 'Event Date', 
      mantineEditTextInputProps: ({ cell, row }) => ({ 
        type: 'date', 
        required: true
      })
    },
    { // try and get this automated once you get the day
      accessorKey: 'eventDay',
      header: 'Event Day', 
      mantineEditTextInputProps: ({ cell, row }) => ({ 
        type: 'select', 
        options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'],
        required: true
      })
    },
    {
      accessorKey: 'eventSTime',
      header: 'Start Time',
      mantineEditTextInputProps: ({cell,row}) => ({
        type: 'time',
        required: true
      })
    },
    {
      accessorKey: 'eventETime',
      header: 'End Time',
      mantineEditTextInputProps: ({cell,row}) => ({
        type: 'time',
        required: true
      })
    },
    {
      accessorKey: 'numPax',
      header: 'Number of Pax',
      mantineEditTextInputProps: ({cell,row}) => ({
        type: 'number',
        required: true
      })
    },
    {
      accessorKey: 'staffReq',
      header: 'Number of Staff Required',
      mantineEditTextInputProps: ({cell,row}) => ({
        type: 'number',
        required: true
      })
    },
    {
      accessorKey: 'remark',
      header: 'Remarks (if any)',
      mantineEditTextInputProps: ({cell,row}) => ({
        type: 'Text',
        required: false
      })
    }
  ];

  const table = useMantineReactTable({
    columns,
    data: fakeBookings,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableBottomToolbar: false,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveEmployee,
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Event</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row }) => (
      <>
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red">
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button>
        Add New Event
      </Button>
    )
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <MantineReactTable table={table}/>
    </div>
  );
}