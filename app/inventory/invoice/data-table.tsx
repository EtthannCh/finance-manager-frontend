"use client";

import { flexRender } from "@tanstack/react-table";

import type { Table as TableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddDatatableRow } from "./add-datatable-row";
import { useState } from "react";
import { MotionIcon } from "motion-icons-react";
import "motion-icons-react/style.css";
import { Button } from "@base-ui/react";

type DataTableContextValue<TData> = {
  table: TableType<TData>;
  totalValue: string;
};

export function DataTable<TData>({
  table,
  totalValue,
}: DataTableContextValue<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex justify-end gap-5 p-5 items-center">
        <div className="flex gap-5">
          <Button
            disabled={table.getRowCount() < 1}
            className={`flex gap-3 text-2xl p-3 outline-2 rounded-md cursor-pointer items-center bg-black text-white ${table.getRowCount() > 0 ? "opacity-100" : "cursor-pointer opacity-50"}`}
            onClick={() => {
              setIsLoading(true);
              const cleanedData = table
                .getFilteredRowModel()
                .rows.map((row) => {
                  return {
                    materialName: row.getValue("materialName"),
                    qty: row.getValue("qty"),
                    price: row.getValue("price"),
                    totalPrice: row.getValue("totalPrice"),
                  };
                });
              sessionStorage.setItem("tableData", JSON.stringify(cleanedData));
              setTimeout(() => {
                setIsLoading(false);
              }, 2000);
            }}
          >
            <span>Save Data</span>
            <MotionIcon name="Save" animation={isLoading ? "bounce" : "none"} />
          </Button>
          <AddDatatableRow
            className={"outline-2 p-3 rounded-md cursor-pointer"}
            table={table}
          ></AddDatatableRow>
        </div>
      </div>
      <Table className="text-2xl">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
