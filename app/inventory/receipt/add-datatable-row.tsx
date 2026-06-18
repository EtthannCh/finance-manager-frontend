"use client";

import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react";

export const AddDatatableRow = ({ table,className }: any) => {
  const meta = table.options.meta;
  return (
    <div className="footer-buttons">
      <Button className={cn(`add-button ${className}`)} onClick={meta?.addRow}>
        Add New +
      </Button>
    </div>
  );
};
