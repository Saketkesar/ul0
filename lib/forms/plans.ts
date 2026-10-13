/**
 * Forms feature plan limits and constants.
 * Single source of truth for Forms tier quotas.
 */

export interface FormsPlanLimits {
  /** Maximum number of active forms an account can create */
  maxForms: number
  /** Maximum fields allowed per form */
  maxFieldsPerForm: number
  /** Monthly submission quota before throttling */
  maxSubmissionsPerMonth: number
  /** Max file upload size in MB for image fields */
  maxImageSizeMb: number
  /** Whether the "Powered by ul0.site" footer can be removed */
  canRemoveBranding: boolean
}

// TODO(owner): Finalize production limits for Pro and Business tiers
export const FORMS_PLAN_LIMITS: Record<string, FormsPlanLimits> = {
  free_user: {
    maxForms: 0, // Forms is a Pro & Business feature
    maxFieldsPerForm: 0,
    maxSubmissionsPerMonth: 0,
    maxImageSizeMb: 2,
    canRemoveBranding: false,
  },
  pro_user: {
    maxForms: 10, // TODO(owner): Pro quota default 10 forms
    maxFieldsPerForm: 30, // TODO(owner): 30 fields per form
    maxSubmissionsPerMonth: 2500, // TODO(owner): 2,500 submissions / month
    maxImageSizeMb: 5, // 5 MB per image upload
    canRemoveBranding: false,
  },
  business_user: {
    maxForms: 50, // TODO(owner): Business quota default 50 forms
    maxFieldsPerForm: 100, // 100 fields per form
    maxSubmissionsPerMonth: 25000, // 25,000 submissions / month
    maxImageSizeMb: 10, // 10 MB per image upload
    canRemoveBranding: true, // Removable badge
  },
  admin: {
    maxForms: 9999,
    maxFieldsPerForm: 200,
    maxSubmissionsPerMonth: 999999,
    maxImageSizeMb: 20,
    canRemoveBranding: true,
  },
}

export const DEFAULT_FORMS_IMAGE_SIZE_MB = 5
export const MAX_FIELD_OPTIONS_COUNT = 50
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const
