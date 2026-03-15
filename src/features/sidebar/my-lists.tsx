"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useReminders } from "@/context/reminders-context";

import { ListRow } from "./list-row";

export function MyLists() {
  const { lists, selectedView, setSelectedView } = useReminders();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Lists</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="flex flex-col gap-px">
          {lists.map((list) => (
            <ListRow key={list.id} list={list} isActive={selectedView === list.id} onSelect={setSelectedView} />
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
