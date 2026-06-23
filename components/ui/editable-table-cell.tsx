"use client";

import useMediaQuery from "@/app/hooks/useMediaQuery";
import { Input } from "@/components/ui/input";
import { convertToDecimal } from "@/lib/utils";
import { useEffect, useState } from "react";

export const EditableCell = ({ getValue, row, column, table }: any) => {
  const [value, setValue] = useState(getValue() ?? "");

  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    setValue(getValue() ?? "");
  }, []);

  const onBlur = () => {
    table.options.meta?.updateIndividualDataByIndex(
      row.index,
      column.id,
      value,
    );
  };

  return (
    <>
      {isMobile ? (
        <span className="text-lg font-medium text-slate-500">
          {column.columnDef.meta?.type == "number"
            ? convertToDecimal(Number(getValue()))
            : getValue()}
        </span>
      ) : (
        <Input
          type={column.columnDef.meta?.type || "text"}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className={`w-[200px] h-[40px] border border-slate-300 rounded-md px-3 text-lg text-slate-500 font-medium ${value == "" ? "border-red-500 border-2" : ""}`}
          min={column.columnDef.meta?.type == "number" ? 0 : ""}
          value={getValue()}
          placeholder={
            column.columnDef.meta?.type == "number" ? "0" : "Nama Barang"
          }
        />
      )}

      {/* <span style={{fontSize:20}}>{column.columnDef.meta?.type == "number"? Number(value)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") :""}</span> */}
    </>
  );
};
