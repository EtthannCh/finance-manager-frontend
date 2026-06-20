"use client";

import { flexRender } from "@tanstack/react-table";

import type { Table as TableType } from "@tanstack/react-table";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MotionIcon } from "motion-icons-react";
import "motion-icons-react/style.css";
import { useState } from "react";
import { AddDatatableRow } from "./add-datatable-row";
import { Receipt } from "./columns";
import { Button } from "@/components/ui/button";

type DataTableContextValue<TData> = {
  table: TableType<TData>;
};

export function DataTable<TData>({ table }: DataTableContextValue<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Receipt>({
    materialName: "",
    price: "",
    qty: "",
    totalPrice: "",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormDataChanges = async (e: any) => {
    e.preventDefault();
    console.log(formData);
  };
  // initalize value to string because components are not allowed to switch between controlled and uncontrolled value
  const [isOpen, setIsOpen] = useState("");
  const handleAddOnClick = () => {
    setIsOpen(isOpen == "true" ? "false" : "true");
  };

  const convertToDecimal = (value: number) => {
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

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
            onClick={handleAddOnClick}
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

      <Sheet
        open={isOpen == "true" ? true : false}
        onOpenChange={handleAddOnClick}
      >
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent className={"py-5 px-5 text-2xl"}>
          <form onSubmit={handleFormDataChanges}>
            <FieldSet>
              <FieldLegend>Payment Method</FieldLegend>
              <FieldDescription>
                All transactions are secure and encrypted
              </FieldDescription>
              <Field>
                <FieldLabel htmlFor="materialName" className="text-2xl">
                  Material Item Name
                </FieldLabel>
                <Input
                  type="text"
                  name="materialName"
                  id="materialName"
                  placeholder="Material Item Name"
                  required
                  value={formData["materialName"]}
                  onChange={handleChange}
                  className="text-2xl"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="qty" className="text-2xl">
                  <span>Quantity</span>
                  <span>({convertToDecimal(Number(formData["qty"]))})</span>
                </FieldLabel>
                <Input
                  type="number"
                  name="qty"
                  id="qty"
                  placeholder="Quantity"
                  required
                  value={formData["qty"]}
                  onChange={handleChange}
                  className="text-2xl"
                  min={0}
                  defaultValue={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="price" className="text-2xl">
                  <span>Price</span>
                  <span>
                    (Rp. {convertToDecimal(Number(formData["price"]))})
                  </span>
                </FieldLabel>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price"
                  required
                  value={formData["price"]}
                  onChange={handleChange}
                  className="text-2xl"
                  min={0}
                  defaultValue={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="qty" className="text-2xl">
                  Total Price
                </FieldLabel>
                <FieldLabel htmlFor="qty" className="text-2xl">
                  Rp.{" "}
                  {convertToDecimal(
                    Number(formData["qty"]) * Number(formData["price"]),
                  )}
                </FieldLabel>
              </Field>
              <Button type="submit" className={"text-xl"}>
                Submit
              </Button>
            </FieldSet>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
