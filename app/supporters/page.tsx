import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Supporters — ul0",
  description: "Meet the people who keep ul0 free for everyone.",
  alternates: { canonical: "https://ul0.site/supporters" },
}

// Hand-curated list — update as donations arrive from Polar webhook
// { name, amount, message?, date }
const SUPPORTERS: {
  name: string
  amount: string
  message?: string
  date: string
}[] = [
  // Example entry (remove when real donors arrive):
  // { name: "Anonymous", amount: "₹500", message: "Keep up the great work!", date: "2026-07-14" },
]

export default function SupportersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/8 via-background to-background" />
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Supporters
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground">
              These amazing people keep ul0 free for everyone. Thank you.
            </p>

            {SUPPORTERS.length === 0 ? (
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 px-8 py-12">
                <Star className="mx-auto mb-4 h-10 w-10 text-rose-400" />
                <p className="mb-2 font-semibold text-foreground">No supporters yet</p>
                <p className="mb-6 text-sm text-muted-foreground">
                  Be the very first person to support ul0 and your name will appear here.
                </p>
                <a
                  href="/api/donate"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 hover:-translate-y-0.5"
                >
                  <Heart className="h-4 w-4" />
                  Become the first supporter
                </a>
              </div>
            ) : (
              <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SUPPORTERS.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-rose-500/30 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-lg font-bold text-rose-500">
                        {s.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.date}</p>
                      </div>
                      <span className="ml-auto text-sm font-bold text-rose-600 dark:text-rose-400">
                        {s.amount}
                      </span>
                    </div>
                    {s.message && (
                      <p className="text-sm italic text-muted-foreground">&quot;{s.message}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12">
              <Link
                href="/donate"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                ← Back to donation page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
