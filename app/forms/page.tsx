import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { listFormDocsByOwner } from "@/lib/appwrite/forms"
import { FormsListClient } from "@/components/dashboard/forms-list-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  ArrowRight,
  Share2,
  Lock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Forms to Google Sheets — Zero-DB Form Builder | UL0",
  description:
    "Create public forms connected directly to your Google Sheet without storing responses in any database. 100% private, free, and instant.",
}

export default async function FormsPage() {
  const { userId } = await auth()

  if (userId) {
    const forms = await listFormDocsByOwner(userId)
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <FormsListClient initialForms={forms} />
        </main>
        <Footer />
      </div>
    )
  }

  // Public Marketing / Landing view for unauthenticated visitors
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-border bg-card/30">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-DB Privacy Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
              Forms that write straight to your Google Sheet
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create public forms without maintaining a database. Responses are encrypted and forwarded directly to your own spreadsheet via Google Apps Script. Zero user submissions are retained on UL0 servers.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto h-11 px-6">
                <Link href="/forms/new">
                  <span>Create a form free</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-11 px-6">
                <Link href="/tools">Browse all utilities</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Architecture Graphic */}
        <section className="py-16 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                How Zero-DB Storage works
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Your data stays in your Google account. We provide the hosted UI and secure transport relay.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card max-w-3xl mx-auto shadow-xs">
              <img
                src="/ul0-forms-sheets-clear.webp"
                alt="Architecture flow: Public form writes directly to your Google Sheet"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 md:py-24 border-b border-border bg-card/20">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Built for privacy, speed, and simplicity
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                No complex cloud infrastructure or proprietary databases required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-border bg-card space-y-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground">100% Private Ownership</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We never store form responses in our database. When someone submits your form, it is relayed into your spreadsheet in real time and discarded from our cache.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground">3-Minute Setup</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We generate a ready-to-use Google Apps Script. Simply copy and paste it into Google Sheets (Extensions → Apps Script), deploy as a Web App, and you are live.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Hosted at ul0.site/e/[slug]</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every form receives a fast, clean public URL with responsive design, keyboard navigation, real-time input validation, and mobile-friendly layouts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Step Walkthrough */}
        <section className="py-16 md:py-20 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Three easy steps to launch
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                <div className="text-xs font-mono font-semibold text-primary">01</div>
                <h3 className="text-sm font-semibold text-foreground">Configure form fields</h3>
                <p className="text-xs text-muted-foreground">
                  Add text inputs, email fields, dropdowns, ratings, or text areas in our visual editor.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                <div className="text-xs font-mono font-semibold text-primary">02</div>
                <h3 className="text-sm font-semibold text-foreground">Connect your Google Sheet</h3>
                <p className="text-xs text-muted-foreground">
                  Paste the generated Apps Script snippet into your sheet and verify the connection with one click.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                <div className="text-xs font-mono font-semibold text-primary">03</div>
                <h3 className="text-sm font-semibold text-foreground">Share and collect responses</h3>
                <p className="text-xs text-muted-foreground">
                  Share your link. Incoming answers append as new rows to your spreadsheet automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-card/40">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to create your form?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Completely free forever. No credit card required.
            </p>
            <div>
              <Button asChild size="lg" className="h-11 px-8">
                <Link href="/forms/new">
                  <span>Start building now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

