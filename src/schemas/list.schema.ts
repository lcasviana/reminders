import { z } from "zod";

export const reminderListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  color: z.string(),
  icon: z.string().optional(),
  shared: z.boolean().default(false),
});

export const createListSchema = reminderListSchema.omit({ id: true });

export type ReminderList = z.infer<typeof reminderListSchema>;
export type CreateList = z.infer<typeof createListSchema>;
