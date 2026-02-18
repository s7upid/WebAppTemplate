import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Role name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission must be selected"),
});

export const roleCreateSchema = roleSchema;

export const roleUpdateSchema = roleSchema;

export type RoleFormData = z.infer<typeof roleSchema>;
