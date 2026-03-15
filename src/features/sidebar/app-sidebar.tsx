"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { SidebarStateProvider } from "@/context/sidebar-context";

import { AddListButton } from "./add-list-button";
import { MyLists } from "./my-lists";
import { SmartListTiles } from "./smart-list-tiles";

export function AppSidebar() {
  return (
    <SidebarStateProvider>
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
    </SidebarStateProvider>
  );
}
