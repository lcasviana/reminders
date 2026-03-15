"use client";

import { User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { LIST_COLOR_MAP } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { ReminderList } from "@/schemas/list.schema";

type ListRowProps = {
  list: ReminderList;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export function ListRow({ list, isActive, onSelect }: ListRowProps) {
  const { getIncompleteRemindersByList } = useReminders();
  const count = getIncompleteRemindersByList(list.id).length;
  const dotColor = LIST_COLOR_MAP[list.color] ?? "bg-gray-400";

  return (
    <button
      onClick={() => onSelect(list.id)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[calc(var(--radius-sm)+2px)] px-2 py-1.5 text-left text-xs transition-colors select-none",
        "ring-sidebar-ring outline-hidden focus-visible:ring-2",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <span className={cn("size-6 shrink-0 rounded-full", dotColor)} aria-hidden />
      <span className="min-w-0 flex-1 truncate font-medium">{list.name}</span>
      {list.shared && <HugeiconsIcon icon={User02Icon} className="text-sidebar-foreground/50 size-3.5 shrink-0" strokeWidth={2} />}
      {count > 0 && <span className="text-sidebar-foreground/60 shrink-0 tabular-nums">{count}</span>}
    </button>
  );
}
