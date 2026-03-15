"use client";

import { Delete01Icon, MoreHorizontalIcon, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { useSidebarState } from "@/context/sidebar-context";
import { useRenameMode } from "@/hooks/use-rename-mode";
import { LIST_COLOR_MAP } from "@/lib/colors";
import { cn } from "@/lib/utils";
import type { ReminderList } from "@/schemas/list.schema";

type ListRowProps = {
  list: ReminderList;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export function ListRow({ list, isActive, onSelect }: ListRowProps) {
  const { getIncompleteRemindersByList, updateList, deleteList } = useReminders();
  const { renamingListId, setRenamingListId } = useSidebarState();
  const count = getIncompleteRemindersByList(list.id).length;
  const dotColor = LIST_COLOR_MAP[list.color] ?? "bg-gray-400";
  const isRenaming = renamingListId === list.id;

  const { draft, setDraft, inputRef, startRename, commit, handleKeyDown } = useRenameMode(
    list.name,
    isRenaming,
    (name) => updateList(list.id, { name }),
    () => setRenamingListId(null),
  );

  return (
    <div
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-[calc(var(--radius-sm)+2px)] px-2 py-1.5 text-left text-xs transition-colors select-none",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <span className={cn("size-6 shrink-0 rounded-full", dotColor)} aria-hidden />

      {isRenaming ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="min-w-0 flex-1 truncate bg-transparent font-medium outline-none"
        />
      ) : (
        <button
          onClick={() => onSelect(list.id)}
          className="ring-sidebar-ring min-w-0 flex-1 truncate text-left font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {list.name}
        </button>
      )}

      {list.shared && <HugeiconsIcon icon={User02Icon} className="text-sidebar-foreground/50 size-3.5 shrink-0" strokeWidth={2} />}
      {count > 0 && !isRenaming && <span className="text-sidebar-foreground/60 shrink-0 tabular-nums">{count}</span>}

      {!isRenaming && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              startRename();
              setRenamingListId(list.id);
              onSelect(list.id);
            }}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
            aria-label="Rename list"
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} className="size-3.5" strokeWidth={2} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteList(list.id);
            }}
            className="text-sidebar-foreground/50 hover:text-destructive rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
            aria-label="Delete list"
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-3.5" strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}
