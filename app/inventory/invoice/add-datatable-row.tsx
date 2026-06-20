"use client";

import useMediaQuery from "@/app/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button } from "@base-ui/react";

export const AddDatatableRow = ({ table,className, onClick }: any) => {
  const meta = table.options.meta;
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="footer-buttons">
      <Button
        className={cn(
          "flex gap-3 w-[180px] h-[50px] text-xl p-3 outline-2 rounded-md cursor-pointer items-center justify-center bg-white text-black",
          className, //cek ulang keubah code g
        )}
        onClick={isMobile? onClick :meta?.addRow}
      >
        Tambah Baris +
      </Button>
    </div>
  );
};