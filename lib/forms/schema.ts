import { z } from "zod"

export const INPUT_FIELD_TYPES = [
  "short_text",
  "long_text",
  "email",
  "phone",
  "number",
  "url",
  "date",
  "time",
  "single_choice",
  "multi_choice",
  "dropdown",
  "rating",
  "scale",
  "yes_no",
  "image",
] as const

export const NON_INPUT_BLOCK_TYPES = ["heading", "paragraph", "divider"] as const

export const ALL_BLOCK_TYPES = [...INPUT_FIELD_TYPES, ...NON_INPUT_BLOCK_TYPES] as const

export type InputFieldType = (typeof INPUT_FIELD_TYPES)[number]
export type NonInputBlockType = (typeof NON_INPUT_BLOCK_TYPES)[number]
export type BlockType = (typeof ALL_BLOCK_TYPES)[number]

export const CURATED_ACCENTS = [
  { id: "teal", label: "Teal", hex: "#1FA087", text: "#ffffff", darkHex: "#1FA087" },
  { id: "ink", label: "Ink", hex: "#18181b", text: "#ffffff", darkHex: "#f4f4f5" },
  { id: "clay", label: "Clay", hex: "#9a3412", text: "#ffffff", darkHex: "#ea580c" },
  { id: "olive", label: "Olive", hex: "#3f6212", text: "#ffffff", darkHex: "#65a30d" },
  { id: "slate", label: "Slate", hex: "#334155", text: "#ffffff", darkHex: "#64748b" },
  { id: "plum", label: "Plum", hex: "#701a75", text: "#ffffff", darkHex: "#a21caf" },
  { id: "ochre", label: "Ochre", hex: "#854d0e", text: "#ffffff", darkHex: "#ca8a04" },
  { id: "rose", label: "Rose", hex: "#9f1239", text: "#ffffff", darkHex: "#e11d48" },
] as const

export type AccentId = (typeof CURATED_ACCENTS)[number]["id"]

export const FieldOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
})
export type FieldOption = z.infer<typeof FieldOptionSchema>

export const FormFieldSchema = z.object({
  id: z.string().min(1),
  key: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9_]+$/, "Field key must be lowercase snake_case alphanumeric"),
  type: z.enum(ALL_BLOCK_TYPES),
  label: z.string().min(1, "Label is required").max(200),
  help: z.string().max(500).optional().default(""),
  required: z.boolean().default(false),
  placeholder: z.string().max(100).optional().default(""),
  options: z.array(FieldOptionSchema).max(50).optional().default([]),
  min: z.number().optional(),
  max: z.number().optional(),
  maxLength: z.number().max(5000).optional(),
})
export type FormField = z.infer<typeof FormFieldSchema>

export const FormThemeSchema = z.object({
  accent: z.enum(["teal", "ink", "clay", "olive", "slate", "plum", "ochre", "rose"]).default("teal"),
  font: z.enum(["sans", "serif", "mono"]).default("sans"),
  mode: z.enum(["auto", "light", "dark"]).default("auto"),
  cover_url: z.string().url().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  submit_label: z.string().max(50).default("Submit"),
  success_message: z.string().max(500).default("Thank you! Your response has been recorded."),
  redirect_url: z.string().url().nullable().optional(),
  close_date: z.string().nullable().optional(),
})
export type FormTheme = z.infer<typeof FormThemeSchema>

export const FormPermissionsSchema = z.object({
  read: z.boolean().default(true),
  edit: z.boolean().default(false),
  delete: z.boolean().default(false),
})
export type FormPermissions = z.infer<typeof FormPermissionsSchema>

export const FormDocSchema = z.object({
  id: z.string(),
  owner_id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().default(""),
  status: z.enum(["draft", "live", "paused"]).default("draft"),
  step: z.number().int().min(1).max(7).default(1),
  schema: z.array(FormFieldSchema).default([]),
  theme: FormThemeSchema.default({}),
  permissions: FormPermissionsSchema.default({ read: true, edit: false, delete: false }),
  script_url: z.string().default(""),
  script_secret_enc: z.string().default(""),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  published_at: z.string().nullable().optional(),
})
export type FormDoc = z.infer<typeof FormDocSchema>

/**
 * Phishing detection: returns true if label matches sensitive keywords.
 */
export function hasPhishingKeywords(text: string): boolean {
  const re = /(password|card number|credit card|cvv|cvc|otp|pin number|aadhaar|ssn|social security)/i
  return re.test(text)
}

/**
 * Builds a dynamic Zod validation schema for respondent answers.
 */
export function buildSubmissionSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const f of fields) {
    // Non-input blocks don't receive answers
    if (NON_INPUT_BLOCK_TYPES.includes(f.type as any)) continue

    let s: z.ZodTypeAny

    switch (f.type) {
      case "email":
        s = z.string().email("Please enter a valid email address.")
        break
      case "number":
        s = z.preprocess((val) => {
          if (val === "" || val === null || val === undefined) return undefined
          const num = Number(val)
          return isNaN(num) ? val : num
        }, z.number({ invalid_type_error: "Must be a number" }))
        if (f.min !== undefined) s = (s as z.ZodNumber).min(f.min)
        if (f.max !== undefined) s = (s as z.ZodNumber).max(f.max)
        break
      case "url":
        s = z.string().url("Please enter a valid website URL.")
        break
      case "multi_choice":
        s = z.array(z.string())
        break
      case "rating":
      case "scale":
        s = z.number().int().min(f.min ?? 1).max(f.max ?? (f.type === "rating" ? 5 : 10))
        break
      case "yes_no":
        s = z.enum(["yes", "no", "Yes", "No", "true", "false"])
        break
      case "image":
        s = z.string().url("Must be an uploaded image URL")
        break
      default:
        s = z.string()
        if (f.maxLength) s = (s as z.ZodString).max(f.maxLength)
        break
    }

    if (!f.required) {
      s = s.optional().nullable()
    } else {
      if (f.type === "short_text" || f.type === "long_text") {
        s = (s as z.ZodString).min(1, `${f.label} is required.`)
      }
    }

    shape[f.key] = s
  }

  // Include honeypot check: _hp must be empty
  shape["_hp"] = z.string().max(0, "Bot submission detected").optional().default("")

  return z.object(shape)
}
