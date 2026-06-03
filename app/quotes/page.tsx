"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Maximize2, Minimize2, RefreshCw, Heart, Share2, Copy, Check, ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface QuoteData { text: string; author: string; category: string }

const quotes: QuoteData[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "success" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "success" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "dreams" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "wisdom" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "life" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "life" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "motivation" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "wisdom" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "success" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "motivation" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "motivation" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "motivation" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth", category: "motivation" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "motivation" },
]

const backgrounds = [
  "from-violet-600 via-purple-600 to-indigo-700",
  "from-rose-500 via-pink-500 to-fuchsia-600",
  "from-cyan-500 via-teal-500 to-emerald-600",
  "from-amber-500 via-orange-500 to-red-600",
  "from-blue-600 via-indigo-600 to-purple-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
]

export default function QuotesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentBg, setCurrentBg] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [favorites, setFavorites] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [fadeIn, setFadeIn] = useState(true)
  const [useGradient, setUseGradient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ul0_favorite_quotes")
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const changeQuote = useCallback((newIndex: number) => {
    setFadeIn(false)
    setTimeout(() => { setCurrentIndex(newIndex); setCurrentBg(Math.floor(Math.random() * backgrounds.length)); setFadeIn(true) }, 300)
  }, [])

  const nextQuote = useCallback(() => changeQuote((currentIndex + 1) % quotes.length), [currentIndex, changeQuote])
  const prevQuote = useCallback(() => changeQuote((currentIndex - 1 + quotes.length) % quotes.length), [currentIndex, changeQuote])
  const randomQuote = useCallback(() => { let newIndex; do { newIndex = Math.floor(Math.random() * quotes.length) } while (newIndex === currentIndex && quotes.length > 1); changeQuote(newIndex) }, [currentIndex, changeQuote])

  useEffect(() => { if (!isAutoPlay) return; const interval = setInterval(nextQuote, 8000); return () => clearInterval(interval) }, [isAutoPlay, nextQuote])

  const toggleFavorite = () => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(currentIndex) ? prev.filter((i) => i !== currentIndex) : [...prev, currentIndex]
      localStorage.setItem("ul0_favorite_quotes", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const copyQuote = () => { navigator.clipboard.writeText(`"${quotes[currentIndex].text}" — ${quotes[currentIndex].author}`); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const shareQuote = () => {
    const text = `"${quotes[currentIndex].text}" — ${quotes[currentIndex].author}`
    if (navigator.share) navigator.share({ title: "Inspirational Quote", text, url: "https://ul0.site/quotes" })
    else copyQuote()
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try { if (!document.fullscreenElement) { await containerRef.current.requestFullscreen(); setIsFullscreen(true) } else { await document.exitFullscreen(); setIsFullscreen(false) } } catch {}
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextQuote() } else if (e.key === "ArrowLeft") { e.preventDefault(); prevQuote() } else if (e.key === "f") toggleFullscreen() }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("keydown", handleKeyDown)
    return () => { document.removeEventListener("fullscreenchange", handleFullscreenChange); document.removeEventListener("keydown", handleKeyDown) }
  }, [nextQuote, prevQuote])

  const quote = quotes[currentIndex]
  const isFavorite = favorites.includes(currentIndex)

  return (
    <>
      {!isFullscreen && <Header />}
      <div 
        ref={containerRef} 
        className={cn(
          "min-h-screen transition-all duration-1000",
          useGradient || isFullscreen 
            ? `bg-gradient-to-br ${backgrounds[currentBg]}` 
            : "bg-background",
          isFullscreen && "fixed inset-0 z-50"
        )}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          {!isFullscreen && (
            <div className="p-6 container mx-auto max-w-5xl">
              <Link 
                href="/" 
                className={cn(
                  "text-sm inline-flex items-center gap-1 transition-colors",
                  useGradient ? "text-white/60 hover:text-white/80" : "text-muted-foreground hover:text-foreground"
                )}
              >
                ← Back to Home
              </Link>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💭</span>
                  <div>
                    <h1 className={cn(
                      "text-3xl md:text-4xl font-bold tracking-tight",
                      useGradient ? "text-white" : "text-foreground"
                    )}>
                      Motivational Quotes
                    </h1>
                    <p className={cn(
                      "text-lg",
                      useGradient ? "text-white/60" : "text-muted-foreground"
                    )}>
                      Daily inspiration for your journey
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUseGradient(!useGradient)}
                    className={cn(
                      useGradient && "border-white/30 text-white hover:bg-white/10 bg-transparent"
                    )}
                  >
                    {useGradient ? "Simple" : "Colorful"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quote Display */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className={cn(
              "max-w-4xl mx-auto text-center transition-all duration-500",
              fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Quote className={cn(
                "w-16 h-16 mx-auto mb-6 opacity-30",
                useGradient || isFullscreen ? "text-white" : "text-foreground"
              )} />
              <blockquote className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-8",
                useGradient || isFullscreen ? "text-white" : "text-foreground"
              )}>
                {quote.text}
              </blockquote>
              <cite className={cn(
                "text-lg md:text-xl not-italic font-medium",
                useGradient || isFullscreen ? "text-white/80" : "text-muted-foreground"
              )}>
                — {quote.author}
              </cite>
              <div className="mt-4">
                <span className={cn(
                  "inline-block px-4 py-1.5 rounded-full text-sm capitalize",
                  useGradient || isFullscreen 
                    ? "bg-white/10 backdrop-blur-sm text-white/70" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {quote.category}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={prevQuote} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAutoPlay(!isAutoPlay)} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={nextQuote} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                <div className={cn(
                  "w-px h-6 mx-2",
                  useGradient || isFullscreen ? "bg-white/20" : "bg-border"
                )} />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={randomQuote} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFavorite} 
                  className={cn(
                    "hover:bg-white/20",
                    isFavorite ? "text-red-400" : useGradient || isFullscreen ? "text-white" : ""
                  )}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={copyQuote} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={shareQuote} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <div className={cn(
                  "w-px h-6 mx-2",
                  useGradient || isFullscreen ? "bg-white/20" : "bg-border"
                )} />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen} 
                  className={cn(
                    useGradient || isFullscreen 
                      ? "text-white hover:bg-white/20" 
                      : "hover:bg-accent"
                  )}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
              </div>
              {!isFullscreen && (
                <div className={cn(
                  "text-center text-sm",
                  useGradient ? "text-white/50" : "text-muted-foreground"
                )}>
                  <p>
                    Press <kbd className={cn(
                      "px-2 py-1 rounded-md mx-1",
                      useGradient ? "bg-white/10" : "bg-muted"
                    )}>→</kbd> next 
                    <kbd className={cn(
                      "px-2 py-1 rounded-md mx-1",
                      useGradient ? "bg-white/10" : "bg-muted"
                    )}>←</kbd> prev 
                    <kbd className={cn(
                      "px-2 py-1 rounded-md mx-1",
                      useGradient ? "bg-white/10" : "bg-muted"
                    )}>F</kbd> fullscreen
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Favorites Section */}
          {!isFullscreen && favorites.length > 0 && (
            <div className={cn(
              "p-6 border-t",
              useGradient ? "border-white/10" : "border-border"
            )}>
              <div className="max-w-4xl mx-auto">
                <h3 className={cn(
                  "text-lg font-medium mb-4 flex items-center gap-2",
                  useGradient ? "text-white" : "text-foreground"
                )}>
                  <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                  Your Favorites ({favorites.length})
                </h3>
                <div className="grid gap-3">
                  {favorites.slice(0, 5).map((index) => (
                    <Card 
                      key={index} 
                      className={cn(
                        "cursor-pointer transition-colors",
                        useGradient 
                          ? "bg-white/10 border-white/10 hover:bg-white/20" 
                          : "bg-card hover:bg-accent/50"
                      )} 
                      onClick={() => changeQuote(index)}
                    >
                      <CardContent className="p-4">
                        <p className={cn(
                          "line-clamp-2",
                          useGradient ? "text-white/90" : "text-foreground"
                        )}>
                          "{quotes[index].text}"
                        </p>
                        <p className={cn(
                          "text-sm mt-1",
                          useGradient ? "text-white/60" : "text-muted-foreground"
                        )}>
                          — {quotes[index].author}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quote Counter */}
          <div className="p-4 text-center">
            <span className={cn(
              "text-sm",
              useGradient || isFullscreen ? "text-white/40" : "text-muted-foreground"
            )}>
              {currentIndex + 1} / {quotes.length}
            </span>
          </div>
        </div>
      </div>
      {!isFullscreen && <Footer />}
    </>
  )
}
