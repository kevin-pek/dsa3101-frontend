import React from "react"
import { useState, useMemo } from "react"
import { MantineReactTable, useMantineReactTable, MRT_EditActionButtons } from "mantine-react-table"
import { ActionIcon, Button, Tooltip, Text, Group, Flex, Title, Stack, Modal } from "@mantine/core"
import { IconTrash, IconEdit } from "@tabler/icons-react"
import { useBookings, useDeleteBooking, useAddBooking, useUpdateBooking } from "../hooks/use-events"

export function Events() {
  const [validationErrors, setValidationErrors] = useState({}) // to add validation
  const { bookings } = useBookings()
  const deleteBooking = useDeleteBooking()
  const addBooking = useAddBooking()
  const updateBooking = useUpdateBooking()
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)

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
        accessorKey: "eventName",
        header: "Event Name",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "eventType",
        header: "Event Type",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "select",
          options: ["Wings of Time", "Others"],
          required: true,
        }),
      },
      {
        accessorKey: "eventDate",
        header: "Event Date",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "date",
          required: true,
        }),
      },
      {
        // try and get this automated once you get the day
        accessorKey: "eventDay",
        header: "Event Day",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "select",
          options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          required: true,
        }),
      },
      {
        accessorKey: "eventSTime",
        header: "Start Time",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "time",
          required: true,
        }),
      },
      {
        accessorKey: "eventETime",
        header: "End Time",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "time",
          required: true,
        }),
      },
      {
        accessorKey: "numPax",
        header: "Number of Pax",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "number",
          required: true,
        }),
      },
      {
        accessorKey: "staffReq",
        header: "Number of Staff Required",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "number",
          required: true,
        }),
      },
      {
        accessorKey: "remark",
        header: "Remarks (if any)",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: false,
        }),
      },
    ],
    [validationErrors],
  )

  // UPDATE action
  const handleUpdateBooking = async ({ row, values, table }) => {
    const updatedBooking = { ...values, id: row.original.bookingId }
    await updateBooking(updatedBooking)
    setValidationErrors({})
    table.setEditingRow(null)
  }

  // DELETE action
  const handleDeleteBooking = (bookingId) => {
    setBookingToDelete(bookingId)
    setDeleteModalOpen(true)
  }

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return

    try {
      await deleteBooking(bookingToDelete)
      console.log(`Event with ID ${bookingToDelete} has been removed successfully.`)
    } catch (error) {
      console.error(`Error deleting event with ID ${bookingToDelete}:`, error)
    }

    setDeleteModalOpen(false)
    setBookingToDelete(null)
  }

  // ADD action
  const handleAddBooking = async ({ values, exitCreatingMode }) => {
    setValidationErrors({})
    await addBooking(values)
    exitCreatingMode()
    // table.setCreatingRow(true)
  }

  // const handleCreateUser = async ({ values, exitCreatingMode }) => {
  //   const newValidationErrors = validateUser(values);
  //   if (Object.values(newValidationErrors).some((error) => !!error)) {
  //     setValidationErrors(newValidationErrors);
  //     return;
  //   }
  //   setValidationErrors({});
  //   await createUser(values);
  //   exitCreatingMode();
  // };

  const table = useMantineReactTable({
    columns,
    data: bookings,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableBottomToolbar: false,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleAddBooking,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdateBooking,
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
    renderRowActions: ({ row, table }) => (
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
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        Add New Event
      </Button>
    ),
  })

  return (
    <div style={{ overflowX: "auto" }}>
      <MantineReactTable table={table} />
      <div style={{ overflowX: "auto", padding: "25px" }}>
        <Group justify="right">
          <Modal
            opened={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Confirm Deletion"
          >
            <Text>Are you sure you want to remove this event?</Text>
            <Group position="right" spacing="md" mt="md">
              <Button variant="outline" color="gray" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={() => confirmDeleteBooking()}>
                Delete
              </Button>
            </Group>
          </Modal>
        </Group>
      </div>
    </div>
  )
}
