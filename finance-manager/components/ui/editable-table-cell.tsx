"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export const EditableCell = ({ getValue, row, column, table}: any) => {
  const [value, setValue] = useState(getValue() ?? 0);

  useEffect(() => {
    setValue(getValue() ?? 0);
  }, []);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <Input
      type={column.columnDef.meta?.type || "text"}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-[250px] text-5xl"
      min={0}
      value={value}
    />
  );
};
