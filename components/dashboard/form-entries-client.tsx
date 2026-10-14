"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import type { FormDoc } from "@/lib/forms/schema"
import { INPUT_FIELD_TYPES } from "@/lib/forms/schema"
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

interface FormEntriesClientProps {
  form: FormDoc
}

export function FormEntriesClient({ form }: FormEntriesClientProps) {
  const [entries, setEntries] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const [limit] = useState<number>(25)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState<string>("")

  // Row inspection & Edit state
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editFields, setEditFields] = useState<Record<string, any>>({})
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Filter input fields only for columns
  const inputFields = (form.schema || []).filter((f) =>
    INPUT_FIELD_TYPES.includes(f.type as any)
  )

  const fetchEntries = useCallback(async (currentOffset = 0) => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(`/api/forms/${form.id}/entries?offset=${currentOffset}&limit=${limit}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load entries from Google Sheet.")
      setEntries(data.entries || [])
      setTotal(data.total || 0)
      setOffset(currentOffset)
    } catch (err: any) {
      setFetchError(err.message || "Failed to fetch entries.")
    } finally {
      setIsLoading(false)
    }
  }, [form.id, limit])

  useEffect(() => {
    fetchEntries(0)
  }, [fetchEntries])

  // Search filter applied locally to current page
  const displayedEntries = entries.filter((row) => {
    if (!searchFilter.trim()) return true
    const q = searchFilter.toLowerCase()
    return Object.values(row).some((val) => String(val).toLowerCase().includes(q))
  })

  // Handle Edit Submission
  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEntry || !selectedEntry._id) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/forms/${form.id}/entries`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEntry._id,
          updates: editFields,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update entry.")
      // Update local state
      setEntries((prev) =>
        prev.map((item) => (item._id === selectedEntry._id ? { ...item, ...editFields } : item))
      )
      setSelectedEntry((prev: any) => ({ ...prev, ...editFields }))
      setIsEditing(false)
    } catch (err: any) {
      alert(err.message || "Failed to update entry.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle Delete Entry
  const handleDeleteEntry = async () => {
    if (!selectedEntry || !selectedEntry._id) return
    if (!confirm("Are you sure? This will permanently delete this row directly from your Google Sheet.")) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/forms/${form.id}/entries?entryId=${selectedEntry._id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete entry.")
      setEntries((prev) => prev.filter((item) => item._id !== selectedEntry._id))
      setTotal((prev) => Math.max(0, prev - 1))
      setSelectedEntry(null)
    } catch (err: any) {
      alert(err.message || "Failed to delete entry.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/forms"
            className="p-1.5 rounded-md hover:bg-[var(--surface-3)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--foreground)] truncate max-w-sm">
                {form.title}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-3)] border border-[var(--border)] font-mono text-[var(--muted-foreground)]">
                {total} {total === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] font-mono mt-0.5">
              <span>/e/{form.slug}</span>
              <span>·</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Connected to Google Sheet</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchEntries(offset)}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-3)] text-xs font-medium cursor-pointer transition-colors"
            title="Refresh entries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <a
            href={`/api/forms/${form.id}/entries?export=csv`}
            download={`${form.slug}-entries.csv`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--foreground)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <Link
            href={`/dashboard/forms/${form.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Edit Form</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search this page..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[var(--surface-3)] border border-[var(--border)] rounded-lg outline-none text-[var(--foreground)]"
          />
        </div>

        <div className="text-xs text-[var(--muted-foreground)]">
          Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit) || 1}
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold mb-0.5">Could not load sheet responses</strong>
            {fetchError}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-3)] text-[var(--muted-foreground)] font-medium">
                <th className="py-3 px-4 font-semibold w-24">Submitted</th>
                {inputFields.map((f) => (
                  <th key={f.key} className="py-3 px-4 font-semibold truncate max-w-[200px]">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading && entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={inputFields.length + 1}
                    className="py-12 text-center text-[var(--muted-foreground)] text-xs"
                  >
                    Fetching responses from Google Sheet...
                  </td>
                </tr>
              ) : displayedEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={inputFields.length + 1}
                    className="py-12 text-center text-[var(--muted-foreground)] text-xs"
                  >
                    No responses recorded yet in this spreadsheet tab.
                  </td>
                </tr>
              ) : (
                displayedEntries.map((row, idx) => {
                  const submittedAt = row._submitted_at
                    ? new Date(row._submitted_at).toLocaleString()
                    : "-"

                  return (
                    <tr
                      key={row._id || idx}
                      onClick={() => {
                        setSelectedEntry(row)
                        setEditFields({ ...row })
                        setIsEditing(false)
                      }}
                      className="hover:bg-[var(--surface-2)]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-[var(--muted-foreground)] font-mono whitespace-nowrap">
                        {submittedAt}
                      </td>
                      {inputFields.map((f) => {
                        const val = row[f.key]
                        return (
                          <td
                            key={f.key}
                            className="py-3 px-4 text-[var(--foreground)] truncate max-w-[200px]"
                            title={String(val || "")}
                          >
                            {f.type === "image" && val ? (
                              <img
                                src={val}
                                alt="thumb"
                                className="w-8 h-8 rounded object-cover border border-[var(--border)] inline-block"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              String(val || "-")
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-3 border-t border-[var(--border)] bg-[var(--surface-3)] text-xs text-[var(--muted-foreground)]">
          <div>
            Showing {entries.length} of {total} total responses
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={offset <= 0 || isLoading}
              onClick={() => fetchEntries(Math.max(0, offset - limit))}
              className="p-1 rounded hover:bg-[var(--card)] text-[var(--foreground)] disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={offset + limit >= total || isLoading}
              onClick={() => fetchEntries(offset + limit)}
              className="p-1 rounded hover:bg-[var(--card)] text-[var(--foreground)] disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Inspection & Edit Drawer */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-[var(--card)] border-l border-[var(--border)] w-full max-w-md h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">Response Details</h3>
                <span className="text-[11px] text-[var(--muted-foreground)] font-mono">
                  ID: {selectedEntry._id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isEditing ? (
              /* Edit Mode */
              <form onSubmit={handleUpdateEntry} className="space-y-4 text-xs">
                {inputFields.map((f) => (
                  <div key={f.key}>
                    <label className="block font-semibold mb-1 text-[var(--foreground)]">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={editFields[f.key] ?? ""}
                      onChange={(e) =>
                        setEditFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                      }
                      className="w-full h-9 px-2.5 bg-[var(--surface-3)] border border-[var(--border)] rounded-md outline-none text-[var(--foreground)]"
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-md border border-[var(--border)] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-1.5 rounded-md bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase">
                    Submitted Timestamp
                  </span>
                  <div className="font-mono text-[var(--foreground)]">
                    {selectedEntry._submitted_at}
                  </div>
                </div>

                {inputFields.map((f) => {
                  const val = selectedEntry[f.key]
                  return (
                    <div key={f.key} className="space-y-1">
                      <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                        {f.label}
                      </span>
                      {f.type === "image" && val ? (
                        <div className="pt-1">
                          <img
                            src={val}
                            alt="Uploaded file"
                            className="max-h-48 rounded-lg object-contain border border-[var(--border)]"
                            referrerPolicy="no-referrer"
                          />
                          <a
                            href={val}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline mt-1"
                          >
                            <span>Open original</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-md bg-[var(--surface-3)] text-[var(--foreground)] leading-relaxed break-words">
                          {String(val || "-")}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="flex justify-between gap-2 pt-6 border-t border-[var(--border)]">
                  {form.permissions?.delete && (
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleDeleteEntry}
                      className="px-3 py-1.5 rounded-md border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-medium cursor-pointer"
                    >
                      {isDeleting ? "Deleting..." : "Delete row"}
                    </button>
                  )}

                  {form.permissions?.edit && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-1.5 rounded-md bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer"
                    >
                      Edit entry
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
