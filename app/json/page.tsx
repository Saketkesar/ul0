"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, Trash2, FileJson, Minimize2, Maximize2, AlertCircle, CheckCircle2, Download, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [indentSize, setIndentSize] = useState("2")
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<{ keys: number; depth: number; size: string } | null>(null)

  // Calculate JSON stats
  const calculateStats = (obj: unknown, depth = 0): { keys: number; maxDepth: number } => {
    if (typeof obj !== "object" || obj === null) {
      return { keys: 0, maxDepth: depth }
    }
    
    let keys = 0
    let maxDepth = depth
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = calculateStats(item, depth + 1)
        keys += result.keys
        maxDepth = Math.max(maxDepth, result.maxDepth)
      }
    } else {
      keys = Object.keys(obj).length
      for (const value of Object.values(obj)) {
        const result = calculateStats(value, depth + 1)
        keys += result.keys
        maxDepth = Math.max(maxDepth, result.maxDepth)
      }
    }
    
    return { keys, maxDepth }
  }

  // Format JSON
  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON to format")
      setIsValid(null)
      setOutput("")
      setStats(null)
      return
    }
    
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, parseInt(indentSize))
      setOutput(formatted)
      setError(null)
      setIsValid(true)
      
      const { keys, maxDepth } = calculateStats(parsed)
      const sizeBytes = new Blob([formatted]).size
      const sizeStr = sizeBytes > 1024 ? `${(sizeBytes / 1024).toFixed(2)} KB` : `${sizeBytes} bytes`
      setStats({ keys, depth: maxDepth, size: sizeStr })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setIsValid(false)
      setOutput("")
      setStats(null)
    }
  }, [input, indentSize])

  // Minify JSON
  const minifyJson = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON to minify")
      setIsValid(null)
      setOutput("")
      return
    }
    
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError(null)
      setIsValid(true)
      
      const sizeBytes = new Blob([minified]).size
      const sizeStr = sizeBytes > 1024 ? `${(sizeBytes / 1024).toFixed(2)} KB` : `${sizeBytes} bytes`
      setStats({ keys: 0, depth: 0, size: sizeStr })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setIsValid(false)
      setOutput("")
    }
  }, [input])

  // Validate JSON
  const validateJson = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON to validate")
      setIsValid(null)
      return
    }
    
    try {
      JSON.parse(input)
      setError(null)
      setIsValid(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setIsValid(false)
    }
  }, [input])

  // Copy to clipboard
  const copyToClipboard = async () => {
    const textToCopy = output || input
    if (!textToCopy) return
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Download JSON
  const downloadJson = () => {
    const textToDownload = output || input
    if (!textToDownload) return
    
    const blob = new Blob([textToDownload], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Upload JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setInput(content)
      setOutput("")
      setError(null)
      setIsValid(null)
      setStats(null)
    }
    reader.readAsText(file)
  }

  // Clear all
  const clearAll = () => {
    setInput("")
    setOutput("")
    setError(null)
    setIsValid(null)
    setStats(null)
  }

  // Sample JSON for demo
  const loadSample = () => {
    const sample = {
      name: "ul0 URL Shortener",
      version: "1.0.0",
      features: ["URL Shortening", "QR Codes", "Bill Splitting", "UTM Builder"],
      stats: {
        users: 1000,
        links_created: 50000,
        countries: 150
      },
      free: true,
      website: "https://ul0.site"
    }
    setInput(JSON.stringify(sample))
    setOutput("")
    setError(null)
    setIsValid(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 sm:text-4xl flex items-center justify-center gap-3">
              <FileJson className="h-10 w-10 text-primary" />
              Free JSON Formatter & Validator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Format, validate, and minify JSON online. Beautify JSON with custom indentation, check for errors, and download results. 100% free, no signup required.
            </p>
          </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="indent">Indent:</Label>
                  <Select value={indentSize} onValueChange={setIndentSize}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="1">Tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={formatJson} className="gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Format / Beautify
                </Button>
                <Button onClick={minifyJson} variant="outline" className="gap-2">
                  <Minimize2 className="h-4 w-4" />
                  Minify
                </Button>
                <Button onClick={validateJson} variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Validate
                </Button>
                <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={downloadJson} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={clearAll} variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button onClick={loadSample} variant="ghost" className="gap-2">
                  Load Sample
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button variant="outline" className="gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Upload
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isValid === true && !error && (
            <Alert className="mb-4 border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                Valid JSON! {stats && `(${stats.size})`}
              </AlertDescription>
            </Alert>
          )}

          {/* Editor Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Input JSON</CardTitle>
                <CardDescription>Paste your JSON here</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setIsValid(null)
                    setError(null)
                  }}
                  placeholder='{"key": "value"}'
                  className="font-mono text-sm min-h-[400px] resize-none"
                  spellCheck={false}
                />
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Formatted Output</CardTitle>
                <CardDescription>
                  {stats ? `${stats.keys} keys • Depth: ${stats.depth} • Size: ${stats.size}` : "Click Format to see output"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                  className="font-mono text-sm min-h-[400px] resize-none bg-muted/50"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Maximize2 className="h-5 w-5 text-primary" />
                  Format JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Beautify minified JSON with proper indentation and line breaks. Choose 2 or 4 spaces for readability.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Minimize2 className="h-5 w-5 text-primary" />
                  Minify JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Compress JSON by removing whitespace. Reduces file size for faster API responses and storage.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Validate JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Check if your JSON is valid. Get detailed error messages showing exactly where syntax errors occur.
              </CardContent>
            </Card>
          </div>

          {/* SEO Content */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What is JSON?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                <strong>JSON (JavaScript Object Notation)</strong> is a lightweight data interchange format that's easy for humans to read and write, and easy for machines to parse and generate. It's based on a subset of JavaScript and is the most popular format for transmitting data in web applications.
              </p>
              <p>
                JSON is used extensively in REST APIs, configuration files, and data storage. This free online JSON formatter helps developers quickly format, validate, and minify JSON data without installing any software.
              </p>
              <h3 className="font-semibold text-foreground pt-2">Common JSON Use Cases:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>API request and response payloads</li>
                <li>Configuration files (package.json, tsconfig.json)</li>
                <li>Data exchange between client and server</li>
                <li>NoSQL database storage (MongoDB, CouchDB)</li>
                <li>Log files and structured data</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
