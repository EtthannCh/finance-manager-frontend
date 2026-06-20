"use client";

import { Button } from "@/components/ui/button";
import RowEdit from "@/components/ui/row-edit";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { EditableCell } from "../../../components/ui/editable-table-cell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Receipt = {
  materialName: string;
  qty: number | string;
  price: number| string;
  totalPrice:string | number;
};

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "materialName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-2xl">Material Item Name</span>
          {column.getIsSorted() == "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: EditableCell,
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: EditableCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: EditableCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    accessorFn: (row) => `${Number(row.price) * Number(row.qty)}`,
    cell: ({ row }) => {
      const total =
        Number(row.original.price ?? 0) * Number(row.original.qty ?? 0);
      return (
        <span>
          {total.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: RowEdit,
  },
];
