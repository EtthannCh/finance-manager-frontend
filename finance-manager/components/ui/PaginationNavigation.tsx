import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationItem,
} from "./pagination";

export default function PaginationNavigation(props: {
  className?: string;
  page: number;
  pageSize: number;
  totalPages: number;
  currentPath: string;
}) {
  return (
    <Pagination className={cn(props.className)} suppressHydrationWarning>
      <PaginationContent>
        <PaginationItem
          key={"prev"}
          aria-disabled={props.page == 0}
          className={props.page == 0 ? "pointer-events-none opacity-50" : ""}
        >
          <PaginationPrevious
            href={`${props.currentPath}?page=${props.page > 0 ? props.page - 1 : 0}&pageSize=${props.pageSize}`}
          />
        </PaginationItem>
        
        <PaginationItem key={""}>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        
        <PaginationItem key={"elipsis"}>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem
          key={"next"}
          aria-disabled={props.page == props.totalPages-1}
          className={
            props.page == props.totalPages-1
              ? "pointer-events-none opacity-50"
              : ""
          }
        >
          <PaginationNext
            href={`${props.currentPath}?page=${props.page + 1}&pageSize=${props.pageSize}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
