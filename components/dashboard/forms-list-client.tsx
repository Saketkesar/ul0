"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormDoc } from "@/lib/forms/schema"
import {
  Plus,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  TableProperties,
  Edit3,
} from "lucide-react"

interface FormsListClientProps {
  initialForms: FormDoc[]
}

export function FormsListClient({ initialForms }: FormsListClientProps) {
  const router = useRouter()
  const [forms, setForms] = useState<FormDoc[]>(initialForms)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const copyLink = (slug: string) => {
    const url = `https://ul0.site/e/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const toggleStatus = async (form: FormDoc) => {
    const nextStatus = form.status === "live" ? "paused" : "live"
    setBusyId(form.id)
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      const data = await res.json()
      setForms((prev) => prev.map((f) => (f.id === form.id ? data.form : f)))
    } catch (err: any) {
      alert(err.message || "Failed to update form status.")
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (form: FormDoc) => {
    if (!confirm(`Are you sure you want to delete "${form.title}"? Your Google Sheet will remain untouched.`)) return
    setBusyId(form.id)
    try {
      const res = await fetch(`/api/forms/${form.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setForms((prev) => prev.filter((f) => f.id !== form.id))
    } catch (err: any) {
      alert(err.message || "Failed to delete form.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Forms → Google Sheets
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md uppercase tracking-wider">
              Zero-DB Storage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Build forms hosted at <code className="text-[var(--foreground)] font-mono">ul0.site/e/[slug]</code>. Submissions write directly to your own Google Sheet.
          </p>
        </div>

        <Link
          href="/dashboard/forms/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New form</span>
        </Link>
      </div>

      {/* Forms List Table or Empty State */}
      {forms.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <FileSpreadsheet className="w-10 h-10 mx-auto text-[var(--muted-foreground)] opacity-40 mb-3" />
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
            No forms created yet
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto mb-5 leading-relaxed">
            Create a form in minutes. We provide the spreadsheet template, you paste our lightweight Apps Script, and your Google Sheet becomes the database.
          </p>
          <Link
            href="/dashboard/forms/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create your first form</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-3)] text-[var(--muted-foreground)] font-medium">
                  <th className="py-3 px-4 font-semibold">Form Title &amp; Slug</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Fields</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">Updated</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {forms.map((form) => {
                  const inputFieldCount = (form.schema || []).filter(
                    (f) => f.type !== "heading" && f.type !== "paragraph" && f.type !== "divider"
                  ).length

                  return (
                    <tr key={form.id} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-sm text-[var(--foreground)]">
                          {form.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted-foreground)] font-mono">
                          <span>/e/{form.slug}</span>
                          <button
                            type="button"
                            onClick={() => copyLink(form.slug)}
                            className="hover:text-[var(--foreground)] transition-colors p-0.5"
                            title="Copy link"
                          >
                            {copiedSlug === form.slug ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          {form.status === "live" && (
                            <a
                              href={`/e/${form.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[var(--foreground)] transition-colors p-0.5"
                              title="Open public form"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                            form.status === "live"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : form.status === "paused"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              form.status === "live"
                                ? "bg-emerald-500"
                                : form.status === "paused"
                                ? "bg-amber-500"
                                : "bg-zinc-400"
                            }`}
                          />
                          <span className="capitalize">{form.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell text-[var(--muted-foreground)] font-mono">
                        {inputFieldCount} {inputFieldCount === 1 ? "field" : "fields"}
                      </td>

                      <td className="py-3.5 px-4 hidden lg:table-cell text-[var(--muted-foreground)] font-mono">
                        {form.updated_at ? new Date(form.updated_at).toLocaleDateString() : "-"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Entries Button */}
                          <Link
                            href={`/dashboard/forms/${form.id}/entries`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-3)] text-[var(--foreground)] hover:border-[var(--primary)] text-xs font-medium transition-colors"
                            title="View Sheet Entries"
                          >
                            <TableProperties className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Entries</span>
                          </Link>

                          {/* Edit / Builder Button */}
                          <Link
                            href={`/dashboard/forms/${form.id}`}
                            className="p-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-3)] text-[var(--foreground)] hover:border-[var(--primary)] text-xs transition-colors"
                            title="Edit form & settings"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Pause / Resume Toggle */}
                          <button
                            type="button"
                            disabled={busyId === form.id}
                            onClick={() => toggleStatus(form)}
                            className="p-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-3)] text-[var(--foreground)] hover:border-[var(--primary)] text-xs transition-colors cursor-pointer disabled:opacity-50"
                            title={form.status === "live" ? "Pause form" : "Make form live"}
                          >
                            {form.status === "live" ? (
                              <Pause className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            disabled={busyId === form.id}
                            onClick={() => handleDelete(form)}
                            className="p-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-3)] text-[var(--foreground)] hover:border-rose-500 text-xs transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete form"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
