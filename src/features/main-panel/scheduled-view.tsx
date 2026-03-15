"use client";

import { useReminders } from "@/context/reminders-context";
import { getScheduledGroup } from "@/lib/date-utils";
import { groupBy } from "@/lib/utils";

import { GroupSection } from "./group-section";
import { ReminderRow } from "./reminder-row";

export function ScheduledView() {
  const { getScheduledReminders } = useReminders();
  const reminders = getScheduledReminders(); // already sorted by dueDate

  const groupMap = groupBy(reminders, (r) => getScheduledGroup(r.dueDate!));

  return (
    <div className="flex flex-col py-4">
      <h1 className="mb-4 px-4 text-2xl font-bold text-red-500">Scheduled</h1>
      {groupMap.size === 0 ? (
        <p className="text-muted-foreground px-4 text-sm">No scheduled reminders.</p>
      ) : (
        Array.from(groupMap.entries()).map(([label, items]) => (
          <GroupSection key={label} title={label}>
            {items.map((r) => (
              <ReminderRow key={r.id} reminder={r} />
            ))}
          </GroupSection>
        ))
      )}
    </div>
  );
}
