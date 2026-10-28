import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for UL0. Learn how we handle links, analytics, and data without tracking cookies.",
  alternates: {
    canonical: "https://ul0.site/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <div className="border-b border-border pb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">1. Core Privacy Commitments</h2>
              <p>
                UL0 is designed to minimize data collection. We do not use advertising tracking cookies,
                we do not sell user data, and we do not profile individual visitors across the web.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">2. Click Analytics &amp; Edge Processing</h2>
              <p>
                When a visitor clicks a short link (<code className="font-mono">/r/[slug]</code>), our edge workers
                record aggregate telemetry to provide link creators with basic analytics:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Country and approximate region (derived from edge network headers, not GPS)</li>
                <li>Referring domain (from HTTP Referer header, if provided)</li>
                <li>Device category, operating system, and browser family (from User-Agent string)</li>
                <li>Timestamp and whether the click originated from a QR code scan</li>
              </ul>
              <p>
                We do not store plain IP addresses in long-term analytics logs. Daily unique visitors are
                calculated using a temporary one-way cryptographic hash that resets every 24 hours.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">3. Cookies and Local Storage</h2>
              <p>
                UL0 does not use third-party advertising cookies or behavioral tracking beacons.
                We use strictly necessary cookies only:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Session &amp; Authentication:</strong> Managed securely via Clerk to maintain your login session.</li>
                <li><strong>Theme Preference:</strong> Stored in local storage or cookie (<code className="font-mono">theme</code>) to preserve light or dark mode.</li>
                <li><strong>Anonymous Link Claim:</strong> A signed, temporary HTTP-only cookie (<code className="font-mono">ul0_claim_token</code>) allowing you to claim a link created before signing up.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">4. Client-Side Browser Utilities</h2>
              <p>
                Utilities including the PDF splitter, image-to-PDF converter, and client tools process files
                directly inside your web browser using WebAssembly. Your files are not transmitted to or stored
                on our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">5. Data Retention &amp; Deletion</h2>
              <p>
                Public short links remain active indefinitely unless they violate our Acceptable Use Policy or
                are deleted by the account owner. You may request account deletion or data export at any time
                by contacting us.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">6. Security and Abuse Prevention</h2>
              <p>
                To protect Internet users from phishing, malware, and deceptive campaigns, destination URLs are
                screened against automated security blocklists and safe browsing feeds. Flagged links are
                deactivated immediately or routed through an interstitial safety warning.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">7. Contact Information</h2>
              <p>
                For privacy inquiries, data requests, or abuse takedown notices, contact:
              </p>
              <p className="font-mono text-foreground">
                Email: support@ul0.site<br />
                Abuse portal: <Link href="/report-abuse" className="text-primary hover:underline">ul0.site/report-abuse</Link>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
