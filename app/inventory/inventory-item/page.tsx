import { getDatabaseURI } from "@/app/actions/read-env";
import { getData, Header } from "@/app/getData";
import { Separator } from "@/components/ui/separator";
import InventoryItem from "./InventoryItem";

export type InventoryItemType = {
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

export default async function InventoryItemPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  let page = params.page ?? 0;
  let pageSize = params.pageSize ?? 10;

  if (Number(pageSize) > 50) {
    pageSize = 50;
  } else if (Number(pageSize) < 10) {
    pageSize = 10;
  }

  const _uri = await getDatabaseURI();
  let header: Header = {
    "user-id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "user-name": "system",
  };
  
  const response: PagedData = await getData(
    `${_uri}/inventory-item/find-paginated?page=${page}&pageSize=${pageSize}&sortDirection=${"ASC"}`,
    "post",
    header,
  );

  const inventoryItemData: InventoryItemType[] = response.content;
  
  const pagedData: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  } = response.page;
  return (
    <section>
      <div className="flex flex-col py-10 gap-3">
        <h1 className="text-[26px] p-0 m-0">Inventory Item Page</h1>
        <Separator />
        <InventoryItem content={inventoryItemData} page={pagedData} />
      </div>
    </section>
  );
}
