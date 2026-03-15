"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";

import { AddListButton } from "./add-list-button";
import { MyLists } from "./my-lists";
import { SmartListTiles } from "./smart-list-tiles";

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarContent>
        <SmartListTiles />
        <SidebarSeparator />
        <MyLists />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <AddListButton />
      </SidebarFooter>
    </Sidebar>
  );
}
