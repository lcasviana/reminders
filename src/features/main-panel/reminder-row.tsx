"use client";

import { useMemo } from "react";

import { Flag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { LIST_COLOR_MAP } from "@/lib/colors";
import { formatDueTime } from "@/lib/date-utils";
import { PRIORITY_LABEL } from "@/lib/priority";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/schemas/reminder.schema";

type Props = {
  reminder: Reminder;
  showList?: boolean;
  highlight?: string;
};

function HighlightText({ text, query }: { text: string; query: string }) {
  const regex = useMemo(() => (query ? new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi") : null), [query]);
  if (!regex) return <>{text}</>;
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={`${i}-${part}`} className="rounded-sm bg-yellow-300/40 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function ReminderRow({ reminder, showList, highlight }: Props) {
  const { lists, completeReminder, uncompleteReminder, updateReminder, setEditingReminderId } = useReminders();
  const list = lists.find((l) => l.id === reminder.listId);
  const completed = !!reminder.completedAt;

  function toggleComplete() {
    if (completed) uncompleteReminder(reminder.id);
    else completeReminder(reminder.id);
  }

  function toggleFlag() {
    updateReminder(reminder.id, { flag: !reminder.flag });
  }

  return (
    <div className="group flex items-start gap-3 px-4 py-2">
      <button
        onClick={toggleComplete}
        className={cn(
          "mt-0.5 size-5 shrink-0 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:outline-none",
          completed ? "border-blue-500 bg-blue-500" : "border-gray-400 hover:border-blue-400 dark:border-gray-600",
        )}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      />

      <button onClick={() => setEditingReminderId(reminder.id)} className="min-w-0 flex-1 text-left focus-visible:outline-none">
        <div className="flex items-center gap-2">
          <span className={cn("truncate text-sm", completed && "text-muted-foreground line-through")}>
            <HighlightText text={reminder.title} query={highlight ?? ""} />
          </span>

          {reminder.priority !== "none" && <span className="shrink-0 text-xs font-bold text-red-500">{PRIORITY_LABEL[reminder.priority]}</span>}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          {reminder.dueDate && <span className="text-muted-foreground text-xs">{formatDueTime(reminder.dueDate)}</span>}
          {showList && list && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <span className={cn("size-2 shrink-0 rounded-full", LIST_COLOR_MAP[list.color] ?? "bg-gray-500")} />
              {list.name}
            </span>
          )}
          {reminder.notes && (
            <span className="text-muted-foreground max-w-50 truncate text-xs">
              <HighlightText text={reminder.notes.split("\n")[0]} query={highlight ?? ""} />
            </span>
          )}
        </div>
      </button>

      <button
        onClick={toggleFlag}
        className={cn(
          "mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none",
          reminder.flag && "opacity-100",
        )}
        aria-label={reminder.flag ? "Remove flag" : "Flag reminder"}
      >
        <HugeiconsIcon icon={Flag01Icon} className={cn("size-4", reminder.flag ? "text-orange-500" : "text-muted-foreground")} strokeWidth={2} />
      </button>
    </div>
  );
}
