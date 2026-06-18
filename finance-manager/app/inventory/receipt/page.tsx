"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@base-ui/react";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useEffect, useState } from "react";
import useSessionStorage from "../../hooks/useSessionStorage";
import { columns, Receipt } from "./columns";
import { DataTable } from "./data-table";

export default function ReceiptPage() {
  const tableData: Receipt[] = useSessionStorage("tableData");
  const [total, setTotal] = useState(0);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(() => [...tableData]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addressTo, setAddressTo] = useState("");

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  useEffect(() => {
    let currentTotal = 0;
    data.map((v) => {
      currentTotal = currentTotal + Number(v.price ?? 0) * Number(v.qty ?? 0);
    });
    setTotal(currentTotal);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      addRow: (newData: Receipt) => {
        setData([...data, newData]);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Receipt[]) =>
          old.filter((_row: Receipt, index: number) => index != rowIndex);
        setData(setFilterFunc);
      },
      calculateTotal: (data: Receipt[]) => {
        let currentTotal = 0;
        data.map((v) => {
          currentTotal =
            currentTotal + Number(v.price ?? 0) * Number(v.qty ?? 0);
        });
        setTotal(currentTotal);
      },
    },
  });

  const exportPdf = () => {
    const doc = new jsPDF("l", "pt", "A4");
    doc.text(
      date?.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) ?? "",
      740,
      20,
    );
    doc.text(`Kepada: ${addressTo}`, 10, 20);
    doc.text(`Jumlah: Rp. ${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`, 10, 45);
    doc.setFontSize(16);
    autoTable(doc, {
      body: data,
      margin: { top: 60, left: 10, right: 10 },
      columns: [
        {
          header: "Material Item Name",
          dataKey: "materialName",
        },
        {
          header: "Qty",
          dataKey: "qty",
        },
        {
          header: "Price",
          dataKey: "price",
        },
      ],
    });
    doc.save("hello pdf");
  };

  return (
    <div className="container mx-auto py-10 text-2xl">
      <Button onClick={exportPdf}>Export to PDF</Button>
      <table className="flex flex-row-reverse my-5 mx-3">
        <tbody className="flex items-center gap-5">
          <tr className="flex gap-5 items-center">
            <td>Tanggal: </td>
            <td>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                captionLayout="dropdown"
              />
            </td>
          </tr>
          <tr>
            <td>Kepada: </td>
            <td>
              <Input
                className={"border-2 rounded-md w-[200px]"}
                onChange={(e) => {
                  setAddressTo(e.target.value);
                }}
              ></Input>
            </td>
          </tr>
        </tbody>
      </table>
      <DataTable
        table={table}
        totalValue={total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
      />
    </div>
  );
}
