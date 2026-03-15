import type { ReminderList } from "@/schemas/list.schema";
import type { Reminder } from "@/schemas/reminder.schema";
import type { ReminderSection } from "@/schemas/section.schema";

const TODAY = new Date("2026-03-15");

function isoDate(date: Date): string {
  return date.toISOString();
}

function todayAt(hour: number, minute = 0): string {
  const d = new Date(TODAY);
  d.setHours(hour, minute, 0, 0);
  return isoDate(d);
}

function daysFromToday(n: number, hour = 9): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return isoDate(d);
}

export const SEED_LISTS: ReminderList[] = [
  { id: "11111111-0000-0000-0000-000000000001", name: "Personal", color: "blue", shared: false },
  { id: "11111111-0000-0000-0000-000000000002", name: "Work", color: "orange", shared: false },
  { id: "11111111-0000-0000-0000-000000000003", name: "Shopping", color: "green", shared: false },
  { id: "11111111-0000-0000-0000-000000000004", name: "Home", color: "red", shared: true },
];

export const SEED_SECTIONS: ReminderSection[] = [
  { id: "22222222-0000-0000-0000-000000000001", listId: "11111111-0000-0000-0000-000000000002", name: "Q1 Goals", order: 0 },
  { id: "22222222-0000-0000-0000-000000000002", listId: "11111111-0000-0000-0000-000000000002", name: "Meetings", order: 1 },
  { id: "22222222-0000-0000-0000-000000000003", listId: "11111111-0000-0000-0000-000000000001", name: "Weekend", order: 0 },
];

export const SEED_REMINDERS: Reminder[] = [
  // Today — morning
  {
    id: "33333333-0000-0000-0000-000000000001",
    title: "Morning run",
    listId: "11111111-0000-0000-0000-000000000001",
    dueDate: todayAt(7, 30),
    flag: false,
    priority: "none",
    order: 1,
  },
  // Today — afternoon, flagged, high priority
  {
    id: "33333333-0000-0000-0000-000000000002",
    title: "Prepare Q1 report",
    notes: "Include revenue breakdown and forecast",
    listId: "11111111-0000-0000-0000-000000000002",
    sectionId: "22222222-0000-0000-0000-000000000001",
    dueDate: todayAt(14),
    flag: true,
    priority: "high",
    order: 2,
  },
  // Today — evening
  {
    id: "33333333-0000-0000-0000-000000000003",
    title: "Call mom",
    listId: "11111111-0000-0000-0000-000000000001",
    dueDate: todayAt(19),
    flag: false,
    priority: "none",
    order: 3,
  },
  // Tomorrow
  {
    id: "33333333-0000-0000-0000-000000000004",
    title: "Team standup",
    listId: "11111111-0000-0000-0000-000000000002",
    sectionId: "22222222-0000-0000-0000-000000000002",
    dueDate: daysFromToday(1, 9),
    flag: false,
    priority: "medium",
    order: 4,
  },
  // This week — Wed
  {
    id: "33333333-0000-0000-0000-000000000005",
    title: "Code review: auth module",
    listId: "11111111-0000-0000-0000-000000000002",
    dueDate: daysFromToday(2, 10),
    flag: true,
    priority: "high",
    order: 5,
  },
  // This week — Fri
  {
    id: "33333333-0000-0000-0000-000000000006",
    title: "Grocery run",
    listId: "11111111-0000-0000-0000-000000000003",
    dueDate: daysFromToday(4, 11),
    flag: false,
    priority: "none",
    order: 6,
  },
  // Next week
  {
    id: "33333333-0000-0000-0000-000000000007",
    title: "Dentist appointment",
    listId: "11111111-0000-0000-0000-000000000001",
    dueDate: daysFromToday(8, 9),
    flag: false,
    priority: "none",
    order: 7,
  },
  // Next month — April
  {
    id: "33333333-0000-0000-0000-000000000008",
    title: "Renew car insurance",
    listId: "11111111-0000-0000-0000-000000000004",
    dueDate: daysFromToday(20, 9),
    flag: true,
    priority: "medium",
    order: 8,
  },
  // May
  {
    id: "33333333-0000-0000-0000-000000000009",
    title: "Book summer flights",
    listId: "11111111-0000-0000-0000-000000000001",
    dueDate: daysFromToday(60, 10),
    flag: false,
    priority: "low",
    order: 9,
  },
  // Weekend section, no due date
  {
    id: "33333333-0000-0000-0000-000000000010",
    title: "Clean garage",
    listId: "11111111-0000-0000-0000-000000000001",
    sectionId: "22222222-0000-0000-0000-000000000003",
    flag: false,
    priority: "none",
    order: 10,
  },
  // Shopping — no due date
  {
    id: "33333333-0000-0000-0000-000000000011",
    title: "Almond milk",
    listId: "11111111-0000-0000-0000-000000000003",
    flag: false,
    priority: "none",
    order: 11,
  },
  {
    id: "33333333-0000-0000-0000-000000000012",
    title: "Running shoes",
    listId: "11111111-0000-0000-0000-000000000003",
    flag: false,
    priority: "low",
    order: 12,
  },
  // Completed — yesterday
  {
    id: "33333333-0000-0000-0000-000000000013",
    title: "Submit expense report",
    listId: "11111111-0000-0000-0000-000000000002",
    sectionId: "22222222-0000-0000-0000-000000000001",
    flag: false,
    priority: "none",
    completedAt: isoDate(new Date("2026-03-14T16:00:00.000Z")),
    order: 13,
  },
  // Completed — 3 days ago
  {
    id: "33333333-0000-0000-0000-000000000014",
    title: "Fix login page bug",
    listId: "11111111-0000-0000-0000-000000000002",
    flag: false,
    priority: "high",
    completedAt: isoDate(new Date("2026-03-12T10:30:00.000Z")),
    order: 14,
  },
];
