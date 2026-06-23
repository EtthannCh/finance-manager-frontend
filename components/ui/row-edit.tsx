import { LucideX } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type Operation = {
  type: string;
  title: string;
  onClick: () => void;
  className: string;
  key:string;
};

type RowEditType<TData> = {
  operations: Operation[];
};

export default function RowEdit<TData>({
  operations,
}: RowEditType<TData>) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {operations.map((v) => (
              <DropdownMenuItem key={v.key}>
                <Button className={v.className} onClick={v.onClick}>
                  <LucideX color="white" />
                  <span>{v.title}</span>
                </Button>
              </DropdownMenuItem>
            ))}
            {/* {isMobile ? <DropdownMenuSeparator /> : ""}
            {isMobile ? (
              <DropdownMenuItem onClick={updateRow}>
                <Button
                  className={"!bg-[#1e3a8a] !text-white hover:!bg-[#64748b]"}
                >
                  <LucideEdit color="white" />
                </Button>
                <span>Edit</span>
              </DropdownMenuItem>
            ) : (
              ""
            )} */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
