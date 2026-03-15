import { z } from "zod";

export const reminderSectionSchema = z.object({
  id: z.string().uuid(),
  listId: z.string().uuid(),
  name: z.string().min(1),
  order: z.number().int(),
});

export const createSectionSchema = reminderSectionSchema.omit({ id: true, order: true });

export type ReminderSection = z.infer<typeof reminderSectionSchema>;
export type CreateSection = z.infer<typeof createSectionSchema>;
