import { z } from "zod";

export const LeadInputSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(10).max(15),
  city: z.string().trim().min(2),
  description: z.string().optional(),
  serviceId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid serviceId"),
});
