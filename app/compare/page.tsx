"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  GitCompare, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  HelpCircle,
  Settings
} from "lucide-react"

// Popular autocomplete suggestions
const SUGGESTIONS_DB: { name: string; category: string }[] = [
  { name: "ChatGPT", category: "AI Assistant" },
  { name: "Claude", category: "AI Assistant" },
  { name: "Gemini", category: "AI Assistant" },
  { name: "Perplexity", category: "AI Search Engine" },
  { name: "Grok", category: "AI Assistant" },
  { name: "iPhone 17", category: "Smartphone" },
  { name: "iPhone 16", category: "Smartphone" },
  { name: "iPhone 15", category: "Smartphone" },
  { name: "Samsung S26", category: "Smartphone" },
  { name: "Samsung S25", category: "Smartphone" },
  { name: "React", category: "Frontend Framework" },
  { name: "Vue", category: "Frontend Framework" },
  { name: "Angular", category: "Frontend Framework" },
  { name: "Next.js", category: "Frontend Framework" },
  { name: "Hostinger", category: "Web Hosting" },
  { name: "Bluehost", category: "Web Hosting" },
  { name: "Namecheap", category: "Web Hosting" },
  { name: "Netflix", category: "Streaming Service" },
  { name: "Prime Video", category: "Streaming Service" },
  { name: "Disney+", category: "Streaming Service" }
]

const TRENDING_COMPARISONS = [
  { title: "ChatGPT vs Claude", count: "12k comparisons", slug: "chatgpt-vs-claude" },
  { title: "React vs Vue", count: "8k comparisons", slug: "react-vs-vue" },
  { title: "Hostinger vs Bluehost", count: "6k comparisons", slug: "hostinger-vs-bluehost" },
  { title: "Netflix vs Prime Video", count: "4k comparisons", slug: "netflix-vs-prime-video" }
]

const LOADING_STEPS = [
  "Detecting Category",
  "Gathering Data",
  "Running AI Analysis",
  "Generating Report",
  "Publishing Comparison"
]

function SuggestionAvatar({ name }: { name: string }) {
  const getInitials = (n: string) => {
    const clean = n.replace(/https?:\/\/(www\.)?/i, "").toUpperCase();
    return clean.substring(0, 2) || "??";
  };

  return (
    <div className="w-6 h-6 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700 shrink-0">
      {getInitials(name)}
    </div>
  );
}

export default function CompareHome() {
  const router = useRouter()
  const [item1, setItem1] = useState("")
  const [item2, setItem2] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState("")

  // Autocomplete and focus states
  const [activeInput, setActiveInput] = useState<1 | 2 | null>(null)
  const [suggestions, setSuggestions] = useState<{ name: string; category: string }[]>([])
  
  // Onboarding walkthrough tour state
  const [onboardingStep, setOnboardingStep] = useState<number>(0)

  // Onboarding initialization
  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed")
    if (!completed) {
      setOnboardingStep(1)
    }
  }, [])

  // Auto-complete filtering
  useEffect(() => {
    const query = activeInput === 1 ? item1 : item2;
    if (!query || !query.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = SUGGESTIONS_DB.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [item1, item2, activeInput])

  // Cycle loading messages when loading
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleCompare = async (e: React.FormEvent, forceItem1?: string, forceItem2?: string) => {
    if (e) e.preventDefault()
    
    const query1 = forceItem1 || item1
    const query2 = forceItem2 || item2

    if (!query1.trim() || !query2.trim()) {
      setError("Please fill out both items/URLs to compare.")
      return
    }

    setError("")
    setIsLoading(true)
    setLoadingStep(0)
    setActiveInput(null)

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item1: query1, item2: query2 }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        router.push(`/compare/${result.slug}`)
      } else {
        setError(result.error || "An error occurred while generating the comparison.")
        setIsLoading(false)
      }
    } catch (err) {
      setError("Failed to connect to the comparison server. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSelectSuggestion = (name: string, inputNum: 1 | 2) => {
    if (inputNum === 1) {
      setItem1(name)
    } else {
      setItem2(name)
    }
    setSuggestions([])
    setActiveInput(null)
  }

  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed")
    setOnboardingStep(1)
  }

  const handleNextOnboarding = () => {
    setOnboardingStep((prev) => prev + 1)
  }

  const handleFinishOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true")
    setOnboardingStep(0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-[#111827] font-sans antialiased">
      <Header />

      <main className="flex-1 flex flex-col justify-center py-16 md:py-24 max-w-4xl mx-auto w-full px-4">
        {/* HERO SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-[48px] md:text-[56px] font-bold tracking-tight text-gray-900 mb-3 leading-none">
            Compare Anything
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Compare products, websites, AI tools, YouTube videos and services side-by-side using AI.
          </p>
        </div>

        {/* SEARCH BOX & FORM */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-xl max-w-3xl w-full mx-auto mb-10 overflow-visible">
          <CardContent className="pt-8 overflow-visible">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                {/* Minimal Loading Indicator */}
                <div className="w-12 h-12 rounded-full border-2 border-gray-100 border-t-gray-900 animate-spin" />
                <div className="space-y-1.5 text-center">
                  <h3 className="text-sm font-bold text-gray-800">
                    Analyzing Comparison
                  </h3>
                  <div className="flex flex-col items-center text-xs text-gray-500 font-medium">
                    {LOADING_STEPS.map((step, idx) => (
                      <span 
                        key={idx} 
                        className={`transition-colors duration-300 ${
                          idx === loadingStep ? "text-gray-900 font-bold" : "text-gray-300"
                        }`}
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">Estimated time: 5-10 seconds</p>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => handleCompare(e)} className="space-y-8 overflow-visible">
                <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-center relative overflow-visible">
                  
                  {/* Input 1 */}
                  <div className="space-y-2 text-left relative overflow-visible">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                      Item / URL 1
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="e.g. ChatGPT or https://..."
                        value={item1}
                        onFocus={() => setActiveInput(1)}
                        onChange={(e) => setItem1(e.target.value)}
                        className="h-11 pl-11 pr-4 border-gray-200 focus-visible:ring-gray-900 rounded-xl bg-gray-50/50 text-sm font-medium"
                        required
                      />
                    </div>

                    {/* Autocomplete dropdown 1 */}
                    {activeInput === 1 && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-[74px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-gray-100">
                        {suggestions.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => handleSelectSuggestion(item.name, 1)}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
                          >
                            <SuggestionAvatar name={item.name} />
                            <div>
                              <div className="text-gray-900">{item.name}</div>
                              <div className="text-[9px] text-gray-400 uppercase tracking-wider">{item.category}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 1 Onboarding Tooltip */}
                    {onboardingStep === 1 && (
                      <div className="absolute left-0 right-0 top-[74px] z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-left max-w-sm mx-auto">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-gray-200" />
                        <p className="text-xs font-semibold text-gray-800 mb-1">Enter a product, website, AI tool or YouTube URL.</p>
                        <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                          Examples: ChatGPT, iPhone 17, Hostinger, or raw URLs.
                        </p>
                        <Button 
                          type="button"
                          size="sm" 
                          onClick={handleNextOnboarding} 
                          className="w-full h-8 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* VS Middle indicator */}
                  <div className="text-center font-bold text-gray-400 text-xs md:mt-6 select-none bg-gray-50 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center mx-auto">
                    VS
                  </div>

                  {/* Input 2 */}
                  <div className="space-y-2 text-left relative overflow-visible">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                      Item / URL 2
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="e.g. Claude or https://..."
                        value={item2}
                        onFocus={() => setActiveInput(2)}
                        onChange={(e) => setItem2(e.target.value)}
                        className="h-11 pl-11 pr-4 border-gray-200 focus-visible:ring-gray-900 rounded-xl bg-gray-50/50 text-sm font-medium"
                        required
                      />
                    </div>

                    {/* Autocomplete dropdown 2 */}
                    {activeInput === 2 && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-[74px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-gray-100">
                        {suggestions.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => handleSelectSuggestion(item.name, 2)}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
                          >
                            <SuggestionAvatar name={item.name} />
                            <div>
                              <div className="text-gray-900">{item.name}</div>
                              <div className="text-[9px] text-gray-400 uppercase tracking-wider">{item.category}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 2 Onboarding Tooltip */}
                    {onboardingStep === 2 && (
                      <div className="absolute left-0 right-0 top-[74px] z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-left max-w-sm mx-auto">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-gray-200" />
                        <p className="text-xs font-semibold text-gray-800 mb-1">Enter the second item you want to compare against.</p>
                        <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                          We will parse details and compare both side-by-side.
                        </p>
                        <Button 
                          type="button"
                          size="sm" 
                          onClick={handleNextOnboarding} 
                          className="w-full h-8 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-destructive font-semibold bg-red-50 border border-red-200 p-3 rounded-xl">
                    {error}
                  </p>
                )}

                {/* Compare Button */}
                <div className="relative overflow-visible">
                  <Button
                    type="submit"
                    className="w-full h-11 text-xs font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-800 shadow-sm border border-gray-200 transition-transform active:translate-y-0 hover:translate-y-[-2px] duration-200"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-gray-300" />
                    Compare with AI
                  </Button>

                  {/* Step 3 Onboarding Tooltip */}
                  {onboardingStep === 3 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-[54px] z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-left max-w-sm w-full">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-gray-200" />
                      <p className="text-xs font-semibold text-gray-800 mb-1">Trigger Analysis</p>
                      <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                        We will analyze both items and generate a detailed comparison report.
                      </p>
                      <Button 
                        type="button"
                        size="sm" 
                        onClick={handleFinishOnboarding} 
                        className="w-full h-8 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                      >
                        Finish
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Popular Comparisons */}
        <div className="space-y-4 text-center mt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Popular Comparisons
            </span>
            <button 
              onClick={resetOnboarding}
              className="text-[10px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              Reset Guide
            </button>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRENDING_COMPARISONS.map((search) => (
              <Link
                key={search.slug}
                href={`/compare/${search.slug}`}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:translate-y-[-2px] transition-all duration-200 shadow-sm text-left group"
              >
                <div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-gray-900">
                    {search.title}
                  </span>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{search.count}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-gray-300" />
          <span>Research comparisons are dynamic and saved permanently.</span>
        </div>
      </main>

      <Footer />
    </div>
  )
}
