import { z } from "zod";

export const reminderSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  notes: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  flag: z.boolean().default(false),
  priority: z.enum(["none", "low", "medium", "high"]).default("none"),
  listId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  completedAt: z.string().datetime().optional(),
  order: z.number().int(),
});

export const createReminderSchema = reminderSchema.omit({ id: true, completedAt: true, order: true });

export type Reminder = z.infer<typeof reminderSchema>;
export type CreateReminder = z.infer<typeof createReminderSchema>;
