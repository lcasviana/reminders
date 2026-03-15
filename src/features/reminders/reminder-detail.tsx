"use client";

import { useState } from "react";

import { Flag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useReminders } from "@/context/reminders-context";
import { LIST_COLOR_MAP } from "@/lib/colors";
import { PRIORITY_OPTIONS, type Priority } from "@/lib/priority";
import { cn } from "@/lib/utils";
import type { Reminder } from "@/schemas/reminder.schema";
import { isSmartList } from "@/schemas/smart-list.schema";

type FormState = {
  title: string;
  notes: string;
  dueDate: string;
  flag: boolean;
  priority: Priority;
  listId: string;
  sectionId: string;
};

function initialForm(reminder: Reminder | null, defaultListId: string): FormState {
  if (!reminder) {
    return { title: "", notes: "", dueDate: "", flag: false, priority: "none", listId: defaultListId, sectionId: "" };
  }
  return {
    title: reminder.title,
    notes: reminder.notes ?? "",
    dueDate: reminder.dueDate ? reminder.dueDate.slice(0, 16) : "",
    flag: reminder.flag,
    priority: reminder.priority as Priority,
    listId: reminder.listId,
    sectionId: reminder.sectionId ?? "",
  };
}

type FormProps = {
  reminder: Reminder | null;
  defaultListId: string;
};

function ReminderForm({ reminder, defaultListId }: FormProps) {
  const isCreate = reminder === null;
  const { lists, sections, editingReminderId, setEditingReminderId, createReminder, updateReminder } = useReminders();

  const [form, setForm] = useState<FormState>(() => initialForm(reminder, defaultListId));

  const availableSections = sections.filter((s) => s.listId === form.listId);
  const selectedList = lists.find((l) => l.id === form.listId);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleListChange(listId: string) {
    setForm((prev) => ({ ...prev, listId, sectionId: "" }));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const data = {
      title: form.title.trim(),
      notes: form.notes || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      flag: form.flag,
      priority: form.priority,
      listId: form.listId,
      sectionId: form.sectionId || undefined,
    };
    if (isCreate) {
      createReminder(data);
    } else if (editingReminderId) {
      updateReminder(editingReminderId, data);
    }
    setEditingReminderId(null);
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{isCreate ? "New Reminder" : "Edit Reminder"}</SheetTitle>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          autoFocus={isCreate}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          className="border-input bg-input/20 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 dark:bg-input/30 min-h-20 w-full resize-y rounded-md border px-2 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 md:text-xs/relaxed"
        />

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Due Date</span>
          <Input type="datetime-local" value={form.dueDate} onChange={(e) => setField("dueDate", e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Priority</span>
          <div className="flex gap-1">
            {PRIORITY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={form.priority === opt.value ? "outline" : "ghost"}
                size="sm"
                onClick={() => setField("priority", opt.value)}
                className={cn("flex-1", opt.value !== "none" && "font-bold text-red-500")}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Flag</span>
          <Button variant={form.flag ? "outline" : "ghost"} size="sm" onClick={() => setField("flag", !form.flag)} className="w-fit">
            <HugeiconsIcon icon={Flag01Icon} className={cn("size-4", form.flag ? "text-orange-500" : "text-muted-foreground")} strokeWidth={2} />
            {form.flag ? "Flagged" : "Flag"}
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">List</span>
          <select
            value={form.listId}
            onChange={(e) => handleListChange(e.target.value)}
            className="border-input bg-input/20 dark:bg-input/30 h-7 w-full rounded-md border px-2 text-sm outline-none focus-visible:ring-2 md:text-xs/relaxed"
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {availableSections.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Section</span>
            <select
              value={form.sectionId}
              onChange={(e) => setField("sectionId", e.target.value)}
              className="border-input bg-input/20 dark:bg-input/30 h-7 w-full rounded-md border px-2 text-sm outline-none focus-visible:ring-2 md:text-xs/relaxed"
            >
              <option value="">None</option>
              {availableSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedList && (
          <div className="flex items-center gap-2">
            <span className={cn("size-2.5 shrink-0 rounded-full", LIST_COLOR_MAP[selectedList.color] ?? "bg-gray-500")} />
            <span className="text-muted-foreground text-xs">{selectedList.name}</span>
          </div>
        )}
      </div>

      <SheetFooter>
        <SheetClose render={<Button variant="ghost">Cancel</Button>} />
        <Button disabled={!form.title.trim()} onClick={handleSave}>
          Done
        </Button>
      </SheetFooter>
    </>
  );
}

export function ReminderDetail() {
  const { reminders, lists, selectedView, editingReminderId, setEditingReminderId } = useReminders();

  const reminder = editingReminderId === "new" ? null : (reminders.find((r) => r.id === editingReminderId) ?? null);
  const defaultListId = !isSmartList(selectedView) ? selectedView : (lists[0]?.id ?? "");

  return (
    <Sheet
      open={editingReminderId !== null}
      onOpenChange={(open) => {
        if (!open) setEditingReminderId(null);
      }}
    >
      <SheetContent side="right" showCloseButton>
        {editingReminderId !== null && <ReminderForm key={editingReminderId} reminder={reminder} defaultListId={defaultListId} />}
      </SheetContent>
    </Sheet>
  );
}
