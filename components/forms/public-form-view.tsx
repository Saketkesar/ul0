"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { CURATED_ACCENTS, type FormDoc, type FormField, type AccentId } from "@/lib/forms/schema"
import {
  Check,
  UploadCloud,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  CornerDownLeft,
} from "lucide-react"

interface PublicFormViewProps {
  form: FormDoc
}

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"]

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

  // Local theme toggle (auto/light/dark)
  const [isDark, setIsDark] = useState<boolean>(false)

  // Report modal state
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportSuccess, setReportSuccess] = useState(false)

  // First invalid field ref map
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    // Check initial system or theme preference
    if (theme.mode === "dark") {
      setIsDark(true)
    } else if (theme.mode === "light") {
      setIsDark(false)
    } else if (typeof window !== "undefined") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [theme.mode])

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

  // Count progress (answered / total input questions)
  const inputQuestions = useMemo(() => {
    return (form.schema || []).filter(
      (f) => f.type !== "heading" && f.type !== "paragraph" && f.type !== "divider"
    )
  }, [form.schema])

  const answeredCount = useMemo(() => {
    return inputQuestions.filter((f) => {
      const val = answers[f.key]
      if (val === undefined || val === null || val === "") return false
      if (Array.isArray(val) && val.length === 0) return false
      return true
    }).length
  }, [inputQuestions, answers])

  const progressPercent = inputQuestions.length > 0 ? Math.round((answeredCount / inputQuestions.length) * 100) : 0

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
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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

  // Keyboard shortcut: Cmd/Ctrl + Enter submits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSubmit()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [answers])

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

  let questionIndex = 0

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center p-6 ${fontClass} ${
          isDark ? "bg-[#090D0C] text-[#ECF5F2]" : "bg-[#FAFBFB] text-[#111817]"
        }`}
      >
        <div className="max-w-md w-full text-center py-12 px-6">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Response recorded
          </h1>
          <p className="text-sm opacity-70 leading-relaxed mb-8">
            {theme.success_message || "Thank you! Your response has been securely saved to the owner's Google Sheet."}
          </p>

          {theme.redirect_url && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono opacity-80 mb-6">
              <span>Redirecting you now...</span>
            </div>
          )}

          <div className="pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-center gap-2 text-xs opacity-50">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted zero-database relay · Powered by ul0.site</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${fontClass} ${
        isDark ? "bg-[#090D0C] text-[#ECF5F2]" : "bg-[#FAFBFB] text-[#111817]"
      }`}
    >
      {/* Sticky Progress Bar at the Very Top (Typeform / Tally style) */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-black/5 dark:bg-white/5">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: accentColor,
          }}
        />
      </div>

      {/* Floating Header Bar */}
      <header className="max-w-2xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between text-xs opacity-60">
        <div className="flex items-center gap-2 font-mono">
          <span>{answeredCount} of {inputQuestions.length} answered</span>
          <span>·</span>
          <span>{progressPercent}%</span>
        </div>

        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Form Document Canvas */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Optional Cover Banner */}
        {theme.cover_url && (
          <div className="w-full h-36 sm:h-48 rounded-2xl overflow-hidden mb-8 border border-black/10 dark:border-white/10 shadow-xs">
            <img
              src={theme.cover_url}
              alt="Form Cover"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Optional Brand Logo */}
        {theme.logo_url && (
          <div className="mb-6">
            <img
              src={theme.logo_url}
              alt="Logo"
              className="h-12 w-auto object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Form Title & Description (Notion document feel) */}
        <header className="mb-10 space-y-2.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-sm sm:text-base opacity-70 leading-relaxed whitespace-pre-wrap">
              {form.description}
            </p>
          )}
        </header>

        {/* Questions Stream */}
        <form onSubmit={handleSubmit} noValidate className="space-y-9">
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
            const isInput = field.type !== "heading" && field.type !== "paragraph" && field.type !== "divider"

            if (isInput) {
              questionIndex++
            }

            // 1. Heading block
            if (field.type === "heading") {
              return (
                <div key={field.id} className="pt-6 pb-1 border-t border-black/5 dark:border-white/5">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    {field.label}
                  </h2>
                  {field.help && (
                    <p className="text-xs opacity-60 mt-1">{field.help}</p>
                  )}
                </div>
              )
            }

            // 2. Paragraph block (Notion Callout aesthetic)
            if (field.type === "paragraph") {
              return (
                <div
                  key={field.id}
                  className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-sm opacity-80 leading-relaxed whitespace-pre-wrap"
                >
                  {field.label}
                </div>
              )
            }

            // 3. Divider block
            if (field.type === "divider") {
              return <hr key={field.id} className="border-t border-black/10 dark:border-white/10 my-8" />
            }

            const currentQNum = String(questionIndex).padStart(2, "0")

            // Interactive Input Fields
            return (
              <div
                key={field.id}
                className="space-y-2.5 transition-all group"
              >
                {/* Question Label with subtle Typeform/Tally badge */}
                <div className="flex items-start gap-2.5">
                  <span
                    className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md mt-0.5 select-none"
                    style={{
                      background: answers[field.key] ? `${accentColor}20` : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                      color: answers[field.key] ? accentColor : "inherit",
                      opacity: answers[field.key] ? 1 : 0.6,
                    }}
                  >
                    {currentQNum}
                  </span>

                  <label
                    htmlFor={field.id}
                    className="block text-base sm:text-lg font-semibold tracking-tight leading-snug cursor-text"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-rose-500 ml-1 font-mono text-sm" title="Required" aria-hidden="true">
                        *
                      </span>
                    )}
                  </label>
                </div>

                {field.help && (
                  <p className="text-xs opacity-60 pl-8 leading-relaxed">
                    {field.help}
                  </p>
                )}

                <div className="pl-8 pt-1">
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
                      placeholder={field.placeholder || "Type your answer here..."}
                      min={field.min}
                      max={field.max}
                      maxLength={field.maxLength}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${field.id}-error` : undefined}
                      className={`w-full h-12 px-4 text-base rounded-xl border outline-none transition-all duration-150 ${
                        isDark ? "bg-[#111816] text-[#ECF5F2]" : "bg-white text-[#111817]"
                      } ${
                        error
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:border-transparent focus:ring-2"
                      }`}
                      style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        caretColor: accentColor,
                      }}
                    />
                  )}

                  {/* Long text / Multiline Textarea */}
                  {field.type === "long_text" && (
                    <textarea
                      ref={(el) => { fieldRefs.current[field.key] = el }}
                      id={field.id}
                      rows={4}
                      value={answers[field.key] ?? ""}
                      onChange={(e) => setAnswer(field.key, e.target.value)}
                      placeholder={field.placeholder || "Type your answer here..."}
                      maxLength={field.maxLength || 5000}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${field.id}-error` : undefined}
                      className={`w-full p-4 text-base rounded-xl border outline-none transition-all duration-150 resize-y ${
                        isDark ? "bg-[#111816] text-[#ECF5F2]" : "bg-white text-[#111817]"
                      } ${
                        error
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:border-transparent focus:ring-2"
                      }`}
                      style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        caretColor: accentColor,
                      }}
                    />
                  )}

                  {/* Single Choice (Typeform / Tally style with Letter Keycaps) */}
                  {field.type === "single_choice" && (
                    <div
                      ref={(el) => { fieldRefs.current[field.key] = el }}
                      tabIndex={-1}
                      className="space-y-2.5 pt-0.5"
                    >
                      {(field.options || []).map((opt, optIdx) => {
                        const isSelected = answers[field.key] === opt.label
                        const letter = CHOICE_LETTERS[optIdx] || String(optIdx + 1)
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                              isDark ? "bg-[#111816]" : "bg-white"
                            }`}
                            style={{
                              borderColor: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                              background: isSelected ? `${accentColor}12` : undefined,
                              boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : "0 1px 2px rgba(0,0,0,0.02)",
                            }}
                          >
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono transition-colors"
                              style={{
                                background: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                                color: isSelected ? accentTextColor : "inherit",
                              }}
                            >
                              {letter}
                            </span>
                            <span className="text-sm sm:text-base font-medium flex-1">
                              {opt.label}
                            </span>
                            <input
                              type="radio"
                              name={field.key}
                              value={opt.label}
                              checked={isSelected}
                              onChange={() => setAnswer(field.key, opt.label)}
                              className="hidden"
                            />
                            {isSelected && (
                              <Check className="w-4 h-4 stroke-[2.5]" style={{ color: accentColor }} />
                            )}
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {/* Multi Choice (Typeform / Tally checkbox cards) */}
                  {field.type === "multi_choice" && (
                    <div
                      ref={(el) => { fieldRefs.current[field.key] = el }}
                      tabIndex={-1}
                      className="space-y-2.5 pt-0.5"
                    >
                      {(field.options || []).map((opt, optIdx) => {
                        const cur = Array.isArray(answers[field.key]) ? answers[field.key] : []
                        const isSelected = cur.includes(opt.label)
                        const letter = CHOICE_LETTERS[optIdx] || String(optIdx + 1)
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                              isDark ? "bg-[#111816]" : "bg-white"
                            }`}
                            style={{
                              borderColor: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                              background: isSelected ? `${accentColor}12` : undefined,
                              boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : "0 1px 2px rgba(0,0,0,0.02)",
                            }}
                          >
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono transition-colors"
                              style={{
                                background: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                                color: isSelected ? accentTextColor : "inherit",
                              }}
                            >
                              {letter}
                            </span>
                            <span className="text-sm sm:text-base font-medium flex-1">
                              {opt.label}
                            </span>
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
                              className="hidden"
                            />
                            {isSelected && (
                              <Check className="w-4 h-4 stroke-[2.5]" style={{ color: accentColor }} />
                            )}
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {/* Dropdown */}
                  {field.type === "dropdown" && (
                    <div className="relative">
                      <select
                        ref={(el) => { fieldRefs.current[field.key] = el }}
                        id={field.id}
                        value={answers[field.key] ?? ""}
                        onChange={(e) => setAnswer(field.key, e.target.value)}
                        className={`w-full h-12 px-4 text-base rounded-xl border outline-none appearance-none transition-all ${
                          isDark ? "bg-[#111816] text-[#ECF5F2]" : "bg-white text-[#111817]"
                        } border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:ring-2`}
                      >
                        <option value="">{field.placeholder || "Select an option..."}</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt.id} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        ▾
                      </div>
                    </div>
                  )}

                  {/* Yes / No Tactile Toggle */}
                  {field.type === "yes_no" && (
                    <div className="grid grid-cols-2 gap-3 pt-0.5">
                      {["Yes", "No"].map((opt, i) => {
                        const isSelected = answers[field.key] === opt
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswer(field.key, opt)}
                            className={`h-12 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isDark ? "bg-[#111816]" : "bg-white"
                            }`}
                            style={{
                              borderColor: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                              background: isSelected ? `${accentColor}15` : undefined,
                              color: isSelected ? accentColor : "inherit",
                              boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : "0 1px 2px rgba(0,0,0,0.02)",
                            }}
                          >
                            <span className="text-xs font-mono opacity-50">[{i === 0 ? "Y" : "N"}]</span>
                            <span>{opt}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Rating (1 to 5 Stars or Disks) */}
                  {field.type === "rating" && (
                    <div className="flex gap-2.5 pt-1">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const isSelected = answers[field.key] === num
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setAnswer(field.key, num)}
                            className={`w-11 h-11 rounded-xl border text-sm font-bold font-mono transition-all flex items-center justify-center cursor-pointer ${
                              isDark ? "bg-[#111816]" : "bg-white"
                            }`}
                            style={{
                              borderColor: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                              background: isSelected ? accentColor : undefined,
                              color: isSelected ? accentTextColor : "inherit",
                              boxShadow: isSelected ? `0 4px 12px ${accentColor}33` : undefined,
                            }}
                          >
                            {num}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* 1 to 10 Scale */}
                  {field.type === "scale" && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const isSelected = answers[field.key] === num
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setAnswer(field.key, num)}
                            className={`flex-1 min-w-[36px] h-11 rounded-xl border text-xs font-bold font-mono transition-all flex items-center justify-center cursor-pointer ${
                              isDark ? "bg-[#111816]" : "bg-white"
                            }`}
                            style={{
                              borderColor: isSelected ? accentColor : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                              background: isSelected ? accentColor : undefined,
                              color: isSelected ? accentTextColor : "inherit",
                            }}
                          >
                            {num}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Image Upload Dropzone */}
                  {field.type === "image" && (
                    <div className="pt-1">
                      {answers[field.key] ? (
                        <div
                          className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${
                            isDark ? "bg-[#111816]" : "bg-white"
                          } border-black/10 dark:border-white/10`}
                        >
                          <img
                            src={answers[field.key]}
                            alt="Attachment"
                            className="w-14 h-14 object-cover rounded-lg border border-black/10 dark:border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 text-xs opacity-70 truncate font-mono">
                            Attachment uploaded
                          </div>
                          <div className="flex gap-2">
                            <label className="text-xs font-semibold cursor-pointer hover:underline" style={{ color: accentColor }}>
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
                              className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                            isDark ? "bg-[#111816]/50 hover:bg-[#111816]" : "bg-white/50 hover:bg-white"
                          } border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30`}
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
                          <UploadCloud className="w-7 h-7 opacity-40 mb-2" />
                          {uploadingField === field.key ? (
                            <span className="text-xs opacity-60 animate-pulse">
                              Uploading image to secure host...
                            </span>
                          ) : (
                            <>
                              <span className="text-sm font-semibold">
                                Click or drag image here
                              </span>
                              <span className="text-xs opacity-50 mt-0.5">
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
                      className="text-xs text-rose-500 font-medium pt-1"
                    >
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {submitError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-medium leading-relaxed">
              {submitError}
            </div>
          )}

          {/* Submit Action Block with Typeform-style Enter hint */}
          <div className="pt-6 pl-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || Boolean(uploadingField)}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              style={{
                background: accentColor,
                color: accentTextColor,
                boxShadow: `0 4px 14px ${accentColor}33`,
              }}
            >
              {isSubmitting ? (
                <span>Submitting response...</span>
              ) : (
                <>
                  <span>{theme.submit_label || "Submit"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <span className="text-xs opacity-40 hidden sm:flex items-center gap-1 font-mono">
              <span>press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] border border-black/10 dark:border-white/10 font-bold">
                Cmd ⌘ + Enter
              </kbd>
            </span>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs opacity-50 gap-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Responses go directly to the owner's Google Sheet</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="hover:underline cursor-pointer"
            >
              Report form
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
      </main>

      {/* Report Form Dialog */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`border rounded-2xl max-w-sm w-full p-5 shadow-2xl ${isDark ? "bg-[#111816] border-white/10" : "bg-white border-black/10"}`}>
            <h3 className="text-base font-bold mb-1">Report form</h3>
            <p className="text-xs opacity-60 mb-4 leading-relaxed">
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
                  placeholder="Describe the issue..."
                  className={`w-full p-3 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-black/20 border-white/10" : "bg-black/[0.02] border-black/10"
                  }`}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReport(false)}
                    className="px-3.5 py-1.5 text-xs rounded-lg border border-black/10 dark:border-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs rounded-lg bg-rose-600 text-white font-medium cursor-pointer"
                  >
                    Send report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
