"use client";

import { useState } from "react";

import { useReminders } from "@/context/reminders-context";
import { useInlineAdd } from "@/hooks/use-inline-add";
import { LIST_TEXT_COLOR_MAP } from "@/lib/colors";
import { cn } from "@/lib/utils";

import { ReminderRow } from "./reminder-row";
import { SectionGroup } from "./section-group";

type Props = {
  listId: string;
};

export function ListView({ listId }: Props) {
  const { lists, sections, getRemindersByList, createReminder, deleteReminder, createSection } = useReminders();
  const [showCompleted, setShowCompleted] = useState(false);
  const addReminder = useInlineAdd((title) => createReminder({ title, listId, flag: false, priority: "none" }));
  const addSection = useInlineAdd((name) => createSection({ name, listId }));

  const list = lists.find((l) => l.id === listId);
  if (!list) return null;

  const allReminders = getRemindersByList(listId);
  const listSections = sections.filter((s) => s.listId === listId).sort((a, b) => a.order - b.order);

  // Single-pass partition into all buckets
  const unsectionedIncomplete: typeof allReminders = [];
  const completedAll: typeof allReminders = [];
  const sectionReminders = new Map<string, typeof allReminders>();
  for (const r of allReminders) {
    if (r.completedAt) {
      completedAll.push(r);
    } else if (r.sectionId) {
      const bucket = sectionReminders.get(r.sectionId) ?? [];
      bucket.push(r);
      sectionReminders.set(r.sectionId, bucket);
    } else {
      unsectionedIncomplete.push(r);
    }
  }

  const textColor = LIST_TEXT_COLOR_MAP[list.color] ?? "text-gray-500";
  const incompleteCount = allReminders.length - completedAll.length;

  function handleClear() {
    completedAll.forEach((r) => deleteReminder(r.id));
  }

  return (
    <div className="flex flex-col py-4">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between px-4">
        <h1 className={cn("text-2xl font-bold", textColor)}>{list.name}</h1>
        <div className="flex items-center gap-3">
          {completedAll.length > 0 && (
            <>
              <span className="text-muted-foreground text-xs">{completedAll.length} completed</span>
              <button onClick={() => setShowCompleted((v) => !v)} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
                {showCompleted ? "Hide" : "Show"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Unsectioned incomplete */}
      {unsectionedIncomplete.map((r) => (
        <ReminderRow key={r.id} reminder={r} />
      ))}

      {/* Sections */}
      {listSections.map((section) => (
        <SectionGroup key={section.id} section={section} reminders={sectionReminders.get(section.id) ?? []} />
      ))}

      {/* Inline add */}
      {addReminder.isAdding ? (
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-gray-400 dark:border-gray-600" />
          <input
            autoFocus
            value={addReminder.value}
            onChange={(e) => addReminder.setValue(e.target.value)}
            onKeyDown={addReminder.handleKeyDown}
            onBlur={addReminder.handleBlur}
            placeholder="New Reminder"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>
      ) : (
        <button
          onClick={() => addReminder.setIsAdding(true)}
          className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-2 px-4 py-1 text-sm transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          New Reminder
        </button>
      )}

      {/* Add Section */}
      {addSection.isAdding ? (
        <div className="mt-1 px-4 py-1">
          <input
            autoFocus
            value={addSection.value}
            onChange={(e) => addSection.setValue(e.target.value)}
            onKeyDown={addSection.handleKeyDown}
            onBlur={addSection.handleBlur}
            placeholder="Section Name"
            className="text-muted-foreground w-full bg-transparent text-xs font-semibold tracking-wide uppercase outline-none placeholder:text-gray-500"
          />
        </div>
      ) : (
        <button
          onClick={() => addSection.setIsAdding(true)}
          className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-2 px-4 py-1 text-sm transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add Section
        </button>
      )}

      {/* Completed */}
      {showCompleted && completedAll.length > 0 && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between px-4">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Completed</h3>
            <button onClick={handleClear} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              Clear
            </button>
          </div>
          {completedAll.map((r) => (
            <ReminderRow key={r.id} reminder={r} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {incompleteCount === 0 && !addReminder.isAdding && <p className="text-muted-foreground mt-2 px-4 text-sm">No Reminders</p>}
    </div>
  );
}
