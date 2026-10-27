import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FilesWorkspace } from "./files-workspace"

export const metadata: Metadata = {
  title: "Free Files & PDF Suite — Resize Images, Split, Merge & Convert | UL0",
  description:
    "Free, private client-side document and file suite. Resize & convert images, compress file size, split PDF pages, merge documents, rotate PDFs, convert text to PDF, and scan with your camera. Install as an app on your phone, 100% private.",
  keywords: [
    "free pdf tools",
    "pdf splitter online free",
    "merge pdf files free",
    "image to pdf converter free",
    "pdf to image converter",
    "image resizer free online",
    "image converter png to jpg",
    "convert webp to png free",
    "compress image size free",
    "rotate pdf pages online free",
    "text to pdf converter online",
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
