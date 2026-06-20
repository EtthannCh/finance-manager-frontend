"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export const EditableCell = ({ getValue, row, column, table }: any) => {
  const [value, setValue] = useState(getValue() ?? 0);

  useEffect(() => {
    setValue(getValue() ?? 0);
  }, []);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <>
      <Input
        type={column.columnDef.meta?.type || "text"}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="w-[200px] h-[40px] border border-slate-300 rounded-md px-3 text-lg text-slate-500 font-medium"
        min={0}
        value={value}
      />
      {/* <span style={{fontSize:20}}>{column.columnDef.meta?.type == "number"? Number(value)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") :""}</span> */}
    </>
  );
};
