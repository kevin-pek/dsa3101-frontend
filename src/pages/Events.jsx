import React from "react"
import { useState, useMemo } from "react"
import { MantineReactTable, useMantineReactTable, MRT_EditActionButtons } from "mantine-react-table"
import { ActionIcon, Button, Tooltip, Text, Group, Flex, Title, Stack, Modal } from "@mantine/core"
import { IconTrash, IconEdit } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import {
  useBookings,
  useDeleteBooking,
  useAddBooking,
  useUpdateBooking,
} from "../hooks/use-events"

export function Events() {
  // State and custon hooks for managing events
  const { bookings } = useBookings()
  const deleteBooking = useDeleteBooking()
  const addBooking = useAddBooking()
  const updateBooking = useUpdateBooking()

  // State management for UI elements and validations
  const [validationErrors, setValidationErrors] = useState({}) 
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)

  const columns = useMemo(
    () => [
      {
        accessorKey: "eventName",
        header: "Event Name",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
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
        accessorKey: "eventSession",
        header: "Event Session",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: ["Morning", "Night", "Fullday"],
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

  // Function to display validation errors using notifications
  function handleValidationErrors(errors) {
    let errorMessage = '';

    if (errors.eventName) {
      errorMessage = errors.eventName;
    } else if (errors.eventDate) {
      errorMessage = errors.eventDate;
    } else if (errors.eventSession) {
      errorMessage = errors.eventSession;
    } else if (errors.numPax) {
      errorMessage = errors.numPax;
    } else if (errors.staffReq) {
      errorMessage = errors.staffReq;
    }
    
    if (errorMessage) {
      notifications.show({
        message: errorMessage,
        color: 'red',
        withBorder: true,
      });
    }
  }

  // UPDATE action
  const handleUpdateBooking = async ({ row, values, table }) => {
    // const newValidationErrors = validateEvent(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    // setValidationErrors({})
    const updatedBooking = { ...values, id: row.original.id }

    let errors = {};
    if (!values.eventName) {
      errors.eventName = "Event Name is required.";
    } else if (!values.eventDate) {
      errors.eventDate = 'Please input the date of Event';
    } else if (!values.eventSession) {
      errors.eventSession = 'Please select an Event Session';
    } else if (!values.numPax) {
      errors.numPax = 'Please input the Number of Pax'
    } else if (!values.staffReq) {
      errors.staffReq = 'Please input the number of Staff Required';
    }
    setValidationErrors(errors);
    // If there are errors, show notifications and do not proceed
    if (Object.keys(errors).length > 0) {
      handleValidationErrors(errors);
      return;  
    }
    // If validation passes, update the employee
    await updateBooking(updatedBooking)
    setValidationErrors({})
    table.setEditingRow(null)
  }

  // DELETE action
  const handleDeleteBooking = (eventId) => {
    setBookingToDelete(eventId)
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
    // const newValidationErrors = validateEvent(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    let errors = {};
    if (!values.eventName) {
      errors.eventName = "Event Name is required.";
    } else if (!values.eventDate) {
      errors.eventDate = 'Please input the date of Event';
    } else if (!values.eventSession) {
      errors.eventSession = 'Please select an Event Session';
    } else if (!values.numPax) {
      errors.numPax = 'Please input the Number of Pax'
    } else if (!values.staffReq) {
      errors.staffReq = 'Please input the number of Staff Required';
    }
    setValidationErrors(errors);

    // If there are errors, show notifications and do not proceed
    if (Object.keys(errors).length > 0) {
      handleValidationErrors(errors);
      return;  
    }

    await addBooking(values)
    setValidationErrors({})
    exitCreatingMode()
  }


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
          <ActionIcon color="red" onClick={() => handleDeleteBooking(row.original.id)}>
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
