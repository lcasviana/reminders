"use client";

import { useState } from "react";

import { ArrowDown01Icon, ArrowRight01Icon, Delete01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { useRenameMode } from "@/hooks/use-rename-mode";
import type { Reminder } from "@/schemas/reminder.schema";
import type { ReminderSection } from "@/schemas/section.schema";

import { ReminderRow } from "./reminder-row";

type Props = {
  section: ReminderSection;
  reminders: Reminder[];
};

export function SectionGroup({ section, reminders }: Props) {
  const { updateSection, deleteSection } = useReminders();
  const [collapsed, setCollapsed] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const { draft, setDraft, inputRef, startRename, commit, handleKeyDown } = useRenameMode(
    section.name,
    isRenaming,
    (name) => updateSection(section.id, { name }),
    () => setIsRenaming(false),
  );

  return (
    <div className="group/section mt-2">
      <div className="flex items-center gap-1 px-4 py-1">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors focus-visible:outline-none"
        >
          <HugeiconsIcon icon={collapsed ? ArrowRight01Icon : ArrowDown01Icon} className="size-3" strokeWidth={2} />
        </button>

        {isRenaming ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            className="text-muted-foreground min-w-0 flex-1 bg-transparent text-xs font-semibold tracking-wide uppercase outline-none"
          />
        ) : (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="text-muted-foreground hover:text-foreground min-w-0 flex-1 text-left text-xs font-semibold tracking-wide uppercase transition-colors focus-visible:outline-none"
          >
            {section.name}
          </button>
        )}

        {!isRenaming && (
          <>
            <button
              onClick={() => {
                startRename();
                setIsRenaming(true);
              }}
              className="text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition-opacity group-hover/section:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              aria-label="Rename section"
            >
              <HugeiconsIcon icon={Edit02Icon} className="size-3" strokeWidth={2} />
            </button>
            <button
              onClick={() => deleteSection(section.id)}
              className="text-muted-foreground hover:text-destructive rounded p-0.5 opacity-0 transition-opacity group-hover/section:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              aria-label="Delete section"
            >
              <HugeiconsIcon icon={Delete01Icon} className="size-3" strokeWidth={2} />
            </button>
          </>
        )}
      </div>
      {!collapsed && reminders.map((r) => <ReminderRow key={r.id} reminder={r} />)}
    </div>
  );
}
