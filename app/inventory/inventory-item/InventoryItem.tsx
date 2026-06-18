"use client";

import { Combobox } from "@/app/components/Combobox";
import PaginationNavigation from "@/components/ui/PaginationNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const InventoryItem = (data: PagedData) => {
  const frameworks = [
    {
      key: "10",
      value: "10",
    },
    {
      key: "20",
      value: "20",
    },
  ];

  const pathname = usePathname();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? 0;
  const handleOnSelectChange = (data: string) => {
    router.push(`${pathname}?page=${page}&pageSize=${data}`);
  };

  return (
    <>
      <div className="container w-screen">
        <DataTable columns={columns} data={data.content} />
      </div>
      <div className="flex items-center justify-between py-4">
        <Combobox
          items={frameworks}
          placeholder="Select Item"
          uri={`${pathname}`}
          onSelectChange={handleOnSelectChange}
        />
        <PaginationNavigation
          page={+data.page.number}
          pageSize={+data.page.size}
          currentPath={pathname?.substring(0, pathname.indexOf("?")) ?? ""}
          totalPages={+data.page.totalPages}
        ></PaginationNavigation>
      </div>
    </>
  );
};

export default InventoryItem;
