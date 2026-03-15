import type { Reminder } from "@/schemas/reminder.schema";

export type Priority = Reminder["priority"];

export const PRIORITY_LABEL: Record<string, string> = {
  low: "!",
  medium: "!!",
  high: "!!!",
};

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "!" },
  { value: "medium", label: "!!" },
  { value: "high", label: "!!!" },
];
