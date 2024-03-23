import React from "react"
import { useState } from "react"
import { MantineReactTable, useMantineReactTable } from "mantine-react-table"
import {
  ActionIcon,
  Button,
  Tooltip,
  FileButton,
  Text,
  Group,
} from "@mantine/core"
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react"
import { fakeEmployees } from "../sampleEmployees"

export function Employees() {
  const [file, setFile] = useState(null)
  const columns = [
    {
      accessorKey: "name",
      header: "Full Name",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "mon",
      header: "Monday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "tues",
      header: "Tuesday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "wed",
      header: "Wednesday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "thurs",
      header: "Thursday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "fri",
      header: "Friday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "sat",
      header: "Saturday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
    {
      accessorKey: "sun",
      header: "Sunday",
      mantineEditTextInputProps: ({ cell, row }) => ({
        type: "email",
        required: true,
      }),
    },
  ]

  const table = useMantineReactTable({
    columns,
    data: fakeEmployees,
    createDisplayMode: "row",
    editDisplayMode: "cell", // double click to edit cell
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableBottomToolbar: false,
    defaultColumn: {
      minSize: 30,
      maxSize: 9001,
    },
    mantineTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    renderRowActions: ({ row }) => (
      <Tooltip label="Delete">
        <ActionIcon color="red">
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button leftSection={<IconPlus size={20}/>}>Create New User</Button>
    ),
  })

  return (
    <div style={{ overflowX: "auto" }}>
      <MantineReactTable table={table} />
      <div style={{ overflowX: "auto", padding: "25px" }}>
        <Group justify="right">
          <FileButton
            onChange={setFile}
            accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            {(props) => (
              <Tooltip label="Employees CSV">
                <Button
                  {...props}
                  rightSection={<IconUpload size={18} />}
                >
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
