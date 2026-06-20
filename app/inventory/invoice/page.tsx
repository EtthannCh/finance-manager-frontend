"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import useMediaQuery from "@/app/hooks/useMediaQuery";

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

  const [pdfUrl, setPdfUrl] = useState("");
  const convertToDecimal = (value: number) => {
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const exportPdf = (actions: string) => {
    let y = 0;
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

    doc.setProperties({
      title: `Invoice-${addressTo}-${
        date?.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) ?? ""
      }`,
    });

    doc.text(`Kepada: ${addressTo}`, 10, 20);
    y += 20;

    doc.setFontSize(16);
    let ypos = 0;

    let tableData: Receipt[] = [];
    data.map((v) => {
      tableData.push({
        materialName: v.materialName,
        qty: convertToDecimal(Number(v.qty)),
        price: "Rp " + convertToDecimal(Number(v.price)),
        totalPrice: "Rp " + convertToDecimal(Number(v.qty) * Number(v.price)),
      });
    });

    autoTable(doc, {
      body: tableData,
      margin: { top: 60, left: 10, right: 10 },
      styles: {
        fontSize: 14,
      },
      columns: [
        {
          header: "Nama Barang",
          dataKey: "materialName",
        },
        {
          header: "Qty",
          dataKey: "qty",
        },
        {
          header: "Harga",
          dataKey: "price",
        },
        {
          header: "Jumlah Harga",
          dataKey: "totalPrice",
        },
      ],
      didDrawPage: function (data) {
        ypos = data.cursor?.y ?? 0;
      },
      headStyles: {
        fillColor: "black",
      },
      theme: "grid",
    });

    y += 20;
    y += ypos;

    doc.text(`Jumlah:`, 530, y);
    doc.text(
      `Rp. ${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`,
      630,
      y,
    );
    doc.text("Barang yang sudah dibeli TIDAK DAPAT DIKEMBALIKAN", 10, y);

    if (actions == "preview") {
      const pdfBlob = doc.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
    } else if (actions == "save") {
      doc.save(
        `Invoice-${addressTo}-${
          date?.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) ?? ""
        }`,
      );
    }
  };

  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="container mx-auto py-10 text-2xl">
      {/* <Button
        className={"sticky top-0"}
        onClick={() => {
          exportPdf("preview");
        }}
      >
        Preview PDF
      </Button> */}
      <div className="flex justify-between items-center">
        <h1 className="text-5xl">New Invoice</h1>
        <Button
          disabled={data.length < 1}
          className={"sticky top-0 w-[100px] h-[60px] text-xl my-5"}
          onClick={() => {
            exportPdf("save");
          }}
        >
          Save PDF
        </Button>
      </div>
      <div className="border-2 p-5 my-5 rounded-md h-max">
        <table className="flex flex-row-reverse my-5 mx-3 items-center">
          <tbody
            className={`flex items-center gap-5 ${isMobile ? "flex-col" : ""}`}
          >
            <tr className="flex gap-5 items-center">
              <td>Tanggal: </td>
              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="outline" />}
                    className={"w-[200px]"}
                  >
                    <span className="text-xl">
                      {date
                        ? date.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : new Date().toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={"w-full"}>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-lg border"
                      captionLayout="dropdown"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
            <tr className="flex gap-5">
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
        <DataTable table={table} />
        <div className="flex justify-end p-5 mt-5">
          <span>Total: Rp. {convertToDecimal(total)}</span>
        </div>
        {/* <div className="flex items-center justify-center w-full h-[600px] mt-5">
          <iframe src={pdfUrl} width="100%" height="100%"></iframe>
        </div> */}
      </div>
    </div>
  );
}
