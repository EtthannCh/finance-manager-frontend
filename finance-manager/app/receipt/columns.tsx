"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { EditableCell } from "./editable-table-cell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Student = {
  studentId: number;
  name: string;
  dateOfBirth: string;
  major: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "studentId",
    header: "Student ID",
    cell: EditableCell,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name 
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
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: EditableCell,
  },
];
