"use client";

import { useReminders } from "@/context/reminders-context";

import { ReminderRow } from "./reminder-row";

export function FlaggedView() {
  const { getFlaggedReminders } = useReminders();
  const reminders = getFlaggedReminders();

  return (
    <div className="flex flex-col py-4">
      <h1 className="mb-4 px-4 text-2xl font-bold text-orange-500">Flagged</h1>
      {reminders.length === 0 ? (
        <p className="text-muted-foreground px-4 text-sm">No flagged reminders.</p>
      ) : (
        reminders.map((r) => <ReminderRow key={r.id} reminder={r} showList />)
      )}
    </div>
  );
}
