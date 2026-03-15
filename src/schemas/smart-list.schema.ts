import { z } from "zod";

export const smartListSchema = z.enum(["Today", "Scheduled", "All", "Flagged", "Completed"]);

export const SMART_LISTS = smartListSchema.options;

export type SmartList = z.infer<typeof smartListSchema>;
