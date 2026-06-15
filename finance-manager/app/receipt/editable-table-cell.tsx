"use client";

import { useEffect, useState } from "react";

export const EditableCell = ({getValue, row, column, table}: any) => {
    const initialValue = getValue();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue])

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  }

  return <input type={value} onChange={(e) => setValue(e.target.value)} onBlur={onBlur}/>;
};
