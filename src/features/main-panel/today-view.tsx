"use client";

import { useReminders } from "@/context/reminders-context";
import { getTimeOfDay } from "@/lib/date-utils";

import { GroupSection } from "./group-section";
import { ReminderRow } from "./reminder-row";

const TIME_ORDER = ["Morning", "Afternoon", "Tonight"] as const;

export function TodayView() {
  const { getTodayReminders } = useReminders();
  const reminders = getTodayReminders();

  const groups = TIME_ORDER.map((label) => ({
    label,
    items: reminders.filter((r) => getTimeOfDay(r.dueDate!) === label),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col py-4">
      <h1 className="mb-4 px-4 text-2xl font-bold text-blue-500">Today</h1>
      {groups.length === 0 ? (
        <p className="text-muted-foreground px-4 text-sm">No reminders for today.</p>
      ) : (
        groups.map((g) => (
          <GroupSection key={g.label} title={g.label}>
            {g.items.map((r) => (
              <ReminderRow key={r.id} reminder={r} />
            ))}
          </GroupSection>
        ))
      )}
    </div>
  );
}
