import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Users, QrCode, ShieldCheck, Zap, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Split Group Expenses & Bills Online Free",
  description: "Learn how to split group expenses and roommate bills online without downloading an app. Compare ul0 Split vs Splitwise. Generate UPI QR codes instantly.",
  keywords: [
    "split expenses online free",
    "split expenses without app",
    "bill splitter free",
    "splitwise free alternative 2026",
    "how to split bills with friends",
    "group expense calculator",
    "split rent and utilities",
    "upi qr code bill split",
    "online expense splitter no signup",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/how-to-split-expenses-group-bills-online",
  },
  openGraph: {
    title: "How to Split Expenses & Group Bills Online Free (No App Required)",
    description: "The complete guide to hassle-free group expense splitting. Calculate debts, share payment links, and pay via UPI QR codes instantly.",
    url: "https://ul0.site/blog/how-to-split-expenses-group-bills-online",
    type: "article",
    images: [{ url: "https://ul0.site/ul0.png" }],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Split Expenses & Group Bills Online Free (No App Required in 2026)",
  description: "Learn how to split group expenses and calculate who owes whom without restrictive daily limits or mandatory app downloads.",
  author: { "@type": "Organization", name: "ul0" },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-10-01",
  dateModified: "2026-10-03",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the ul0 Bill Splitter work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Add group members, enter the expenses with who paid and who shared, and the algorithm automatically computes the minimum number of transactions needed to settle all debts.",
      },
    },
    {
      "@type": "Question",
      name: "Do my friends need to create an account to view the split?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! You can share a direct web link or QR code. Anyone with the link can view the itemized breakdown and pay their share via UPI or bank transfer.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a daily limit like on Splitwise?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. ul0 Split is 100% free with unlimited expenses, unlimited groups, and zero daily transaction caps.",
      },
    },
  ],
}

export default function SplitExpensesGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="min-h-screen bg-background py-10 px-4 sm:px-6">
        <article className="mx-auto max-w-3xl space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to blog
            </Link>
            <span>/</span>
            <span className="text-foreground">Productivity &amp; Finances</span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Users className="h-3 w-3" />
              Group Finance &amp; Utilities Guide
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              How to Split Expenses &amp; Group Bills Online Free (No App Required)
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Planning a weekend road trip, sharing rent with roommates, or dining out with friends? Here is how to track group spending, minimize transfer chaos, and settle debts instantly with zero subscription fees.
            </p>
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span>Try the Free Online Bill Splitter</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Calculate balances, minimize debts, and generate instant UPI payment QR codes directly in your browser.
            </p>
            <Link
              href="/split"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              Open Free Bill Splitter Now →
            </Link>
          </div>

          {/* Section 1 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              1. The Problem with Legacy Expense Apps in 2026
            </h2>
            <p>
              For years, apps like Splitwise were the default recommendation for groups. However, recent monetization updates have introduced frustrating bottlenecks:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
              <li><strong>Artificial 3-Expense Daily Limits:</strong> Users on free tiers are blocked from adding more than 3 receipts in a 24-hour period.</li>
              <li><strong>Mandatory App Store Downloads:</strong> Every friend in your group must install a 150MB native mobile app just to see how much they owe for dinner.</li>
              <li><strong>Aggressive Full-Screen Ads:</strong> Popups and banner ads make adding expenses slow and annoying on vacation networks.</li>
            </ul>
            <p>
              Modern web technologies now make dedicated mobile apps completely unnecessary for bill splitting. A responsive web utility like <strong>ul0 Split</strong> lets anyone create a shared tab in seconds, share it via WhatsApp or SMS, and settle up without creating accounts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              2. How Smart Debt Minimization Works
            </h2>
            <p>
              Imagine four friends on a weekend getaway: Alice paid $120 for Airbnb, Bob paid $60 for groceries, Charlie paid $40 for fuel, and Dave paid nothing.
            </p>
            <p>
              If every person paid each other back individually, you would need <strong>6 separate bank transfers</strong>.
            </p>
            <div className="p-4 rounded-xl border border-border bg-card text-xs space-y-2">
              <span className="font-semibold text-foreground text-sm">Automated Settlement Algorithm:</span>
              <p>
                <strong>ul0 Split</strong> runs a graph simplification algorithm that consolidates who owes whom into the minimum possible payments. In this example, Dave simply sends $55 to Alice, and Charlie sends $5 to Alice. Everyone is settled in just <strong>2 fast transactions</strong> instead of 6!
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              3. Step-by-Step: How to Split a Bill on ul0.site
            </h2>
            <div className="grid gap-3 pt-2">
              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Navigate to Split Expenses</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click &quot;Split Expenses&quot; in the top navigation bar or visit <code className="font-mono text-primary">ul0.site/split</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Add Members &amp; Expenses</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Type in the names of your group members. Add each expense: specify the total amount, who paid, and who participated.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 rounded-xl border border-border bg-card">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Share the Summary Link or Scan UPI QR</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click &quot;Share Tab&quot; to copy a short link. Friends can view the breakdown on any phone or scan the generated UPI QR code to pay instantly via Google Pay, PhonePe, or Paytm.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Comparison Table */}
          <section className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              4. Feature Comparison: ul0 Split vs. Splitwise
            </h2>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3 text-emerald-600 font-bold">ul0 Split</th>
                    <th className="p-3">Splitwise (Free)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="p-3 font-medium text-foreground">Daily Expense Limit</td>
                    <td className="p-3 font-bold text-emerald-600">Unlimited (No Limit)</td>
                    <td className="p-3 text-rose-500">Capped at 3 / day</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">App Download Required?</td>
                    <td className="p-3 font-bold text-emerald-600">No (100% Web)</td>
                    <td className="p-3 text-rose-500">Yes for best features</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Account Required to View?</td>
                    <td className="p-3 font-bold text-emerald-600">No (Instant Share Link)</td>
                    <td className="p-3 text-rose-500">Yes (Mandatory Sign In)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">UPI QR Code Generation</td>
                    <td className="p-3 font-bold text-emerald-600">Built-in (Zero Fees)</td>
                    <td className="p-3 text-rose-500">Not supported natively</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Cost</td>
                    <td className="p-3 font-bold text-emerald-600">Free Forever</td>
                    <td className="p-3">$4.99/mo for Pro</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3 mt-10">
            <h3 className="text-xl font-bold text-foreground">Ready to split a bill with your friends?</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No registration required. Calculate who owes whom in under 30 seconds.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/split"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
              >
                Start Splitting Expenses Free
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:bg-accent transition-all"
              >
                Back to Shortener
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
