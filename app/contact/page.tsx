import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UL0Icon } from "@/components/ul0-icon"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us — Support & Business Inquiries",
  description:
    "Get in touch with the UL0 team for custom domain setup help, abuse reports, or business inquiries.",
  alternates: {
    canonical: "https://ul0.site/contact",
  },
  openGraph: {
    title: "Contact Us — Support & Business Inquiries | UL0",
    description:
      "Contact the UL0 team for custom domain support, enterprise inquiries, or account assistance.",
    url: "https://ul0.site/contact",
    siteName: "UL0",
    type: "website",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "Contact UL0 Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Support & Business Inquiries | UL0",
    description: "Contact the UL0 team for support, feedback, or business inquiries.",
    images: ["https://ul0.site/social-card.png"],
  },
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3 sm:text-4xl text-foreground">Contact Us</h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-surface-2 border border-border text-primary">
                  <UL0Icon name="mail" animated={true} size={24} />
                </div>
                <h2 className="text-lg font-bold text-foreground">Email Us</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For all inquiries, support requests, feedback, or business proposals, please email us directly:
              </p>
              <div>
                <a 
                  href="mailto:getul0site@gmail.com" 
                  className="text-xl font-bold text-primary hover:underline inline-block"
                >
                  getul0site@gmail.com
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-surface-2 border border-border text-primary">
                  <UL0Icon name="clock" animated={true} size={24} />
                </div>
                <h2 className="text-lg font-bold text-foreground">Response Time</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We typically respond within 24-48 hours. For urgent matters, please include &quot;URGENT&quot; in the subject line.
              </p>
            </div>

            {/* Common Topics */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-surface-2 border border-border text-primary">
                  <UL0Icon name="chat" animated={true} size={24} />
                </div>
                <h2 className="text-lg font-bold text-foreground">What You Can Contact Us About</h2>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  <span>Report a malicious or spam link</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  <span>Request link removal</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  <span>Bug reports and product feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  <span>Business inquiries and custom domain integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  <span>General questions about UL0 platform</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
