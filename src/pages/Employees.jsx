import React from "react"
import { MantineReactTable, useMantineReactTable } from "mantine-react-table"
import { ActionIcon, Button, Tooltip } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import { fakeEmployees } from "../sampleEmployees"

export function Employees() {
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
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also available)
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableBottomToolbar: false,
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 20,
      maxSize: 9001,
      size: 145,
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
    renderTopToolbarCustomActions: ({ table }) => <Button>Create New User</Button>,
  })

  return <MantineReactTable table={table} />
}
