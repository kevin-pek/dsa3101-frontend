import React, { useState } from 'react';
import { MRT_EditActionButtons, MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Flex, Stack, Text, Title, ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { fakeBookings } from '../sampleBookings.jsx';
// import {
//   useMutation,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { modals } from '@mantine/modals';


export function Bookings() {
  const [bookings, setBookings] = useState(fakeBookings); // Manage state of bookings here
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);

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

  // const handleDeleteBooking = (bookingId) => {
  //   modals.openConfirmModal({
  //     title: 'Are you sure you want to delete this event?',
  //     children: (
  //       <Text>
  //         Are you sure you want to delete this event? This action cannot be undone.
  //       </Text>
  //     ),
  //     labels: { confirm: 'Delete', cancel: 'Cancel' },
  //     confirmProps: { color: 'red' },
  //     onConfirm: () => deleteBooking(bookingId),
  //   });
  // };

  const handleDeleteBooking = (bookingId) => {
    setBookingIdToDelete(bookingId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // Perform delete action here with bookingIdToDelete
    deleteBooking(bookingIdToDelete);
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const deleteBooking = (bookingId) => {
    const updatedBookings = bookings.filter(booking => booking.bookingId !== bookingId);
    setBookings(updatedBookings);
  };

  const table = useMantineReactTable({
    columns,
    data: fakeBookings,
    createDisplayMode: 'modal',
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
          <ActionIcon color="red" onClick={() => handleDeleteBooking(row.original.bookingId)}>
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
      <Modal
        opened={showDeleteConfirmation}
        onClose={cancelDelete}
        title="Are you sure you want to delete this event?"
        overlayOpacity={0.7}
      >
        <Container textAlign="center">
          <Text>This action cannot be undone.</Text>
          <Button onClick={confirmDelete} color="red">Delete</Button>
          <Button onClick={cancelDelete}>Cancel</Button>
        </Container>
      </Modal>
    </div>
  );
}

// const { mutateAsync: deleteUser} = useDeleteUser();
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

// NOTE: api linked codes are in api > booking.js
