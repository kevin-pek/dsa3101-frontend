import React from 'react';
import { useState, useMemo } from "react";
import { MantineReactTable, useMantineReactTable,MRT_EditActionButtons } from 'mantine-react-table';
import { ActionIcon,
  Button,
  Tooltip,
  Text,
  Group,
  Flex,
  Title,
  Stack, } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { fakeBookings } from '../sampleBookings';
import { updateBooking, deleteBooking, addBooking } from '../api/booking';
import { List, DeleteButton } from "@refinedev/mantine";
import { Table, Pagination } from "@mantine/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";


export function Bookings() {
  const [validationErrors, setValidationErrors] = useState({}) // to add validation
  const columns = useMemo(
    () => [ 
      // { 
      //   accessorKey: 'bookingId',
      //   header: 'Booking ID', 
      //   mantineEditTextInputProps: ({ cell, row }) => ({ 
      //     type: 'number',
      //     required: true
      //   })
      // },
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
          type: 'text',
          required: false
        })
      }
    ],
    [validationErrors],
  )
  
// UPDATE action
  const handleSaveBooking = async ({ values, table }) => {
    await updateBooking(values)
    setValidationErrors({})
    table.setEditingRow(null)
  }

// ADD action
const handleAddBooking = async ({ values, table }) => {
  await addBooking(values)
  setValidationErrors({})
  table.setCreatingRow(true)
}

// delete action
const handleDeleteBooking = async (bookingId) => {
  const isConfirmed = window.confirm('Are you sure you want to delete this booking?');
  if (isConfirmed) {
    try {
      await deleteBooking(bookingId);
      console.log(`Booking with ID ${bookingId} has been deleted successfully.`);
    } 
    catch (error) {
      // Handle any errors that occur during the deletion operation
      console.error(`Error deleting booking with ID ${bookingId}:`, error);
    }
  }
};

  const table = useMantineReactTable({
    columns,
    data: fakeBookings,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableBottomToolbar: false,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleAddBooking,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBooking,
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
    renderRowActions: ({ row,table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => handleDeleteBooking(row.original.bookingId)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
      onClick={() =>
      {table.setCreatingRow(true);
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