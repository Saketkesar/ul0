"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, ExternalLink, Share2, Loader2, Clock, Leaf } from "lucide-react"
import { isValidUrl } from "@/lib/utils/slug"

// Calculate carbon savings from short links
// Average URL: ~75 characters, Short URL: ~20 characters
// Data transfer: ~0.06g CO2 per KB (rough estimate)
// Short link saves ~55 bytes per click
const calculateCarbonSaved = (originalUrlLength: number, clicks: number = 1) => {
  const charsSaved = originalUrlLength - 20 // short URL is ~20 chars
  const bytesSaved = charsSaved * clicks
  const kbSaved = bytesSaved / 1024
  const co2SavedGrams = kbSaved * 0.06
  return {
    bytesSaved,
    co2SavedGrams,
    treesEquivalent: co2SavedGrams / 21000, // 1 tree absorbs ~21kg CO2/year
  }
}

export function LinkShortenerForm() {
  const [longUrl, setLongUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [carbonSaved, setCarbonSaved] = useState<{ bytesSaved: number; co2SavedGrams: number } | null>(null)
  const [cooldown, setCooldown] = useState(0) // Rate limit cooldown in seconds

  // Countdown timer for rate limit
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShortUrl(null)
    setCarbonSaved(null)

    if (!isValidUrl(longUrl)) {
      setError("Please enter a valid URL (including http:// or https://)")
      return
    }

    // Process directly without video ad
    processShorten()
  }

  const processShorten = async () => {
    setIsLoading(true)
    const originalLength = longUrl.length

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, customSlug: customSlug || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL")
      }

      setShortUrl(`${window.location.origin}/r/${data.slug}`)
      
      // Calculate carbon savings
      const savings = calculateCarbonSaved(originalLength, 100) // Assume 100 clicks
      setCarbonSaved(savings)
      
      setLongUrl("")
      setCustomSlug("")
      setShowOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareUrl = async () => {
    if (shortUrl && navigator.share) {
      await navigator.share({ url: shortUrl })
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Input
            type="url"
            placeholder="Paste your long URL here..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="h-11 flex-1 text-base sm:h-12"
            required
          />
          <Button type="submit" disabled={isLoading} className="h-11 px-6 sm:h-12 sm:px-8">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="sm:hidden">...</span>
                <span className="hidden sm:inline">Shortening...</span>
              </>
            ) : (
              "Shorten"
            )}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="text-xs text-muted-foreground hover:text-foreground sm:text-sm"
        >
          {showOptions ? "Hide options" : "Custom slug (optional)"}
        </button>

        {showOptions && (
          <div className="space-y-2">
            <Label htmlFor="customSlug" className="text-sm">
              Custom slug
            </Label>
            <Input
              id="customSlug"
              type="text"
              placeholder="my-custom-link"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
              className="h-10 max-w-xs"
            />
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {shortUrl && (
        <Card className="mt-4 border-primary/20 bg-primary/5 sm:mt-6">
          <CardContent className="p-3 sm:p-4">
            <p className="mb-2 text-xs font-medium text-foreground sm:text-sm">Your short link:</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <code className="flex-1 truncate rounded bg-background px-2 py-1.5 text-xs font-medium text-primary sm:px-3 sm:py-2 sm:text-sm">
                {shortUrl}
              </code>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-8 gap-1 text-xs sm:h-9 sm:text-sm bg-transparent"
                >
                  {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="h-8 gap-1 text-xs sm:h-9 sm:text-sm bg-transparent"
                >
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Open</span>
                  </a>
                </Button>
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={shareUrl}
                    className="h-8 gap-1 text-xs sm:h-9 sm:text-sm bg-transparent"
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Carbon Savings Display */}
            {carbonSaved && carbonSaved.bytesSaved > 0 && (
              <div className="mt-3 pt-3 border-t border-primary/10">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600 dark:text-green-400">
                  <Leaf className="h-4 w-4" />
                  <span className="font-medium">🌱 Green Link!</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  This short link saves <strong>{carbonSaved.bytesSaved.toLocaleString()} bytes</strong> per 100 clicks, 
                  reducing ~<strong>{carbonSaved.co2SavedGrams.toFixed(3)}g CO₂</strong> emissions. 
                  Small actions, big impact! 🌍
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
    </>
  )
}
