import { z } from "zod";

const StatusEnum = ["active", "inactive", "sold", "pending", "deleted"];

export const PropertiesCreationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty"),

  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty"),

  price: z
    .union([
      z.number({ invalid_type_error: "Price must be a number" }),
      z.string().regex(/^\d+(\.\d+)?$/, "Price must be a number"),
    ])
    .transform((val) => Number(val))
    .refine((n) => n >= 0, { message: "Price must be a non-negative number" }),

  location: z
    .string({ required_error: "Location is required" })
    .min(1, "Location cannot be empty"),

  property_type: z
    .string({ required_error: "Property type is required" })
    .min(1, "Property type cannot be empty"),

  bedrooms: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "Bedrooms must be a valid integer"),
    ])
    .transform((v) => Number(v))
    .optional(),

  bathrooms: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "Bathrooms must be a valid integer"),
    ])
    .transform((v) => Number(v))
    .optional(),

  area_sqft: z
    .union([
      z.number(),
      z.string().regex(/^\d+(\.\d+)?$/, "Area must be a valid number"),
    ])
    .transform((v) => Number(v))
    .optional(),

  status: z.enum(StatusEnum, { invalid_type_error: "Invalid status value" }),

  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .optional(),
});
