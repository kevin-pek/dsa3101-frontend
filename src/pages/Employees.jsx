import React from "react"
import { useState, useMemo, useRef } from "react"
import { MantineReactTable, useMantineReactTable, MRT_EditActionButtons } from "mantine-react-table"
import { ActionIcon, Button, Tooltip, Text, Group, Flex, Title, Stack, Modal } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { IconPlus, IconTrash, IconUpload, IconEdit } from "@tabler/icons-react"
import {
  useEmployees,
  useDeleteEmployee,
  useUpdateEmployee,
  useUploadEmployee,
  useAddEmployee,
} from "../hooks/use-employees"

export function Employees() {
  const { employees } = useEmployees()
  const deleteEmployee = useDeleteEmployee()
  const addEmployee = useAddEmployee()
  const updateEmployee = useUpdateEmployee()
  const uploadEmployee = useUploadEmployee()
  const openRef = useRef(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [validationErrors, setValidationErrors] = useState({}) // to add validation
  const [file, setFile] = useState(null)
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
        accessorKey: "type",
        header: "FT/PT",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: ["FT", "PT"], // to change
          required: true,
        }),
      },
      {
        accessorKey: "wage",
        header: "Wage",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "int",
          required: true,
        }),
      },
      {
        accessorKey: "role",
        header: "Role",
        editVariant: "select",
        mantineEditSelectProps: ({ cell, row }) => ({
          data: ["Manager", "Server", "Cook", "Dishwasher"], // to change
          required: true,
        }),
      },
      {
        accessorKey: "mon",
        header: "Monday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "tues",
        header: "Tuesday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "wed",
        header: "Wednesday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "thurs",
        header: "Thursday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "fri",
        header: "Friday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "sat",
        header: "Saturday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
      {
        accessorKey: "sun",
        header: "Sunday",
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: "string",
          required: true,
        }),
      },
    ],
    [validationErrors],
  )

  // ADD action
  const handleAddEmployee = async ({ values, exitCreatingMode }) => {
    setValidationErrors({})
    await addEmployee(values)
    exitCreatingMode()
  }

  // UPDATE action
  const handleUpdateEmployee = async ({ row, values, table }) => {
    const updatedEmployee = { ...values, id: row.original.id }
    await updateEmployee(updatedEmployee)
    setValidationErrors({})
    table.setEditingRow(null)
  }

  // DELETE action
  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId)
    setDeleteModalOpen(true)
  }

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return

    try {
      await deleteEmployee(employeeToDelete)
      console.log(`Employee with ID ${employeeToDelete} has been removed successfully.`)
    } catch (error) {
      console.error(`Error deleting employee with ID ${employeeToDelete}:`, error)
    }

    setDeleteModalOpen(false)
    setEmployeeToDelete(null)
  }

  // For CSV upload
  const handleUpload = async (selectedFile) => {
    await uploadEmployee(selectedFile)
    setFile(selectedFile)
  }

  const table = useMantineReactTable({
    columns,
    data: employees,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableBottomToolbar: false,
    defaultColumn: {
      minSize: 30,
      maxSize: 9001,
      size: 120,
    },
    mantineTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleAddEmployee,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdateEmployee,
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
        Create New Employee
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
