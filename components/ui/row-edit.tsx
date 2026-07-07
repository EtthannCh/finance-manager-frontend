import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger
} from "./dropdown-menu";

export type Operation = {
  type: string;
  title: string;
  onClick: () => void;
  className: string;
  key: string;
  Icon: LucideIcon;
  variant:
    | "link"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive";
};

type RowEditType<TData> = {
  operations: Operation[];
};

export default function RowEdit<TData>({ operations }: RowEditType<TData>) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup className={"flex flex-col gap-3 p-2"}>
            {operations.map((v) => (
              <Button
                className={cn("flex justify-between w-full", v.className)}
                onClick={v.onClick}
                variant={v.variant}
                key={v.key}
              >
                <v.Icon />
                <span>{v.title}</span>
              </Button>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
