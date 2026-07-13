import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - ul0 Free URL Shortener",
  description: "Privacy Policy for ul0 - Free URL Shortener and Expense Splitter. Learn how we collect, use, and protect your data. GDPR compliant.",
  keywords: ["privacy policy", "ul0 privacy", "url shortener privacy", "data protection", "GDPR"],
  alternates: {
    canonical: "https://ul0.site/privacy",
  },
  openGraph: {
    title: "Privacy Policy - ul0 URL Shortener",
    description: "Privacy Policy for ul0 - Free URL Shortener. Learn how we protect your data.",
    url: "https://ul0.site/privacy",
    type: "website",
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 sm:text-4xl">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: July 5, 2026</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to ul0 ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our <Link href="/" className="text-primary hover:underline">URL shortening</Link> and <Link href="/split" className="text-primary hover:underline">expense splitting</Link> services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-medium mb-2">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>URLs you submit for shortening</li>
                <li>Group names and member information for expense splitting</li>
                <li>UPI IDs for payment processing</li>
                <li>Expense details (amounts, descriptions, dates)</li>
                <li>Email address and account info when signing up via Clerk</li>
                <li>Billing details provided to our payment partners (Polar.sh / Stripe) when subscribing to a plan</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
                <li>Click data on shortened links</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To provide and maintain our URL shortening service</li>
                <li>To process and manage expense splits</li>
                <li>To generate analytics and usage statistics</li>
                <li>To improve our services and user experience</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To process subscription payments and sync plans via webhooks</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Shortened URLs are stored indefinitely unless deleted by the creator or flagged for abuse. Expense split data is retained for 24 hours after creation, after which the shareable link expires. We retain account profile information and subscription status as long as your account is active.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Service providers who assist in operating our platform (hosting, analytics, Clerk for authentication, Polar.sh/Stripe for subscription billing processing)</li>
                <li>Law enforcement when required by law</li>
                <li>Third parties with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver relevant advertisements. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Advertising and Google AdSense</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use Google AdSense to serve advertisements on our website. To comply with Google's policies, please note the following:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-3">
                <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a> or the <a href="http://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">About Ads</a> portal.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                These third-party ad networks use technology to send the advertisements and links that appear on our website directly to your browser. They automatically receive your IP address when this occurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have rights to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:support@ul0.site" className="text-primary hover:underline font-medium">support@ul0.site</a><br />
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
