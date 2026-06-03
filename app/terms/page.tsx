import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service - ul0 Free URL Shortener",
  description: "Terms of Service for ul0 - Free URL Shortener and Expense Splitter. Read our terms and conditions before using our services.",
  keywords: ["terms of service", "terms and conditions", "ul0 terms", "url shortener terms", "service agreement"],
  alternates: {
    canonical: "https://ul0.site/terms",
  },
  openGraph: {
    title: "Terms of Service - ul0 URL Shortener",
    description: "Terms of Service for ul0 - Free URL Shortener. Read our terms and conditions.",
    url: "https://ul0.site/terms",
    type: "website",
  },
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 sm:text-4xl">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 30, 2025</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using ul0's <Link href="/" className="text-primary hover:underline">URL shortening</Link> and <Link href="/split" className="text-primary hover:underline">expense splitting</Link> services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                ul0 provides:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>URL Shortening:</strong> Create short, shareable links from long URLs</li>
                <li><strong>Expense Splitting:</strong> Split bills among groups with UPI payment integration</li>
                <li><strong>QR Code Generation:</strong> Generate QR codes for UPI payments</li>
                <li><strong>Link Analytics:</strong> Track clicks on shortened URLs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use our Services only for lawful purposes. You shall not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Create shortened links to illegal, harmful, or malicious content</li>
                <li>Distribute spam, malware, or phishing links</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to circumvent our security measures</li>
                <li>Use automated tools to abuse our Services</li>
                <li>Share false or misleading expense information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Prohibited Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                Links to the following content are strictly prohibited:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Adult or pornographic material</li>
                <li>Illegal drugs or controlled substances</li>
                <li>Violence, hate speech, or discrimination</li>
                <li>Fraud, scams, or deceptive practices</li>
                <li>Malware, viruses, or malicious software</li>
                <li>Copyright-infringing material</li>
                <li>Personal information without consent (doxing)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Link Expiration and Removal</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Remove any link that violates these Terms</li>
                <li>Disable accounts that repeatedly violate our policies</li>
                <li>Expire or remove inactive links</li>
                <li>Modify or discontinue Services at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Expense split links automatically expire 24 hours after creation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The ul0 name, logo, and all related graphics are our trademarks. You may not use these marks without our prior written permission. You retain ownership of the content you link to, but grant us a license to process and redirect that content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, UL0 SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OUR SERVICES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless ul0 and its affiliates from any claims, damages, losses, or expenses arising from your use of our Services or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Services may contain links to third-party websites or integrate with third-party services (such as UPI payment providers). We are not responsible for the content, privacy practices, or terms of these third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Advertising</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our free Services are supported by advertising. By using our Services, you agree to view advertisements displayed on our platform. We are not responsible for the content of third-party advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our Services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: stablersleet@duck.com<br />
                Website: https://ul0.site/contact
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
