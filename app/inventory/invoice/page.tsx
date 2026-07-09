"use client";

import useMediaQuery from "@/app/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditableCell } from "@/components/ui/editable-table-cell";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import RowEdit, { Operation } from "@/components/ui/row-edit";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { convertToDecimal } from "@/lib/utils";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { ArrowDown, ArrowUp, LucideEdit, LucideX } from "lucide-react";
import { MotionIcon } from "motion-icons-react";
import { pdfToImg } from "pdftoimg-js/browser";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import useSessionStorage from "../../hooks/useSessionStorage";
import { AddDatatableRow } from "./add-datatable-row";
import { DataTable } from "./data-table";

export default function ReceiptPage() {
  const tableData: Receipt[] = useSessionStorage("tableData");
  const [total, setTotal] = useState(0);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(() => [...tableData]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addressTo, setAddressTo] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isOpen, setIsOpen] = useState("");
  const [sheetType, setSheetType] = useState<SheetOpenType>("add");
  const [formData, setFormData] = useState<Receipt>({
    id: crypto.randomUUID(),
    materialName: "",
    qty: "",
    price: "",
    totalPrice: "",
  });

  // initalize value to string because components are not allowed to switch between controlled and uncontrolled value
  const [isLoading, setIsLoading] = useState(false);

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

  type Receipt = {
    id: string;
    materialName: string;
    qty: number | string;
    price: number | string;
    totalPrice: string | number;
  };

  const handleUpdateData = (id: string): void => {
    const findData: Receipt | undefined = data.find((v) => v.id === id);
    setFormData(
      findData == undefined
        ? {
            id: formData["id"],
            materialName: formData["materialName"],
            qty: formData["qty"],
            price: formData["price"],
            totalPrice: formData["totalPrice"],
          }
        : findData,
    );
  };

  const handleRemoveData = (id: string): void => {
    table.options.meta?.removeRow(id);
  };

  const columns: ColumnDef<Receipt>[] = [
    {
      accessorKey: "id",
      header: () => {},
    },
    {
      accessorKey: "materialName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="text-xl text-slate-500 font-bold">
              Nama Barang
            </span>
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
        <span className="text-xl text-slate-500 font-bold">Banyaknya</span>
      ),
      cell: EditableCell,
      meta: {
        type: "number",
      },
    },
    {
      accessorKey: "price",
      header: () => (
        <span className="text-xl text-slate-500 font-bold">Harga Satuan</span>
      ),
      cell: EditableCell,
      meta: {
        type: "number",
      },
    },
    {
      accessorKey: "totalPrice",
      header: () => (
        <span className="text-xl text-slate-500 font-bold">Jumlah Harga</span>
      ),
      accessorFn: (row) => `${Number(row.price) * Number(row.qty)}`,
      cell: ({ row }) => {
        const total =
          Number(row.original.price ?? 0) * Number(row.original.qty ?? 0);
        return (
          <span className="text-lg text-slate-500 font-medium">
            {convertToDecimal(total)}
          </span>
        );
      },
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const operations: Operation[] = [
          {
            title: "Hapus",
            type: "delete",
            onClick: () => handleRemoveData(row.original.id),
            className: "",
            key: row.original.id + "delete",
            Icon: LucideX,
            variant: "destructive",
          },
          {
            title: "Edit",
            type: "edit",
            onClick: () => {
              handleOpenSheet();
              setSheetType("edit");
              handleUpdateData(row.original.id);
            },
            className: `!bg-[#1e3a8a] !text-white hover:!bg-[#64748b] ${isMobile ? "" : "hidden"}`,
            key: row.original.id + "edit",
            Icon: LucideEdit,
            variant: "outline",
          },
        ];
        return <RowEdit operations={operations}></RowEdit>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility: {
        id: false,
      },
    },
    meta: {
      updateIndividualDataByIndex: (
        rowIndex: number,
        columnId: string,
        value: string,
      ) => {
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
      addRow: () => {
        setData([
          ...data,
          {
            id: crypto.randomUUID(),
            materialName: "",
            qty: "",
            price: "",
            totalPrice: "",
          },
        ]);
      },
      removeRow: (id: string) => {
        const updatedData = data.filter(
          (v) => v.id.toLowerCase() !== id.toLowerCase(),
        );
        setData(updatedData);
      },
      calculateTotal: (data: Receipt[]) => {
        let currentTotal = 0;
        data.map((v) => {
          currentTotal =
            currentTotal + Number(v.price ?? 0) * Number(v.qty ?? 0);
        });
        setTotal(currentTotal);
      },
      updateData: (dataToUpdate: Receipt, id: string) => {
        const dataFound = data.find((v) => v.id === id);
        if (dataFound == undefined) {
          setData([...data, formData]);
        } else {
          setData((old) =>
            old.map((v) => {
              if (v.id === id) {
                return dataToUpdate;
              }
              return v;
            }),
          );
        }
      },
    },
  });

  const downloadImage = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.setAttribute("download", `${fileName}.jpg`);
    a.setAttribute("href", url);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  type PdfRow = {
    materialName: string;
    qty: string;
    price: string;
    totalPrice: string;
  };

  const exportPdf = async (actions: string) => {
    let y = 0;
    const doc = new jsPDF("l", "pt", "A4");

    // doc.text(
    //   date?.toLocaleDateString("id-ID", {
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric",
    //   }) ?? "",
    //   740,
    //   20,
    // );

    doc.setProperties({
      title: `Invoice-${addressTo}-${
        date?.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) ?? ""
      }`,
    });

    // ================= HEADER =================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.setFontSize(26);

    doc.text("INVOICE", 780, 40, {
      align: "right",
    });

    doc.setDrawColor(180);
    doc.line(40, 55, 800, 55);

    doc.setFontSize(20);

    doc.setFont("helvetica", "bold");

    // doc.text("Invoice No :",560,80);
    doc.text("Tanggal :", 560, 100);
    // doc.text("Due Date :",560,120);

    // doc.text(
    //     "INV-0001",
    //     780,
    //     80,
    //     {align:"right"}
    // );

    doc.text(
      date?.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) ?? "",
      780,
      100,
      { align: "right" },
    );

    // doc.text("-",780,120,{align:"right"});

    doc.rect(40, 80, 400, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Kepada :", 50, 105);

    doc.setFont("helvetica", "normal");
    doc.text(addressTo || "-", 50, 133);

    // doc.rect(300, 80, 230, 60);

    // doc.setFont("helvetica", "bold");
    // doc.text("PO :", 310, 100);

    // doc.setFont("helvetica", "normal");
    // doc.text("-", 310, 120);

    y += 20;

    doc.setFontSize(16);
    let ypos = 0;

    let tableData: PdfRow[] = [];
    data.forEach((v, index) => {
      tableData.push({
        materialName: v.materialName,
        qty: convertToDecimal(Number(v.qty)),
        price: "Rp " + convertToDecimal(Number(v.price)),
        totalPrice: "Rp " + convertToDecimal(Number(v.qty) * Number(v.price)),
      });
    });
    const MAX_ROWS = 6;

    while (tableData.length < MAX_ROWS) {
      tableData.push({
        materialName: "",
        qty: "",
        price: "",
        totalPrice: "",
      });
    }

    autoTable(doc, {
      body: tableData,

      margin: {
        left: 40,
        right: 40,
        top: 160,
        bottom: 80,
      },
      styles: {
        fontSize: 20,
        fontStyle: "bold",
        cellPadding: 10,
        minCellHeight: 45,
        lineWidth: 2,
        lineColor: [220, 220, 220],
      },
      columnStyles: {
        qty: {
          halign: "center",
        },
        price: {
          halign: "right",
        },
        totalPrice: {
          halign: "right",
        },
      },
      columns: [
        {
          header: "Banyaknya",
          dataKey: "qty",
        },
        {
          header: "Nama Barang",
          dataKey: "materialName",
        },
        {
          header: "Harga Satuan",
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
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      theme: "grid",
    });

    y += 20;
    y += ypos;

    doc.setFillColor(245, 245, 245);

    doc.roundedRect(480, ypos + 20, 320, 60, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text("TOTAL : ", 500, ypos + 57);

    doc.text("Rp " + convertToDecimal(total), 850, ypos + 57, {
      align: "right",
    });

    // doc.text(
    //   "Barang yang sudah dibeli tidak dapat dikembalikan.",
    //   40,
    //   y + 50
    // );

    doc.setFontSize(9);
    doc.setTextColor(150);

    if (actions == "preview") {
      const pdfBlob = doc.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
    } else if (actions == "save") {
      const pdfBlob = doc.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));

      const images = await pdfToImg(doc.output("dataurlstring"), {
        imgType: "jpg",
        scale: 3,
        background: "white",
      });
      images.forEach((imgSrc, index) => {
        var link = document.createElement("a");
        link.download = `Invoice-${addressTo}-${
          date?.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) ?? ""
        }(${index}).jpeg`;
        link.href = imgSrc;
        link.click();
      });

      // doc.save(
      //   `Invoice-${addressTo}-${
      //     date?.toLocaleDateString("id-ID", {
      //       day: "numeric",
      //       month: "long",
      //       year: "numeric",
      //     }) ?? ""
      //   }`,
      // );
    }
  };

  type SheetOpenType = "edit" | "add";
  const handleOpenSheet = () => {
    setFormData({
      id: crypto.randomUUID(),
      materialName: "",
      qty: "",
      price: "",
      totalPrice: "",
    });
    setIsOpen(isOpen == "true" ? "false" : "true");
  };

  const handleFormDataChanges = async (e: SyntheticEvent<HTMLFormElement>) => {
    table.options.meta?.updateData(
      formData ?? { materialName: "", qty: "", price: "", totalPrice: "" },
      formData["id"],
    );
    handleOpenSheet();
    e.preventDefault();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="w-full min-h-screen bg-white md:bg-[#f5f7fb] py-3">
      {/* <Button
        className={"sticky top-0"}
        onClick={() => {
          exportPdf("preview");
        }}
      >
        Preview PDF
      </Button> */}
      <SidebarTrigger />
      <div className="px-3 md:px-10">
        <h1 className="text-3xl text-gray-700">New Invoice</h1>
      </div>
      <div
        className="
          p-3 md:p-5
          my-5
          mx-0 md:mx-10
          bg-transparent md:bg-white
          rounded-none md:rounded-xl
          shadow-none md:shadow-lg md:shadow-slate-300/50
          h-max
        "
      >
        <div
          className={`flex gap-5 justify-end mr-3 ${isMobile ? "flex-col" : ""}`}
        >
          <Button
            disabled={table.getRowCount() < 1}
            className={`flex gap-3 w-full md:w-[180px] h-[50px] text-xl outline-2 rounded-md cursor-pointer items-center justify-center bg-[#1e3a8a] text-white ${
              table.getRowCount() > 0
                ? "opacity-100"
                : "cursor-pointer opacity-50"
            }`}
            onClick={() => {
              setIsLoading(true);
              const cleanedData = table
                .getFilteredRowModel()
                .rows.map((row) => {
                  return {
                    id: row.getValue("id"),
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
            className="w-full md:w-auto outline-2 p-3 rounded-md cursor-pointer"
            table={table}
            onClick={() => {
              handleOpenSheet();
              setSheetType("add");
            }}
          ></AddDatatableRow>
        </div>
        <table className="w-full my-5" id="table-data">
          <tbody
            className={`${isMobile ? "flex flex-col gap-4" : "flex items-center gap-5"}`}
          >
            <tr
              className={`flex items-center gap-5 ${
                isMobile ? "w-full justify-between" : ""
              }`}
            >
              <td className="text-lg text-slate-500 font-medium">Tanggal</td>
              <td className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="outline" />}
                    className="w-full md:w-[200px]"
                  >
                    <span className="text-lg text-slate-500 font-medium">
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
            <tr className="flex gap-5 items-center">
              <td className="text-lg text-slate-500 font-medium">Kepada</td>

              <td className="flex-1">
                <Input
                  className="border border-slate-300 rounded-md w-full h-[40px] px-3 text-lg text-slate-500 font-medium"
                  onChange={(e) => {
                    setAddressTo(e.target.value);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <DataTable table={table} />
        </div>
        <div className="mt-6 flex flex-col md:flex-row md:justify-end gap-4">
          <div className="w-full md:w-auto border border-slate-300 rounded-lg px-6 py-3 bg-slate-50 shadow-sm">
            <span className="text-xl text-slate-500 font-bold">
              Total: Rp {convertToDecimal(total)}
            </span>
          </div>

          <Button
            disabled={data.length < 1}
            className="w-full md:w-[180px] h-[50px] bg-[#1e3a8a] text-white hover:bg-[#64748b]"
            onClick={() => exportPdf("save")}
          >
            Save PDF
          </Button>
        </div>
        {/* <div className="flex items-center justify-center w-full h-[600px] mt-5">
          <iframe src={pdfUrl} width="100%" height="100%"></iframe>
        </div> */}
      </div>
      <Sheet
        open={isOpen == "true" ? true : false}
        onOpenChange={handleOpenSheet}
      >
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
                  placeholder="Nama Barang"
                  required
                  value={formData["materialName"]}
                  onChange={handleChange}
                  className="text-2xl"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="qty" className="text-2xl">
                  <span>Banyaknya</span>
                  <span>({convertToDecimal(Number(formData["qty"]))})</span>
                </FieldLabel>
                <Input
                  type="number"
                  name="qty"
                  id="qty"
                  placeholder="Banyaknya"
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
                  <span>Harga Satuan</span>
                  <span>
                    (Rp. {convertToDecimal(Number(formData["price"]))})
                  </span>
                </FieldLabel>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Harga Satuan"
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
                  Total Harga
                </FieldLabel>
                <FieldLabel htmlFor="qty" className="text-2xl">
                  Rp.{" "}
                  {convertToDecimal(
                    Number(formData["qty"]) * Number(formData["price"]),
                  )}
                </FieldLabel>
              </Field>
              <Button
                type="submit"
                className={"text-xl bg-[#1e3a8a] text-white p-6"}
              >
                {sheetType == "add" ? "Tambah" : "Ubah"}
              </Button>
            </FieldSet>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
