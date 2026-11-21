import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(120, { message: "Title must be at most 120 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(10000, { message: "Content must be at most 10,000 characters" }),
});

export const validColorSchemes = [
  "theme-red",
  "theme-blue",
  "theme-rose",
  "theme-violet",
  "theme-green",
  "theme-yellow",
  "theme-orange",
] as const;

export const settingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(60, { message: "Name must be at most 60 characters" }),
  color: z.enum(validColorSchemes, {
    message: "Invalid color scheme selected",
  }),
});
