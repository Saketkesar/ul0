import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FilesWorkspace } from "./files-workspace"

export const metadata: Metadata = {
  title: "Free Files & PDF Suite — Split, Merge, Image to PDF & Scan | UL0",
  description:
    "Free, private client-side document and PDF suite. Split PDF pages, merge multiple documents, convert images to PDF, extract pages, and scan documents from your phone. Install as an app, zero signup, 100% private.",
  keywords: [
    "free pdf tools",
    "pdf splitter online free",
    "merge pdf files free",
    "image to pdf converter free",
    "pdf to image converter",
    "document scanner app",
    "private pdf tools no upload",
    "client side pdf tools",
    "free pdf pwa app",
  ],
  alternates: {
    canonical: "https://ul0.site/files",
  },
  openGraph: {
    title: "Free Files & PDF Suite — Split, Merge & Convert Documents | UL0",
    description:
      "Client-side PDF and file tools that run directly in your browser. No file uploads, 100% private. Install as an app on your phone.",
    url: "https://ul0.site/files",
    type: "website",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 Files & PDF Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Files & PDF Suite — Split, Merge & Convert Documents | UL0",
    description:
      "Client-side PDF and file tools that run directly in your browser. Install as an app on your phone.",
    images: ["https://ul0.site/social-card.png"],
  },
}

export default function FilesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <FilesWorkspace />
      </main>
      <Footer />
    </div>
  )
}
