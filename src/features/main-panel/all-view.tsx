"use client";

import { useReminders } from "@/context/reminders-context";
import { LIST_TEXT_COLOR_MAP } from "@/lib/colors";
import { cn } from "@/lib/utils";

import { GroupSection } from "./group-section";
import { ReminderRow } from "./reminder-row";

export function AllView() {
  const { lists, getIncompleteRemindersByList } = useReminders();

  const groups = lists
    .map((list) => ({
      list,
      items: getIncompleteRemindersByList(list.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col py-4">
      <h1 className="mb-4 px-4 text-2xl font-bold text-gray-500">All</h1>
      {groups.length === 0 ? (
        <p className="text-muted-foreground px-4 text-sm">No reminders.</p>
      ) : (
        groups.map(({ list, items }) => (
          <GroupSection
            key={list.id}
            title={list.name}
            titleClassName={cn("normal-case tracking-normal text-sm font-semibold", LIST_TEXT_COLOR_MAP[list.color] ?? "text-gray-500")}
          >
            {items.map((r) => (
              <ReminderRow key={r.id} reminder={r} />
            ))}
          </GroupSection>
        ))
      )}
    </div>
  );
}
