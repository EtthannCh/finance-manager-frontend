import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { ThemeProvider } from "@/app/components/theme-provider";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

type Sidebar = {
  header: string;
  items: Array<{
    id: string;
    subtitle: string;
    link_: string;
  }>;
};

const sidebarData: Sidebar[] = [
  {
    header: "Inventory Management",
    items: [
      {
        id: "inventory_item",
        subtitle: "Inventory Item",
        link_: "/inventory/inventory-item",
      },
      {
        id: "material_item",
        subtitle: "Material Item",
        link_: "/inventory/material-item",
      },
      {
        id:"invoice",
        subtitle:"Invoice",
        link_:"/inventory/invoice"
      }
    ],
  },
];

export function AppSidebar() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Sidebar>
        <SidebarHeader />
        <Link href={"/"} className="text-4xl">Management </Link>
        <SidebarContent>
          {sidebarData.map((data) => (
            <Accordion>
              <AccordionItem value={data.header} className={"flex flex-col pl-3"}>
                <AccordionTrigger className={"text-xl"}>{data.header}</AccordionTrigger>
                <AccordionContent>
                  <ul key={data.header} className="flex flex-col gap-3 text-[18px] pl-3">
                    {data.items.map((item) => (
                      <Link key={item.id} href={item.link_}>
                        {item.subtitle}
                      </Link>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex gap-5">
            <ThemeToggle></ThemeToggle>
          </div>
        </SidebarFooter>
      </Sidebar>
    </ThemeProvider>
  );
}
