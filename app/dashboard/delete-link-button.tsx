"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UL0Icon } from "@/components/ul0-icon"

interface DeleteLinkButtonProps {
  linkId: string
  canDelete: boolean
  redirectOnDelete?: boolean
}

export function DeleteLinkButton({ linkId, canDelete, redirectOnDelete = false }: DeleteLinkButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!canDelete) {
      alert("Link deletion is a premium feature. Please upgrade to Pro or Business to delete custom domain links.")
      return
    }

    if (!confirm("Are you sure you want to delete this short link? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/links/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkId }),
      })

      if (res.ok) {
        if (redirectOnDelete) {
          router.push("/dashboard")
          router.refresh()
        } else {
          router.refresh()
        }
      } else {
        const data = await res.json()
        alert(data.error || "Failed to delete link")
      }
    } catch {
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!canDelete) {
    return (
      <button
        onClick={handleDelete}
        className="rounded-full p-2 text-muted-foreground/35 hover:text-primary transition-colors"
        title="Upgrade plan to delete links"
      >
        <UL0Icon name="lock" className="h-4 w-4" />
      </button>
    )
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
      title="Delete link"
    >
      {loading ? <UL0Icon name="loading" className="h-4 w-4 animate-spin" /> : <UL0Icon name="trash" className="h-4 w-4" />}
    </button>
  )
}
