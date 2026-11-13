import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "Support ul0 — Donate to Keep It Free",
  description:
    "ul0 is 100% free. Your donation helps cover domains, servers, public APIs, temporary file storage, and more. Pay any amount starting from ₹100.",
  alternates: { canonical: "https://ul0.site/donate" },
}

// Milestone target in INR paise (₹10,000 = $100 approx)
const MILESTONE_TARGET_PAISE = 1000000 // ₹10,000
const MILESTONE_RAISED_PAISE = 0 // Update this as donations come in

const MILESTONES = [
  {
    id: 1,
    title: "New Domains & Infrastructure",
    target: "₹8,500 (~$100)",
    description:
      "Cover annual domain renewal costs and upgrade server bandwidth so ul0 stays fast and reliable globally.",
    icon: "domain",
    reached: false,
  },
  {
    id: 2,
    title: "Free Public REST API",
    target: "₹17,000 (~$200)",
    description:
      "Launch a fully documented, rate-limited public API so developers can shorten links, manage QR codes, and track analytics in their own apps — for free.",
    icon: "code",
    reached: false,
  },
  {
    id: 3,
    title: "Temporary File Storage",
    target: "₹42,500 (~$500)",
    description:
      "Build a free, no-signup temporary file storage service — upload files, get a short link, files auto-delete after 24h. Privacy-first.",
    icon: "database",
    reached: false,
  },
]

const progressPct = Math.min(
  100,
  Math.round((MILESTONE_RAISED_PAISE / MILESTONE_TARGET_PAISE) * 100)
)

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  const isSuccess = params?.success === "true"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/10 via-background to-background" />
          <div className="container mx-auto px-4 text-center">
            {isSuccess && (
              <div className="mx-auto mb-8 flex max-w-md items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-left shadow-2xs">
                <UL0Icon name="check" size={20} className="shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold text-emerald-700 dark:text-emerald-300">
                    Thank you for your donation!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You&apos;re helping keep ul0 free for everyone.
                  </p>
                </div>
              </div>
            )}

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-2xs">
              <UL0Icon name="heart" animated={true} size={36} />
            </div>

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Support ul0
            </h1>
            <p className="mx-auto mb-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              ul0 is, and will always be, <strong className="text-foreground">completely free</strong> — no ads,
              no paywalls, no signup required. Your donation directly funds what&apos;s built next.
            </p>
            <p className="mb-8 text-xs sm:text-sm text-muted-foreground">
              Pay any amount starting from <strong className="text-foreground">₹100</strong>. Every rupee counts.
            </p>

            <a
              href="/api/donate"
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 hover:shadow-rose-500/40"
            >
              <UL0Icon name="heart" size={18} />
              <span>Donate Now — Pay What You Want</span>
              <UL0Icon name="external" size={14} className="opacity-80" />
            </a>

            <p className="mt-3 text-xs text-muted-foreground">
              Processed securely via Polar · No account needed
            </p>
          </div>
        </section>

        {/* Milestone Progress */}
        <section className="border-y bg-muted/20 py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground">
                Milestone Progress
              </h2>
              <p className="mb-8 text-center text-sm text-muted-foreground">
                First target: <strong className="text-foreground">₹10,000</strong> to cover new domain
                registrations and infrastructure costs.
              </p>

              {/* Progress bar */}
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">
                  ₹{(MILESTONE_RAISED_PAISE / 100).toLocaleString("en-IN")} raised
                </span>
                <span className="text-muted-foreground text-xs">
                  Goal: ₹{(MILESTONE_TARGET_PAISE / 100).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-700"
                  style={{ width: `${Math.max(progressPct, 2)}%` }}
                />
              </div>
              <p className="mt-1.5 text-right text-xs text-muted-foreground font-mono">{progressPct}% funded</p>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-14 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-3 text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                What Your Support Builds
              </h2>
              <p className="mb-10 text-center text-xs sm:text-sm text-muted-foreground">
                Each milestone unlocks a new free feature for everyone.
              </p>

              <div className="grid gap-6 sm:grid-cols-3">
                {MILESTONES.map((m) => (
                  <div
                    key={m.id}
                    className={`relative rounded-3xl border p-6 transition-all shadow-2xs ${
                      m.reached
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border bg-card hover:border-rose-500/30"
                    }`}
                  >
                    {m.reached && (
                      <span className="absolute right-4 top-4 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                        Reached
                      </span>
                    )}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 border border-border">
                      <UL0Icon name={m.icon} animated={true} size={26} />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-foreground">{m.title}</h3>
                    <p className="mb-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Target: {m.target}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What it's free */}
        <section className="border-t bg-muted/20 py-14 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 border border-border shadow-2xs">
                <UL0Icon name="bolt" animated={true} size={30} />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                ul0 is free. Period.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Donations are appreciated but never required. You can use every feature of ul0 — URL
                shortening, QR codes, analytics, expense splitting, UTM tools — completely free, forever.
                Donations just help us build more free things faster.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 text-xs text-muted-foreground pt-2">
                {["No ads", "No paywalls", "No signup required", "No limits", "Permanent links"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-2xs font-medium">
                    <UL0Icon name="check" size={12} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Supporters */}
        <section className="border-t py-14 sm:py-20">
          <div className="container mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Supporters</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Be the first to support ul0.{" "}
              <Link href="/supporters" className="text-primary underline underline-offset-4 font-semibold">
                View all supporters →
              </Link>
            </p>
            <div className="pt-2">
              <a
                href="/api/donate"
                className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-7 py-3 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 transition-all hover:bg-rose-500/20 shadow-2xs"
              >
                <UL0Icon name="heart" size={16} />
                <span>Become a supporter</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
