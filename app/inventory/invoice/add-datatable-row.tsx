"use client";

import useMediaQuery from "@/app/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react";

export const AddDatatableRow = ({ table,className, onClick }: any) => {
  const meta = table.options.meta;
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="footer-buttons">
      <Button className={cn(`add-button ${className}`)} onClick={isMobile? onClick :meta?.addRow}>
        Add New +
      </Button>
    </div>
  );
};
