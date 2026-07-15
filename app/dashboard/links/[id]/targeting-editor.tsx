"use client"

import { useState } from "react"
import {
  Lock,
  Target,
  Smartphone,
  GitFork,
  Calendar,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Sparkles,
} from "lucide-react"

interface LinkData {
  $id: string
  slug: string
  long_url: string
  host: string
  targeting_json?: string | null
}

interface TargetingEditorProps {
  link: LinkData
}

interface GeoTarget {
  country: string
  url: string
}

interface AbTestOption {
  url: string
  weight: number
}

export function TargetingEditor({ link }: TargetingEditorProps) {
  const [activeTab, setActiveTab] = useState<"protect" | "geo" | "device" | "ab" | "utm">("protect")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Parse existing targeting settings
  const initialTargeting = (() => {
    if (!link.targeting_json) return {}
    try {
      return JSON.parse(link.targeting_json)
    } catch {
      return {}
    }
  })()

  // protection states
  const [password, setPassword] = useState(initialTargeting.password || "")
  const [clicksLimit, setClicksLimit] = useState<number | "">(initialTargeting.clicks_limit || "")
  const [oneTime, setOneTime] = useState<boolean>(initialTargeting.one_time || false)
  const [expireAt, setExpireAt] = useState<string>(
    initialTargeting.expire_at ? new Date(initialTargeting.expire_at).toISOString().slice(0, 16) : ""
  )

  // geo targeting states
  const [geoTargets, setGeoTargets] = useState<GeoTarget[]>(
    initialTargeting.geo_targeting
      ? Object.entries(initialTargeting.geo_targeting).map(([country, url]) => ({
          country,
          url: url as string,
        }))
      : [{ country: "IN", url: "" }]
  )

  // device targeting states
  const [mobileUrl, setMobileUrl] = useState(initialTargeting.device_targeting?.mobile || "")
  const [tabletUrl, setTabletUrl] = useState(initialTargeting.device_targeting?.tablet || "")
  const [desktopUrl, setDesktopUrl] = useState(initialTargeting.device_targeting?.desktop || "")

  // ab testing states
  const [abOptions, setAbOptions] = useState<AbTestOption[]>(
    initialTargeting.ab_testing || [
      { url: link.long_url, weight: 50 },
      { url: "", weight: 50 },
    ]
  )

  // UTM builder states (pure helper for pasting into fields)
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmResult, setUtmResult] = useState("")

  const addGeoTarget = () => {
    setGeoTargets([...geoTargets, { country: "US", url: "" }])
  }

  const removeGeoTarget = (index: number) => {
    const updated = geoTargets.filter((_, i) => i !== index)
    setGeoTargets(updated.length === 0 ? [{ country: "US", url: "" }] : updated)
  }

  const updateGeoTarget = (index: number, field: keyof GeoTarget, value: string) => {
    const updated = [...geoTargets]
    updated[index][field] = value
    setGeoTargets(updated)
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)

    // Build targeting JSON payload
    const targeting: Record<string, any> = {}

    if (password.trim()) targeting.password = password.trim()
    if (clicksLimit) targeting.clicks_limit = Number(clicksLimit)
    if (oneTime) targeting.one_time = true
    if (expireAt) targeting.expire_at = new Date(expireAt).toISOString()

    const validGeo = geoTargets.filter((t) => t.country && t.url.trim())
    if (validGeo.length > 0) {
      targeting.geo_targeting = {}
      for (const target of validGeo) {
        targeting.geo_targeting[target.country.toUpperCase()] = target.url.trim()
      }
    }

    const deviceTargeting: Record<string, string> = {}
    if (mobileUrl.trim()) deviceTargeting.mobile = mobileUrl.trim()
    if (tabletUrl.trim()) deviceTargeting.tablet = tabletUrl.trim()
    if (desktopUrl.trim()) deviceTargeting.desktop = desktopUrl.trim()
    if (Object.keys(deviceTargeting).length > 0) {
      targeting.device_targeting = deviceTargeting
    }

    const validAb = abOptions.filter((o) => o.url.trim() && o.weight > 0)
    if (validAb.length > 0) {
      targeting.ab_testing = validAb
    }

    try {
      const res = await fetch(`/api/links/${link.$id}/targeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targeting_json: Object.keys(targeting).length > 0 ? JSON.stringify(targeting) : null,
        }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Generate UTM link
  const generateUtm = () => {
    if (!link.long_url) return
    try {
      const url = new URL(link.long_url)
      if (utmSource) url.searchParams.set("utm_source", utmSource)
      if (utmMedium) url.searchParams.set("utm_medium", utmMedium)
      if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign)
      setUtmResult(url.href)
    } catch {
      setUtmResult("Invalid main destination URL format")
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[460px]">
      {/* Tabs list sidebar */}
      <div className="w-full md:w-52 border-r border-gray-200 bg-gray-50/50 p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Link Controls
        </div>
        {[
          { id: "protect", label: "Protection & Expiry", icon: Lock },
          { id: "geo", label: "Geo Targeting", icon: Target },
          { id: "device", label: "Device Targeting", icon: Smartphone },
          { id: "ab", label: "A/B Testing Splits", icon: GitFork },
          { id: "utm", label: "UTM Tag Builder", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all text-left ${
                active
                  ? "bg-gray-900 text-white shadow-xs scale-102"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Configuration Area */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* 1. Protection & Expiration Controls */}
          {activeTab === "protect" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Access Security & Expiration</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Protect links with passwords, set expiry dates, or configure click caps.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Password Protection</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="None (Public link)"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Click Limit Cap</label>
                  <input
                    type="number"
                    value={clicksLimit}
                    onChange={(e) => setClicksLimit(e.target.value ? Number(e.target.value) : "")}
                    placeholder="No limit (Infinite redirects)"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={expireAt}
                    onChange={(e) => setExpireAt(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="oneTime"
                    checked={oneTime}
                    onChange={(e) => setOneTime(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <label htmlFor="oneTime" className="text-xs font-bold text-gray-700 cursor-pointer">
                    One-time link (expire on first click)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 2. Geo Targeting */}
          {activeTab === "geo" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Geographical Targeting</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Redirect visitors to custom destinations based on their country.
                </p>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {geoTargets.map((target, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={target.country}
                      onChange={(e) => updateGeoTarget(idx, "country", e.target.value)}
                      placeholder="IN, US, GB"
                      maxLength={2}
                      className="w-16 rounded-md border border-gray-300 bg-white px-2 py-2 text-xs text-center font-bold uppercase placeholder:text-gray-400 outline-none focus:border-gray-900"
                    />
                    <input
                      type="url"
                      value={target.url}
                      onChange={(e) => updateGeoTarget(idx, "url", e.target.value)}
                      placeholder="https://country-specific-site.com"
                      className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-400 outline-none focus:border-gray-900"
                    />
                    <button
                      onClick={() => removeGeoTarget(idx)}
                      className="rounded-md p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addGeoTarget}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-950 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add country redirection
              </button>
            </div>
          )}

          {/* 3. Device Targeting */}
          {activeTab === "device" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Device Targeting</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Redirect visitors based on the OS or device class they are using.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Mobile Redirect (iOS / Android)</label>
                  <input
                    type="url"
                    value={mobileUrl}
                    onChange={(e) => setMobileUrl(e.target.value)}
                    placeholder="https://example.com/mobile-landing"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-400 outline-none focus:border-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Tablet Redirect</label>
                  <input
                    type="url"
                    value={tabletUrl}
                    onChange={(e) => setTabletUrl(e.target.value)}
                    placeholder="https://example.com/tablet-landing"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-400 outline-none focus:border-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Desktop Redirect</label>
                  <input
                    type="url"
                    value={desktopUrl}
                    onChange={(e) => setDesktopUrl(e.target.value)}
                    placeholder="https://example.com/desktop-landing"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-400 outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. A/B Testing Splits */}
          {activeTab === "ab" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">A/B Traffic Splits</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Split redirects randomly between two separate landing destinations to measure conversions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <div className="w-16 shrink-0 text-xs font-bold text-gray-500">Path A</div>
                  <input
                    type="number"
                    value={abOptions[0].weight}
                    onChange={(e) => {
                      const w = Number(e.target.value)
                      setAbOptions([
                        { ...abOptions[0], weight: w },
                        { ...abOptions[1], weight: 100 - w },
                      ])
                    }}
                    placeholder="50"
                    min={0}
                    max={100}
                    className="w-16 rounded-md border border-gray-300 bg-white px-2 py-2 text-xs text-center font-bold outline-none focus:border-gray-900"
                  />
                  <span className="text-xs font-semibold text-gray-400 shrink-0">%</span>
                  <input
                    type="url"
                    value={abOptions[0].url}
                    onChange={(e) => setAbOptions([{ ...abOptions[0], url: e.target.value }, abOptions[1]])}
                    placeholder="https://landing-page-a.com"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-gray-900"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="w-16 shrink-0 text-xs font-bold text-gray-500">Path B</div>
                  <input
                    type="number"
                    value={abOptions[1].weight}
                    disabled
                    placeholder="50"
                    className="w-16 rounded-md border border-gray-250 bg-gray-50 px-2 py-2 text-xs text-center font-bold text-gray-400 outline-none"
                  />
                  <span className="text-xs font-semibold text-gray-400 shrink-0">%</span>
                  <input
                    type="url"
                    value={abOptions[1].url}
                    onChange={(e) => setAbOptions([abOptions[0], { ...abOptions[1], url: e.target.value }])}
                    placeholder="https://landing-page-b.com"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. UTM Tag Builder */}
          {activeTab === "utm" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">UTM Campaign Parameters Builder</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Generate campaign marketing urls with pre-configured parameters.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Campaign Source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="google, newsletter, twitter"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Campaign Medium</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    placeholder="cpc, banner, email"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Campaign Name</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="winter_sale, promo_launch"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={generateUtm}
                  className="rounded-lg border px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Generate UTM URL
                </button>
              </div>

              {utmResult && (
                <div className="rounded-lg bg-gray-50 border p-3.5 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Generated Target URL</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={utmResult}
                      className="flex-1 bg-white border rounded-md px-3 py-1.5 text-xs font-mono select-all truncate"
                    />
                    <button
                      onClick={() => {
                        // Let users paste directly to long_url or copy it
                        navigator.clipboard.writeText(utmResult)
                      }}
                      className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer save parameters */}
        <div className="border-t border-gray-150 pt-4 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1 animate-in fade-in duration-300">
                <CheckCircle2 className="h-4 w-4" /> Link targeting configuration saved!
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Targeting Configurations
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
