import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  Lock,
  Server,
  EyeOff,
  AlertTriangle,
  Flag,
  CheckCircle2,
  FileCheck,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Security & Safety Architecture — How ul0 Protects Users | ul0",
  description:
    "Learn about ul0's security infrastructure, including TLS/HTTPS encryption, SSRF protection, anti-phishing heuristics, and privacy-first data handling.",
  alternates: {
    canonical: "https://ul0.site/security",
  },
}

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheck className="h-4 w-4" />
              Infrastructure &amp; Safety Standards
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Security &amp; Abuse Prevention
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              We take link integrity and user safety seriously. Here is an honest, technical explanation of the security systems safeguarding every redirect on ul0.
            </p>
          </div>

          {/* Security Pillars */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">1. Mandatory TLS / HTTPS</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All traffic to ul0 and customer custom domains is strictly encrypted with modern TLS 1.3 encryption. HTTP Strict Transport Security (HSTS) with a 1-year max-age is enforced across all endpoints.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">2. SSRF &amp; Private IP Blocking</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our backend server-side validation strictly prohibits shortening or inspecting private intranet IP ranges (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, AWS metadata 169.254.169.254, and IPv6 loopback addresses).
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">3. Brand Mimicry &amp; Phishing Heuristics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Link submissions are checked in real-time against heuristics for brand spoofing (e.g. fake PayPal, Apple, Chase, or Google authentication forms on disposable TLDs). Suspicious URLs are automatically rejected.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <EyeOff className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">4. Privacy-First Telemetry</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Click analytics use anonymized telemetry (aggregate country codes and device categories). We never sell user data, record personal PII, or install third-party advertising tracking pixels on redirects.
              </p>
            </div>
          </div>

          {/* Abuse Takedown Box */}
          <div className="p-6 sm:p-8 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Flag className="h-5 w-5 text-rose-500" />
                Spam &amp; Phishing Takedowns
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Found a short link being used for malware, credential harvesting, or spam? We disable confirmed malicious slugs immediately.
              </p>
            </div>
            <Link
              href="/report-abuse"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shrink-0 shadow-sm"
            >
              Report Malicious Link
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
