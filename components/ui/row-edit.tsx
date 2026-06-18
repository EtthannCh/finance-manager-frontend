import { Button } from "./button";

export default function RowEdit({ row, table }: any) {
  const meta = table.options.meta;

  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  return <Button onClick={removeRow} className={"bg-red-600 hover:bg-red-600"}>X</Button>;
}
