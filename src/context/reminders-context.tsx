"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { SEED_LISTS, SEED_REMINDERS, SEED_SECTIONS } from "@/lib/seed";
import type { CreateList, ReminderList } from "@/schemas/list.schema";
import type { CreateReminder, Reminder } from "@/schemas/reminder.schema";
import type { CreateSection, ReminderSection } from "@/schemas/section.schema";
import type { SmartList } from "@/schemas/smart-list.schema";

const STORAGE_KEY = "reminders-store";

type State = {
  lists: ReminderList[];
  sections: ReminderSection[];
  reminders: Reminder[];
  selectedView: SmartList | string;
};

const SEED_STATE: State = {
  lists: SEED_LISTS,
  sections: SEED_SECTIONS,
  reminders: SEED_REMINDERS,
  selectedView: "Today",
};

type RemindersContextValue = {
  lists: ReminderList[];
  sections: ReminderSection[];
  reminders: Reminder[];
  selectedView: SmartList | string;
  setSelectedView: (view: SmartList | string) => void;
  editingReminderId: string | null;
  setEditingReminderId: (id: string | null) => void;

  getRemindersByList: (listId: string) => Reminder[];
  getIncompleteRemindersByList: (listId: string) => Reminder[];
  getRemindersBySection: (sectionId: string) => Reminder[];
  getIncompleteReminders: () => Reminder[];
  getTodayReminders: () => Reminder[];
  getScheduledReminders: () => Reminder[];
  getFlaggedReminders: () => Reminder[];
  getCompletedReminders: () => Reminder[];

  createReminder: (data: CreateReminder) => void;
  updateReminder: (id: string, data: Partial<Omit<Reminder, "id">>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  uncompleteReminder: (id: string) => void;

  createList: (data: CreateList) => string;
  updateList: (id: string, data: Partial<Omit<ReminderList, "id">>) => void;
  deleteList: (id: string) => void;

  createSection: (data: CreateSection) => void;
  updateSection: (id: string, data: Partial<Omit<ReminderSection, "id">>) => void;
  deleteSection: (id: string) => void;
};

const RemindersContext = createContext<RemindersContextValue | null>(null);

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function RemindersProvider({ children }: { children: React.ReactNode }) {
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [state, setState] = useState<State>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as State;
    } catch {
      // fall back to seed
    }
    return SEED_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<RemindersContextValue>(() => {
    const { lists, sections, reminders, selectedView } = state;

    return {
      lists,
      sections,
      reminders,
      selectedView,
      editingReminderId,
      setEditingReminderId,

      setSelectedView: (view) => setState((prev) => ({ ...prev, selectedView: view })),

      getRemindersByList: (listId) => reminders.filter((r) => r.listId === listId).sort((a, b) => a.order - b.order),

      getIncompleteRemindersByList: (listId) => reminders.filter((r) => r.listId === listId && !r.completedAt).sort((a, b) => a.order - b.order),

      getRemindersBySection: (sectionId) => reminders.filter((r) => r.sectionId === sectionId).sort((a, b) => a.order - b.order),

      getIncompleteReminders: () => reminders.filter((r) => !r.completedAt),

      getTodayReminders: () => reminders.filter((r) => !r.completedAt && r.dueDate && isToday(r.dueDate)),

      getScheduledReminders: () => reminders.filter((r) => !r.completedAt && r.dueDate).sort((a, b) => a.dueDate!.localeCompare(b.dueDate!)),

      getFlaggedReminders: () => reminders.filter((r) => !r.completedAt && r.flag),

      getCompletedReminders: () => reminders.filter((r) => r.completedAt).sort((a, b) => b.completedAt!.localeCompare(a.completedAt!)),

      createReminder: (data) =>
        setState((prev) => ({
          ...prev,
          reminders: [...prev.reminders, { ...data, id: crypto.randomUUID(), completedAt: undefined, order: Date.now() }],
        })),

      updateReminder: (id, data) =>
        setState((prev) => ({
          ...prev,
          reminders: prev.reminders.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),

      deleteReminder: (id) => setState((prev) => ({ ...prev, reminders: prev.reminders.filter((r) => r.id !== id) })),

      completeReminder: (id) =>
        setState((prev) => ({
          ...prev,
          reminders: prev.reminders.map((r) => (r.id === id ? { ...r, completedAt: new Date().toISOString() } : r)),
        })),

      uncompleteReminder: (id) =>
        setState((prev) => ({
          ...prev,
          reminders: prev.reminders.map((r) => (r.id === id ? { ...r, completedAt: undefined } : r)),
        })),

      createList: (data) => {
        const id = crypto.randomUUID();
        setState((prev) => ({ ...prev, lists: [...prev.lists, { ...data, id }] }));
        return id;
      },

      updateList: (id, data) =>
        setState((prev) => ({
          ...prev,
          lists: prev.lists.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),

      deleteList: (id) =>
        setState((prev) => ({
          ...prev,
          lists: prev.lists.filter((l) => l.id !== id),
          sections: prev.sections.filter((s) => s.listId !== id),
          reminders: prev.reminders.filter((r) => r.listId !== id),
        })),

      createSection: (data) =>
        setState((prev) => ({
          ...prev,
          sections: [...prev.sections, { ...data, id: crypto.randomUUID(), order: Date.now() }],
        })),

      updateSection: (id, data) =>
        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),

      deleteSection: (id) =>
        setState((prev) => ({
          ...prev,
          sections: prev.sections.filter((s) => s.id !== id),
          reminders: prev.reminders.map((r) => (r.sectionId === id ? { ...r, sectionId: undefined } : r)),
        })),
    };
  }, [state, editingReminderId]);

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders(): RemindersContextValue {
  const context = useContext(RemindersContext);
  if (!context) throw new Error("useReminders must be used within RemindersProvider");
  return context;
}
