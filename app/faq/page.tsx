import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - URL Shortener & Bill Splitter Questions | ul0 [2025]",
  description: "Find answers about ul0 free URL shortener & bill splitter. How to shorten URLs, split expenses, create QR codes. Common questions answered. No signup required!",
  keywords: [
    // Primary FAQ Keywords
    "custom domain short link free",
    "free custom domain link shortener",
    "cheapest custom domain link shortener",
    "own domain link shortener",
    "branded url shortener free",
    "url shortener FAQ",
    "link shortener questions",
    "url shortener help",
    "free url shortener FAQ",
    
    // Question Keywords
    "how to shorten url",
    "how to shorten link",
    "how to create short url",
    "how to use url shortener",
    "what is url shortener",
    "is ul0 free",
    "do links expire",
    
    // Bill Splitter FAQ
    "split expenses FAQ",
    "bill splitter help",
    "expense splitter questions",
    "how to split expenses",
    "how to use bill splitter",
    
    // Payment FAQ
    "UPI payment questions",
    "PayPal split FAQ",
    "Venmo split help",
    "payment QR code FAQ",
    
    // Feature FAQ
    "QR code generator FAQ",
    "wifi qr code help",
    "utm builder FAQ",
    "json formatter FAQ",
    "pomodoro timer FAQ",
    
    // Comparison FAQ
    "bitly vs ul0",
    "tinyurl vs ul0",
    "splitwise vs ul0",
    "is ul0 better than bitly",
    
    // Trust Keywords
    "is ul0 safe",
    "is ul0 secure",
    "is ul0 free forever",
    "ul0 review",
    
    // Long-tail Keywords
    "free url shortener without signup FAQ",
    "how does url shortening work",
    "url shortener for beginners",
  ],
  alternates: {
    canonical: "https://ul0.site/faq",
  },
  openGraph: {
    title: "FAQ - Frequently Asked Questions | ul0",
    description: "Find answers about ul0 free URL shortener & bill splitter. How to shorten URLs, split expenses, create QR codes & more.",
    url: "https://ul0.site/faq",
    type: "website",
    siteName: "ul0 FAQ",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 FAQ - Frequently Asked Questions",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - URL Shortener Questions | ul0",
    description: "Answers about URL shortening, bill splitting & more!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const generalFaqs = [
  {
    question: "What is ul0?",
    answer: "ul0 is a free, fast, and reliable URL shortening service that also offers split expense features. We help you create short, memorable links and easily split bills with friends or groups."
  },
  {
    question: "Is ul0 free to use?",
    answer: "Yes! ul0 is completely free to use. We support our service through non-intrusive advertising. You can shorten unlimited URLs and create unlimited split expense sessions."
  },
  {
    question: "Do I need an account to use ul0?",
    answer: "No account is required to use our basic services. You can shorten URLs and create split expense sessions instantly without signing up."
  },
  {
    question: "How long do shortened URLs last?",
    answer: "Shortened URLs on ul0 are permanent and never expire. Your links will continue to work indefinitely as long as our service is running."
  },
]

const urlShortenerFaqs = [
  {
    question: "How do I shorten a URL?",
    answer: "Simply paste your long URL into the input box on our homepage and click 'Shorten'. You'll instantly receive a shortened link that you can copy and share anywhere."
  },
  {
    question: "Can I customize my shortened URL?",
    answer: "Yes! By connecting a custom domain, you can create branded short URLs (like link.yourbrand.com/promo) with custom aliases. You get 1 custom domain and 1 short link for free, and up to 3 domains with 100 short links on our budget Pro plan."
  },
  {
    question: "Can I use my own custom domain for short links?",
    answer: "Absolutely! Connecting your own domain is fully supported. We offer a generous Free tier which includes 1 connected domain and 1 custom link. For more limits, our paid plans are the cheapest in the market (Pro is only $2/mo billed annually)."
  },
  {
    question: "What types of URLs can I shorten?",
    answer: "You can shorten most public URLs. However, we prohibit shortening links to illegal content, malware, phishing sites, adult content, or any content that violates our Terms of Service."
  },
  {
    question: "Is there a limit on how many URLs I can shorten?",
    answer: "There's no strict limit on shortening links using our standard domain (ul0.site). For custom domains, limits depend on your plan: Free (1 link), Pro (100 links), and Business (unlimited links)."
  },
  {
    question: "Why was my link removed?",
    answer: "Links that violate our Terms of Service, including spam, malware, phishing, or illegal content, are removed. If you believe your link was removed in error, contact us."
  },
]

const splitExpenseFaqs = [
  {
    question: "What is the Split Expense feature?",
    answer: "Split Expense helps you divide costs among friends or group members. Add members, input expenses, and ul0 calculates who owes whom, with QR codes for easy UPI payments."
  },
  {
    question: "How do I create a split expense session?",
    answer: "Go to the Split page, add member names, enter your UPI IDs (optional), add expenses with amounts and who paid/participated, and the app calculates settlements automatically."
  },
  {
    question: "Can I share my split expense session?",
    answer: "Yes! You can generate a shareable link that's valid for 24 hours. Anyone with the link can view the expense breakdown and settlement details."
  },
  {
    question: "How does the settlement calculation work?",
    answer: "Our algorithm minimizes the number of transactions needed. It calculates each person's balance and suggests optimal payments so everyone settles their share efficiently."
  },
  {
    question: "What is the UPI QR code feature?",
    answer: "When you enter UPI IDs, ul0 generates QR codes for each settlement. Payers can scan the QR code with any UPI app to make instant payments."
  },
  {
    question: "Can I download the expense report?",
    answer: "Yes! You can download a PDF summary of your split expense session including all expenses, member balances, and settlement details."
  },
]

const privacySecurityFaqs = [
  {
    question: "Is my data secure on ul0?",
    answer: "Yes, we take security seriously. We use secure connections (HTTPS), don't store unnecessary personal data, and our database is protected with industry-standard security measures."
  },
  {
    question: "What data does ul0 collect?",
    answer: "We collect minimal data: original URLs for shortening, basic analytics (click counts), and data you voluntarily provide for split expenses. See our Privacy Policy for details."
  },
  {
    question: "Does ul0 track my clicks?",
    answer: "We maintain basic click counters for analytics purposes. We don't track personal information or create user profiles based on clicking behavior."
  },
]

const technicalFaqs = [
  {
    question: "Why is my shortened link not working?",
    answer: "The original URL might be down, the link may have been removed for policy violations, or there could be a temporary service issue. Try creating a new shortened link."
  },
  {
    question: "Do you have an API?",
    answer: "We're working on a public API for developers. Stay tuned for updates on programmatic access to our URL shortening service."
  },
  {
    question: "What browsers are supported?",
    answer: "ul0 works on all modern browsers including Chrome, Firefox, Safari, Edge, and their mobile versions. We recommend using the latest browser version for best experience."
  },
]

// Combine all FAQs for schema
const allFaqs = [...generalFaqs, ...urlShortenerFaqs, ...splitExpenseFaqs, ...privacySecurityFaqs, ...technicalFaqs]

// FAQ Schema for Google Rich Results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl">Frequently Asked Questions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about ul0. Can't find what you're looking for?{" "}
              <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
            </p>
          </div>

          <div className="space-y-8">
            {/* General */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">General Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {generalFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`general-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* URL Shortener */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">URL Shortener</h2>
              <Accordion type="single" collapsible className="w-full">
                {urlShortenerFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`url-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Split Expenses */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Split Expenses</h2>
              <Accordion type="single" collapsible className="w-full">
                {splitExpenseFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`split-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Privacy & Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
              <Accordion type="single" collapsible className="w-full">
                {privacySecurityFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`privacy-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Technical */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Technical Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {technicalFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`tech-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Still have questions */}
          <div className="mt-12 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              We're here to help! Reach out to our support team.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
