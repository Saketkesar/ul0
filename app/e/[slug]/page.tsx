import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getFormDocBySlug } from "@/lib/appwrite/forms"
import { PublicFormView } from "@/components/forms/public-form-view"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const form = await getFormDocBySlug(slug)

  if (!form || form.status !== "live") {
    return {
      title: "Form Not Available | UL0",
      description: "This form is not accepting responses.",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${form.title} | UL0 Forms`,
    description: form.description || "Submit your response securely.",
    openGraph: {
      title: `${form.title} | UL0 Forms`,
      description: form.description || "Submit your response securely.",
      images: form.theme?.cover_url ? [{ url: form.theme.cover_url }] : undefined,
    },
    robots: { index: false, follow: false }, // Prevent search engines from indexing respondent form pages
  }
}

export default async function PublicFormPage({ params }: PageProps) {
  const { slug } = await params
  const form = await getFormDocBySlug(slug)

  // Calm 404-style screen if draft, paused, closed, or non-existent
  if (!form || form.status !== "live") {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center py-20 px-6">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] text-[var(--muted-foreground)] mx-auto mb-4 flex items-center justify-center border border-[var(--border)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2">
            This form isn't accepting responses
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
            The form has either been paused by its creator, reached its scheduled close date, or does not exist.
          </p>
          <a
            href="https://ul0.site"
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline transition-colors"
          >
            Create your own Google Sheets form with UL0
          </a>
        </div>
      </main>
    )
  }

  return <PublicFormView form={form} />
}
