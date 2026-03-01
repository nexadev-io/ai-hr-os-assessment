import { z } from "zod";

export const employmentTypeEnum = z.enum(["full-time", "part-time", "contract"]);
export const jobStatusEnum = z.enum(["draft", "published", "closed"]);

export const createJobSchema = z.object({
  tenantId: z
    .string({
      required_error: "tenantId is required",
      invalid_type_error: "tenantId must be a string",
    })
    .uuid("tenantId must be a valid UUID"),
  title: z
    .string({
      required_error: "title is required",
      invalid_type_error: "title must be a string",
    })
    .min(1, "title is required")
    .max(255, "title must be at most 255 characters"),
  department: z
    .string({ invalid_type_error: "department must be a string" })
    .max(100, "department must be at most 100 characters")
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be a string" })
    .max(150, "location must be at most 150 characters")
    .optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract"], {
      invalid_type_error: "employmentType must be one of: full-time, part-time, contract",
    })
    .optional(),
  salaryMin: z
    .number({ invalid_type_error: "salaryMin must be a number" })
    .int("salaryMin must be an integer")
    .optional(),
  salaryMax: z
    .number({ invalid_type_error: "salaryMax must be a number" })
    .int("salaryMax must be an integer")
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be a string" })
    .optional(),
  status: z
    .enum(["draft", "published", "closed"], {
      invalid_type_error: "status must be one of: draft, published, closed",
    })
    .optional(),
}).superRefine((data, ctx) => {
  if (typeof data.salaryMin === "number" && typeof data.salaryMax === "number" && data.salaryMin > data.salaryMax) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salaryMax"],
      message: "salaryMax must be greater than or equal to salaryMin",
    });
  }
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
