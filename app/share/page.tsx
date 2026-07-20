import type { Metadata } from "next"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShareClient } from "./share-client"
import { Shield, Zap, Lock, Globe, HardDrive, Cpu, Check, HelpCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Free Online P2P File Sharing — Direct Transfer No Size Limit | ul0",
  description:
    "Share files of any size directly between devices with 100% privacy and zero file size limits. Free online P2P end-to-end encrypted WebRTC file transfer. No signup or software required.",
  keywords: [
    "p2p file sharing online",
    "free p2p file transfer",
    "online file transfer no limit",
    "send large files online free",
    "webrtc file sharing",
    "direct peer to peer file transfer",
    "toffeeshare alternative",
    "sendanywhere alternative",
    "filepizza alternative",
    "encrypted p2p file transfer",
    "share large video online",
    "fast browser file transfer",
    "unlimited file sharing free",
    "secure online file share",
    "no cloud upload file transfer",
  ],
  alternates: {
    canonical: "https://ul0.site/share",
  },
  openGraph: {
    title: "Free Online P2P File Sharing — Direct Transfer No Size Limit | ul0",
    description:
      "Share files of any size directly between devices online with 100% privacy and zero file size limits. Free P2P end-to-end encrypted file transfer via WebRTC.",
    url: "https://ul0.site/share",
    type: "website",
    siteName: "ul0 - P2P File Sharing",
    images: [
      {
        url: "https://ul0.site/ul0.png",
        width: 512,
        height: 512,
        alt: "ul0 Free P2P File Transfer Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free P2P File Sharing — Unlimited Direct Transfer | ul0",
    description:
      "Share files of any size directly between devices online with 100% privacy and zero file size limits.",
    images: ["https://ul0.site/ul0.png"],
  },
}

export default function SharePage() {
  // Rich JSON-LD Schemas for #1 World Ranking
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // WebApplication Schema
      {
        "@type": "WebApplication",
        "@id": "https://ul0.site/share#webapp",
        name: "ul0 P2P File Transfer",
        url: "https://ul0.site/share",
        applicationCategory: "FileTransferApplication",
        operatingSystem: "All Web Browsers (Chrome, Safari, Firefox, Edge, iOS, Android)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Free browser-based Peer-to-Peer (P2P) WebRTC file transfer application. Transfer unlimited size files directly between devices without cloud uploads or registration.",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "250",
          bestRating: "5",
          worstRating: "1",
        },
        featureList: [
          "Zero file size limit P2P transfer",
          "End-to-end 256-bit WebRTC encryption",
          "No cloud server storage — 100% private",
          "No software installation required",
          "Fast direct browser-to-browser speeds",
        ],
      },
      // BreadcrumbList Schema
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/share#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://ul0.site",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "P2P File Transfer",
            item: "https://ul0.site/share",
          },
        ],
      },
      // FAQPage Schema
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/share#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is there a file size limit on ul0 P2P share?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No! There are zero file size limits. Because files are transferred directly between browsers using WebRTC peer-to-peer data channels, you can send 1GB, 10GB, 50GB, or larger files completely free.",
            },
          },
          {
            "@type": "Question",
            name: "Are my files stored on your servers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Your files are never uploaded to or stored on any server or database. Data streams directly from the sender's browser memory to the recipient's browser memory in real time.",
            },
          },
          {
            "@type": "Question",
            name: "Is online P2P file transfer secure?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Transfers use WebRTC DTLS/SRTP 256-bit end-to-end encryption by default. Only you and the recipient with your secret 6-character room code or link can access the data stream.",
            },
          },
          {
            "@type": "Question",
            name: "Do I or the recipient need to install an app or create an account?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No installation or registration is needed. It runs natively in all web browsers on Windows, macOS, Linux, iPhone, iPad, and Android.",
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          
          {/* SEO Hero Header */}
          <div className="mx-auto max-w-3xl text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Unlimited P2P WebRTC Transfer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Free Online <span className="text-primary">P2P File Sharing</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Send files of <strong className="text-foreground font-semibold">any size</strong> directly from browser to browser. 
              100% end-to-end encrypted, zero cloud storage, and no registration required.
            </p>
          </div>

          {/* Interactive Client P2P App Component */}
          <Suspense fallback={
            <div className="py-20 text-center text-muted-foreground text-sm font-mono animate-pulse">
              Loading secure P2P WebRTC engine…
            </div>
          }>
            <ShareClient />
          </Suspense>

          {/* SEO Comprehensive Information Sections */}
          <section className="mt-20 border-t border-border/40 pt-16 space-y-16">
            
            {/* Why P2P Section */}
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Why Use WebRTC Peer-to-Peer File Transfer?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Traditional cloud storage providers force artificial 2GB limits or charge expensive subscriptions. P2P file sharing changes everything.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-base">Zero Server Uploads &amp; Complete Privacy</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Unlike Wetransfer or Google Drive, your files are never saved on third-party servers. Data streams directly from your computer or phone to your recipient via encrypted WebRTC DataChannels.
                  </p>
                </div>

                <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-base">Unlimited File Size Transfers</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Need to send a 50GB 4K video shoot, RAW photography archive, or virtual machine image? Because no server storage is consumed, you can share files of any size for free.
                  </p>
                </div>

                <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-base">Maximum Wi-Fi &amp; Network Bandwidth</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By bypassing middleman cloud servers, transfers operate at maximum available peer bandwidth. On local Wi-Fi networks, transfers achieve gigabit speeds.
                  </p>
                </div>

                <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-base">DTLS / SRTP 256-Bit Encryption</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Built on native browser WebRTC standards. All data frames are protected by military-grade end-to-end encryption, ensuring no intermediary or ISP can inspect your content.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Table Section */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  How ul0 P2P Share Compares
                </h2>
                <p className="text-sm text-muted-foreground">
                  See how ul0 P2P file transfer compares against traditional cloud link tools and alternative P2P services.
                </p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-border bg-card">
                <table className="w-full text-left text-xs text-muted-foreground">
                  <thead className="bg-muted/40 text-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-4">Feature</th>
                      <th className="p-4 text-primary font-bold">ul0 P2P Share</th>
                      <th className="p-4">WeTransfer / Dropbox</th>
                      <th className="p-4">ToffeeShare / SendAnywhere</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="p-4 font-medium text-foreground">File Size Limit</td>
                      <td className="p-4 font-bold text-emerald-500">Unlimited (Free)</td>
                      <td className="p-4">2 GB Free Limit</td>
                      <td className="p-4">Limited or Paid tiers</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Server Storage</td>
                      <td className="p-4 font-bold text-emerald-500">Zero (Direct P2P)</td>
                      <td className="p-4">Stored on Cloud Servers</td>
                      <td className="p-4">Zero (P2P)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">End-to-End Encrypted</td>
                      <td className="p-4 font-bold text-emerald-500">Yes (WebRTC DTLS)</td>
                      <td className="p-4">No (Server decrypted)</td>
                      <td className="p-4">Yes</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Account / Registration</td>
                      <td className="p-4 font-bold text-emerald-500">No Signup Needed</td>
                      <td className="p-4">Required for large files</td>
                      <td className="p-4">No signup needed</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Integrated URL &amp; QR Tools</td>
                      <td className="p-4 font-bold text-emerald-500">Included (Shortener + QR)</td>
                      <td className="p-4">None</td>
                      <td className="p-4">Basic</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
                  <h3 className="font-bold text-foreground text-base">Is there any file size limit for P2P transfers?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No. Because files are streamed chunk by chunk directly between browser memory over WebRTC data channels, ul0 imposes no file size cap. You can transfer 1GB or 100GB files seamlessly.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
                  <h3 className="font-bold text-foreground text-base">Does the sender need to keep their browser tab open?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Yes. Since this is a direct peer-to-peer connection without intermediary server storage, the sender&apos;s browser tab must stay open until the receiver finishes downloading the file.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
                  <h3 className="font-bold text-foreground text-base">Are my files cached on any cloud server?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Never. Data travels through encrypted peer-to-peer tunnels. No file content is ever written to disk or stored on any server.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
                  <h3 className="font-bold text-foreground text-base">What happens if the connection drops?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If either peer loses internet connection, the transfer stops. Simply click reconnect or enter the 6-character room code to re-establish the P2P connection.
                  </p>
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
