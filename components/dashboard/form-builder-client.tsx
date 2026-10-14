"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormDoc, FormField, BlockType } from "@/lib/forms/schema"
import {
  INPUT_FIELD_TYPES,
  NON_INPUT_BLOCK_TYPES,
  CURATED_ACCENTS,
  hasPhishingKeywords,
} from "@/lib/forms/schema"
import { generateAppsScript } from "@/lib/forms/appscript"
import { isValidAppsScriptUrl } from "@/lib/forms/client"
import QRCode from "qrcode"
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Eye,
  GripVertical,
  HelpCircle,
  MoveDown,
  MoveUp,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  Trash2,
  X,
  AlertTriangle,
  Play,
  Pause,
  FileSpreadsheet,
  Code2,
  Link2,
  Palette,
  Share2,
} from "lucide-react"

interface FormBuilderClientProps {
  initialForm: FormDoc
  userEmail: string | null
}

const WIZARD_STEPS = [
  { id: 1, label: "Basics", icon: Settings },
  { id: 2, label: "Fields", icon: Plus },
  { id: 3, label: "Template", icon: FileSpreadsheet },
  { id: 4, label: "Script", icon: Code2 },
  { id: 5, label: "Connect", icon: Link2 },
  { id: 6, label: "Design", icon: Palette },
  { id: 7, label: "Share", icon: Share2 },
]

export function FormBuilderClient({ initialForm, userEmail }: FormBuilderClientProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormDoc>(initialForm)
  const [currentStep, setCurrentStep] = useState<number>(initialForm.step || 1)

  // Autosave status: "saved" | "saving" | "error"
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Step 1: Basics
  const [title, setTitle] = useState(form.title)
  const [slug, setSlug] = useState(form.slug)
  const [description, setDescription] = useState(form.description || "")
  const [slugError, setSlugError] = useState<string | null>(null)

  // Step 2: Fields & Blocks
  const [fields, setFields] = useState<FormField[]>(form.schema || [])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    fields.length > 0 ? fields[0].id : null
  )
  const [slashMenuOpen, setSlashMenuOpen] = useState(false)
  const [slashMenuFilter, setSlashMenuFilter] = useState("")
  const [slashInsertIndex, setSlashInsertIndex] = useState<number>(fields.length)

  // Step 4: Script & Permissions
  const [permissions, setPermissions] = useState(
    form.permissions || { read: true, edit: false, delete: false }
  )
  const [rawSecret, setRawSecret] = useState<string>("••••••••••••••••••••••••••••••••")
  const [isRegeneratingSecret, setIsRegeneratingSecret] = useState(false)
  const [scriptCopied, setScriptCopied] = useState(false)

  // Step 5: Connect & Test
  const [scriptUrl, setScriptUrl] = useState(form.script_url || "")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<{
    ok?: boolean
    message?: string
    code?: string
    missing?: string[]
  } | null>(null)

  // Step 6: Design
  const [theme, setTheme] = useState(form.theme || {})

  // Step 7: Share & QR
  const [qrCanvasUrl, setQrCanvasUrl] = useState<string>("")
  const [linkCopied, setLinkCopied] = useState(false)

  // Selected Field ref
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null

  // Save changes to DB
  const triggerSave = useCallback(
    async (updates: Partial<FormDoc>) => {
      setSaveStatus("saving")
      try {
        const res = await fetch(`/api/forms/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        if (!res.ok) throw new Error("Autosave failed")
        const data = await res.json()
        setForm(data.form)
        setSaveStatus("saved")
      } catch {
        setSaveStatus("error")
      }
    },
    [form.id]
  )

  const debouncedSave = useCallback(
    (updates: Partial<FormDoc>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      setSaveStatus("saving")
      saveTimeoutRef.current = setTimeout(() => {
        triggerSave(updates)
      }, 700)
    },
    [triggerSave]
  )

  // Phishing check on fields
  const phishingWarnings = fields.filter((f) => hasPhishingKeywords(f.label))

  // Render QR Code on Share step
  useEffect(() => {
    if (currentStep === 7) {
      const publicUrl = `https://ul0.site/e/${slug}`
      QRCode.toDataURL(publicUrl, { width: 300, margin: 2 }, (err, url) => {
        if (!err && url) setQrCanvasUrl(url)
      })
    }
  }, [currentStep, slug])

  // Field manipulation helpers
  const addField = (type: BlockType, insertAt = fields.length) => {
    const isInput = INPUT_FIELD_TYPES.includes(type as any)
    const baseKey = isInput ? `${type}_${Math.random().toString(36).substring(2, 6)}` : `block_${Math.random().toString(36).substring(2, 6)}`

    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      key: baseKey,
      type,
      label:
        type === "heading"
          ? "Section Heading"
          : type === "paragraph"
          ? "Write a description or helpful instructions here."
          : type === "divider"
          ? "Divider"
          : `New ${type.replace(/_/g, " ")}`,
      help: "",
      required: isInput,
      placeholder: "",
      options:
        type === "single_choice" || type === "multi_choice" || type === "dropdown"
          ? [
              { id: "opt_1", label: "Option 1" },
              { id: "opt_2", label: "Option 2" },
            ]
          : [],
    }

    const nextFields = [...fields.slice(0, insertAt), newField, ...fields.slice(insertAt)]
    setFields(nextFields)
    setSelectedFieldId(newField.id)
    setSlashMenuOpen(false)
    debouncedSave({ schema: nextFields })
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    const nextFields = fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    setFields(nextFields)
    debouncedSave({ schema: nextFields })
  }

  const removeField = (id: string) => {
    const nextFields = fields.filter((f) => f.id !== id)
    setFields(nextFields)
    if (selectedFieldId === id) {
      setSelectedFieldId(nextFields.length > 0 ? nextFields[0].id : null)
    }
    debouncedSave({ schema: nextFields })
  }

  const moveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= fields.length) return
    const nextFields = [...fields]
    const temp = nextFields[index]
    nextFields[index] = nextFields[targetIndex]
    nextFields[targetIndex] = temp
    setFields(nextFields)
    debouncedSave({ schema: nextFields })
  }

  // Generate Apps Script Code
  const inputKeys = fields
    .filter((f) => INPUT_FIELD_TYPES.includes(f.type as any))
    .map((f) => f.key)

  const generatedScriptCode = generateAppsScript({
    title,
    secret: rawSecret,
    keys: inputKeys,
    permissions,
  })

  // Handle Regenerate Secret
  const handleRegenerateSecret = async () => {
    if (!confirm("Regenerating the secret will invalidate the script currently running in your Google Sheet. You will need to copy the updated script and deploy a New Version in Apps Script. Continue?")) return
    setIsRegeneratingSecret(true)
    try {
      const res = await fetch(`/api/forms/${form.id}/regenerate-secret`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to regenerate secret.")
      setRawSecret(data.rawSecret)
      alert("New secret generated! Copy the updated script below and update your Google Sheet deployment.")
    } catch (err: any) {
      alert(err.message || "Failed to regenerate secret.")
    } finally {
      setIsRegeneratingSecret(false)
    }
  }

  // Handle Test Connection
  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setTestResult(null)
    try {
      const res = await fetch(`/api/forms/${form.id}/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script_url: scriptUrl }),
      })
      const data = await res.json()
      setTestResult(data)
      if (data.ok) {
        setForm((prev) => ({ ...prev, script_url: scriptUrl }))
      }
    } catch {
      setTestResult({ ok: false, message: "Network error calling test endpoint." })
    } finally {
      setIsTestingConnection(false)
    }
  }

  // Handle Go Live Toggle
  const handleToggleLive = async () => {
    const nextStatus = form.status === "live" ? "paused" : "live"
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update status")
      setForm(data.form)
    } catch (err: any) {
      alert(err.message || "Failed to toggle status")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-20">
      {/* Top Header & Wizard Navigation */}
      <header className="sticky top-0 z-30 bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/forms"
              className="p-1.5 rounded-md hover:bg-[var(--surface-3)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Back to all forms"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate max-w-[200px] sm:max-w-xs text-[var(--foreground)]">
                  {title || "Untitled Form"}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    form.status === "live"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : form.status === "paused"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}
                >
                  {form.status}
                </span>
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
                /e/{slug}
              </div>
            </div>
          </div>

          {/* Wizard Step Selector */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-3)] p-1 rounded-lg border border-[var(--border)]">
            {WIZARD_STEPS.map((s) => {
              const Icon = s.icon
              const isActive = currentStep === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setCurrentStep(s.id)
                    debouncedSave({ step: s.id })
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Autosave & Preview Actions */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--muted-foreground)] hidden sm:inline">
              {saveStatus === "saving" ? (
                <span className="text-amber-500">Saving…</span>
              ) : saveStatus === "error" ? (
                <span className="text-rose-500">Save error</span>
              ) : (
                <span className="opacity-70">Saved</span>
              )}
            </span>

            {form.status === "live" && (
              <a
                href={`/e/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-3)] text-xs font-medium hover:border-[var(--primary)] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </a>
            )}

            <Link
              href={`/dashboard/forms/${form.id}/entries`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Entries</span>
            </Link>
          </div>
        </div>

        {/* Mobile Wizard Steps Horizontal Slider */}
        <div className="flex md:hidden overflow-x-auto gap-1 pt-2 pb-1">
          {WIZARD_STEPS.map((s) => {
            const isActive = currentStep === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentStep(s.id)
                  debouncedSave({ step: s.id })
                }}
                className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  isActive ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-3)] text-[var(--muted-foreground)]"
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Phishing warning if detected */}
        {phishingWarnings.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block text-sm font-semibold mb-0.5">Sensitive Field Warning</strong>
              Your form contains labels matching restricted terms: (
              {phishingWarnings.map((w) => `"${w.label}"`).join(", ")}).
              Collecting passwords, payment card details, and national identification numbers violates UL0 Terms of Service and will trigger account suspension.
            </div>
          </div>
        )}

        {/* STEP 1: BASICS */}
        {currentStep === 1 && (
          <div className="max-w-xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Form Basics</h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Configure your public form title and permanent slug endpoint.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Form Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    debouncedSave({ title: e.target.value })
                  }}
                  placeholder="Customer Feedback Survey"
                  className="w-full h-10 px-3 text-sm bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Public URL Slug
                </label>
                <div className="flex rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--surface-3)]">
                  <span className="px-3 py-2 bg-[var(--surface-2)] text-xs text-[var(--muted-foreground)] font-mono border-r border-[var(--border)] select-none">
                    ul0.site/e/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const nextSlug = e.target.value.toLowerCase().trim()
                      setSlug(nextSlug)
                      debouncedSave({ slug: nextSlug })
                    }}
                    placeholder="my-survey"
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-mono text-[var(--foreground)]"
                  />
                </div>
                {slugError && <p className="text-xs text-rose-500 mt-1">{slugError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Description / Welcome Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    debouncedSave({ description: e.target.value })
                  }}
                  placeholder="Tell respondents the purpose of this form and how long it takes to complete."
                  className="w-full p-3 text-sm bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Continue to Fields →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FIELDS (BUILDER) */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Center Document Canvas */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-10 max-w-[680px] w-full mx-auto shadow-xs space-y-6">
              {/* Document Header */}
              <div className="space-y-2 border-b border-[var(--border)] pb-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    debouncedSave({ title: e.target.value })
                  }}
                  placeholder="Untitled Form"
                  className="w-full text-2xl sm:text-3xl font-bold tracking-tight bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
                />
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    debouncedSave({ description: e.target.value })
                  }}
                  placeholder="Click here to write a description or instructions..."
                  className="w-full text-sm text-[var(--muted-foreground)] bg-transparent border-none outline-none resize-none placeholder:text-[var(--muted-foreground)]/50"
                />
              </div>

              {/* Blocks Canvas */}
              <div className="space-y-4">
                {fields.map((field, idx) => {
                  const isSelected = selectedFieldId === field.id
                  const isInput = INPUT_FIELD_TYPES.includes(field.type as any)

                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--surface-3)]/80 ring-1 ring-[var(--primary)]"
                          : "border-[var(--border)] hover:border-[var(--muted-foreground)]/40 bg-[var(--surface-2)]/40"
                      }`}
                    >
                      {/* Left Reorder Handles */}
                      <div className="absolute left-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            moveField(idx, "up")
                          }}
                          className="p-1 rounded hover:bg-[var(--surface-3)] text-[var(--muted-foreground)] disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === fields.length - 1}
                          onClick={(e) => {
                            e.stopPropagation()
                            moveField(idx, "down")
                          }}
                          className="p-1 rounded hover:bg-[var(--surface-3)] text-[var(--muted-foreground)] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="pl-6">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--muted-foreground)] border border-[var(--border)] font-mono text-[10px]">
                              {field.type.replace(/_/g, " ")}
                            </span>
                            {field.required && (
                              <span className="text-[10px] text-rose-500 font-semibold">
                                *Required
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[var(--muted-foreground)] font-mono">
                            col: {field.key}
                          </span>
                        </div>

                        {/* Block preview rendering */}
                        <div className="text-sm font-medium text-[var(--foreground)]">
                          {field.label}
                        </div>
                        {field.help && (
                          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                            {field.help}
                          </div>
                        )}

                        {/* Option pills if choice type */}
                        {(field.type === "single_choice" ||
                          field.type === "multi_choice" ||
                          field.type === "dropdown") && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {(field.options || []).map((o) => (
                              <span
                                key={o.id}
                                className="text-xs px-2 py-0.5 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]"
                              >
                                {o.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Add Block Button / Slash Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSlashInsertIndex(fields.length)
                      setSlashMenuOpen(true)
                    }}
                    className="w-full py-3 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add block or question (Type / to browse)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Settings Panel */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 sticky top-20 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--foreground)]">Block Settings</h3>
                {selectedField && (
                  <button
                    type="button"
                    onClick={() => removeField(selectedField.id)}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {selectedField ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--foreground)]">
                      Question Label / Heading
                    </label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                      className="w-full h-9 px-2.5 bg-[var(--surface-3)] border border-[var(--border)] rounded-md outline-none text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[var(--foreground)]">
                      Help text (Optional)
                    </label>
                    <input
                      type="text"
                      value={selectedField.help || ""}
                      onChange={(e) => updateField(selectedField.id, { help: e.target.value })}
                      placeholder="Extra context for respondents"
                      className="w-full h-9 px-2.5 bg-[var(--surface-3)] border border-[var(--border)] rounded-md outline-none text-[var(--foreground)]"
                    />
                  </div>

                  {INPUT_FIELD_TYPES.includes(selectedField.type as any) && (
                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedField.required}
                        onChange={(e) =>
                          updateField(selectedField.id, { required: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[var(--primary)]"
                      />
                      <span className="font-semibold text-[var(--foreground)]">
                        Required field
                      </span>
                    </label>
                  )}

                  {/* Options Manager for Choice Blocks */}
                  {(selectedField.type === "single_choice" ||
                    selectedField.type === "multi_choice" ||
                    selectedField.type === "dropdown") && (
                    <div className="pt-2 border-t border-[var(--border)] space-y-2">
                      <label className="block font-semibold text-[var(--foreground)]">
                        Choice Options
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {(selectedField.options || []).map((opt, optIdx) => (
                          <div key={opt.id} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => {
                                const nextOpts = [...(selectedField.options || [])]
                                nextOpts[optIdx] = { ...opt, label: e.target.value }
                                updateField(selectedField.id, { options: nextOpts })
                              }}
                              className="flex-1 h-8 px-2 bg-[var(--surface-3)] border border-[var(--border)] rounded text-xs outline-none text-[var(--foreground)]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextOpts = (selectedField.options || []).filter(
                                  (_, i) => i !== optIdx
                                )
                                updateField(selectedField.id, { options: nextOpts })
                              }}
                              className="p-1 hover:text-rose-500 cursor-pointer"
                              title="Remove option"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextOpts = [
                            ...(selectedField.options || []),
                            {
                              id: `opt_${Date.now()}`,
                              label: `Option ${(selectedField.options || []).length + 1}`,
                            },
                          ]
                          updateField(selectedField.id, { options: nextOpts })
                        }}
                        className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add option</span>
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[var(--border)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] block font-mono">
                      Sheet column: {selectedField.key}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-[var(--muted-foreground)]">
                  Select a block from the canvas to edit its properties.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: SHEET TEMPLATE */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Download Spreadsheet Template
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                We generate a pre-formatted Excel workbook tailored to your questions. You'll upload this to Google Sheets.
              </p>
            </div>

            <div className="p-3 bg-[var(--surface-3)] border border-[var(--border)] rounded-xl flex items-center justify-center">
              <img
                src="/ul0-forms-sheets-clear.webp"
                alt="Form to Google Sheet diagram"
                className="max-h-48 w-auto object-contain rounded-lg"
              />
            </div>

            <div className="p-4 bg-[var(--surface-3)] border border-[var(--border)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>{slug}-template.xlsx</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Contains sheet <code>Responses</code> with {inputKeys.length} question columns + <code>README</code>
                </p>
              </div>

              <a
                href={`/api/forms/${form.id}/xlsx`}
                download={`${slug}-template.xlsx`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .xlsx</span>
              </a>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                How to set up your Google Sheet:
              </h3>
              <ol className="text-xs text-[var(--muted-foreground)] space-y-2 list-decimal list-inside leading-relaxed">
                <li>Create a new spreadsheet in <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] underline font-medium">Google Sheets</a>.</li>
                <li>Click <strong>File → Import → Upload</strong> and upload the downloaded <code>.xlsx</code> file.</li>
                <li>Choose <strong>"Replace spreadsheet"</strong> and click <strong>Import data</strong>.</li>
                <li>Confirm that the sheet tab is named exactly <code className="text-[var(--foreground)] font-mono">Responses</code>.</li>
              </ol>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium cursor-pointer"
              >
                ← Back to Fields
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next: Apps Script →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PERMISSIONS & SCRIPT */}
        {currentStep === 4 && (
          <div className="max-w-3xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Permissions &amp; Google Apps Script
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Choose what UL0 is authorized to do in your sheet. The generated script will only include the code for your chosen permissions.
              </p>
            </div>

            {/* Permission Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[var(--surface-3)] border border-[var(--border)] rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-500"
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Collect responses
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    Always enabled. Appends responses.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.read}
                  onChange={(e) => {
                    const p = { ...permissions, read: e.target.checked }
                    setPermissions(p)
                    debouncedSave({ permissions: p })
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-[var(--primary)]"
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    View entries in UL0
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    Shows sheet responses in dashboard.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.edit}
                  onChange={(e) => {
                    const p = { ...permissions, edit: e.target.checked }
                    setPermissions(p)
                    debouncedSave({ permissions: p })
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-[var(--primary)]"
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Edit entries from UL0
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    Allows updating rows via dashboard.
                  </div>
                </div>
              </label>
            </div>

            {/* Code Block with Copy & Regenerate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--foreground)]">
                  Generated Apps Script
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isRegeneratingSecret}
                    onClick={handleRegenerateSecret}
                    className="text-xs text-[var(--muted-foreground)] hover:text-amber-500 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate secret</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedScriptCode)
                      setScriptCopied(true)
                      setTimeout(() => setScriptCopied(false), 2000)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer"
                  >
                    {scriptCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{scriptCopied ? "Copied!" : "Copy code"}</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-[var(--surface-3)] border border-[var(--border)] rounded-xl font-mono text-[11px] text-[var(--foreground)] max-h-64 overflow-y-auto whitespace-pre leading-relaxed select-all">
                {generatedScriptCode}
              </pre>
            </div>

            {/* Deployment Instructions */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] space-y-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
              <h4 className="font-bold text-[var(--foreground)]">How to deploy in your Google Sheet:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your Sheet → click <strong>Extensions → Apps Script</strong>.</li>
                <li>Delete any default code, paste the copied code above, and click <strong>Save (Disk icon)</strong>.</li>
                <li>Click <strong>Deploy → New deployment</strong>. Select type <strong>Web app</strong>.</li>
                <li>Set <strong>Execute as: Me</strong> and <strong>Who has access: Anyone</strong>. Click <strong>Deploy</strong>.</li>
                <li>Click <strong>Authorize access</strong>. Google will show <em>"Google hasn't verified this app"</em> — this is normal because you wrote and host your own script. Click <strong>Advanced → Go to project (unsafe) → Allow</strong>.</li>
                <li>Copy the resulting Web app URL (ends in <code className="font-mono text-[var(--foreground)]">/exec</code>).</li>
              </ol>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next: Connect &amp; Test →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONNECT & TEST */}
        {currentStep === 5 && (
          <div className="max-w-xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Connect Google Apps Script
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Paste your Web app endpoint to test communication between UL0 and your Google Sheet.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Google Apps Script Web App URL
                </label>
                <input
                  type="url"
                  value={scriptUrl}
                  onChange={(e) => {
                    const u = e.target.value.trim()
                    setScriptUrl(u)
                    debouncedSave({ script_url: u })
                  }}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full h-10 px-3 text-xs font-mono bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                />
                <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                  Must be an official endpoint ending in <code className="font-mono">/exec</code>
                </p>
              </div>

              <button
                type="button"
                disabled={isTestingConnection || !scriptUrl}
                onClick={handleTestConnection}
                className="w-full h-11 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Testing connection with Google Sheets...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Test connection</span>
                  </>
                )}
              </button>

              {/* Diagnostic Results Banner */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    testResult.ok
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-500"
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">
                    {testResult.ok ? "✓ Connection Verified!" : "Connection Failed"}
                  </div>
                  <div>{testResult.message}</div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next: Design →
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: DESIGN */}
        {currentStep === 6 && (
          <div className="max-w-2xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Form Design &amp; Theme</h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Customize the presentation, typography, and accent colors of your public form.
              </p>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">
                Curated Accent Palette
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {CURATED_ACCENTS.map((accent) => {
                  const isSelected = (theme.accent || "teal") === accent.id
                  return (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => {
                        const nextTheme = { ...theme, accent: accent.id }
                        setTheme(nextTheme)
                        debouncedSave({ theme: nextTheme })
                      }}
                      className={`h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                        isSelected ? "ring-2 ring-offset-2 ring-[var(--foreground)] scale-105" : "border-black/10"
                      }`}
                      style={{ background: accent.hex }}
                      title={accent.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Typography */}
            <div className="grid grid-cols-3 gap-3">
              {(["sans", "serif", "mono"] as const).map((fontOption) => (
                <button
                  key={fontOption}
                  type="button"
                  onClick={() => {
                    const nextTheme = { ...theme, font: fontOption }
                    setTheme(nextTheme)
                    debouncedSave({ theme: nextTheme })
                  }}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    (theme.font || "sans") === fontOption
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)] font-semibold"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className={`capitalize text-sm ${fontOption === "serif" ? "font-serif" : fontOption === "mono" ? "font-mono" : "font-sans"}`}>
                    {fontOption}
                  </span>
                </button>
              ))}
            </div>

            {/* Logo and Cover URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Brand Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={theme.logo_url || ""}
                  onChange={(e) => {
                    const nextTheme = { ...theme, logo_url: e.target.value.trim() }
                    setTheme(nextTheme)
                    debouncedSave({ theme: nextTheme })
                  }}
                  placeholder="https://.../logo.png"
                  className="w-full h-10 px-3 text-xs bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Header Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={theme.cover_url || ""}
                  onChange={(e) => {
                    const nextTheme = { ...theme, cover_url: e.target.value.trim() }
                    setTheme(nextTheme)
                    debouncedSave({ theme: nextTheme })
                  }}
                  placeholder="https://.../cover.jpg"
                  className="w-full h-10 px-3 text-xs bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none text-[var(--foreground)]"
                />
              </div>
            </div>

            {/* Custom Submit Label and Success Message */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Submit Button Label
                </label>
                <input
                  type="text"
                  value={theme.submit_label || "Submit"}
                  onChange={(e) => {
                    const nextTheme = { ...theme, submit_label: e.target.value }
                    setTheme(nextTheme)
                    debouncedSave({ theme: nextTheme })
                  }}
                  className="w-full h-10 px-3 text-sm bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Submission Success Message
                </label>
                <input
                  type="text"
                  value={theme.success_message || "Thank you! Your response has been recorded."}
                  onChange={(e) => {
                    const nextTheme = { ...theme, success_message: e.target.value }
                    setTheme(nextTheme)
                    debouncedSave({ theme: nextTheme })
                  }}
                  className="w-full h-10 px-3 text-sm bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none text-[var(--foreground)]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next: Share &amp; QR →
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: SHARE & QR */}
        {currentStep === 7 && (
          <div className="max-w-xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sm:p-8 space-y-6 text-center">
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Share Form</h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Your form is ready to collect responses straight to Google Sheets.
              </p>
            </div>

            {/* Status Switcher */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-3)] flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs font-bold text-[var(--foreground)]">
                  Public Status: <span className="capitalize text-emerald-500">{form.status}</span>
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  {form.status === "live"
                    ? "Form is live and accepting submissions."
                    : "Form is paused. Visitors see a calm closed message."}
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleLive}
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  form.status === "live"
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                {form.status === "live" ? "Pause Form" : "Go Live Now"}
              </button>
            </div>

            {/* Public Link Box */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--foreground)] text-left">
                Permanent Public URL
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] font-mono text-xs">
                <span className="flex-1 truncate text-[var(--foreground)] text-left">
                  https://ul0.site/e/{slug}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://ul0.site/e/${slug}`)
                    setLinkCopied(true)
                    setTimeout(() => setLinkCopied(false), 2000)
                  }}
                  className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                  title="Copy link"
                >
                  {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`/e/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* QR Code Container */}
            {qrCanvasUrl && (
              <div className="pt-2 flex flex-col items-center">
                <div className="p-4 bg-white rounded-xl border border-[var(--border)] shadow-xs inline-block">
                  <img src={qrCanvasUrl} alt="Form QR Code" className="w-44 h-44 object-contain" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <a
                    href={qrCanvasUrl}
                    download={`${slug}-qr.png`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-3)] text-xs font-medium hover:border-[var(--primary)] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download QR</span>
                  </a>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border)] flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium cursor-pointer"
              >
                ← Back
              </button>

              <Link
                href={`/dashboard/forms/${form.id}/entries`}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                View Sheet Responses →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Slash Block Menu Modal */}
      {slashMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl max-w-sm w-full p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <span className="text-xs font-bold text-[var(--foreground)]">Insert Block or Field</span>
              <button
                type="button"
                onClick={() => setSlashMenuOpen(false)}
                className="p-1 hover:text-rose-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={slashMenuFilter}
              onChange={(e) => setSlashMenuFilter(e.target.value)}
              placeholder="Search field types..."
              className="w-full h-8 px-2 text-xs bg-[var(--surface-3)] border border-[var(--border)] rounded-md outline-none text-[var(--foreground)]"
            />

            <div className="max-h-60 overflow-y-auto space-y-1">
              {[...INPUT_FIELD_TYPES, ...NON_INPUT_BLOCK_TYPES]
                .filter((t) => t.toLowerCase().includes(slashMenuFilter.toLowerCase()))
                .map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addField(type, slashInsertIndex)}
                    className="w-full text-left px-2.5 py-2 rounded-md hover:bg-[var(--surface-3)] text-xs font-medium text-[var(--foreground)] flex items-center justify-between cursor-pointer"
                  >
                    <span className="capitalize">{type.replace(/_/g, " ")}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                      {INPUT_FIELD_TYPES.includes(type as any) ? "input" : "layout"}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
