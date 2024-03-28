import React from "react"
import { useState, useMemo } from "react"
import { MantineReactTable, useMantineReactTable, MRT_EditActionButtons } from "mantine-react-table"
import {
  ActionIcon,
  Button,
  Tooltip,
  FileButton,
  Text,
  Group,
  Flex,
  Title,
  Stack,
} from "@mantine/core"
import { IconPlus, IconTrash, IconUpload, IconEdit } from "@tabler/icons-react"
import { fakeEmployees } from "../sampleEmployees"
import { updateEmployee } from "../api/employee"

export function Employees() {
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

  // UPDATE action
  const handleSaveEmployee = async ({ values, table }) => {
    await updateEmployee(values)
    setValidationErrors({})
    table.setEditingRow(null)
  }

  // For CSV upload
  const handleUpload = async (selectedFile) => {
    const parsedData = await parseEmployeesFile(selectedFile) // or just pass to backend to parse
    saveData(parsedData)

    setFile(selectedFile)
  }

  const parseEmployeesFile = async (file) => {
    console.log("parsing...")
  }

  const saveData = async (data) => {
    // const updatePromises = data.map(employee => updateEmployee(employee));
    // await Promise.all(updatePromises)
    console.log("saving...!")
  }

  const table = useMantineReactTable({
    columns,
    data: fakeEmployees,
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
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveEmployee,
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
          <ActionIcon color="red">
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button leftSection={<IconPlus size={20} />}>Create New Employee</Button>
    ),
  })

  return (
    <div style={{ overflowX: "auto" }}>
      <MantineReactTable table={table} />
      <div style={{ overflowX: "auto", padding: "25px" }}>
        <Group justify="right">
          <FileButton
            onChange={handleUpload}
            accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            {(props) => (
              <Tooltip label="Employees CSV">
                <Button {...props} rightSection={<IconUpload size={18} />}>
                  Upload CSV
                </Button>
              </Tooltip>
            )}
          </FileButton>
        </Group>
        {file && (
          <Text ta="right" mt="2px">
            Uploaded File: {file.name}
          </Text>
        )}
      </div>
    </div>
  )
}
