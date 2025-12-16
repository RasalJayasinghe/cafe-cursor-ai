import { z } from "zod";

// Order validation schemas
export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  orderType: z.enum(["pickup", "dine-in"]),
  items: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1, "Order must have at least one item"),
  total: z.number().positive(),
  status: z
    .enum(["pending", "preparing", "ready", "completed", "cancelled"])
    .default("pending"),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "preparing", "ready", "completed", "cancelled"])
    .optional(),
  customerName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
});

// Project validation schemas
export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

// Photo validation schemas
export const createPhotoSchema = z.object({
  url: z.string().url("Invalid photo URL"),
  caption: z.string().optional().or(z.literal("")),
  uploadedBy: z.string().min(2, "Uploader name must be at least 2 characters"),
});

// Question validation schemas
export const createQuestionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  askedBy: z.string().min(2, "Name must be at least 2 characters"),
});

export const answerQuestionSchema = z.object({
  answer: z.string().min(5, "Answer must be at least 5 characters"),
});

// Type inference
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;
