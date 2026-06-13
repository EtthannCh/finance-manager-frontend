import type { Header } from "@/app/getData";
import { getData } from "@/app/getData";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export type InventoryItem = {
  id: number;
  materialItemId: number;
  materialItemName: string;
  qty: number;
  createdById: string;
  createdBy: string;
  createdAt: string;
  lastUpdatedById: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  prevUpdatedById: string;
  prevUpdatedBy: string;
  prevUpdatedAt: string;
};

export default async function InventoryItemPage() {
  let header: Header = {
    "user-id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "user-name": "system",
  };
  const response = getData(
    "http://localhost:8080/inventory-item/find-paginated?page=0&pageSize=10&sortDirection=ASC",
    "post",
    header,
  );

  const fetchData: PagedData = await response;
  const inventoryItemData: InventoryItem[] = fetchData.content;

  return (
    <section>
      <div className="flex flex-col py-20 gap-3">
        <h1 className="text-[26px] p-0 m-0">Inventory Item Page</h1>
        <Separator/>
        <div className="container w-screen">
          <DataTable columns={columns} data={inventoryItemData} />
        </div>
      </div>
    </section>
  );
}
