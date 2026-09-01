"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Smartphone,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  Share2,
  Palette,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface BioLinkItem {
  id: string
  title: string
  url: string
}

export default function LinkInBioPage() {
  const [profileName, setProfileName] = useState("Alex Rivers")
  const [handle, setHandle] = useState("@alexrivers")
  const [bio, setBio] = useState("Digital Creator, Photographer & Tech Enthusiast based in California 📸✨")
  const [theme, setTheme] = useState<"dark" | "gradient" | "minimal" | "cyber">("dark")
  const [copied, setCopied] = useState(false)
  const [published, setPublished] = useState(false)

  const [links, setLinks] = useState<BioLinkItem[]>([
    { id: "1", title: "🎥 Watch My Latest YouTube Video", url: "https://youtube.com" },
    { id: "2", title: "🛍️ Shop My Lightroom Photo Presets", url: "https://gumroad.com" },
    { id: "3", title: "🎙️ Listen to The Creative Podcast", url: "https://spotify.com" },
    { id: "4", title: "📩 Join 12,000+ on My Free Newsletter", url: "https://substack.com" },
  ])

  const addLink = () => {
    setLinks([
      ...links,
      { id: Date.now().toString(), title: "✨ New Link Title", url: "https://" },
    ])
  }

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  const removeLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id))
  }

  const handlePublish = () => {
    setPublished(true)
  }

  const copyBioLink = () => {
    const slug = handle.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "mybio"
    navigator.clipboard.writeText(`https://ul0.site/bio/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getThemeStyles = () => {
    switch (theme) {
      case "gradient":
        return {
          phoneBg: "bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 text-white",
          btnBg: "bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur",
          avatarBg: "bg-gradient-to-tr from-pink-500 to-amber-500",
        }
      case "minimal":
        return {
          phoneBg: "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white",
          btnBg: "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-foreground hover:bg-zinc-50 shadow-sm",
          avatarBg: "bg-zinc-800 text-white",
        }
      case "cyber":
        return {
          phoneBg: "bg-black text-emerald-400 font-mono",
          btnBg: "bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40",
          avatarBg: "bg-emerald-500 text-black",
        }
      default: // dark
        return {
          phoneBg: "bg-zinc-950 text-white",
          btnBg: "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 shadow-sm",
          avatarBg: "bg-primary text-primary-foreground",
        }
    }
  }

  const styles = getThemeStyles()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <Smartphone className="h-4 w-4" />
              100% Free Link-in-Bio Generator
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free Link-in-Bio Page Builder
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Create a stunning, fast, and customizable bio landing page for your Instagram, TikTok, YouTube, and X profile with zero monthly fees.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Left: Editor Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Profile details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Details</CardTitle>
                  <CardDescription className="text-xs">Customize your bio header and appearance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-xs">Display Name</Label>
                      <Input
                        id="name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="handle" className="text-xs">Handle / Username</Label>
                      <Input
                        id="handle"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-xs">Bio Summary</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="mt-1 text-sm"
                    />
                  </div>

                  {/* Theme Selector */}
                  <div>
                    <Label className="text-xs mb-2 block">Theme Style</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "dark", label: "Dark Sleek" },
                        { id: "gradient", label: "Sunset Aura" },
                        { id: "minimal", label: "Minimalist" },
                        { id: "cyber", label: "Cyber Terminal" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTheme(t.id as any)}
                          className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                            theme === t.id
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                              : "border-border bg-card hover:bg-accent text-muted-foreground"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Links List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Custom Buttons &amp; Links</CardTitle>
                    <CardDescription className="text-xs">Add your videos, affiliate links, and stores.</CardDescription>
                  </div>
                  <Button size="sm" onClick={addLink} className="gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add Link
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {links.map((linkItem, idx) => (
                    <div key={linkItem.id} className="p-3.5 rounded-xl border border-border bg-background space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Link #{idx + 1}</span>
                        {links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLink(linkItem.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            title="Remove link"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <Input
                        placeholder="Button Title (e.g. 🎧 Listen to My Podcast)"
                        value={linkItem.title}
                        onChange={(e) => updateLink(linkItem.id, "title", e.target.value)}
                        className="text-sm h-9"
                      />
                      <Input
                        placeholder="Destination URL (https://...)"
                        value={linkItem.url}
                        onChange={(e) => updateLink(linkItem.id, "url", e.target.value)}
                        className="text-xs font-mono h-8"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Publish / Action Row */}
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handlePublish} className="flex-1 h-11 font-semibold gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Free Bio Link
                </Button>
              </div>

              {published && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 text-sm space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Your Link-in-Bio is Ready:</span>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-background border border-border font-mono text-xs text-foreground break-all">
                    <span>https://ul0.site/bio/{handle.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "mybio"}</span>
                    <Button size="sm" variant="outline" onClick={copyBioLink} className="h-7 text-xs gap-1 shrink-0">
                      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Mobile Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center sticky top-20">
              <div className="w-[320px] sm:w-[350px] rounded-[42px] border-[8px] border-zinc-800 bg-zinc-950 p-2 shadow-2xl overflow-hidden">
                {/* Speaker notch */}
                <div className="mx-auto h-4 w-28 rounded-full bg-zinc-800 mb-2" />

                {/* Inner Screen */}
                <div className={`rounded-[30px] p-6 min-h-[580px] flex flex-col items-center text-center transition-colors duration-300 ${styles.phoneBg}`}>
                  {/* Avatar */}
                  <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-md ${styles.avatarBg}`}>
                    {profileName.charAt(0) || "A"}
                  </div>

                  {/* Profile Info */}
                  <h2 className="font-bold text-lg leading-tight">{profileName || "Your Name"}</h2>
                  <p className="text-xs opacity-75 font-mono mt-0.5">{handle || "@username"}</p>
                  <p className="text-xs opacity-90 mt-3 max-w-[250px] leading-relaxed">
                    {bio || "Your bio description will appear right here."}
                  </p>

                  {/* Social icons row */}
                  <div className="flex items-center gap-3 my-4 opacity-80">
                    <Instagram className="h-4 w-4" />
                    <Youtube className="h-4 w-4" />
                    <Twitter className="h-4 w-4" />
                    <Globe className="h-4 w-4" />
                  </div>

                  {/* Link buttons */}
                  <div className="w-full space-y-2.5 mt-2 flex-1">
                    {links.map((l) => (
                      <div
                        key={l.id}
                        className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${styles.btnBg}`}
                      >
                        <span className="truncate">{l.title || "Untitled Link"}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 ml-1" />
                      </div>
                    ))}
                  </div>

                  {/* Powered by badge */}
                  <div className="pt-4 text-[10px] opacity-60 font-mono flex items-center gap-1">
                    <span>Powered by</span>
                    <span className="font-bold">ul0.site</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
