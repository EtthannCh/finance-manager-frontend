"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Receipt() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} defData={[]} />
    </div>
  );
}
