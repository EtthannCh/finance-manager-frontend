"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { EditableCell } from "../../../components/ui/editable-table-cell";
import RowEdit from "@/components/ui/row-edit";

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
          <span className="text-xl text-slate-500 font-bold">Nama Barang</span>
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
    header: () => (
      <span className="text-xl text-slate-500 font-bold">
        Banyaknya
      </span>
    ),
    cell: EditableCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <span className="text-xl text-slate-500 font-bold">
        Harga Satuan
      </span>
    ),
    cell: EditableCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "totalPrice",
    header: () => (
      <span className="text-xl text-slate-500 font-bold">
        Jumlah Harga
      </span>
    ),
    accessorFn: (row) => `${Number(row.price) * Number(row.qty)}`,
    cell: ({ row }) => {
      const total =
        Number(row.original.price ?? 0) * Number(row.original.qty ?? 0);
      return (
        <span className="text-lg text-slate-500 font-medium">
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
