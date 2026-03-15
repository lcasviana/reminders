"use client";

import { useMemo } from "react";

import { useReminders } from "@/context/reminders-context";

import { ReminderRow } from "./reminder-row";

export function SearchView({ query }: { query: string }) {
  const { reminders } = useReminders();
  const q = query.toLowerCase();
  const results = useMemo(
    () => reminders.filter((r) => r.title.toLowerCase().includes(q) || (r.notes ?? "").toLowerCase().includes(q)),
    [reminders, q],
  );

  return (
    <div className="py-2">
      <p className="text-muted-foreground px-4 pb-2 text-xs">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>
      {results.length === 0 ? (
        <p className="text-muted-foreground px-4 py-8 text-center text-sm">No reminders found</p>
      ) : (
        results.map((r) => <ReminderRow key={r.id} reminder={r} showList highlight={query} />)
      )}
    </div>
  );
}
