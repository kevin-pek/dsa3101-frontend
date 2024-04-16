import React from "react"
import { useState, useMemo, useRef } from "react"
import { MantineReactTable, useMantineReactTable, MRT_EditActionButtons } from "mantine-react-table"
import {
  ActionIcon,
  Button,
  Tooltip,
  Text,
  Group,
  Flex,
  Title,
  Stack,
  Modal,
  Box,
  Space,
} from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { IconPlus, IconTrash, IconUpload, IconEdit, IconCheck } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import {
  useEmployees,
  useDeleteEmployee,
  useUpdateEmployee,
  useUploadEmployee,
  useAddEmployee,
} from "../hooks/use-employees"
import { Role } from "../types/employee"
import { Shift } from "../types/schedule"

/**
 * @typedef {import('../types/employee').Employee} Employee
 * @typedef {import('../types/employee').Role} Role
 * @typedef {import('../types/schedule').Shift} Shift
 */

/**
 * @type {import('mantine-react-table').MRT_ColumnDef<Employee>[]}
 */

export function Employees() {
  // State and custom hooks for managing employees
  const { employees } = useEmployees()
  const deleteEmployee = useDeleteEmployee()
  const addEmployee = useAddEmployee()
  const updateEmployee = useUpdateEmployee()
  const uploadEmployee = useUploadEmployee()

  // Ref for opening the Dropzone
  const openRef = useRef(null)

  // State management for UI elements and validations
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [validationErrors, setValidationErrors] = useState({}) // Store validation errors
  const [file, setFile] = useState(null) // Store the file for upload

  // Define table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Full Name",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "employmentType",
        header: "FT/PT",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: ["Full Time", "Part Time"],
          required: true,
        }),
      },
      {
        accessorKey: "wage",
        header: "Wage",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "number",
          required: true,
        }),
      },
      {
        accessorKey: "role",
        header: "Role",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Role),
          required: true,
        }),
      },
      {
        accessorKey: "secondaryRole",
        header: "Secondary Role",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Role),
          required: false,
        }),
      },
      {
        accessorKey: "mon",
        header: "Monday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
      {
        accessorKey: "tues",
        header: "Tuesday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
      {
        accessorKey: "wed",
        header: "Wednesday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
      {
        accessorKey: "thurs",
        header: "Thursday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
      {
        accessorKey: "fri",
        header: "Friday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
      {
        accessorKey: "sat",
        header: "Saturday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
      {
        accessorKey: "sun",
        header: "Sunday",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: Object.values(Shift),
          required: false,
        }),
      },
    ],
    [validationErrors],
  )

  // Function to display validation errors using notifications
  function handleValidationErrors(errors) {
    let errorMessage = ""

    if (errors.name) {
      errorMessage = errors.name
    } else if (errors.employmentType) {
      errorMessage = errors.employmentType
    } else if (errors.wage) {
      errorMessage = errors.wage
    } else if (errors.role) {
      errorMessage = errors.role
    }

    if (errorMessage) {
      notifications.show({
        message: errorMessage,
        color: "red",
        withBorder: true,
      })
    }
  }

  // Handler for adding a new employee
  const handleAddEmployee = async ({ values, exitCreatingMode }) => {
    let errors = {}

    // Add employee validation
    if (!values.name) {
      errors.name = "Name is required."
    } else if (!values.employmentType) {
      errors.employmentType = "Employment type is required."
    } else if (!values.wage) {
      errors.wage = "Wage is required."
    } else if (values.wage < 0) {
      errors.wage = "Invalid Wage."
    } else if (!values.role) {
      errors.role = "Role is required."
    }
    // Update state with any found errors
    setValidationErrors(errors)

    // If there are errors, show notifications and do not proceed
    if (Object.keys(errors).length > 0) {
      handleValidationErrors(errors)
      return
    }

    // If validation passes, add the employee
    await addEmployee(values)

    notifications.show({
      color: "teal",
      title: "Success",
      message: `Employee added successfully.`,
      icon: <IconCheck />,
      loading: false,
      autoClose: 2000,
      withCloseButton: true,
    })
    setValidationErrors({}) // Clear any existing errors
    exitCreatingMode()
  }

  // Handler for updating employee
  const handleUpdateEmployee = async ({ row, values, table }) => {
    const updatedEmployee = { ...values, id: row.original.id }
    let errors = {}

    // Add employee validation
    if (!values.name) {
      errors.name = "Name is required."
    } else if (!values.employmentType) {
      errors.employmentType = "Employment type is required."
    } else if (!values.wage) {
      errors.wage = "Wage is required."
    } else if (values.wage < 0) {
      errors.wage = "Invalid Wage."
    } else if (!values.role) {
      errors.role = "Role is required."
    }
    // Update state with any found errors
    setValidationErrors(errors)

    // If there are errors, show notifications and do not proceed
    if (Object.keys(errors).length > 0) {
      handleValidationErrors(errors)
      return
    }

    // If validation passes, update the employee
    await updateEmployee(updatedEmployee)
    setValidationErrors({})
    notifications.show({
      color: "teal",
      title: "Success",
      message: `Employee updated successfully.`,
      icon: <IconCheck />,
      loading: false,
      autoClose: 2000,
      withCloseButton: true,
    })
    table.setEditingRow(null)
  }

  // Handler for deleting employee
  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId)
    setDeleteModalOpen(true)
  }

  // Confirm delete action
  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return

    try {
      await deleteEmployee(employeeToDelete)
      console.log(`Employee with ID ${employeeToDelete} has been removed successfully.`)
    } catch (error) {
      console.error(`Error deleting employee with ID ${employeeToDelete}:`, error)
    }

    setDeleteModalOpen(false)
    notifications.show({
      color: "teal",
      title: "Success",
      message: `Employee deleted successfully.`,
      icon: <IconCheck />,
      loading: false,
      autoClose: 2000,
      withCloseButton: true,
    })
    setEmployeeToDelete(null)
  }

  // Handle CSV upload
  const handleUpload = async (selectedFile) => {
    await uploadEmployee(selectedFile)
    setFile(selectedFile)
  }

  // Table configuration with MantineReactTable
  const table = useMantineReactTable({
    columns,
    data: employees,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleAddEmployee,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdateEmployee,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Add New Employee</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Employee</Title>
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
          <ActionIcon color="red" onClick={() => handleDeleteEmployee(row.original.id)}>
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
        leftSection={<IconPlus size={20} />}
      >
        Add New Employee
      </Button>
    ),
  })

  // JSX structure for the Employees component
  return (
    <div style={{ overflowX: "auto" }}>
      <Box p="md">
        <Title order={2}>Employees</Title>
        <Space h="md" />
        <MantineReactTable table={table} />
      </Box>

      <div style={{ overflowX: "auto", padding: "25px" }}>
        <Group justify="right">
          <Modal
            opened={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Confirm Deletion"
          >
            <Text>Are you sure you want to remove this employee?</Text>
            <Group position="right" spacing="md" mt="md">
              <Button variant="outline" color="gray" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={() => confirmDeleteEmployee()}>
                Delete
              </Button>
            </Group>
          </Modal>
          <Dropzone
            openRef={openRef}
            onDrop={handleUpload}
            activateOnClick={false}
            accept={[
              "text/csv",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ]}
          >
            <Tooltip label="Employees CSV">
              <Button
                rightSection={<IconUpload size={18} />}
                onClick={() => openRef.current && openRef.current()}
                style={{ pointerEvents: "all" }}
              >
                Upload CSV
              </Button>
            </Tooltip>
          </Dropzone>
        </Group>
      </div>
    </div>
  )
}
