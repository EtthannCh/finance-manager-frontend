"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "./page";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "materialItemName",
    header: "Material Item Name",
    cell: ({ row }) => {
      return <div>{row.original.materialItemName}</div>;
    }
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.createdAt).toLocaleDateString("en-uk", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdatedBy",
    header: "Last Updated By",
  },
  {
    accessorKey: "lastUpdatedAt",
    header: () => {
        return <span className="align-left">{"Last Updated At"}</span>
    },
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.lastUpdatedAt).toLocaleDateString("en-uk", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </div>
      );
    },
  },
];
