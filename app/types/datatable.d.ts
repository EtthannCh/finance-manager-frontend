import type { RowData } from "@tanstack/react-table";
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateIndividualDataByIndex: (rowIndex: number, columnId: string, value: string) => void;
    addRow: (newData: TData) => void;
    removeRow: (id: string) => void;
    calculateTotal: (data: TData[]) => void;
    updateData : (updatedData : TData, id:string) => void;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: "number" | "text";
  }
}
