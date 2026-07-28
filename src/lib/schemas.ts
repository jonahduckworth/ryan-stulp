import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable();

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
  phone: z
    .string()
    .trim()
    .max(30)
    .transform((value) => (value === "" ? null : value)),
  intent: z.enum(["buy", "sell", "invest", "commercial", "general"]),
  message: z
    .string()
    .trim()
    .min(10, "Please share a little more detail (at least 10 characters).")
    .max(3000),
  propertyAddress: optionalText,
  source: z.enum([
    "contact-page",
    "listing-detail",
    "buying-page",
    "home-evaluation",
  ]),
  website: z.string().max(0, "Unable to submit."),
  turnstileToken: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const passwordSetupSchema = z
  .object({
    password: z
      .string()
      .min(12, "Password must be at least 12 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const listingSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words and hyphens only."),
  address: z.string().trim().min(3).max(180),
  city: z.string().trim().min(2).max(100),
  province: z.string().trim().min(2).max(40),
  postalCode: optionalText,
  price: z.coerce.number().int().nonnegative().nullable(),
  status: z.enum(["draft", "active", "pending", "sold", "archived"]),
  propertyType: z.string().trim().min(2).max(80),
  bedrooms: z.coerce.number().int().nonnegative().nullable(),
  bathrooms: z.coerce.number().nonnegative().nullable(),
  squareFeet: z.coerce.number().int().positive().nullable(),
  description: z.string().trim().min(20).max(12000),
  features: z
    .string()
    .max(2000)
    .transform((value) =>
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  coverImageUrl: z.url("Use a valid image URL.").or(z.literal("")).transform((value) => value || null),
});

export const leadUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "contacted", "qualified", "closed", "archived"]),
  notes: z.string().trim().max(6000).transform((value) => value || null),
});

export type LeadInput = z.infer<typeof leadSchema>;
