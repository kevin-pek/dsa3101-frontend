import React from 'react';
import { useState } from 'react';
import { MRT_EditActionButtons,MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Flex,
  Stack,
  Text,
  Title, ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { ModalsProvider, modals } from '@mantine/modals';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeBookings } from '../sampleBookings.jsx';

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
    createDisplayMode: 'row',
    editDisplayMode: 'modal', // changed from table to modal
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableBottomToolbar: false,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Add New Event</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
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
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true); 
        }}
      >
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

// const { mutateAsync: deleteUser} = useDeleteUser();

// functions below
//DELETE action
const openDeleteConfirmModal = (row) =>
modals.openConfirmModal({
  title: 'Are you sure you want to delete this event?',
  children: (
    <Text>
      Are you sure you want to delete {row.original.eventName} on 
      {row.original.eventDate}? This action cannot be undone.
    </Text>
  ),
  labels: { confirm: 'Delete', cancel: 'Cancel' },
  confirmProps: { color: 'red' },
  onConfirm: () => deleteBooking(row.original.bookingId),
});

 //UPDATE action
//  const handleSaveUser = async ({ values, table }) => {
//   const newValidationErrors = validateUser(values);
//   if (Object.values(newValidationErrors).some((error) => error)) {
//     setValidationErrors(newValidationErrors);
//     return;
//   }
//   setValidationErrors({});
//   await updateUser(values);
//   table.setEditingRow(null); //exit editing mode
// };


function deleteBooking(bookingId) {
  // Use useState hook to manage state of bookings
  const [bookings, setBookings] = useState(fakeBookings);

  // Filter out the booking with the provided bookingId
  const updatedBookings = bookings.filter(booking => booking.bookingId !== bookingId);

  // Update state with the filtered bookings
  setBookings(updatedBookings);

  // Return the updated bookings array
  return updatedBookings;
}

// NOTE: api linked codes are in api > booking.js
