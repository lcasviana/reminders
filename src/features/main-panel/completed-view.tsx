"use client";

import { useReminders } from "@/context/reminders-context";
import { getRelativeDateLabel } from "@/lib/date-utils";
import { groupBy } from "@/lib/utils";

import { GroupSection } from "./group-section";
import { ReminderRow } from "./reminder-row";

export function CompletedView() {
  const { getCompletedReminders } = useReminders();
  const reminders = getCompletedReminders(); // sorted reverse by completedAt

  const groupMap = groupBy(reminders, (r) => getRelativeDateLabel(r.completedAt!));

  return (
    <div className="flex flex-col py-4">
      <div className="mb-4 flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-gray-500">Completed</h1>
        {reminders.length > 0 && <span className="text-muted-foreground text-4xl font-bold">{reminders.length}</span>}
      </div>
      {groupMap.size === 0 ? (
        <p className="text-muted-foreground px-4 text-sm">No completed reminders.</p>
      ) : (
        Array.from(groupMap.entries()).map(([label, items]) => (
          <GroupSection key={label} title={label}>
            {items.map((r) => (
              <ReminderRow key={r.id} reminder={r} showList showCompletedTime />
            ))}
          </GroupSection>
        ))
      )}
    </div>
  );
}
