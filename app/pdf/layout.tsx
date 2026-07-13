import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free PDF Scanner & Document Tools — Scan, Edit, Download | ul0.site",
  description: "Scan documents with your camera, apply filters, sort pages, and export clean PDFs — all free, all in the browser. No app download, no signup required.",
  keywords: ["PDF scanner online", "document scanner browser", "scan to PDF free", "PDF page sorter", "PDF filter tool"],
  alternates: { canonical: "https://ul0.site/pdf" },
  openGraph: { title: "Free PDF Scanner & Document Tools | ul0.site", description: "Browser-based PDF scanning, filters, and exports. 100% free, no signup.", url: "https://ul0.site/pdf", siteName: "ul0.site", type: "website" },
}
export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
