import { z } from "zod";

export const smartListSchema = z.enum(["Today", "Scheduled", "All", "Flagged", "Completed"]);

export const SMART_LISTS = smartListSchema.options;

export type SmartList = z.infer<typeof smartListSchema>;

export function isSmartList(view: string): view is SmartList {
  return (SMART_LISTS as readonly string[]).includes(view);
}
