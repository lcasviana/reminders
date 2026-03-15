"use client";

import { Flag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { LIST_COLOR_MAP } from "@/lib/colors";
import { formatDueTime } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/schemas/reminder.schema";

const PRIORITY_LABEL: Record<string, string> = {
  low: "!",
  medium: "!!",
  high: "!!!",
};

type Props = {
  reminder: Reminder;
  showList?: boolean;
};

export function ReminderRow({ reminder, showList }: Props) {
  const { lists, completeReminder, uncompleteReminder, updateReminder } = useReminders();
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

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("truncate text-sm", completed && "text-muted-foreground line-through")}>{reminder.title}</span>

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
          {reminder.notes && <span className="text-muted-foreground max-w-50 truncate text-xs">{reminder.notes.split("\n")[0]}</span>}
        </div>
      </div>

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
