"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { useSidebarState } from "@/context/sidebar-context";

export function AddListButton() {
  const { createList, setSelectedView } = useReminders();
  const { setRenamingListId } = useSidebarState();

  function handleAdd() {
    const id = createList({ name: "New List", color: "blue", shared: false });
    setSelectedView(id);
    setRenamingListId(id);
  }

  return (
    <button
      onClick={handleAdd}
      className="text-sidebar-foreground/70 hover:text-sidebar-foreground ring-sidebar-ring flex items-center gap-2 px-2 py-2 text-xs outline-hidden transition-colors focus-visible:ring-2"
    >
      <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} />
      Add List
    </button>
  );
}
