"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Globe2,
  Smartphone,
  Laptop,
  ArrowRight,
  TrendingUp,
  MousePointerClick,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

export default function LinkTrackerPage() {
  const { isSignedIn } = useAuth()
  const [searchSlug, setSearchSlug] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <BarChart3 className="h-4 w-4" />
              Real-Time Link Telemetry &amp; Stats
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free Link Tracker &amp; Click Analytics
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Track where your audience clicks from. Inspect country distribution, mobile vs. desktop devices, referrer sources, and daily engagement trends in real time.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Go to Your Analytics Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Create Free Account to Track Links <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Shorten a Link Now
              </Link>
            </div>
          </div>

          {/* Interactive Live Interactive Preview Dashboard */}
          <Card className="border-border bg-card shadow-xl overflow-hidden mb-14">
            <div className="border-b border-border/80 bg-muted/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-sm text-foreground">Live Telemetry Dashboard Preview</span>
                <Badge variant="secondary" className="text-[11px]">Real-Time Data</Badge>
              </div>
              <span className="text-xs text-muted-foreground font-mono">Sample: ul0.site/r/summer-launch</span>
            </div>

            <CardContent className="p-6 space-y-8">
              {/* Stat Counters Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Total Clicks</span>
                    <MousePointerClick className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">4,829</div>
                  <div className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +24% vs last week
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Unique Visitors</span>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">3,941</div>
                  <div className="text-[11px] text-muted-foreground mt-1">81.6% unique ratio</div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Top Country</span>
                    <Globe2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">United States</div>
                  <div className="text-[11px] text-muted-foreground mt-1">54.2% of all traffic</div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Top Platform</span>
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">Mobile (iOS/Android)</div>
                  <div className="text-[11px] text-muted-foreground mt-1">68% mobile, 32% desktop</div>
                </div>
              </div>

              {/* Geographic & Source Breakdown Simulation */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-5 rounded-xl border border-border bg-background/50 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
                    <span>Geographic Distribution</span>
                    <span className="text-xs text-muted-foreground">Top Markets</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>🇺🇸 United States</span>
                        <span className="font-semibold">2,618 clicks (54.2%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "54.2%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>🇨🇦 Canada</span>
                        <span className="font-semibold">680 clicks (14.1%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary/80 rounded-full" style={{ width: "14.1%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>🇬🇧 United Kingdom</span>
                        <span className="font-semibold">512 clicks (10.6%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary/70 rounded-full" style={{ width: "10.6%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>🇦🇺 Australia</span>
                        <span className="font-semibold">394 clicks (8.2%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: "8.2%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-border bg-background/50 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
                    <span>Top Referrers &amp; Channels</span>
                    <span className="text-xs text-muted-foreground">Traffic Source</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Instagram (Stories &amp; Bio)</span>
                        <span className="font-semibold">1,840 clicks</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "38%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Direct / Email / QR Scans</span>
                        <span className="font-semibold">1,210 clicks</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "25%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>YouTube (Video Descriptions)</span>
                        <span className="font-semibold">980 clicks</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>X / Twitter</span>
                        <span className="font-semibold">530 clicks</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "11%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Props & Guide */}
          <div className="space-y-12 border-t border-border pt-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Why Track Links with ul0?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Understand how your links perform across campaigns, emails, social posts, and QR flyers.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Country-Level Geo Telemetry</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Discover exactly which countries and regions your traffic originates from. Perfect for auditing global ad spend and influencer reach.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Device &amp; Browser Breakdown</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  See whether users click from iOS iPhones, Android phones, MacBooks, or Windows desktops to optimize landing page experiences.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Privacy-First Tracking</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zero invasive tracking cookies or personal data stored. Compliant with GDPR, CCPA, and modern privacy standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
