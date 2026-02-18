import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  roleId: z
    .string()
    .min(1, "Role is required")
    .uuid("Please choose a valid role"),
  status: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error("Status must be a valid number");
        return num;
      }
      return val;
    })
    .refine((val) => val >= 0 && val <= 3, {
      message: "Status must be between 0 and 3",
    }),
});

export const userCreateSchema = userSchema;

export const userUpdateSchema = userSchema.partial().extend({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  avatar: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return val.startsWith("data:image/") && val.includes("base64,");
    }, "Please upload a valid image file"),
});

export type UserFormData = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof userCreateSchema>;
export type UpdateUserData = z.infer<typeof userUpdateSchema>;
