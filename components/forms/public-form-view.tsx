"use client"

import React, { useState, useRef, useEffect, useId } from "react"
import { CURATED_ACCENTS, type FormDoc, type FormField, type AccentId } from "@/lib/forms/schema"

interface PublicFormViewProps {
  form: FormDoc
}

export function PublicFormView({ form }: PublicFormViewProps) {
  const theme = form.theme || {}
  const accentKey = (theme.accent as AccentId) || "teal"
  const accentDef = CURATED_ACCENTS.find((a) => a.id === accentKey) || CURATED_ACCENTS[0]

  // Answers keyed by field.key
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  // Report modal state
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportSuccess, setReportSuccess] = useState(false)

  // First invalid field ref map
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})

  // Handle redirect on success if configured
  useEffect(() => {
    if (submitted && theme.redirect_url) {
      const timer = setTimeout(() => {
        window.location.href = theme.redirect_url!
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [submitted, theme.redirect_url])

  // Style Tokens derived from theme
  const fontClass =
    theme.font === "serif"
      ? "font-serif"
      : theme.font === "mono"
      ? "font-mono"
      : "font-sans"

  const accentColor = accentDef.hex
  const accentTextColor = accentDef.text

  const setAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  // Handle image upload per field
  const handleFileUpload = async (fieldKey: string, file: File) => {
    setUploadingField(fieldKey)
    setErrors((prev) => {
      const next = { ...prev }
      delete next[fieldKey]
      return next
    })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`/api/e/${form.slug}/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      setAnswer(fieldKey, data.url)
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [fieldKey]: err.message || "Failed to upload image." }))
    } finally {
      setUploadingField(null)
    }
  }

  // Client-side pre-validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let firstInvalidKey: string | null = null

    for (const f of form.schema) {
      if (f.type === "heading" || f.type === "paragraph" || f.type === "divider") continue

      const val = answers[f.key]

      if (f.required) {
        if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          newErrors[f.key] = `${f.label} is required.`
          if (!firstInvalidKey) firstInvalidKey = f.key
          continue
        }
      }

      if (val) {
        if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors[f.key] = "Please enter a valid email address."
          if (!firstInvalidKey) firstInvalidKey = f.key
        } else if (f.type === "url" && !/^https?:\/\/.+/i.test(val)) {
          newErrors[f.key] = "Please enter a valid website URL starting with https://"
          if (!firstInvalidKey) firstInvalidKey = f.key
        }
      }
    }

    setErrors(newErrors)

    if (firstInvalidKey && fieldRefs.current[firstInvalidKey]) {
      fieldRefs.current[firstInvalidKey]?.focus()
      fieldRefs.current[firstInvalidKey]?.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    return Object.keys(newErrors).length === 0
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/e/${form.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors)
        }
        throw new Error(data.error || "Failed to submit form.")
      }

      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Failed to record response. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportReason.trim()) return

    try {
      await fetch(`/api/e/${form.slug}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason.trim() }),
      })
      setReportSuccess(true)
      setTimeout(() => {
        setShowReport(false)
        setReportSuccess(false)
        setReportReason("")
      }, 2000)
    } catch {}
  }

  // Success Screen
  if (submitted) {
    return (
      <main className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4 ${fontClass}`}>
        <div className="max-w-[540px] w-full text-center py-16 px-6">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Response recorded
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
            {theme.success_message || "Thank you! Your response has been securely saved to the owner's Google Sheet."}
          </p>

          {theme.redirect_url && (
            <p className="text-xs text-[var(--muted-foreground)] font-mono">
              Redirecting in 3 seconds...
            </p>
          )}

          <div className="pt-12 border-t border-[var(--border)] mt-12 text-xs text-[var(--muted-foreground)] opacity-70">
            Powered by ul0.site · Zero respondent data stored
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] py-8 sm:py-16 px-4 selection:bg-[${accentColor}33] ${fontClass}`}
    >
      <div className="max-w-[620px] mx-auto">
        {/* Cover Image */}
        {theme.cover_url && (
          <div className="w-full h-36 sm:h-44 rounded-xl overflow-hidden mb-8 border border-[var(--border)]">
            <img
              src={theme.cover_url}
              alt="Form Cover"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Logo */}
        {theme.logo_url && (
          <div className="mb-6">
            <img
              src={theme.logo_url}
              alt="Brand Logo"
              className="max-h-14 max-w-[180px] object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
              {form.description}
            </p>
          )}
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="space-y-7">
          {/* Honeypot field (hidden offscreen) */}
          <input
            type="text"
            name="_hp"
            value={answers._hp || ""}
            onChange={(e) => setAnswer("_hp", e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {form.schema.map((field) => {
            const error = errors[field.key]

            // 1. Heading block
            if (field.type === "heading") {
              return (
                <div key={field.id} className="pt-4">
                  <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                    {field.label}
                  </h2>
                  {field.help && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">{field.help}</p>
                  )}
                </div>
              )
            }

            // 2. Paragraph block
            if (field.type === "paragraph") {
              return (
                <div key={field.id} className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                  {field.label}
                </div>
              )
            }

            // 3. Divider block
            if (field.type === "divider") {
              return <hr key={field.id} className="border-t border-[var(--border)] my-6" />
            }

            // Interactive Input Fields
            return (
              <div key={field.id} className="space-y-1.5">
                <label
                  htmlFor={field.id}
                  className="block text-[15px] font-medium text-[var(--foreground)]"
                >
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
                </label>

                {field.help && (
                  <p className="text-xs text-[var(--muted-foreground)]">{field.help}</p>
                )}

                {/* Short text, Email, Phone, Number, URL, Date, Time */}
                {["short_text", "email", "phone", "number", "url", "date", "time"].includes(field.type) && (
                  <input
                    ref={(el) => { fieldRefs.current[field.key] = el }}
                    id={field.id}
                    type={
                      field.type === "email"
                        ? "email"
                        : field.type === "phone"
                        ? "tel"
                        : field.type === "number"
                        ? "number"
                        : field.type === "url"
                        ? "url"
                        : field.type === "date"
                        ? "date"
                        : field.type === "time"
                        ? "time"
                        : "text"
                    }
                    value={answers[field.key] ?? ""}
                    onChange={(e) => setAnswer(field.key, e.target.value)}
                    placeholder={field.placeholder || ""}
                    min={field.min}
                    max={field.max}
                    maxLength={field.maxLength}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${field.id}-error` : undefined}
                    className="w-full h-11 px-3.5 text-base sm:text-sm bg-[var(--surface-3)] text-[var(--foreground)] border border-[var(--border)] rounded-lg outline-none transition-all duration-150 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent placeholder:text-[var(--muted-foreground)]/60"
                    style={{
                      borderColor: error ? "#ef4444" : undefined,
                    }}
                  />
                )}

                {/* Long text */}
                {field.type === "long_text" && (
                  <textarea
                    ref={(el) => { fieldRefs.current[field.key] = el }}
                    id={field.id}
                    rows={4}
                    value={answers[field.key] ?? ""}
                    onChange={(e) => setAnswer(field.key, e.target.value)}
                    placeholder={field.placeholder || ""}
                    maxLength={field.maxLength || 5000}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${field.id}-error` : undefined}
                    className="w-full p-3 text-base sm:text-sm bg-[var(--surface-3)] text-[var(--foreground)] border border-[var(--border)] rounded-lg outline-none transition-all duration-150 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent placeholder:text-[var(--muted-foreground)]/60 resize-y"
                    style={{
                      borderColor: error ? "#ef4444" : undefined,
                    }}
                  />
                )}

                {/* Single Choice (Stacked rows) */}
                {field.type === "single_choice" && (
                  <div
                    ref={(el) => { fieldRefs.current[field.key] = el }}
                    tabIndex={-1}
                    className="space-y-2 pt-1"
                  >
                    {(field.options || []).map((opt) => {
                      const isSelected = answers[field.key] === opt.label
                      return (
                        <label
                          key={opt.id}
                          className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer"
                          style={{
                            borderColor: isSelected ? accentColor : "var(--border)",
                            background: isSelected ? `${accentColor}0e` : "var(--surface-3)",
                          }}
                        >
                          <input
                            type="radio"
                            name={field.key}
                            value={opt.label}
                            checked={isSelected}
                            onChange={() => setAnswer(field.key, opt.label)}
                            className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                          />
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {opt.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {/* Multi Choice (Stacked rows) */}
                {field.type === "multi_choice" && (
                  <div
                    ref={(el) => { fieldRefs.current[field.key] = el }}
                    tabIndex={-1}
                    className="space-y-2 pt-1"
                  >
                    {(field.options || []).map((opt) => {
                      const cur = Array.isArray(answers[field.key]) ? answers[field.key] : []
                      const isSelected = cur.includes(opt.label)
                      return (
                        <label
                          key={opt.id}
                          className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer"
                          style={{
                            borderColor: isSelected ? accentColor : "var(--border)",
                            background: isSelected ? `${accentColor}0e` : "var(--surface-3)",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAnswer(field.key, [...cur, opt.label])
                              } else {
                                setAnswer(field.key, cur.filter((x: string) => x !== opt.label))
                              }
                            }}
                            className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                          />
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {opt.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {/* Dropdown */}
                {field.type === "dropdown" && (
                  <select
                    ref={(el) => { fieldRefs.current[field.key] = el }}
                    id={field.id}
                    value={answers[field.key] ?? ""}
                    onChange={(e) => setAnswer(field.key, e.target.value)}
                    className="w-full h-11 px-3 text-base sm:text-sm bg-[var(--surface-3)] text-[var(--foreground)] border border-[var(--border)] rounded-lg outline-none transition-all duration-150 focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="">{field.placeholder || "Select an option..."}</option>
                    {(field.options || []).map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Yes / No */}
                {field.type === "yes_no" && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {["Yes", "No"].map((opt) => {
                      const isSelected = answers[field.key] === opt
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswer(field.key, opt)}
                          className="h-11 rounded-lg border text-sm font-medium transition-all duration-150 flex items-center justify-center cursor-pointer"
                          style={{
                            borderColor: isSelected ? accentColor : "var(--border)",
                            background: isSelected ? `${accentColor}0e` : "var(--surface-3)",
                            color: isSelected ? accentColor : "var(--foreground)",
                            fontWeight: isSelected ? 600 : 500,
                          }}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Rating (1 to 5) */}
                {field.type === "rating" && (
                  <div className="flex gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = answers[field.key] === num
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAnswer(field.key, num)}
                          className="w-10 h-10 rounded-lg border text-sm font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer"
                          style={{
                            borderColor: isSelected ? accentColor : "var(--border)",
                            background: isSelected ? accentColor : "var(--surface-3)",
                            color: isSelected ? accentTextColor : "var(--foreground)",
                          }}
                        >
                          {num}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Scale (1 to 10) */}
                {field.type === "scale" && (
                  <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = answers[field.key] === num
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAnswer(field.key, num)}
                          className="flex-1 min-w-[34px] h-10 rounded-lg border text-xs font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer"
                          style={{
                            borderColor: isSelected ? accentColor : "var(--border)",
                            background: isSelected ? accentColor : "var(--surface-3)",
                            color: isSelected ? accentTextColor : "var(--foreground)",
                          }}
                        >
                          {num}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Image upload */}
                {field.type === "image" && (
                  <div className="pt-1">
                    {answers[field.key] ? (
                      <div className="flex items-center gap-3 p-3 bg-[var(--surface-3)] border border-[var(--border)] rounded-lg">
                        <img
                          src={answers[field.key]}
                          alt="Uploaded attachment"
                          className="w-14 h-14 object-cover rounded-md border border-[var(--border)]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 text-xs text-[var(--muted-foreground)] truncate">
                          Attachment uploaded
                        </div>
                        <div className="flex gap-2">
                          <label className="text-xs font-medium text-[var(--primary)] cursor-pointer hover:underline">
                            Replace
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0]
                                if (f) handleFileUpload(field.key, f)
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setAnswer(field.key, null)}
                            className="text-xs font-medium text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-all cursor-pointer bg-[var(--surface-3)]"
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          disabled={uploadingField === field.key}
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) handleFileUpload(field.key, f)
                          }}
                        />
                        {uploadingField === field.key ? (
                          <div className="text-xs text-[var(--muted-foreground)] animate-pulse">
                            Uploading image to secure host...
                          </div>
                        ) : (
                          <>
                            <span className="text-sm font-medium text-[var(--foreground)]">
                              Click to upload image
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)] mt-1">
                              PNG, JPG, WebP or GIF up to 5MB
                            </span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                )}

                {/* Inline Error Announcement */}
                {error && (
                  <p
                    id={`${field.id}-error`}
                    aria-live="polite"
                    className="text-xs text-rose-500 pt-0.5"
                  >
                    {error}
                  </p>
                )}
              </div>
            )
          })}

          {submitError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-lg text-xs text-rose-500 font-medium leading-relaxed">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || Boolean(uploadingField)}
              className="w-full sm:w-auto min-w-[140px] h-11 px-6 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm cursor-pointer disabled:opacity-50"
              style={{
                background: accentColor,
                color: accentTextColor,
              }}
            >
              {isSubmitting ? "Submitting..." : theme.submit_label || "Submit"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] gap-3">
          <div>
            Your responses are stored directly in the owner's Google Sheet.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="hover:underline cursor-pointer"
            >
              Report this form
            </button>
            <span>·</span>
            <a
              href="https://ul0.site"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Powered by ul0.site
            </a>
          </div>
        </footer>
      </div>

      {/* Report Form Dialog */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl max-w-sm w-full p-5 shadow-xl">
            <h3 className="text-base font-semibold mb-1 text-[var(--foreground)]">Report form</h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-4 leading-relaxed">
              UL0 strictly prohibits collecting passwords, payment cards, and government IDs.
            </p>

            {reportSuccess ? (
              <div className="text-xs text-emerald-500 font-medium py-4 text-center">
                Report submitted. Thank you for keeping ul0 safe.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe why you are reporting this form..."
                  className="w-full p-2.5 text-xs bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none text-[var(--foreground)]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReport(false)}
                    className="px-3 py-1.5 text-xs rounded-md border border-[var(--border)] cursor-pointer text-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs rounded-md bg-rose-600 text-white font-medium cursor-pointer"
                  >
                    Send report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
