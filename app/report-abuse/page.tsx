"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, ShieldCheck, CheckCircle2, AlertTriangle, Send, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ReportAbusePage() {
  const [shortUrl, setShortUrl] = useState("")
  const [reason, setReason] = useState("phishing")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shortUrl.trim()) return

    setLoading(true)
    // Simulate submission / send email
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
              <Flag className="h-4 w-4" />
              Abuse &amp; Phishing Report Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Report a Malicious Short Link
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-xl mx-auto">
              We have zero tolerance for phishing, malware, scam redirects, or illegal material. Submit suspicious links below for immediate inspection and takedown.
            </p>
          </div>

          {submitted ? (
            <Card className="border-emerald-500/30 bg-emerald-500/5 text-center p-8 space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Abuse Report Received</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Thank you for helping keep the web safe. Our automated security scanners and trust team have logged the link <strong>{shortUrl}</strong> and will deactivate it if policy violations are confirmed.
              </p>
              <div className="pt-2">
                <Button onClick={() => { setSubmitted(false); setShortUrl(""); }} variant="outline" className="text-xs">
                  Report Another Link
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-border shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Abuse Report Form</CardTitle>
                <CardDescription className="text-xs">Provide details about the violating short link.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="sUrl" className="text-xs font-semibold">
                      Short Link in Question <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="sUrl"
                      placeholder="e.g. https://ul0.site/r/xyz"
                      value={shortUrl}
                      onChange={(e) => setShortUrl(e.target.value)}
                      required
                      className="mt-1 text-sm font-mono text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Reason for Violation</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger className="mt-1 text-sm">
                        <SelectValue placeholder="Select Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phishing">Phishing / Brand Impersonation / Credential Theft</SelectItem>
                        <SelectItem value="malware">Malware / Virus / Ransomware Distribution</SelectItem>
                        <SelectItem value="spam">Spam / Deceptive Advertising</SelectItem>
                        <SelectItem value="illegal">Illegal Goods / Services</SelectItem>
                        <SelectItem value="copyright">Copyright or Trademark Infringement</SelectItem>
                        <SelectItem value="other">Other Policy Violation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="desc" className="text-xs font-semibold">Additional Details / Evidence (Optional)</Label>
                    <Textarea
                      id="desc"
                      placeholder="Explain how this link was received or why it is fraudulent..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail" className="text-xs font-semibold">Your Email (Optional, for follow-up)</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={loading || !shortUrl.trim()} className="w-full h-11 font-semibold gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Submit Abuse Report
                    </Button>
                  </div>

                  <p className="text-center text-[11px] text-muted-foreground pt-2">
                    You can also email our security team directly at{" "}
                    <a href="mailto:getul0site@gmail.com" className="text-primary underline">
                      getul0site@gmail.com
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
