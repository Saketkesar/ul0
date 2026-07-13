"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { 
  Megaphone, 
  Plus, 
  Link2, 
  MousePointerClick, 
  Calendar, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"

interface LinkDoc {
  $id: string
  slug: string
  long_url: string
  host: string
  clicks_count: number
  created_at: string | null
}

interface DomainDoc {
  $id: string
  domain: string
  status: string
}

interface CampaignsClientProps {
  initialLinks: LinkDoc[]
  verifiedDomains: DomainDoc[]
  userId: string
}

interface ParsedCampaign {
  name: string
  totalClicks: number
  linksCount: number
  links: LinkDoc[]
  sources: string[]
  mediums: string[]
}

const COMMON_SOURCES = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "newsletter", label: "Newsletter" },
]

const COMMON_MEDIUMS = [
  { value: "cpc", label: "CPC (Cost Per Click)" },
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email Campaign" },
  { value: "organic", label: "Organic Referral" },
  { value: "banner", label: "Banner Ad" },
]

export function CampaignsClient({ initialLinks, verifiedDomains, userId }: CampaignsClientProps) {
  const [links, setLinks] = useState<LinkDoc[]>(initialLinks)
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  // Link Builder Form State
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [hostDomain, setHostDomain] = useState("ul0.site")
  const [customSlug, setCustomSlug] = useState("")

  // Result / UI State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successLink, setSuccessLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Parse links into campaigns in real-time
  const campaigns = useMemo(() => {
    const campaignsMap: Record<string, ParsedCampaign> = {}

    for (const link of links) {
      try {
        const url = new URL(link.long_url)
        const campaignName = url.searchParams.get("utm_campaign")
        
        if (campaignName) {
          const campaignKey = campaignName.toLowerCase().trim()
          const source = url.searchParams.get("utm_source") || "unknown"
          const medium = url.searchParams.get("utm_medium") || "unknown"

          if (!campaignsMap[campaignKey]) {
            campaignsMap[campaignKey] = {
              name: campaignName,
              totalClicks: 0,
              linksCount: 0,
              links: [],
              sources: [],
              mediums: [],
            }
          }

          const camp = campaignsMap[campaignKey]
          camp.totalClicks += link.clicks_count || 0
          camp.linksCount += 1
          camp.links.push(link)
          
          if (!camp.sources.includes(source)) camp.sources.push(source)
          if (!camp.mediums.includes(medium)) camp.mediums.push(medium)
        }
      } catch {
        // Skip links that aren't valid URLs or have parsing issues
      }
    }

    return Object.values(campaignsMap).sort((a, b) => b.totalClicks - a.totalClicks)
  }, [links])

  const handleCreateCampaignLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessLink(null)

    if (!websiteUrl || !utmSource || !utmMedium || !utmCampaign) {
      setError("Please fill in all required fields marked with *")
      return
    }

    let parsedUrl: URL
    try {
      let urlStr = websiteUrl.trim()
      if (!urlStr.match(/^https?:\/\//i)) {
        urlStr = "https://" + urlStr
      }
      parsedUrl = new URL(urlStr)
    } catch {
      setError("Please enter a valid website URL")
      return
    }

    setLoading(true)

    // Build URL query parameters
    const params = new URLSearchParams(parsedUrl.search)
    params.set("utm_source", utmSource.trim().toLowerCase().replace(/\s+/g, "_"))
    params.set("utm_medium", utmMedium.trim().toLowerCase().replace(/\s+/g, "_"))
    params.set("utm_campaign", utmCampaign.trim().toLowerCase().replace(/\s+/g, "_"))
    parsedUrl.search = params.toString()

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: parsedUrl.toString(),
          host: hostDomain,
          customSlug: customSlug.trim() || undefined,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccessLink(data.shortUrl)
        
        // Add new link to local list to update UI instantly
        const newLink: LinkDoc = {
          $id: Math.random().toString(), // local placeholder id
          slug: data.slug,
          long_url: parsedUrl.toString(),
          host: hostDomain,
          clicks_count: 0,
          created_at: new Date().toISOString(),
        }
        setLinks([newLink, ...links])
        
        // Reset inputs
        setWebsiteUrl("")
        setCustomSlug("")
      } else {
        setError(data.error || "Failed to create campaign link")
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!successLink) return
    try {
      await navigator.clipboard.writeText(successLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const toggleCampaign = (name: string) => {
    setExpandedCampaign(expandedCampaign === name ? null : name)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Link Builder Panel */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Build Campaign URL
            </CardTitle>
            <CardDescription>
              Create shortened links with standard tracking tags automatically appended.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCampaignLink} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {successLink && (
                <Alert className="border-green-500/25 bg-green-500/5 py-3">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-xs font-semibold text-green-600">Link Created Successfully!</AlertTitle>
                  <AlertDescription className="text-xs mt-1.5 space-y-2">
                    <div className="font-mono bg-background border rounded px-2.5 py-1.5 break-all select-all">
                      {successLink}
                    </div>
                    <Button onClick={handleCopy} size="sm" className="w-full gap-1 text-xs h-8">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="url" className="text-xs">Website URL *</Label>
                <Input
                  id="url"
                  placeholder="e.g. yoursite.com/features"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="source" className="text-xs">Source *</Label>
                  <Input
                    id="source"
                    placeholder="e.g. google, twitter"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="h-9 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="medium" className="text-xs">Medium *</Label>
                  <Input
                    id="medium"
                    placeholder="e.g. cpc, social"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="h-9 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="campaign" className="text-xs">Campaign Name *</Label>
                <Input
                  id="campaign"
                  placeholder="e.g. spring_sale_2026"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="host" className="text-xs">Short Host Domain</Label>
                  <Select value={hostDomain} onValueChange={setHostDomain}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="ul0.site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ul0.site">ul0.site</SelectItem>
                      {verifiedDomains.map((d) => (
                        <SelectItem key={d.$id} value={d.domain}>
                          {d.domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug" className="text-xs">Custom Slug (Optional)</Label>
                  <Input
                    id="slug"
                    placeholder="e.g. discount"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2 h-9 text-sm mt-2">
                <Plus className="h-4 w-4" />
                {loading ? "Generating..." : "Generate Branded Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Directory */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Active Campaigns ({campaigns.length})
            </CardTitle>
            <CardDescription>
              Performance metrics aggregated dynamically from links containing campaign identifiers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {campaigns.length === 0 ? (
              <div className="text-center py-16 px-6 bg-muted/5">
                <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-semibold">No Active Campaigns</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                  Campaign folders will appear here automatically when you generate short links containing a Campaign Name parameter.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {campaigns.map((camp) => {
                  const isExpanded = expandedCampaign === camp.name
                  return (
                    <div key={camp.name} className="flex flex-col">
                      {/* Campaign Header Summary */}
                      <div 
                        onClick={() => toggleCampaign(camp.name)}
                        className="flex items-center justify-between gap-4 p-5 hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm capitalize truncate">{camp.name.replace(/_/g, " ")}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span>**{camp.linksCount}** link{camp.linksCount !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span className="truncate">Sources: {camp.sources.join(", ")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold">
                              <MousePointerClick className="h-3 w-3" />
                              {camp.totalClicks} clicks
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>

                      {/* Expanded Campaign Link List */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t bg-muted/10 space-y-3">
                          <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase pt-2">Campaign Tracking URLs</h4>
                          <div className="space-y-2">
                            {camp.links.map((link) => (
                              <div key={link.$id} className="flex items-center justify-between gap-4 bg-background border rounded-lg p-3 text-xs shadow-2xs">
                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="font-mono font-bold text-primary truncate">
                                    {link.host}/r/{link.slug}
                                  </div>
                                  <p className="text-muted-foreground truncate max-w-lg">{link.long_url}</p>
                                  {link.created_at && (
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      <span>Created {new Date(link.created_at).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="inline-flex items-center gap-0.5 bg-green-500/5 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {link.clicks_count} click{link.clicks_count !== 1 ? 's' : ''}
                                  </span>
                                  {/* Link to Analytics Details */}
                                  {/* Since placeholder local IDs cannot open analytics, check if it looks like a real Appwrite ID (length > 10) */}
                                  {link.$id.length > 10 && (
                                    <Link 
                                      href={`/dashboard/links/${link.$id}`}
                                      className="rounded border p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                      title="Advanced Analytics"
                                    >
                                      <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                  )}
                                  <a 
                                    href={link.long_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="rounded border p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="Open Landing URL"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
